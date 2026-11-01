import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User, HelpCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { useAuth, mapAuthError } from '../lib/authContext';
import { buildSampleDemoReport } from '../lib/sampleDemo';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, resetPassword, enterGuestMode } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // Inline errors & loading state
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Get target redirect query param
  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') ? decodeURIComponent(searchParams.get('redirect')!) : '/app/new';

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      navigate(redirectTarget, { replace: true });
    }
  }, [user, navigate, redirectTarget]);

  const enableFacebook = import.meta.env.VITE_ENABLE_FACEBOOK === 'true';

  const validate = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please provide a valid institutional or personal email.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (isSignUp && !name.trim()) {
      newErrors.name = 'Full student name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
        toast('Account created successfully! Welcome to DigiStudentWay.', 'success');
      } else {
        await signInWithEmail(email, password);
        toast('Signed in successfully.', 'success');
      }
      navigate(redirectTarget, { replace: true });
    } catch (err: any) {
      const friendlyMsg = mapAuthError(err);
      toast(friendlyMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (providerName: 'Google' | 'Facebook') => {
    setIsLoading(true);
    try {
      if (providerName === 'Google') {
        await signInWithGoogle();
      } else {
        await signInWithFacebook();
      }
      toast(`Signed in with ${providerName}!`, 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err: any) {
      toast(mapAuthError(err), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast('Please enter your registered email address.', 'error');
      return;
    }
    try {
      await resetPassword(resetEmail.trim());
      toast('Password reset email sent! Check your inbox or spam folder.', 'success');
      setShowForgotModal(false);
      setResetEmail('');
    } catch (err: any) {
      toast(mapAuthError(err), 'error');
    }
  };

  // Instant Guest Demo Mode
  const handleLaunchGuestDemo = () => {
    enterGuestMode();
    const demo = buildSampleDemoReport();
    sessionStorage.setItem('digi_active_report', JSON.stringify(demo));
    toast('Launched in Guest Demo Mode with realistic scholarship data!', 'info');
    navigate('/app/analysis/demo');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-[#080D1B]">
      {/* Left Panel: Branding & Value Props */}
      <div className="md:w-5/12 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-r border-white/10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md p-1 flex items-center justify-center">
              <img src="/logo.png" alt="DigiStudentWay Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                DigiStudent<span className="text-accent">Way</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                Information Gap Detection
              </span>
            </div>
          </Link>

          <div className="pt-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> AI-Assisted Information Gap Platform
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl leading-snug text-white">
              Stop guessing what circulars left out.
            </h2>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Sign in to cross-examine multiple notices, save audit histories, and eliminate application rejection risks.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Secure Cloud Sync for your saved analyses</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Zero student PII harvested or shared</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Anti-Hallucination quote verification on all claims</span>
            </div>
          </div>
        </div>

        {/* Demo Fast Track */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={handleLaunchGuestDemo}
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-accent text-xs font-semibold border border-accent/30 transition-all flex items-center justify-center gap-2 hover:shadow-glow-blue/20"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Instant 1-Click Guest Demo</span>
          </button>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="md:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md space-y-6 bg-[rgba(16,26,46,0.6)] backdrop-blur-xl p-8 rounded-3xl border border-[rgba(148,163,184,0.15)] shadow-soft">
          {/* Tabs: Sign In / Sign Up */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrors({});
              }}
              className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                !isSignUp
                  ? 'bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-glow-blue'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrors({});
              }}
              className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                isSignUp
                  ? 'bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-glow-blue'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="text-center">
            <h3 className="font-heading font-extrabold text-2xl text-white">
              {isSignUp ? 'Create your student account' : 'Welcome back to DigiStudentWay'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isSignUp
                ? 'Join thousands of students auditing their academic applications.'
                : 'Enter your credentials to access your saved gap analyses.'}
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className={`grid ${enableFacebook ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
            {/* Continue with Google */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleOAuthLogin('Google')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs font-semibold transition-all shadow-soft-sm hover:border-white/30 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Continue with Facebook */}
            {enableFacebook && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthLogin('Facebook')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs font-semibold transition-all shadow-soft-sm hover:border-white/30 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#101A2E] px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Or email address
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Student Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm bg-white/[0.04] text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent ${
                      errors.name ? 'border-rose-500' : 'border-white/15'
                    }`}
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.name && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Student Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@university.ac.in"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm bg-white/[0.04] text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent ${
                    errors.email ? 'border-rose-500' : 'border-white/15'
                  }`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-xs text-accent hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm bg-white/[0.04] text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent ${
                    errors.password ? 'border-rose-500' : 'border-white/15'
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSignUp ? 'Create Free Student Account' : 'Sign In to DigiStudentWay'}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400">
            By signing in, you agree to our{' '}
            <Link to="/privacy" className="text-accent hover:underline">
              Privacy Policy & Zero-PII Policy
            </Link>
            .
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setShowForgotModal(false)} />
          <div className="relative w-full max-w-md bg-[#101A2E]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-[rgba(148,163,184,0.2)] shadow-soft-xl z-10 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">
              Reset Your Password
            </h3>
            <p className="text-xs text-slate-400">
              Enter your email address to receive an official password reset link.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                placeholder="student@university.ac.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowForgotModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
