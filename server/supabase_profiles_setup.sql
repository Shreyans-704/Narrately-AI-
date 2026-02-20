-- Supabase profiles table + RLS policies
-- Paste this into the Supabase SQL editor (Project > SQL Editor > New query) and run.
-- This creates a `profiles` table referenced to `auth.users` and enables
-- Row Level Security with policies allowing users to manage their own profile.

BEGIN;

-- Create table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  avatar_group_id text DEFAULT NULL,
  role text DEFAULT 'user',
  credit_balance integer DEFAULT 30,
  trial_ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add avatar_group_id to existing tables that were created before this column was added
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_group_id text DEFAULT NULL;

-- Helpful index
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own profile (id must match auth.uid())
CREATE POLICY IF NOT EXISTS profiles_insert_own ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to select their own profile
CREATE POLICY IF NOT EXISTS profiles_select_own ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY IF NOT EXISTS profiles_update_own ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

COMMIT;

-- Notes:
-- 1) If you prefer server-side profile creation (recommended for stricter control),
--    create a secure function that runs with the 'service_role' key and call it
--    from a server endpoint instead of inserting from the client.
-- 2) If your Auth settings require email confirmation, the client may not have an
--    authenticated session right after signUp. In that case profile creation should
--    happen after the user confirms their email (or via a server-side webhook).
