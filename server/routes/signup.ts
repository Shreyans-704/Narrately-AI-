import { RequestHandler } from 'express';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service_role key (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface SignupRequest {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  setDefaultPassword?: boolean;
}

export const handleSignup: RequestHandler = async (req, res) => {
  const { userId, email, fullName, avatarUrl, setDefaultPassword } = req.body as SignupRequest;

  if (!userId || !email || !fullName) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Create profile using service_role (bypasses RLS)
    const trialEndDate = new Date();
    trialEndDate.setMonth(trialEndDate.getMonth() + 3);

    const { data: upsertData, error } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: userId,
          email,
          full_name: fullName,
          avatar_url: avatarUrl ?? null,
          role: 'user',
          status: 'inactive',   // New users start as inactive, awaiting admin activation
          credit_balance: 30,
          total_views: 0,
          onboarding_completed: false,
          trial_ends_at: trialEndDate.toISOString(),
        },
        { onConflict: 'id', ignoreDuplicates: true }
      )
      .select();

    if (error) {
      console.error('Profile creation error:', error);
      
      // Check for duplicate email error
      if (error.message && (error.message.includes('duplicate key') || error.message.includes('profiles_email_key'))) {
        res.status(409).json({ error: 'This email is already registered. Please sign in instead.' });
        return;
      }
      
      res.status(400).json({ error: error.message });
      return;
    }

    // ignoreDuplicates returns 0 rows when the row already existed — fetch it explicitly
    let data = upsertData && upsertData.length > 0 ? upsertData[0] : null;
    if (!data) {
      const { data: existing, error: existErr } = await supabaseAdmin
        .from('profiles').select('*').eq('id', userId).maybeSingle();
      if (existErr || !existing) {
        console.error('Failed to fetch existing profile:', existErr);
        res.status(500).json({ error: 'Profile creation failed' });
        return;
      }
      data = existing;
    }

    // For OAuth users (e.g. Google), set a default password so they can later
    // change it via the normal "current password" flow.
    if (setDefaultPassword) {
      const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: 'Narrately@first123',
      });
      if (pwError) {
        console.warn('Could not set default password for OAuth user:', pwError.message);
      }
    }

    res.json({ user: data, error: null });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
