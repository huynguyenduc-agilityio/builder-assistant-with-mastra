import { useAuth } from '@/components/auth-context';
import { Navigate } from 'react-router';
import { useState } from 'react';

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signIn();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 p-8 md:p-10">
          {/* Logo / Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-40 h-16 rounded-2xl from-indigo-500 to-purple-600 flex items-center justify-center mb-5 px-3">
              <img
                src="https://static.wixstatic.com/media/484b05_5308a7a859e54d94bf683cedf2a25f34~mv2.png/v1/fill/w_276,h_66,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Asset%2010.png"
                alt="DevDay Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              DevDay Assistant
            </h1>
            <p className="text-sm text-slate-400 mt-2 text-center">
              Sign in to start your AI-powered conversation
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-transparent px-3 text-slate-500 uppercase tracking-wider">
                Continue with
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            id="google-sign-in-button"
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="group w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl
                       bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/[0.2]
                       text-white font-medium text-sm
                       transition-all duration-300 ease-out
                       hover:shadow-lg hover:shadow-indigo-500/10
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/[0.07]
                       cursor-pointer"
          >
            {isSigningIn ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span className="group-hover:translate-x-0.5 transition-transform duration-300">
              {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Footer text */}
          <p className="text-xs text-slate-500 text-center mt-6 leading-relaxed">
            By signing in, you agree to our{' '}
            <span className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-indigo-500/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
