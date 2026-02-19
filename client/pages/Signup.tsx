import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithGoogle, signUp } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();

  // Get email from state if coming from hero form
  const initialEmail = (location.state as any)?.email || '';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Calculate trial end date (3 months from now)
      const trialEndDate = new Date();
      trialEndDate.setMonth(trialEndDate.getMonth() + 3);

      // TODO: Implement Supabase registration
      // On successful registration, user will be created with:
      // - credit_balance: 30
      // - trial_ends_at: 3 months from today
      const { user: createdUser, error: signupError } = await signUp(email, password, fullName);

      if (signupError) {
        setError(signupError);
        return;
      }

      if (createdUser) {
        // store user in auth store and navigate to onboarding
        setUser(createdUser as any);
        navigate('/onboarding');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);

    try {
      console.log('Initiating Google sign-up...');
      const { data, error } = await signInWithGoogle('/onboarding');
      
      if (error) {
        console.error('Google signup error:', error);
        setError(error);
      } else if (data) {
        // Google OAuth will redirect to onboarding after successful signup
        console.log('Google sign-up initiated, redirecting...');
      }
    } catch (err) {
      console.error('Google signup exception:', err);
      setError('Google sign-up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'AI-Powered Video Generation',
    'Seamless Background Personalization',
    'Effortless Editing & Sharing',
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* ── Mobile-only top logo bar ── */}
      <div className="flex lg:hidden items-center gap-2 px-4 py-4 bg-background dark relative z-20">
        <img src="/ai-bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white relative z-10">
          <div className="w-7 h-7 bg-gradient-to-br from-[#00C2FF] to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">N</span>
          </div>
          <span>Narrately</span>
        </Link>
      </div>

      {/* ── Left: Marketing Sidebar ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col">
        {/* Background image */}
        <img
          src="/Gemini_Generated_Image_qdv6alqdv6alqdv6.png"
          alt="Creator using Narrately AI"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-950/70 to-black/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-6 lg:p-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <img src="/narrately-logo.svg" alt="Narrately" className="w-6 h-6" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Narrately AI</span>
          </Link>

          {/* Bottom copy */}
          <div>
            <h2 className="text-white font-bold text-2xl lg:text-3xl leading-tight mb-6">
              Join Millions of Creators that Trust Narrately AI to Supercharge Their Stories
            </h2>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-white/90 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right: Auth Form ── */}
      <div className="flex flex-1 items-center justify-center bg-background dark px-4 py-8 md:px-8 md:py-12 relative overflow-hidden">
        {/* Website normal background */}
        <img src="/ai-bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none" />
        <div className="floating-logos pointer-events-none" aria-hidden>
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--large" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--med" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--small" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--med" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--small" alt="" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          {/* Brand icon – hidden on mobile since top bar shows logo */}
          <div className="hidden lg:flex justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md">
              <img src="/narrately-logo.svg" alt="Narrately" className="w-7 h-7" />
            </div>
          </div>

          <p className="text-center text-sm text-foreground/60 mb-1">Welcome to Narrately AI</p>
          <h1 className="text-center text-lg md:text-xl font-bold text-foreground mb-5 md:mb-6 leading-snug">
            Get started with your email
          </h1>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card/60 backdrop-blur-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              required
            />
            <input
              type="email"
              value={email || initialEmail}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card/60 backdrop-blur-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 8 characters)"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card/60 backdrop-blur-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card/60 backdrop-blur-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold text-sm transition-colors"
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-foreground/50">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-border bg-card/60 backdrop-blur-sm hover:bg-card text-foreground font-medium text-sm transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLoading ? 'Signing up…' : 'Continue with Google'}
          </button>

          {/* Legal */}
          <p className="mt-6 text-xs text-foreground/50 text-center">
            By continuing you agree to our{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">privacy policy</a>
            {' '}and{' '}
            <a href="/terms-of-use" className="text-primary hover:underline">terms of use</a>
          </p>

          {/* Switch to login */}
          <p className="mt-5 text-sm text-foreground/60 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
