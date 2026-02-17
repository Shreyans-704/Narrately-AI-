import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Zap, Flame } from 'lucide-react';
import { getCurrentUser, signOut } from '@/lib/supabase';

export function Header() {
  const { user, logout, isTrialActive, getTrialDaysRemaining } = useAuthStore();
  const onTrial = isTrialActive();
  const trialDaysRemaining = getTrialDaysRemaining();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <nav className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-black">N</span>
          </div>
          <span>Narrately</span>
        </Link>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/features" className="text-foreground/80 hover:text-foreground transition-colors text-sm">
            Features
          </Link>
          <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors text-sm">
            Pricing
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors text-sm">
            About
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
            {/* Ensure auth store is populated on mount */}
            {/* This will hide Sign In / Get Started when a session exists */}
            {typeof window !== 'undefined' && (
              <AuthInitializer />
            )}
          {user ? (
            <>
              {/* Trial Status & Credits Display */}
              <div className="flex items-center gap-3">
                {onTrial && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-xs font-medium text-primary">
                    <Flame className="w-3 h-3" />
                    {trialDaysRemaining}d left
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">
                    {user.credit_balance} Credits
                  </span>
                </div>
              </div>

              {/* User Menu */}
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await signOut();
                  logout();
                  window.location.href = '/';
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
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
        const { user, error } = await getCurrentUser();
        if (!mounted) return;
        if (user) {
          setUser(user as any);
        }
      } catch (e) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setUser]);

  return null;
}
