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
}

export const handleSignup: RequestHandler = async (req, res) => {
  const { userId, email, fullName } = req.body as SignupRequest;

  if (!userId || !email || !fullName) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Create profile using service_role (bypasses RLS)
    const trialEndDate = new Date();
    trialEndDate.setMonth(trialEndDate.getMonth() + 3);

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        role: 'user',
        credit_balance: 30,
        trial_ends_at: trialEndDate.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Profile creation error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({ user: data, error: null });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
