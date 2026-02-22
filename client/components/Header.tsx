import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Zap, Flame, ArrowRight, Menu, X, Sun, Moon } from 'lucide-react';
import { getCurrentUser, signOut, supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';

const navVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.18, ease: 'easeIn' } },
};

function MobileThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <div className="flex items-center gap-2 py-2 border-b border-border">
      <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium flex-1">Theme</span>
      <button
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="p-1.5 rounded-full bg-muted border border-border text-foreground/70 hover:text-foreground transition-colors"
      >
        {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-border bg-muted text-foreground/70 hover:text-foreground hover:bg-muted/80 transition-all duration-200"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export function Header() {
  const { user, logout, isTrialActive, getTrialDaysRemaining } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!user;
  const onTrial = isTrialActive();
  const trialDaysRemaining = getTrialDaysRemaining();
  const [mobileOpen, setMobileOpen] = useState(false);
  // On all public pages (home, features, pricing, about, etc.) show only the avatar circle.
  // Only inside /studio routes do we show Dashboard + Sign Out.
  const onPublicPage = !location.pathname.startsWith('/studio');
  const onPricingPage = onPublicPage; // keeps existing JSX references working

  const handleSignOut = async () => {
    setMobileOpen(false);
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
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors flex-shrink-0"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black">N</span>
          </div>
          <span className="whitespace-nowrap">Narrately</span>
        </Link>

        {/* Central Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/features"
            className="text-foreground/70 hover:text-foreground transition-colors text-sm"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-foreground/70 hover:text-foreground transition-colors text-sm"
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className="text-foreground/70 hover:text-foreground transition-colors text-sm"
          >
            About
          </Link>
        </div>

        {/* Right Section — animated swap between auth states */}
        <div className="flex items-center gap-3 min-w-0">
          <ThemeToggle />
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
                className="flex items-center gap-2 sm:gap-3"
              >
                {/* Trial badge — desktop only */}
                {onTrial && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-medium text-primary">
                    <Flame className="w-3 h-3 text-primary" />
                    {trialDaysRemaining}d left
                  </div>
                )}

                {/* Credits badge — desktop only */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground">
                  <Zap className="w-3.5 h-3.5 text-green-500" />
                  {user!.credit_balance} Credits
                </div>

                {/* Dashboard button — desktop only; hidden on pricing page */}
                {!onPricingPage && (
                  <Link to="/studio" className="hidden sm:block">
                    <button className="px-4 py-1.5 rounded-lg bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">
                      Dashboard
                    </button>
                  </Link>
                )}

                {/* Sign Out button — desktop only; hidden on pricing page */}
                {!onPricingPage && (
                  <button
                    onClick={handleSignOut}
                    className="hidden sm:block px-4 py-1.5 rounded-lg text-foreground/80 text-sm font-medium hover:text-foreground transition-colors"
                  >
                    Sign Out
                  </button>
                )}

                {/* Avatar circle — shown only on pricing page */}
                {onPricingPage && (
                  <Link
                    to="/studio/profile"
                    className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-sm flex-shrink-0 hover:opacity-90 transition-opacity"
                    title="View profile"
                  >
                    {(user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                  </Link>
                )}
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
                {/* Sign In — hidden on mobile (available in hamburger menu) */}
                <Link
                  to="/login"
                  className="hidden md:block px-4 py-1.5 rounded-lg text-foreground/80 text-sm font-medium hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>

                {/* Get Started Free */}
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Get Started Free</span>
                  <span className="sm:hidden">Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        {/* Hamburger — mobile only */}
          <button
            className="md:hidden text-foreground/70 hover:text-foreground transition-colors p-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-b border-border px-6 py-4 flex flex-col gap-3"
          >
            {/* Mobile theme toggle */}
            <MobileThemeToggle />
            <Link to="/features" onClick={() => setMobileOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors text-sm py-2 border-b border-border">Features</Link>
            <Link to="/pricing" onClick={() => setMobileOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors text-sm py-2 border-b border-border">Pricing</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors text-sm py-2 border-b border-border">About</Link>
            {isLoggedIn ? (
              <>
                {onPricingPage ? (
                  <Link to="/studio/profile" onClick={() => setMobileOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors text-sm py-2 border-b border-border">My Profile</Link>
                ) : (
                  <>
                    <Link to="/studio" onClick={() => setMobileOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors text-sm py-2 border-b border-border">Dashboard</Link>
                    <button onClick={handleSignOut} className="text-left text-foreground/70 hover:text-foreground transition-colors text-sm py-2">Sign Out</button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors text-sm py-2 border-b border-border">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors w-fit">Get Started Free <ArrowRight className="w-3.5 h-3.5" /></Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function AuthInitializer() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let mounted = true;

    // Populate store on initial load
    (async () => {
      try {
        const { user } = await getCurrentUser();
        if (!mounted) return;
        if (user) setUser(user as any);
      } catch (_) {}
    })();

    // Also catch OAuth SIGNED_IN events (Google redirect lands here)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        try {
          const { user } = await getCurrentUser();
          if (mounted && user) setUser(user as any);
        } catch (_) {}
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser]);

  return null;
}
