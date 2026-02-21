import { RequestHandler } from 'express';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.VITE_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!url || !serviceKey) {
    console.error('[getAdminClient] Missing env variables!', { 
      hasUrl: !!url, 
      hasKey: !!serviceKey 
    });
  }
  
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// PATCH /api/admin/users/:id/credits — update a user's credit_balance
export const handleUpdateCredits: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { credit_balance } = req.body as { credit_balance: number };

    if (typeof credit_balance !== 'number' || credit_balance < 0) {
      res.status(400).json({ error: 'Invalid credit_balance value' });
      return;
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({ credit_balance, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    res.json({ user: data[0] });
  } catch (err: any) {
    console.error('[update-credits]', err);
    res.status(500).json({ error: err.message || 'Failed to update credits' });
  }
};

// PATCH /api/admin/users/:id/role — update a user's role
export const handleUpdateRole: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body as { role: 'user' | 'admin' };

    if (!['user', 'admin'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    res.json({ user: data[0] });
  } catch (err: any) {
    console.error('[update-role]', err);
    res.status(500).json({ error: err.message || 'Failed to update role' });
  }
};

// DELETE /api/admin/users/:id — delete a user from auth + profile
export const handleDeleteUser: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id as string;
    const supabase = getAdminClient();

    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;

    res.json({ success: true });
  } catch (err: any) {
    console.error('[delete-user]', err);
    res.status(500).json({ error: err.message || 'Failed to delete user' });
  }
};

// PATCH /api/admin/users/:id/avatar-group — assign or remove avatar group
// Assigning a group automatically activates the user; removing it deactivates them.
export const handleUpdateAvatarGroup: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar_group_id } = req.body as { avatar_group_id: string | null };
    const newStatus = avatar_group_id ? 'active' : 'inactive';

    const supabase = getAdminClient();

    // Check if profile row exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!existing) {
      // Profile missing — create it from auth user data
      const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(id);
      if (authErr || !authUser?.user) {
        console.error('[avatar-group] Auth user not found:', authErr);
        res.status(404).json({ error: 'Auth user not found' });
        return;
      }
      const u = authUser.user;
      const meta = u.user_metadata as any;
      const trialEnd = new Date();
      trialEnd.setMonth(trialEnd.getMonth() + 3);
      
      const { data: upsertData, error: upsertErr } = await supabase.from('profiles').upsert({
        id,
        email: u.email ?? '',
        full_name: meta?.full_name || meta?.name || u.email?.split('@')[0] || 'User',
        avatar_url: meta?.avatar_url || meta?.picture || null,
        role: 'user',
        status: newStatus,
        avatar_group_id: avatar_group_id || null,
        credit_balance: 30,
        total_views: 0,
        onboarding_completed: false,
        trial_ends_at: trialEnd.toISOString(),
        created_at: u.created_at,
      }, { onConflict: 'id' });
      
      if (upsertErr) {
        console.error('[avatar-group] Upsert error:', upsertErr);
        throw upsertErr;
      }
      console.log('[avatar-group] Profile created, data:', upsertData);
    } else {
      const { data: updateData, error } = await supabase
        .from('profiles')
        .update({
          avatar_group_id: avatar_group_id || null,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();
      if (error) {
        console.error('[avatar-group] Update error:', error);
        throw error;
      }
      console.log('[avatar-group] Profile updated, data:', updateData);
    }

    const { data: final, error: fetchErr } = await supabase
      .from('profiles').select('*').eq('id', id).maybeSingle();
    
    console.log('[avatar-group] Final fetch result:', { final, fetchErr });
    
    if (fetchErr) {
      console.error('[avatar-group] Fetch error:', fetchErr);
      throw fetchErr;
    }
    if (!final) {
      console.error('[avatar-group] Profile not found after operation');
      res.status(500).json({ error: 'Failed to retrieve updated profile' });
      return;
    }

    res.json({ user: final });
  } catch (err: any) {
    console.error('[update-avatar-group]', err);
    res.status(500).json({ error: err.message || 'Failed to update avatar group' });
  }
};

// PATCH /api/admin/users/:id/status — independently toggle active / inactive
// Last updated: 2026-02-22
export const handleUpdateStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: 'active' | 'inactive' };

    console.log('[update-status] Request received:', { id, status });

    if (!['active', 'inactive'].includes(status)) {
      res.status(400).json({ error: 'status must be "active" or "inactive"' });
      return;
    }

    const supabase = getAdminClient();
    console.log('[update-status] Checking if profile exists for user:', id);

    // Check if the profile row already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    console.log('[update-status] Profile exists:', !!existing);

    if (!existing) {
      console.log('[update-status] Creating profile from auth user...');
      // Profile row missing — fetch auth user details and create it now
      const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(id);
      if (authErr || !authUser?.user) {
        console.error('[update-status] Auth user not found:', authErr);
        res.status(404).json({ error: 'Auth user not found' });
        return;
      }
      const u = authUser.user;
      const meta = u.user_metadata as any;
      const trialEnd = new Date();
      trialEnd.setMonth(trialEnd.getMonth() + 3);
      
      console.log('[update-status] Auth user data:', { email: u.email, meta });
      
      const { data: upsertData, error: upsertErr } = await supabase.from('profiles').upsert({
        id,
        email: u.email ?? '',
        full_name: meta?.full_name || meta?.name || u.email?.split('@')[0] || 'User',
        avatar_url: meta?.avatar_url || meta?.picture || null,
        role: 'user',
        status,
        credit_balance: 30,
        total_views: 0,
        onboarding_completed: false,
        trial_ends_at: trialEnd.toISOString(),
        created_at: u.created_at,
      }, { onConflict: 'id' });
      
      if (upsertErr) {
        console.error('[update-status] Upsert error:', upsertErr);
        throw upsertErr;
      }
      console.log('[update-status] Profile created successfully, data:', upsertData);
    } else {
      console.log('[update-status] Updating existing profile...');
      // Row exists — just update status
      const { data: updateData, error } = await supabase
        .from('profiles')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      if (error) {
        console.error('[update-status] Update error:', error);
        throw error;
      }
      console.log('[update-status] Profile updated successfully, data:', updateData);
    }

    // Return the final row
    console.log('[update-status] Fetching final profile...');
    const { data: final, error: fetchErr } = await supabase
      .from('profiles').select('*').eq('id', id).maybeSingle();
    
    console.log('[update-status] Final fetch result:', { final, fetchErr });
    
    if (fetchErr) {
      console.error('[update-status] Fetch error:', fetchErr);
      throw fetchErr;
    }
    if (!final) {
      console.error('[update-status] Profile not found after upsert/update');
      res.status(500).json({ error: 'Failed to retrieve updated profile' });
      return;
    }

    console.log('[update-status] Success! Returning profile');
    res.json({ user: final });
  } catch (err: any) {
    console.error('[update-status]', err);
    res.status(500).json({ error: err.message || 'Failed to update status' });
  }
};
