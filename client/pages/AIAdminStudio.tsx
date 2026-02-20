import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, LogOut, RefreshCw, Trash2, X,
  CheckCircle2, AlertCircle, Mail,
  Crown, Zap, BarChart3, Edit2, Save, ChevronRight,
  Settings, LayoutDashboard, UserCog, TrendingUp, Menu,
  Sun, Moon, Search, Filter, Layers, Calendar,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface AdminUser {
  id: string;
  email: string;
  phone: string;
  display_name: string;
  avatar_url: string | null;
  avatar_group_id: string | null;
  providers: string[];
  provider_type: string;
  role: 'user' | 'admin';
  credit_balance: number;
  trial_ends_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

type EditField = 'credits' | 'role' | null;

// ── Avatar groups list ─────────────────────────────────────
const AVATAR_GROUPS = [
  { id: 'AVG-2024-KX-001', name: 'Team Alpha' },
  { id: 'AVG-2024-KX-002', name: 'Team Beta' },
  { id: 'AVG-2024-KX-003', name: 'Team Gamma' },
  { id: 'AVG-2024-KX-004', name: 'Enterprise Group' },
  { id: 'AVG-2024-KX-005', name: 'Starter Pack' },
];

function fmt(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtShort(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function shortId(id: string) {
  return id.length > 20 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
}

const ProviderBadge = ({ provider }: { provider: string }) => (
  <span className="inline-flex items-center gap-1 text-[10px] bg-foreground/[0.07] border border-border rounded-md px-1.5 py-0.5 text-foreground/60 font-semibold">
    {provider === 'google'
      ? <><span className="font-bold text-[9px] text-blue-400">G</span> Google</>
      : <><Mail className="w-2.5 h-2.5" /> Email</>}
  </span>
);

// ── Assign Avatar Group Modal ──────────────────────────────
function AssignModal({
  user, onClose, onAssign,
}: {
  user: AdminUser;
  onClose: () => void;
  onAssign: (userId: string, groupId: string | null) => Promise<void>;
}) {
  const [selectedGroup, setSelectedGroup] = useState(user.avatar_group_id ?? '');
  const [saving, setSaving] = useState(false);

  const handleAssign = async () => {
    setSaving(true);
    await onAssign(user.id, selectedGroup || null);
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-foreground/[0.07] hover:bg-foreground/[0.12] flex items-center justify-center text-foreground/60 hover:text-foreground transition-all"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-6 pb-5 border-b border-border">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <p className="text-foreground font-bold text-base">Assign Avatar Group ID</p>
            <p className="text-foreground/40 text-xs mt-0.5">
              User: <span className="font-semibold text-foreground/60">{user.display_name !== '-' ? user.display_name : user.email}</span>{' '}
              · {user.email}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-foreground/60 uppercase tracking-wide mb-2">
              <Layers className="w-3.5 h-3.5" /> Select Avatar Group
            </label>
            <select
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all cursor-pointer"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">— No Group Assigned —</option>
              {AVATAR_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>{g.id} — {g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-cyan-500/[0.08] border border-cyan-500/20 text-xs text-cyan-600 dark:text-cyan-300 leading-relaxed">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              {selectedGroup
                ? `Assigning "${AVATAR_GROUPS.find((g) => g.id === selectedGroup)?.name ?? selectedGroup}" will link this user to the selected avatar group.`
                : "Removing the Avatar Group ID will unlink this user from their current avatar group."}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 border-t border-border pt-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-semibold hover:bg-foreground/5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00C2FF] hover:bg-[#00aadd] text-black text-sm font-semibold transition-all disabled:opacity-60 shadow-lg shadow-[#00C2FF]/20"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            {saving ? 'Saving…' : selectedGroup ? 'Assign Group' : 'Remove Group'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── STAT COLS ──────────────────────────────────────────────
const STAT_COLS = [
  { label: 'Total Users',         key: 'total',     Icon: Users,    color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { label: 'Admins',              key: 'admins',    Icon: Crown,    color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  { label: 'Credits Distributed', key: 'credits',   Icon: Zap,      color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20' },
  { label: 'Auth Providers',      key: 'providers', Icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
] as const;

type ActiveSection = 'overview' | 'users' | 'roles';

export default function AIAdminStudio() {
  const { adminUsername, logout } = useAdminStore();
  const { theme, toggle } = useTheme();

  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editField, setEditField] = useState<EditField>(null);
  const [editingCredit, setEditingCredit] = useState(0);
  const [editingRole, setEditingRole] = useState<'user' | 'admin'>('user');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Assign modal
  const [assigningUser, setAssigningUser] = useState<AdminUser | null>(null);

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

  const startEditCredits = (u: AdminUser) => { setEditingId(u.id); setEditField('credits'); setEditingCredit(u.credit_balance); };
  const startEditRole    = (u: AdminUser) => { setEditingId(u.id); setEditField('role');    setEditingRole(u.role); };
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

  const handleAssignGroup = async (userId: string, groupId: string | null) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/avatar-group`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_group_id: groupId }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, avatar_group_id: groupId } : u));
      showToast(groupId ? `Avatar group assigned — user activated` : 'Avatar group removed — user deactivated');
    } catch (e: any) { showToast(e.message, false); }
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
  const allAdmins     = signedInUsers.filter((u) => u.role === 'admin');
  const totalCredits  = signedInUsers.reduce((s, u) => s + u.credit_balance, 0);
  const uniqueProviders = [...new Set(signedInUsers.flatMap((u) => u.providers))].length;

  const stats = { total: signedInUsers.length, admins: allAdmins.length, credits: totalCredits, providers: uniqueProviders };

  // Decide which rows to show based on section, search, and filter
  const baseRows = activeSection === 'roles' ? signedInUsers.filter((u) => u.role === 'admin') : signedInUsers;
  // Active = signed in within the last 30 days
  const isUserActive = (u: AdminUser) => {
    if (!u.last_sign_in_at) return false;
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return new Date(u.last_sign_in_at).getTime() > thirtyDaysAgo;
  };
  const filteredRows = baseRows.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || u.email.toLowerCase().includes(q) || (u.display_name !== '-' && u.display_name.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'all'
      || (statusFilter === 'active' && isUserActive(u))
      || (statusFilter === 'inactive' && !isUserActive(u));
    return matchSearch && matchStatus;
  });

  const activeCount   = baseRows.filter(isUserActive).length;
  const inactiveCount = baseRows.filter((u) => !isUserActive(u)).length;
  const hasFilters    = !!searchQuery || statusFilter !== 'all';

  const sidebarItems: { icon: typeof LayoutDashboard; label: string; section: ActiveSection }[] = [
    { icon: LayoutDashboard, label: 'Overview',       section: 'overview' },
    { icon: Users,           label: 'All Users',      section: 'users'    },
    { icon: UserCog,         label: 'Admins & Roles', section: 'roles'    },
  ];

  return (
    <motion.div className="flex h-screen bg-background text-foreground overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={cn(
        'fixed inset-y-0 left-0 h-full w-60 z-40 flex flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out',
        'lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="px-5 py-5 flex items-center gap-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-foreground font-bold text-sm tracking-tight block">Admin Portal</span>
            <span className="text-foreground/50 text-[10px] font-semibold">Narrately.ai</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {sidebarItems.map(({ icon: Icon, label, section }) => (
            <motion.button key={section} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setActiveSection(section); setSidebarOpen(false); }}
              className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                activeSection === section
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20'
                  : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5')}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {activeSection === section && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </motion.button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 px-1 mb-3">Quick Stats</p>
          {[
            { label: 'Signed-in Users', value: loading ? '—' : signedInUsers.length },
            { label: 'Total Credits',   value: loading ? '—' : totalCredits },
            { label: 'Admin Accounts',  value: loading ? '—' : allAdmins.length },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-2">
              <span className="text-[11px] font-semibold text-foreground/60">{label}</span>
              <span className="text-xs font-bold text-foreground">{value}</span>
            </div>
          ))}
        </div>

        <div className="px-4 pb-5 pt-4 border-t border-border space-y-1">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
              <p className="text-[10px] font-semibold text-foreground/50 truncate">Super Admin</p>
            </div>
          </div>
          <motion.button whileHover={{ x: 3 }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all">
            <Settings className="w-4 h-4" /> Settings
          </motion.button>
          <motion.button whileHover={{ x: 3 }} onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </motion.button>
          <motion.button whileHover={{ x: 3 }} onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" /> Log out
          </motion.button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 md:px-8 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-foreground/50 hover:text-foreground transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {activeSection === 'overview' && 'Dashboard Overview'}
                {activeSection === 'users'    && 'User Management'}
                {activeSection === 'roles'    && 'Admins & Roles'}
              </h2>
              <p className="text-xs font-medium text-foreground/50 mt-0.5">
                {loading ? 'Fetching data…' : `${signedInUsers.length} signed-in users · live data`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all"
              aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={fetchUsers} disabled={loading}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-border bg-foreground/5 text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all disabled:opacity-50">
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
          </div>
        </header>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
              className={cn('fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium shadow-2xl border',
                toast.ok
                  ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-600 dark:text-emerald-300'
                  : 'bg-red-500/15 border-red-500/25 text-red-600 dark:text-red-300')}>
              {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 w-full space-y-6">

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {STAT_COLS.map(({ label, key, Icon, color, bg, border }) => (
              <motion.div key={key} whileHover={{ scale: 1.02 }}
                className={cn('rounded-2xl border bg-card p-4 sm:p-5 flex items-start justify-between shadow-sm', border)}>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-foreground/60 mb-1 uppercase tracking-wide">{label}</p>
                  {loading
                    ? <div className="h-7 sm:h-9 w-12 rounded-lg bg-foreground/5 animate-pulse mt-1" />
                    : <p className="text-2xl sm:text-4xl font-bold text-foreground">{stats[key]}</p>}
                </div>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
                  <Icon className={cn('w-5 h-5', color)} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Active/Inactive mini chips (users + roles sections) ── */}
          {activeSection !== 'overview' && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-sm">
                <Users className="w-4 h-4 text-foreground/40" />
                <span className="text-sm font-bold text-foreground">{baseRows.length}</span>
                <span className="text-xs text-foreground/40 font-semibold">Total</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</span>
                <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-semibold">Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/[0.08] border border-amber-500/20">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{inactiveCount}</span>
                <span className="text-xs text-amber-600/70 dark:text-amber-400/70 font-semibold">Inactive</span>
              </div>
            </div>
          )}

          {/* ── Search + Filter toolbar (users + roles sections) ── */}
          {activeSection !== 'overview' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="flex-1 min-w-0 flex items-center gap-2.5 bg-card border border-border rounded-xl px-4 py-2.5 text-foreground/40 focus-within:border-[#00C2FF]/50 focus-within:ring-1 focus-within:ring-[#00C2FF]/20 transition-all">
                  <Search className="w-4 h-4 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by name or email…"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-foreground/30 hover:text-foreground transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                    showFilters
                      ? 'bg-[#00C2FF]/10 border-[#00C2FF]/40 text-[#00C2FF]'
                      : 'bg-card border-border text-foreground/60 hover:text-foreground hover:bg-foreground/5',
                  )}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasFilters && (
                    <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>
              </div>

              {/* Filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-4 flex-wrap bg-card border border-border rounded-xl px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Status</label>
                        <select
                          className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#00C2FF]/50 cursor-pointer"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                          <option value="all">All Users</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      {hasFilters && (
                        <button
                          onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                          className="ml-auto px-3 py-2 rounded-lg border border-border bg-background text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs text-foreground/40 font-semibold">
                {filteredRows.length} {filteredRows.length === 1 ? 'user' : 'users'} found
              </p>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              <button onClick={fetchUsers} className="ml-auto underline hover:no-underline text-xs">Retry</button>
            </motion.div>
          )}

          {/* ── User Table ── */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {activeSection === 'roles'
                  ? <UserCog className="w-4 h-4 text-amber-500" />
                  : <Users className="w-4 h-4 text-cyan-500" />}
                <h2 className="text-sm font-bold text-foreground">
                  {activeSection === 'roles' ? 'Admin & Role Management' : 'User Management'}
                  {!loading && (
                    <span className="ml-2 text-xs text-foreground/40 font-semibold">
                      {filteredRows.length} accounts
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Live data</span>
              </div>
            </div>

            {/* Empty state */}
            {!loading && filteredRows.length === 0 && (
              <div className="flex flex-col items-center py-20 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-foreground/[0.05] border border-border flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-foreground/20" />
                </div>
                <p className="text-foreground font-bold text-base mb-1">No users found</p>
                <p className="text-foreground/40 text-sm max-w-xs leading-relaxed mb-4">
                  {hasFilters ? 'Try adjusting your filters or search query.' : 'No registered users yet.'}
                </p>
                {hasFilters && (
                  <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                    className="px-4 py-2 rounded-xl bg-[#00C2FF] text-black text-sm font-semibold hover:bg-[#00aadd] transition-all">
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Table */}
            {(loading || filteredRows.length > 0) && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ minWidth: '900px' }}>
                  <thead>
                    <tr className="border-b border-border bg-foreground/[0.02]">
                      {['', 'User', 'Email', 'Status', 'Avatar Group ID', 'Date Joined', 'Credits', 'Role', 'Last Sign In', 'Actions'].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-left text-[10px] font-bold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-border">
                          {Array.from({ length: 10 }).map((__, j) => (
                            <td key={j} className="px-4 py-4">
                              <div className="h-3.5 rounded-md bg-foreground/5 animate-pulse" style={{ width: `${35 + (j * 19) % 55}%` }} />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filteredRows.map((u, idx) => {
                      const isEditingThis = editingId === u.id;
                      const active = isUserActive(u);
                      return (
                        <motion.tr key={u.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className="border-b border-border hover:bg-foreground/[0.02] transition-colors group">

                          {/* Avatar */}
                          <td className="px-4 py-3.5">
                            {u.avatar_url
                              ? <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full border border-border object-cover" />
                              : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/50 to-cyan-500/50 flex items-center justify-center text-xs font-bold text-foreground">
                                  {(u.display_name !== '-' ? u.display_name : u.email).charAt(0).toUpperCase()}
                                </div>}
                          </td>

                          {/* User */}
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-foreground whitespace-nowrap">
                              {u.display_name !== '-' ? u.display_name : <span className="text-foreground/30">—</span>}
                            </p>
                            <p className="text-[10px] font-mono text-foreground/30 mt-0.5 select-all" title={u.id}>{shortId(u.id)}</p>
                          </td>

                          {/* Email */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5 text-foreground/60 text-xs font-semibold">
                              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="max-w-[160px] truncate">{u.email || '—'}</span>
                            </div>
                            {u.providers.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {u.providers.map((p) => <ProviderBadge key={p} provider={p} />)}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={cn(
                              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap',
                              active
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                            )}>
                              <div className={cn('w-1.5 h-1.5 rounded-full', active ? 'bg-emerald-500' : 'bg-amber-500')} />
                              {active ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          {/* Avatar Group ID */}
                          <td className="px-4 py-3.5">
                            {u.avatar_group_id ? (
                              <div className="flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-foreground/30" />
                                <span className="font-mono text-[11px] font-bold bg-[#00C2FF]/10 text-[#00C2FF] px-2 py-0.5 rounded-lg">
                                  {u.avatar_group_id}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-foreground/30 italic">Not assigned</span>
                            )}
                          </td>

                          {/* Date Joined */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5 text-foreground/50 text-xs font-semibold">
                              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                              {fmtShort(u.created_at)}
                            </div>
                          </td>

                          {/* Credits */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {isEditingThis && editField === 'credits' && u.role !== 'admin' ? (
                              <div className="flex items-center gap-1.5">
                                <input type="number" value={editingCredit}
                                  onChange={(e) => setEditingCredit(Number(e.target.value))}
                                  className="w-20 px-2 py-1.5 rounded-lg bg-background border border-cyan-500/40 text-foreground text-xs outline-none focus:border-cyan-500"
                                  autoFocus />
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSaveCredit(u.id)} disabled={saving}
                                  className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50" title="Save">
                                  {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={cancelEdit}
                                  className="p-1.5 rounded-lg bg-foreground/5 text-foreground/40 hover:bg-foreground/10" title="Cancel">
                                  <X className="w-3 h-3" />
                                </motion.button>
                              </div>
                            ) : (
                              u.role === 'admin' ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-violet-500 text-lg leading-none" title="Unlimited">∞</span>
                                  <Zap className="w-3 h-3 text-yellow-400" />
                                </div>
                              ) : (
                              <button onClick={() => startEditCredits(u)} className="flex items-center gap-1.5 group/c" title="Click to edit">
                                <span className="font-bold text-cyan-600 dark:text-cyan-300">{u.credit_balance}</span>
                                <Zap className="w-3 h-3 text-yellow-400" />
                                <Edit2 className="w-2.5 h-2.5 text-foreground/30 opacity-0 group-hover/c:opacity-100 transition-opacity" />
                              </button>
                              )
                            )}
                          </td>

                          {/* Role */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {isEditingThis && editField === 'role' ? (
                              <div className="flex items-center gap-1.5">
                                <select value={editingRole} onChange={(e) => setEditingRole(e.target.value as 'user' | 'admin')}
                                  className="px-2 py-1.5 rounded-lg bg-background border border-amber-500/40 text-foreground text-xs outline-none focus:border-amber-500"
                                  autoFocus>
                                  <option value="user">user</option>
                                  <option value="admin">admin</option>
                                </select>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSaveRole(u.id)} disabled={saving}
                                  className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-50" title="Save">
                                  {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={cancelEdit}
                                  className="p-1.5 rounded-lg bg-foreground/5 text-foreground/40 hover:bg-foreground/10" title="Cancel">
                                  <X className="w-3 h-3" />
                                </motion.button>
                              </div>
                            ) : (
                              <button onClick={() => startEditRole(u)} className="group/r flex items-center gap-1.5">
                                <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap',
                                  u.role === 'admin'
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                    : 'bg-foreground/[0.07] text-foreground/60 border-border')}>
                                  {u.role}
                                </span>
                                <Edit2 className="w-2.5 h-2.5 text-foreground/30 opacity-0 group-hover/r:opacity-100 transition-opacity" />
                              </button>
                            )}
                          </td>

                          {/* Last Sign In */}
                          <td className="px-4 py-3.5 text-xs font-semibold whitespace-nowrap">
                            {u.last_sign_in_at
                              ? <span className="text-emerald-600 dark:text-emerald-400">{fmt(u.last_sign_in_at)}</span>
                              : <span className="text-foreground/30">Never</span>}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setAssigningUser(u)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-[#00C2FF] text-xs font-semibold hover:bg-[#00C2FF]/10 hover:border-[#00C2FF]/40 transition-all whitespace-nowrap"
                              >
                                <Layers className="w-3 h-3 flex-shrink-0" />
                                {u.avatar_group_id ? 'Edit Group' : 'Assign Group'}
                              </button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(u.id)} disabled={deletingId === u.id}
                                className="p-1.5 rounded-lg text-foreground/30 hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-40" title="Delete user">
                                {deletingId === u.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredRows.length > 0 && (
              <div className="px-6 py-3 border-t border-border flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground/40">
                  Showing {filteredRows.length} of {baseRows.length} accounts
                </p>
                <p className="text-xs font-semibold text-foreground/40 flex items-center gap-1">
                  Click <Edit2 className="inline w-2.5 h-2.5 mx-0.5" /> on Credits or Role to edit inline
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Assign Modal ── */}
      <AnimatePresence>
        {assigningUser && (
          <AssignModal
            user={assigningUser}
            onClose={() => setAssigningUser(null)}
            onAssign={handleAssignGroup}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
