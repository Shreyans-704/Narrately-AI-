import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  User,
  FolderOpen,
  ChevronRight,
  Settings,
  LogOut,
  Zap,
  Menu,
  X,
  Sun,
  Moon,
  Camera,
  Edit2,
  Check,
  XIcon,
  Shield,
  Mail,
  Layers,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { signOut, updateUserProfile, uploadAvatar, changePassword } from "@/lib/supabase";
import { useTheme } from "@/hooks/useTheme";

// ── Sidebar nav items ──────────────────────────────────────
const sidebarNavItems = [
  { icon: Home, label: "Home" },
  { icon: User, label: "Avatar" },
  { icon: FolderOpen, label: "Projects" },
];

// ── Onboarding choices (reused in Preferences tab) ───────
const onboardingGoals = ['Social Media', 'Ads', 'Education & Training Videos', 'Product Demos', 'Internal Communications', 'Video Translations', 'Podcasts', 'Other'];
const onboardingRoles = ['Marketing', 'Sales', 'Education & Training', 'Business Owner', 'Content Creator', 'Other'];
const onboardingPersonas = [
  { title: 'I run my own business or work independently', sub: 'Freelancer, solopreneur, or founder' },
  { title: 'I work at a company or as part of a team', sub: 'Employee, agency, or enterprise team member' },
  { title: "I'm just trying things out for fun or learning", sub: 'Student, hobbyist, or curious creator' },
];

// ── Profile sub-nav ────────────────────────────────────────
const profileNavItems = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

// ── Google icon (SVG) ──────────────────────────────────────
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// ── Strength helpers ───────────────────────────────────────
const calcStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "#ef4444", "#f59e0b", "#10b981", "#6366f1"];

// ── Main Component ─────────────────────────────────────────
export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile state — seeded from Supabase user record
  const [activeTab, setActiveTab] = useState("profile");
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.full_name || user?.email?.split("@")[0] || "User"
  );
  const [nameInput, setNameInput] = useState(
    user?.full_name || user?.email?.split("@")[0] || "User"
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url ?? null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Security state
  const [showPw, setShowPw] = useState({ cur: false, new: false, con: false });
  const [pwForm, setPwForm] = useState({ cur: "", new: "", con: "" });
  const [pwStrength, setPwStrength] = useState(0);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  // Preferences state
  const [prefGoal, setPrefGoal] = useState<string>((user as any)?.onboarding_goal || 'Social Media');
  const [prefRole, setPrefRole] = useState<string>((user as any)?.onboarding_role || 'Marketing');
  const [prefPersona, setPrefPersona] = useState<number>(() => {
    const saved = (user as any)?.onboarding_persona;
    if (!saved) return 0;
    const idx = onboardingPersonas.findIndex((p) => p.title === saved);
    return idx >= 0 ? idx : 0;
  });
  const [prefLoading, setPrefLoading] = useState(false);
  const [prefError, setPrefError] = useState<string | null>(null);
  const [prefSuccess, setPrefSuccess] = useState(false);

  // Keep preference form in sync when the user store updates (e.g. right after
  // returning from onboarding where fresh DB data was fetched before navigating here)
  useEffect(() => {
    if (!user) return;
    setPrefGoal((user as any).onboarding_goal || 'Social Media');
    setPrefRole((user as any).onboarding_role || 'Marketing');
    setPrefPersona(() => {
      const saved = (user as any).onboarding_persona;
      if (!saved) return 0;
      const idx = onboardingPersonas.findIndex((p) => p.title === saved);
      return idx >= 0 ? idx : 0;
    });
  }, [user?.id, (user as any)?.onboarding_goal, (user as any)?.onboarding_role, (user as any)?.onboarding_persona]);

  const fileRef = useRef<HTMLInputElement>(null);
  const isActive = true;

  const handleLogout = async () => {
    await signOut();
    logout();
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) {}
    navigate("/");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Optimistic preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    setIsUploadingAvatar(true);
    setSaveError(null);

    const { url, user: updatedUser, error } = await uploadAvatar(user.id, file);
    setIsUploadingAvatar(false);

    if (error || !url) {
      setSaveError(error ?? "Avatar upload failed");
      // Revert preview
      setAvatarUrl(user.avatar_url ?? null);
      return;
    }

    setAvatarUrl(url);
    if (updatedUser) setUser(updatedUser as any);
  };

  const handleSaveName = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    setSaveError(null);

    const { user: updatedUser, error } = await updateUserProfile(user.id, {
      full_name: nameInput,
      updated_at: new Date().toISOString(),
    });

    setIsSaving(false);

    if (error || !updatedUser) {
      setSaveError(error ?? "Failed to save name");
      return;
    }

    setUser(updatedUser as any);
    setDisplayName(nameInput);
    setEditingName(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePassword = async () => {
    setPwError(null);
    setPwSuccess(false);
    if (pwForm.new.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (!/[A-Z]/.test(pwForm.new)) { setPwError('New password must contain at least one uppercase letter.'); return; }
    if (!/[0-9]/.test(pwForm.new)) { setPwError('New password must contain at least one number.'); return; }
    if (pwForm.new !== pwForm.con) { setPwError('New passwords do not match.'); return; }

    setPwLoading(true);
    const { error } = await changePassword(pwForm.new);
    setPwLoading(false);

    if (error) {
      setPwError(error);
    } else {
      setPwSuccess(true);
      setPwForm({ cur: '', new: '', con: '' });
      setPwStrength(0);
      setTimeout(() => setPwSuccess(false), 4000);
    }
  };

  const handleSavePreferences = async () => {
    if (!user?.id) return;
    setPrefLoading(true);
    setPrefError(null);
    setPrefSuccess(false);
    const { user: updated, error } = await updateUserProfile(user.id, {
      onboarding_goal: prefGoal,
      onboarding_role: prefRole,
      onboarding_persona: onboardingPersonas[prefPersona].title,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });
    setPrefLoading(false);
    if (error || !updated) { setPrefError(error ?? 'Failed to save preferences'); return; }
    setUser(updated as any);
    setPrefSuccess(true);
    setTimeout(() => setPrefSuccess(false), 3000);
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "February 17, 2026";

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C2FF] to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-base">N</span>
              </div>
              <span className="text-foreground font-bold text-lg tracking-tight">
                Narrately
              </span>
            </div>
            <button
              className="lg:hidden text-foreground/40 hover:text-foreground transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 flex flex-col gap-0.5">
          {sidebarNavItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => navigate("/studio")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-foreground/50 hover:text-foreground hover:bg-foreground/5"
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mx-4 my-2 border-t border-border" />

        {/* Personal */}
        <div className="px-4 py-2">
          <p className="text-foreground/40 text-[10px] uppercase tracking-widest mb-2 px-1">
            Personal
          </p>
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg bg-foreground/5 border border-border transition-colors group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00C2FF] to-purple-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-left min-w-0">
              <p className="text-foreground text-xs font-semibold truncate">
                {displayName}
              </p>
              <p className="text-foreground/40 text-[10px] truncate">
                {user?.email ?? "user@narrately.ai"}
              </p>
            </div>
          </button>
        </div>

        {/* Workspace */}
        <div className="px-4 py-2">
          <p className="text-foreground/40 text-[10px] uppercase tracking-widest mb-2 px-1">
            Workspace
          </p>
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-foreground/5 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
              <span className="text-foreground/60 text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-foreground text-xs font-semibold truncate">
                {displayName}&apos;s Workspace
              </p>
              <p className="text-foreground/40 text-[10px]">· 1 Free</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-foreground/30 flex-shrink-0" />
          </button>
        </div>

        <div className="flex-1" />

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-border flex flex-col gap-0.5">
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors font-medium"
          >
            <Zap className="w-4 h-4 text-[#00C2FF]" />
            Upgrade Plan
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors font-medium">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-border flex-shrink-0 bg-card/60 backdrop-blur-sm">
          <button
            className="lg:hidden text-foreground/50 hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg bg-foreground/[0.07] hover:bg-foreground/[0.12] flex items-center justify-center text-foreground/60 hover:text-foreground transition-all"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            {/* Status pill */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/30"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex relative">
          {/* Radial glow */}
          <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px]">
            <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,194,255,0.06)_0%,transparent_70%)]" />
          </div>

          {/* Profile sub-sidebar — desktop only */}
          <div className="hidden md:flex flex-col w-56 flex-shrink-0 border-r border-border bg-card/40 p-4 gap-6 relative z-10">
            {/* Avatar block */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <div className="relative w-20 h-20">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00C2FF] to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-card border-2 border-border flex items-center justify-center text-[#00C2FF] hover:bg-foreground/5 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploadingAvatar}
                  title={isUploadingAvatar ? 'Uploading…' : 'Change avatar'}
                >
                  {isUploadingAvatar ? (
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                    </svg>
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="text-center">
                <p className="text-foreground text-sm font-semibold">
                  {displayName}
                </p>
                <p className="text-foreground/40 text-xs mt-0.5">
                  {user?.email ?? "user@narrately.ai"}
                </p>
              </div>
            </div>

            {/* Sub-nav */}
            <nav className="flex flex-col gap-1">
              {profileNavItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeTab === id
                      ? "bg-foreground/10 text-foreground"
                      : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>

            {/* Inactive notice */}
            {!isActive && (
              <div className="flex gap-2 items-start bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>
                  Your account is pending activation by an administrator.
                </span>
              </div>
            )}
          </div>

          {/* Main profile content */}
          <div className="flex-1 px-4 py-6 md:px-10 md:py-8 overflow-y-auto relative z-10">

            {/* ── Mobile: avatar + tab switcher (shown only below md) ── */}
            <div className="md:hidden flex flex-col items-center gap-4 mb-6">
              {/* Avatar */}
              <div className="relative w-20 h-20">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover ring-2 ring-border" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00C2FF] to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-card border-2 border-border flex items-center justify-center text-[#00C2FF] hover:bg-foreground/5 shadow-sm cursor-pointer disabled:opacity-50"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                    </svg>
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="text-center">
                <p className="text-foreground text-sm font-semibold">{displayName}</p>
                <p className="text-foreground/40 text-xs mt-0.5">{user?.email ?? ''}</p>
              </div>
              {/* Mobile tab switcher */}
              <div className="flex w-full gap-2 bg-foreground/[0.04] border border-border rounded-xl p-1">
                {profileNavItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === id
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-foreground/50 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl flex flex-col gap-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">
                    My Profile
                  </h1>
                  <p className="text-foreground/40 text-sm mt-1">
                    Manage your personal information and account details
                  </p>
                </div>

                {/* Error banner */}
                {saveError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {saveError}
                    <button className="ml-auto text-red-500/60 hover:text-red-500" onClick={() => setSaveError(null)}>✕</button>
                  </div>
                )}

                {/* Account Info card */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-border">
                    <p className="text-foreground text-sm font-semibold">
                      Account Information
                    </p>
                    <p className="text-foreground/40 text-xs mt-0.5">
                      Your details from Google authentication
                    </p>
                  </div>
                  <div className="divide-y divide-border/60">
                    {/* Display Name */}
                    <div className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-foreground/60 text-sm font-medium min-w-[150px]">
                        <User className="w-4 h-4" />
                        Display Name
                      </div>
                      {editingName ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/40 transition-all"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            autoFocus
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSaveName()
                            }
                          />
                          <button
                            onClick={handleSaveName}
                            disabled={isSaving}
                            className="w-8 h-8 rounded-lg bg-[#00C2FF] hover:bg-[#00aadd] flex items-center justify-center text-black transition-colors flex-shrink-0 disabled:opacity-60"
                          >
                            {isSaving ? (
                              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                              </svg>
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingName(false)}
                            className="w-8 h-8 rounded-lg bg-foreground/[0.07] hover:bg-foreground/[0.12] flex items-center justify-center text-foreground/60 transition-colors flex-shrink-0"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-foreground text-sm flex-1">
                            {displayName}
                          </span>
                          <button
                            onClick={() => {
                              setNameInput(displayName);
                              setEditingName(true);
                            }}
                            className="w-8 h-8 rounded-lg bg-foreground/[0.07] hover:bg-foreground/[0.12] flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors flex-shrink-0"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-foreground/60 text-sm font-medium min-w-[150px]">
                        <Mail className="w-4 h-4" />
                        Email Address
                        <span className="text-[10px] font-semibold text-foreground/40 bg-foreground/[0.07] px-2 py-0.5 rounded uppercase tracking-wide">
                          Read-only
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 text-foreground text-sm">
                        {user?.email ?? "user@narrately.ai"}
                        <span className="flex items-center gap-1.5 text-[11px] text-foreground/50 bg-foreground/[0.05] border border-border px-2 py-0.5 rounded-md">
                          <GoogleIcon /> Google
                        </span>
                      </div>
                    </div>

                    {/* Avatar Group ID */}
                    <div className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-foreground/60 text-sm font-medium min-w-[150px]">
                        <Layers className="w-4 h-4" />
                        Avatar Group ID
                        <span className="text-[10px] font-semibold text-foreground/40 bg-foreground/[0.07] px-2 py-0.5 rounded uppercase tracking-wide">
                          Read-only
                        </span>
                      </div>
                      <div className="flex-1">
                        {isActive ? (
                          <span className="font-mono text-sm bg-[#00C2FF]/10 text-[#00C2FF] px-3 py-1 rounded-lg font-semibold">
                            AVG-2024-KX-001
                          </span>
                        ) : (
                          <span className="text-sm text-foreground/40 italic">
                            Not yet assigned
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-foreground/60 text-sm font-medium min-w-[150px]">
                        <Calendar className="w-4 h-4" />
                        Member Since
                      </div>
                      <div className="flex-1 text-foreground text-sm">
                        {memberSince}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activation Status card */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-border">
                    <p className="text-foreground text-sm font-semibold">
                      Activation Status
                    </p>
                    <p className="text-foreground/40 text-xs mt-0.5">
                      Managed by your administrator
                    </p>
                  </div>
                  <div className="flex items-start justify-between px-6 py-5 gap-4 flex-wrap">
                    <div className="flex flex-col gap-3 flex-1">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold w-fit border ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isActive ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {isActive ? "Active" : "Inactive"}
                      </div>
                      <p className="text-foreground/50 text-sm leading-relaxed max-w-md">
                        {isActive
                          ? "Your account is fully activated. You have access to all platform features based on your subscription."
                          : "Your account is pending activation. An administrator will review and assign your Avatar Group ID to grant full access."}
                      </p>
                    </div>
                    {!isActive && (
                      <div className="flex flex-col items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-4 flex-shrink-0">
                        <span className="text-2xl">⏳</span>
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          Awaiting admin review
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl flex flex-col gap-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">
                    Security
                  </h1>
                  <p className="text-foreground/40 text-sm mt-1">
                    Manage your account security settings
                  </p>
                </div>

                {/* Google Auth notice */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-border">
                    <p className="text-foreground text-sm font-semibold">
                      Authentication Method
                    </p>
                  </div>
                  <div className="flex gap-4 items-start px-6 py-5">
                    <div className="w-10 h-10 rounded-xl bg-foreground/[0.07] border border-border flex items-center justify-center flex-shrink-0">
                      <GoogleIcon />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold mb-1.5">
                        Signed in with Google
                      </p>
                      <p className="text-foreground/50 text-sm leading-relaxed mb-3">
                        Your account uses Google OAuth for authentication. To
                        change your password or manage 2FA, visit your Google
                        account security settings.
                      </p>
                      <a
                        href="https://myaccount.google.com/security"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#00C2FF] text-sm font-semibold hover:underline"
                      >
                        Manage Google Account Security →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-border">
                    <p className="text-foreground text-sm font-semibold">
                      Change Password
                    </p>
                    <p className="text-foreground/40 text-xs mt-0.5">
                      Set a new password for your account.
                    </p>
                  </div>
                  <div className="divide-y divide-border/60">
                    {(
                      [
                        { key: "new", label: "New Password" },
                        { key: "con", label: "Confirm New Password" },
                      ] as { key: "cur" | "new" | "con"; label: string }[]
                    ).map(({ key, label }) => (
                      <div key={key} className="px-6 py-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-2 text-foreground/60 text-sm font-medium min-w-[180px]">
                            <Lock className="w-4 h-4" />
                            {label}
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <div className="relative flex-1">
                              <input
                                type={showPw[key] ? "text" : "password"}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/40 transition-all"
                                placeholder="••••••••"
                                value={pwForm[key]}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setPwForm((p) => ({ ...p, [key]: v }));
                                  if (key === "new") setPwStrength(calcStrength(v));
                                }}
                              />
                              <button
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                                onClick={() =>
                                  setShowPw((p) => ({
                                    ...p,
                                    [key]: !p[key],
                                  }))
                                }
                              >
                                {showPw[key] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* Strength meter */}
                        {key === "new" && pwForm.new && (
                          <div className="flex items-center gap-3 mt-3 pl-[26px]">
                            <div className="flex gap-1 flex-1">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className="h-1 flex-1 rounded-full transition-colors duration-200"
                                  style={{
                                    background:
                                      i <= pwStrength
                                        ? strengthColors[pwStrength]
                                        : "hsl(var(--border))",
                                  }}
                                />
                              ))}
                            </div>
                            <span
                              className="text-xs font-semibold"
                              style={{ color: strengthColors[pwStrength] }}
                            >
                              {strengthLabel[pwStrength]}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Rules */}
                    <div className="px-6 py-4 flex flex-col gap-2">
                      {[
                        "Minimum 8 characters",
                        "At least one uppercase letter",
                        "At least one number",
                      ].map((r) => (
                        <div
                          key={r}
                          className="flex items-center gap-2 text-xs text-foreground/50"
                        >
                          <span className="text-emerald-500">✓</span> {r}
                        </div>
                      ))}
                    </div>

                    {/* Error / Success feedback */}
                    {pwError && (
                      <div className="mx-6 mb-1 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {pwError}
                      </div>
                    )}
                    {pwSuccess && (
                      <div className="mx-6 mb-1 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                        Password updated successfully!
                      </div>
                    )}

                    {/* Save button */}
                    <div className="px-6 pb-5">
                      <button
                        onClick={handleChangePassword}
                        disabled={pwLoading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00C2FF] hover:bg-[#00aadd] disabled:opacity-60 disabled:cursor-not-allowed text-black text-sm font-semibold transition-colors shadow-lg shadow-[#00C2FF]/20"
                      >
                        <Shield className="w-4 h-4" />
                        {pwLoading ? 'Updating…' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground">Preferences</h2>
                  <p className="text-foreground/50 text-sm mt-1">Update your onboarding selections any time.</p>
                </div>

                {/* What do you want to create? */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-border">
                    <p className="text-foreground text-sm font-semibold">What do you want to create?</p>
                  </div>
                  <div className="px-6 py-5 grid grid-cols-2 gap-3">
                    {onboardingGoals.map((g) => (
                      <button
                        key={g}
                        onClick={() => setPrefGoal(g)}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-150 ${
                          prefGoal === g
                            ? 'bg-[#00C2FF] border-[#00C2FF] text-black font-semibold'
                            : 'border-border text-foreground/70 hover:bg-foreground/5 hover:border-foreground/20'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* What is your role? */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-border">
                    <p className="text-foreground text-sm font-semibold">What is your role?</p>
                  </div>
                  <div className="px-6 py-5 grid grid-cols-2 gap-3">
                    {onboardingRoles.map((r) => (
                      <button
                        key={r}
                        onClick={() => setPrefRole(r)}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-150 ${
                          prefRole === r
                            ? 'bg-[#00C2FF] border-[#00C2FF] text-black font-semibold'
                            : 'border-border text-foreground/70 hover:bg-foreground/5 hover:border-foreground/20'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Which best describes you? */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-border">
                    <p className="text-foreground text-sm font-semibold">Which best describes you as a creator?</p>
                  </div>
                  <div className="px-6 py-5 flex flex-col gap-3">
                    {onboardingPersonas.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setPrefPersona(i)}
                        className={`w-full px-5 py-4 rounded-xl border text-left transition-all duration-150 ${
                          prefPersona === i
                            ? 'bg-[#00C2FF] border-[#00C2FF]'
                            : 'border-border hover:bg-foreground/5 hover:border-foreground/20'
                        }`}
                      >
                        <p className={`font-semibold text-sm leading-snug ${prefPersona === i ? 'text-black' : 'text-foreground'}`}>{p.title}</p>
                        <p className={`text-xs mt-1 ${prefPersona === i ? 'text-black/70' : 'text-foreground/50'}`}>{p.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {prefError && (
                  <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{prefError}</div>
                )}
                {prefSuccess && (
                  <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">Preferences saved!</div>
                )}
                <div className="pb-2">
                  <button
                    onClick={handleSavePreferences}
                    disabled={prefLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00C2FF] hover:bg-[#00aadd] disabled:opacity-60 disabled:cursor-not-allowed text-black text-sm font-semibold transition-colors shadow-lg shadow-[#00C2FF]/20"
                  >
                    <Check className="w-4 h-4" />
                    {prefLoading ? 'Saving…' : 'Save Preferences'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* ── Toast ── */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-foreground text-background px-5 py-3 rounded-xl text-sm font-medium shadow-2xl"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          Changes saved successfully
        </motion.div>
      )}
    </div>
  );
}
