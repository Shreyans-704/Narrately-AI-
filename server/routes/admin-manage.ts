import { RequestHandler } from 'express';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.VITE_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
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
      .select()
      .single();

    if (error) throw error;

    res.json({ user: data });
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
      .select()
      .single();

    if (error) throw error;

    res.json({ user: data });
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
