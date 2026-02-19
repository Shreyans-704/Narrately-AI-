import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, LogOut, RefreshCw, Trash2, X,
  CheckCircle2, AlertCircle, Mail, Phone, Clock,
  Crown, Zap, BarChart3, Edit2, Save, ChevronRight,
  Settings, LayoutDashboard, UserCog, TrendingUp, Menu,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { cn } from '@/lib/utils';

interface AdminUser {
  id: string;
  email: string;
  phone: string;
  display_name: string;
  avatar_url: string | null;
  providers: string[];
  provider_type: string;
  role: 'user' | 'admin';
  credit_balance: number;
  trial_ends_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

type EditField = 'credits' | 'role' | null;

function fmt(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function shortId(id: string) {
  return id.length > 20 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
}

const ProviderBadge = ({ provider }: { provider: string }) => (
  <span className="inline-flex items-center gap-1 text-[10px] bg-white/8 border border-white/10 rounded-md px-1.5 py-0.5 text-white/55 font-medium">
    {provider === 'google'
      ? <><span className="font-bold text-[9px] text-blue-400">G</span> Google</>
      : <><Mail className="w-2.5 h-2.5" /> Email</>}
  </span>
);

const STAT_COLS = [
  { label: 'Total Users', key: 'total', Icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { label: 'Admins', key: 'admins', Icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { label: 'Credits Distributed', key: 'credits', Icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { label: 'Auth Providers', key: 'providers', Icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
] as const;

type ActiveSection = 'overview' | 'users' | 'roles';

export default function AIAdminStudio() {
  const { adminUsername, logout } = useAdminStore();

  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editField, setEditField] = useState<EditField>(null);
  const [editingCredit, setEditingCredit] = useState(0);
  const [editingRole, setEditingRole] = useState<'user' | 'admin'>('user');
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const displayName = adminUsername
    ? adminUsername.charAt(0).toUpperCase() + adminUsername.slice(1)
    : 'Admin';

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch users');
      const { users: data } = await res.json();
      setUsers(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const startEditCredits = (u: AdminUser) => {
    setEditingId(u.id); setEditField('credits'); setEditingCredit(u.credit_balance);
  };
  const startEditRole = (u: AdminUser) => {
    setEditingId(u.id); setEditField('role'); setEditingRole(u.role);
  };
  const cancelEdit = () => { setEditingId(null); setEditField(null); };

  const handleSaveCredit = async (userId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credit_balance: editingCredit }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, credit_balance: editingCredit } : u));
      cancelEdit(); showToast('Credits updated successfully');
    } catch (e: any) { showToast(e.message, false); }
    finally { setSaving(false); }
  };

  const handleSaveRole = async (userId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editingRole }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: editingRole } : u));
      cancelEdit(); showToast('Role updated successfully');
    } catch (e: any) { showToast(e.message, false); }
    finally { setSaving(false); }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Permanently delete this user? This action cannot be undone.')) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('User deleted');
    } catch (e: any) { showToast(e.message, false); }
    finally { setDeletingId(null); }
  };

  const handleLogout = () => { logout(); window.location.href = '/'; };

  const signedInUsers = users.filter((u) => u.last_sign_in_at !== null);
  const allAdmins = signedInUsers.filter((u) => u.role === 'admin');
  const totalCredits = signedInUsers.reduce((s, u) => s + u.credit_balance, 0);
  const uniqueProviders = [...new Set(signedInUsers.flatMap((u) => u.providers))].length;

  const stats = { total: signedInUsers.length, admins: allAdmins.length, credits: totalCredits, providers: uniqueProviders };
  const tableRows = activeSection === 'roles' ? signedInUsers.filter((u) => u.role === 'admin') : signedInUsers;

  const sidebarItems: { icon: typeof LayoutDashboard; label: string; section: ActiveSection }[] = [
    { icon: LayoutDashboard, label: 'Overview', section: 'overview' },
    { icon: Users, label: 'All Users', section: 'users' },
    { icon: UserCog, label: 'Admins & Roles', section: 'roles' },
  ];

  return (
    <motion.div className="flex h-screen bg-[#050505] text-white overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 h-full w-60 z-40 flex flex-col border-r border-white/5 bg-white/[0.025] backdrop-blur-xl transition-transform duration-300 ease-in-out',
          'lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-semibold text-sm tracking-tight block">Admin Portal</span>
            <span className="text-white/30 text-[10px]">Narrately.ai</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {sidebarItems.map(({ icon: Icon, label, section }) => (
            <motion.button key={section} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSection(section)}
              className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                activeSection === section
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                  : 'text-white/45 hover:text-white hover:bg-white/5')}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {activeSection === section && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </motion.button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/5 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-1 mb-3">Quick Stats</p>
          {[
            { label: 'Signed-in Users', value: loading ? '—' : signedInUsers.length },
            { label: 'Total Credits', value: loading ? '—' : totalCredits },
            { label: 'Admin Accounts', value: loading ? '—' : allAdmins.length },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-2">
              <span className="text-[11px] text-white/35">{label}</span>
              <span className="text-xs font-semibold text-white/70">{value}</span>
            </div>
          ))}
        </div>

        <div className="px-4 pb-5 pt-4 border-t border-white/5 space-y-1">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-[10px] text-white/35 truncate">Super Admin</p>
            </div>
          </div>
          <motion.button whileHover={{ x: 3 }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Settings className="w-4 h-4" /> Settings
          </motion.button>
          <motion.button whileHover={{ x: 3 }} onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" /> Log out
          </motion.button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 md:px-8 border-b border-white/5 bg-[#050505]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-white/50 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-semibold text-white">
                {activeSection === 'overview' && 'Dashboard Overview'}
                {activeSection === 'users' && 'User Management'}
                {activeSection === 'roles' && 'Admins & Roles'}
              </h2>
              <p className="text-xs text-white/30 mt-0.5">
                {loading ? 'Fetching data…' : `${signedInUsers.length} signed-in users · last updated just now`}
              </p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={fetchUsers} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Refresh
          </motion.button>
        </header>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
              className={cn('fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium shadow-2xl border',
                toast.ok ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' : 'bg-red-500/15 border-red-500/25 text-red-300')}>
              {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 w-full">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {STAT_COLS.map(({ label, key, Icon, color, bg, border }) => (
              <motion.div key={key} whileHover={{ scale: 1.02 }}
                className={cn('rounded-2xl border bg-white/[0.025] p-5 flex items-start justify-between', border)}>
                <div>
                  <p className="text-xs text-white/35 font-medium mb-1">{label}</p>
                  {loading
                    ? <div className="h-9 w-14 rounded-lg bg-white/5 animate-pulse mt-1" />
                    : <p className="text-4xl font-bold text-white">{stats[key]}</p>}
                </div>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
                  <Icon className={cn('w-5 h-5', color)} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              <button onClick={fetchUsers} className="ml-auto underline hover:no-underline text-xs">Retry</button>
            </motion.div>
          )}

          {/* User Table */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.025] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {activeSection === 'roles'
                  ? <UserCog className="w-4 h-4 text-amber-400" />
                  : <Users className="w-4 h-4 text-cyan-400" />}
                <h2 className="text-sm font-semibold text-white">
                  {activeSection === 'roles' ? 'Admin & Role Management' : 'Signed-in Users'}
                  {!loading && <span className="ml-2 text-xs text-white/30 font-normal">{tableRows.length} accounts</span>}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Live data</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: '1100px' }}>
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.015]">
                    {['', 'UID', 'Display Name', 'Email', 'Phone', 'Auth Providers', 'Provider Type', 'Credits', 'Role', 'Created At', 'Last Sign In', 'Actions'].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-[10px] font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {Array.from({ length: 12 }).map((__, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-3.5 rounded-md bg-white/5 animate-pulse" style={{ width: `${35 + (j * 19) % 55}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : tableRows.length === 0 ? (
                    <tr><td colSpan={12} className="px-6 py-16 text-center text-white/25 text-sm">No users found.</td></tr>
                  ) : tableRows.map((u, idx) => {
                    const isEditingThis = editingId === u.id;
                    return (
                      <motion.tr key={u.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/[0.025] transition-colors group">

                        {/* Avatar */}
                        <td className="px-4 py-3.5">
                          {u.avatar_url
                            ? <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                            : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/50 to-cyan-500/50 flex items-center justify-center text-xs font-bold text-white/80">
                                {(u.display_name !== '-' ? u.display_name : u.email).charAt(0).toUpperCase()}
                              </div>}
                        </td>

                        {/* UID */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-[10px] text-white/30 select-all cursor-copy hover:text-white/50 transition-colors" title={u.id}>
                            {shortId(u.id)}
                          </span>
                        </td>

                        {/* Display Name */}
                        <td className="px-4 py-3.5 font-medium text-white whitespace-nowrap">
                          {u.display_name !== '-' ? u.display_name : <span className="text-white/20">—</span>}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3.5 text-white/50 max-w-[180px] truncate">
                          {u.email || <span className="text-white/20">—</span>}
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-3.5 text-white/40 whitespace-nowrap">
                          {u.phone !== '-'
                            ? <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-white/25" />{u.phone}</span>
                            : <span className="text-white/20">—</span>}
                        </td>

                        {/* Auth Providers */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 flex-wrap">
                            {u.providers.length
                              ? u.providers.map((p) => <ProviderBadge key={p} provider={p} />)
                              : <span className="text-white/20 text-xs">—</span>}
                          </div>
                        </td>

                        {/* Provider Type */}
                        <td className="px-4 py-3.5 text-white/35 text-xs">{u.provider_type}</td>

                        {/* Credits — editable */}
                        <td className="px-4 py-3.5">
                          {isEditingThis && editField === 'credits' ? (
                            <div className="flex items-center gap-1.5">
                              <input type="number" value={editingCredit}
                                onChange={(e) => setEditingCredit(Number(e.target.value))}
                                className="w-20 px-2 py-1.5 rounded-lg bg-white/10 border border-cyan-500/40 text-white text-xs outline-none focus:border-cyan-400"
                                autoFocus />
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSaveCredit(u.id)} disabled={saving}
                                className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50" title="Save">
                                {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              </motion.button>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={cancelEdit}
                                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10" title="Cancel">
                                <X className="w-3 h-3" />
                              </motion.button>
                            </div>
                          ) : (
                            <button onClick={() => startEditCredits(u)} className="flex items-center gap-1.5 group/c" title="Click to edit credits">
                              <span className="font-semibold text-cyan-300">{u.credit_balance}</span>
                              <Zap className="w-3 h-3 text-yellow-400" />
                              <Edit2 className="w-2.5 h-2.5 text-white/20 opacity-0 group-hover/c:opacity-100 transition-opacity" />
                            </button>
                          )}
                        </td>

                        {/* Role — editable */}
                        <td className="px-4 py-3.5">
                          {isEditingThis && editField === 'role' ? (
                            <div className="flex items-center gap-1.5">
                              <select value={editingRole} onChange={(e) => setEditingRole(e.target.value as 'user' | 'admin')}
                                className="px-2 py-1.5 rounded-lg bg-[#0d0d0d] border border-amber-500/40 text-white text-xs outline-none focus:border-amber-400"
                                autoFocus>
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                              </select>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSaveRole(u.id)} disabled={saving}
                                className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-50" title="Save">
                                {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              </motion.button>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={cancelEdit}
                                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10" title="Cancel">
                                <X className="w-3 h-3" />
                              </motion.button>
                            </div>
                          ) : (
                            <button onClick={() => startEditRole(u)} className="group/r flex items-center gap-1.5" title="Click to edit role">
                              <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors',
                                u.role === 'admin'
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                  : 'bg-white/8 text-white/40 border border-white/10')}>
                                {u.role}
                              </span>
                              <Edit2 className="w-2.5 h-2.5 text-white/20 opacity-0 group-hover/r:opacity-100 transition-opacity" />
                            </button>
                          )}
                        </td>

                        {/* Created At */}
                        <td className="px-4 py-3.5 text-white/30 text-xs whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-white/20" />{fmt(u.created_at)}
                          </span>
                        </td>

                        {/* Last Sign In */}
                        <td className="px-4 py-3.5 text-white/30 text-xs whitespace-nowrap">
                          {u.last_sign_in_at
                            ? <span className="text-emerald-400/70">{fmt(u.last_sign_in_at)}</span>
                            : <span className="text-white/20">Never</span>}
                        </td>

                        {/* Delete */}
                        <td className="px-4 py-3.5">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(u.id)} disabled={deletingId === u.id}
                            className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40" title="Delete user">
                            {deletingId === u.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!loading && tableRows.length > 0 && (
              <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
                <p className="text-xs text-white/25">Showing {tableRows.length} of {users.length} total accounts</p>
                <p className="text-xs text-white/25 flex items-center gap-1">
                  Click <Edit2 className="inline w-2.5 h-2.5 mx-0.5" /> on Credits or Role to edit inline
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </motion.div>
  );
}
