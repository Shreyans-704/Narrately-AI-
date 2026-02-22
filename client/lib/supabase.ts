import { createClient } from '@supabase/supabase-js';
import { apiUrl } from '@/lib/api';

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
          status: 'active' | 'inactive';
          credit_balance: number;
          total_views: number;
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
          status?: 'active' | 'inactive';
          credit_balance?: number;
          total_views?: number;
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
          status?: 'active' | 'inactive';
          credit_balance?: number;
          total_views?: number;
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
    if (!authData.user) throw new Error('Sign up failed - no user returned');

    // IMPORTANT: Create profile immediately after auth user is created,
    // even if email confirmation is pending. This ensures the user appears
    // in the admin dashboard and can login after verifying their email.
    const response = await fetch(apiUrl('/api/signup'), {
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

    // Now check if email confirmation is required
    // In Supabase v2, when email confirmation is required `authData.session` is null
    if (!authData.session) {
      return {
        user: null,
        error:
          'A confirmation email has been sent. Please check your inbox and verify your email before signing in.',
      };
    }

    // If we have a session (email confirmation disabled), return the profile
    return { user: profileData, error: null };
  } catch (error) {
    // Try to extract PostgREST / Supabase error message when possible
    let message = 'Sign up failed';
    
    if (error && typeof error === 'object' && 'message' in (error as any)) {
      message = (error as any).message;
      
      // Check for duplicate email errors from Supabase Auth
      if (message.toLowerCase().includes('user already registered') ||
          message.toLowerCase().includes('email already') ||
          message.toLowerCase().includes('already exists')) {
        message = 'This email is already registered. Please sign in instead.';
      }
    }
    
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

    // If profile is missing, create it via the server endpoint (service_role, bypasses RLS)
    // so the status is correctly set to 'inactive' (pending admin activation).
    if (!profileData || (profileError && (profileError as any).code === 'PGRST116')) {
      const meta = data.user.user_metadata as any;
      const signupRes = await fetch(apiUrl('/api/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.user.id,
          email,
          fullName: meta?.full_name || meta?.name || email.split('@')[0],
          avatarUrl: meta?.avatar_url || meta?.picture || null,
        }),
      });
      const signupJson = await signupRes.json().catch(() => ({}));
      const { data: createdProfile, error: insertError } = { data: signupJson.user ?? null, error: signupJson.error ?? null };
      if (insertError) {
        console.error('Failed to create profile on sign-in:', insertError);
        throw new Error(insertError);
      }
      profileData = createdProfile;
      profileError = null;
    } else if (profileError) {
      // If there's a different error (not "no rows"), throw it
      throw profileError;
    }

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

export async function signInWithGoogle(redirectPath = '/studio') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectPath}`,
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
    let { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // PGRST116 = no rows found — new OAuth (e.g. Google) user with no profile yet.
    // We MUST use the server endpoint (service_role) because RLS blocks direct
    // client-side INSERTs for new rows, causing a blank/stuck dashboard screen.
    if (profileError && (profileError as any).code === 'PGRST116') {
      const meta = user.user_metadata as any;
      const response = await fetch(apiUrl('/api/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email ?? '',
          fullName: meta?.full_name || meta?.name || user.email?.split('@')[0] || 'User',
          avatarUrl: meta?.avatar_url || meta?.picture || null,
          setDefaultPassword: true,
        }),
      });
      // If the profile was already created between the SELECT and POST (race), ignore conflict
      const json = await response.json().catch(() => ({}));
      if (json.user) return { user: json.user, error: null };
      // Retry the SELECT in case of duplicate-key (another tab beat us)
      const { data: retried } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (retried) return { user: retried, error: null };
      throw new Error(json.error || 'Failed to create profile');
    }

    if (profileError) throw profileError;

    // Migrate old accounts that still have the legacy 100-credit default → 30
    if (profileData && profileData.credit_balance === 100) {
      await supabase
        .from('profiles')
        .update({ credit_balance: 30 })
        .eq('id', user.id);
      profileData.credit_balance = 30;
    }

    // Sync OAuth avatar (Google etc.) into the profile if not already set
    const metaAvatar =
      (user.user_metadata as any)?.avatar_url ||
      (user.user_metadata as any)?.picture ||
      null;
    if (profileData && !profileData.avatar_url && metaAvatar) {
      const { data: updated } = await supabase
        .from('profiles')
        .update({ avatar_url: metaAvatar, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();
      if (updated) return { user: updated, error: null };
    }

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

export async function changePassword(newPassword: string) {
  try {
    // The user is already authenticated via a live session — no re-auth needed.
    // supabase.auth.updateUser works for both email/password and OAuth users.
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update password' };
  }
}

export async function uploadAvatar(userId: string, file: File) {
  try {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);

    // Update profile with avatar_url
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return { url: data.publicUrl, user: profile, error: null };
  } catch (error) {
    return { url: null, user: null, error: error instanceof Error ? error.message : 'Avatar upload failed' };
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
