import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'user' | 'admin';
          credit_balance: number;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          credit_balance?: number;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          credit_balance?: number;
          trial_ends_at?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper function to create trial end date (3 months from now)
export function getTrialEndDate(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date;
}

// Helper to format trial expiration
export function formatTrialExpiration(trialEndsAt: string | null): string {
  if (!trialEndsAt) return 'No active trial';
  const endDate = new Date(trialEndsAt);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysRemaining <= 0) return 'Trial expired';
  if (daysRemaining === 1) return '1 day remaining';
  return `${daysRemaining} days remaining`;
}

// Authentication functions
export async function signUp(email: string, password: string, fullName: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // If the Supabase project requires email confirmation, `authData.user` may be null
    // until the user confirms their email. In that case don't attempt to insert a
    // profile from the client (Row Level Security may block it) — return a clear
    // message so the UI can tell the user to check their email.
    if (!authData.user) {
      return {
        user: null,
        error:
          'A confirmation email has been sent. Please check your inbox and verify your email before signing in.',
      };
    }

    // Create profile via server endpoint (uses service_role to bypass RLS)
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: authData.user.id,
        email,
        fullName,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create profile');
    }

    const { user: profileData, error: profileError } = await response.json();

    if (profileError) throw new Error(profileError);

    return { user: profileData, error: null };
  } catch (error) {
    // Try to extract PostgREST / Supabase error message when possible
    const message =
      error && typeof error === 'object' && 'message' in (error as any)
        ? (error as any).message
        : 'Sign up failed';
    return { user: null, error: message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed');

    // Get user profile
    let { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // If profile is missing, try to create it (allowed by RLS policy when auth.uid() == id)
    if (!profileData) {
      const trialEndDate = getTrialEndDate();
      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          full_name: (data.user.user_metadata as any)?.full_name || null,
          role: 'user',
          credit_balance: 100,
          trial_ends_at: trialEndDate.toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;
      profileData = createdProfile;
    }

    if (profileError) throw profileError;

    return { user: profileData, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Sign in failed' };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Sign out failed' };
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Google sign in failed' };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!user) return { user: null, error: null };

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    return { user: profileData, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Failed to get user' };
  }
}

export async function updateUserProfile(userId: string, updates: Partial<any>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { user: data, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Failed to update profile' };
  }
}

export async function deductCredits(userId: string, amount: number = 1) {
  try {
    // Get current balance
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select('credit_balance')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    const newBalance = Math.max(0, profileData.credit_balance - amount);

    // Update balance
    const { data, error } = await supabase
      .from('profiles')
      .update({ credit_balance: newBalance })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { user: data, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Failed to deduct credits' };
  }
}
