import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { signInWithGoogle, signIn, getCurrentUser } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Login attempt:', { email });

      // Check for hardcoded admin credentials first
      if (email === 'Admin@Narrately' && password === 'Admin@2026') {
        // Create a mock admin user object
        const adminUser = {
          id: 'admin-special',
          email: 'Admin@Narrately',
          full_name: 'Admin',
          role: 'admin' as const,
          credit_balance: 999999,
          trial_ends_at: null,
          created_at: new Date().toISOString(),
        };
        setUser(adminUser);
        navigate('/admin-portal');
        return;
      }

      const { user: profile, error: signinError } = await signIn(email, password);

      if (signinError) {
        console.warn('Sign in helper returned error:', signinError);

        // Try to recover: maybe auth succeeded but profile creation failed.
        // Fetch current user/profile directly from Supabase and proceed if present.
        const { user: currentUser, error: currentError } = await getCurrentUser();
        if (currentUser && !currentError) {
          setUser(currentUser as any);
          if ((currentUser as any).role === 'admin') {
            navigate('/admin-portal');
          } else {
            navigate('/studio');
          }
          return;
        }

        console.error('Sign in failed, no profile available:', signinError, currentError);
        setError(signinError);
        return;
      }

      if (!profile) {
        // As a fallback, try to fetch current user
        const { user: currentUser, error: currentError } = await getCurrentUser();
        if (currentUser && !currentError) {
          setUser(currentUser as any);
          if ((currentUser as any).role === 'admin') {
            navigate('/admin-portal');
          } else {
            navigate('/studio');
          }
          return;
        }

        setError('Sign in failed: no profile returned');
        return;
      }

      // Set auth store and navigate based on role
      setUser(profile as any);
      
      // Redirect to admin portal if user is admin
      if ((profile as any).role === 'admin') {
        navigate('/admin-portal');
      } else {
        navigate('/studio');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      console.log('Initiating Google sign-in...');
      const { data, error } = await signInWithGoogle('/studio');
      
      if (error) {
        console.error('Google signin error:', error);
        setError(error);
      } else if (data) {
        // Google OAuth will redirect to dashboard after successful login
        console.log('Google sign-in initiated, redirecting...');
      }
    } catch (err) {
      console.error('Google signin exception:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark relative">
      <Header />

      {/* Decorative AI background (behind content) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/ai-bg.svg" alt="" className="w-full h-full object-cover opacity-70" />

        {/* floating Narrately N logos */}
        <div className="floating-logos" aria-hidden>
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--large" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--med" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--small" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--med" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--small" alt="" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
      </div>

      <div className="pt-20 md:pt-0 min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-foreground/85 hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Form Container */}
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
              <p className="text-foreground/85">Sign in to your Narrately account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-foreground/85">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full border-border hover:bg-background"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            <div className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-center text-xs text-foreground/90 mb-3">
                New to Narrately?
              </p>
              <Link to="/signup">
                <button className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-sm transition-colors">
                  Sign up for Free Trial
                </button>
              </Link>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
