import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Zap, Flame, ArrowRight } from 'lucide-react';
import { getCurrentUser, signOut } from '@/lib/supabase';

const navVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.18, ease: 'easeIn' } },
};

export function Header() {
  const { user, logout, isTrialActive, getTrialDaysRemaining } = useAuthStore();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const onTrial = isTrialActive();
  const trialDaysRemaining = getTrialDaysRemaining();

  const handleSignOut = async () => {
    await signOut();
    logout();
    // Clear any persisted session data
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) {}
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <nav className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-white hover:text-[#00C2FF] transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#00C2FF] to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black">N</span>
          </div>
          <span>Narrately</span>
        </Link>

        {/* Central Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/features"
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            About
          </Link>
        </div>

        {/* Right Section — animated swap between auth states */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Populate auth store on mount */}
          {typeof window !== 'undefined' && <AuthInitializer />}

          <AnimatePresence mode="wait" initial={false}>
            {isLoggedIn ? (
              <motion.div
                key="logged-in"
                variants={navVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-3"
              >
                {/* Trial badge */}
                {onTrial && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-white/15 text-xs font-medium text-[#00C2FF]">
                    <Flame className="w-3 h-3 text-[#00C2FF]" />
                    {trialDaysRemaining}d left
                  </div>
                )}

                {/* Credits badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-white/15 text-xs font-semibold text-white">
                  <Zap className="w-3.5 h-3.5 text-[#4ade80]" />
                  {user!.credit_balance} Credits
                </div>

                {/* Dashboard button */}
                <Link to="/studio">
                  <button className="px-4 py-1.5 rounded-lg bg-[#1a1a1a] border border-white/25 text-white text-sm font-medium hover:bg-[#252525] transition-colors">
                    Dashboard
                  </button>
                </Link>

                {/* Sign Out button */}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-1.5 rounded-lg text-white/80 text-sm font-medium hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="logged-out"
                variants={navVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-3"
              >
                {/* Sign In */}
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg text-white/80 text-sm font-medium hover:text-white transition-colors"
                >
                  Sign In
                </Link>

                {/* Get Started Free */}
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00C2FF] text-black text-sm font-semibold hover:bg-[#00aadd] transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}

function AuthInitializer() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { user } = await getCurrentUser();
        if (!mounted) return;
        if (user) setUser(user as any);
      } catch (_) {}
    })();
    return () => {
      mounted = false;
    };
  }, [setUser]);

  return null;
}
