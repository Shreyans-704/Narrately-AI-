import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  Languages,
  Wrench,
  FolderOpen,
  ChevronRight,
  Settings,
  LogOut,
  Zap,
  Plus,
  BookOpen,
  SlidersHorizontal,
  ChevronDown,
  ArrowUp,
  Bell,
  History,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/lib/supabase';

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: User, label: 'Avatar' },
  { icon: Languages, label: 'Translate' },
  { icon: Wrench, label: 'Tools' },
  { icon: FolderOpen, label: 'Projects' },
];

const recentVideos = [
  { title: 'Product Launch Ad', date: '2h ago', status: 'Done' },
  { title: 'Startup Pitch Deck', date: 'Yesterday', status: 'Done' },
  { title: 'Social Media Reel', date: '3d ago', status: 'Done' },
];

export default function StudioDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [prompt, setPrompt] = useState('');
  const [avatarMode, setAvatarMode] = useState<'Auto' | 'Avatar'>('Auto');
  const [activeNav, setActiveNav] = useState('Home');

  const displayName = user?.email?.split('@')[0] ?? 'Shreyans';

  const handleLogout = async () => {
    await signOut();
    logout();
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) {}
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#080808] overflow-hidden font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-[#0b0c0e] border-r border-white/[0.07] flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C2FF] to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-base">N</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Narrately</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 flex flex-col gap-0.5">
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeNav === label
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mx-4 my-2 border-t border-white/[0.07]" />

        {/* Personal */}
        <div className="px-4 py-2">
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 px-1">Personal</p>
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00C2FF] to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left min-w-0">
              <p className="text-white text-xs font-medium truncate">{displayName}</p>
              <p className="text-white/40 text-[10px] truncate">{user?.email ?? 'shreyans@narrately.ai'}</p>
            </div>
          </button>
        </div>

        {/* Workspace */}
        <div className="px-4 py-2">
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 px-1">Workspace</p>
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-white/60 text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{displayName}'s Workspace</p>
              <p className="text-white/40 text-[10px]">· 1 Free</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
          </button>
        </div>

        <div className="flex-1" />

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/[0.07] flex flex-col gap-0.5">
          <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Zap className="w-4 h-4 text-[#00C2FF]" />
            Upgrade Plan
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <header className="flex items-center justify-end px-6 py-4 border-b border-white/[0.07] gap-3 flex-shrink-0">
          <button className="relative text-white/50 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00C2FF]" />
          </button>
          <button className="text-white/50 hover:text-white transition-colors text-sm font-medium">
            Resources
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start px-6 py-12 relative">
          {/* Radial glow */}
          <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px]">
            <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,194,255,0.13)_0%,transparent_70%)]" />
          </div>

          {/* Hero greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 relative z-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Hi {displayName}, what will you create?
              </span>
            </h1>
          </motion.div>

          {/* AI Command Center */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full max-w-2xl relative z-10"
          >
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Mode toggle */}
              <div className="px-4 pt-4 flex items-center gap-2">
                <div className="flex items-center bg-white/[0.08] rounded-full p-0.5 gap-0.5">
                  {(['Avatar', 'Auto'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setAvatarMode(m)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        avatarMode === m
                          ? 'bg-white/15 text-white'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {m === 'Avatar' && <User className="w-3 h-3" />}
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your video idea ..."
                rows={4}
                className="w-full bg-transparent px-5 py-4 text-white/80 placeholder:text-white/25 text-sm resize-none focus:outline-none"
              />

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-all" title="Prompt Gallery">
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-all" title="Settings">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-all" title="History">
                    <History className="w-4 h-4" />
                  </button>
                  {/* Generate group */}
                  <div className="flex items-center">
                    <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-l-full border-r border-white/10 transition-all">
                      <Zap className="w-3.5 h-3.5 text-[#00C2FF]" />
                      Generate
                    </button>
                    <button className="bg-white/10 hover:bg-white/15 text-white px-2 py-2 rounded-r-full transition-all border-l border-white/10">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Submit */}
                  <button className="w-9 h-9 rounded-full bg-[#00C2FF] hover:bg-[#00aadd] flex items-center justify-center transition-colors shadow-lg shadow-[#00C2FF]/20">
                    <ArrowUp className="w-4 h-4 text-black font-bold" />
                  </button>
                </div>
              </div>
            </div>

            {/* Create with AI Studio CTA */}
            <div className="flex justify-center mt-5">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00C2FF]/10 border border-[#00C2FF]/30 text-[#00C2FF] text-sm font-medium hover:bg-[#00C2FF]/20 transition-all">
                <Zap className="w-4 h-4" />
                Create with AI Studio
              </button>
            </div>
          </motion.div>

          {/* Recent videos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-2xl mt-12 relative z-10"
          >
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Recent Videos</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentVideos.map((v, i) => (
                <div
                  key={i}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 hover:bg-white/[0.07] hover:border-white/10 transition-all cursor-pointer group"
                >
                  <div className="aspect-video bg-gradient-to-br from-[#00C2FF]/10 to-purple-500/10 rounded-xl mb-3 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#00C2FF]/40 group-hover:text-[#00C2FF]/70 transition-colors" />
                  </div>
                  <p className="text-white text-xs font-medium truncate">{v.title}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{v.date}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
