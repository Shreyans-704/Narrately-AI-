import { RequestHandler } from 'express';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.VITE_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET /api/admin/users — list all auth users joined with profile data
export const handleGetAdminUsers: RequestHandler = async (_req, res) => {
  try {
    const supabase = getAdminClient();

    // Fetch all auth users (paginated — fetch up to 1000)
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authError) throw authError;

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, role, credit_balance, avatar_url, trial_ends_at');
    if (profilesError) throw profilesError;

    // Try to fetch avatar_group_id separately (column may not exist yet)
    let avatarGroupMap = new Map<string, string | null>();
    try {
      const { data: agData } = await supabase
        .from('profiles')
        .select('id, avatar_group_id');
      if (agData) {
        agData.forEach((row: any) => avatarGroupMap.set(row.id, row.avatar_group_id ?? null));
      }
    } catch (_) {
      // column doesn't exist yet — all users will show as inactive until column is added
    }

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const users = (authData?.users || []).map((u) => {
      const profile = profileMap.get(u.id);
      const providers = (u.identities || []).map((id) => id.provider);
      const providerType = providers.includes('google') || providers.includes('github')
        ? 'Social'
        : providers.includes('email')
        ? 'Email'
        : '-';

      return {
        id: u.id,
        email: u.email || '-',
        phone: u.phone || '-',
        display_name: profile?.full_name || (u.user_metadata as any)?.full_name || (u.user_metadata as any)?.name || '-',
        avatar_url: profile?.avatar_url || (u.user_metadata as any)?.avatar_url || null,
        avatar_group_id: avatarGroupMap.get(u.id) ?? null,
        providers,
        provider_type: providerType,
        role: profile?.role || 'user',
        credit_balance: profile?.credit_balance ?? 0,
        trial_ends_at: profile?.trial_ends_at || null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
      };
    });

    res.json({ users });
  } catch (err: any) {
    console.error('[admin-users]', err);
    res.status(500).json({ error: err.message || 'Failed to fetch users' });
  }
};
