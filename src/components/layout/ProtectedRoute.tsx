import React from 'react';
import { Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../lib/authContext';
import { Loader2, Sparkles } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { user, loading, isGuest } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
        <span className="text-xs font-semibold text-slate-500 font-mono">
          Authenticating session...
        </span>
      </div>
    );
  }

  const isDemoPath = location.pathname.includes('demo');

  // If not logged in, not in guest mode, and not viewing sample demo, redirect to /auth
  if (!user && !isGuest && !isDemoPath) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirect=${redirectUrl}`} replace />;
  }

  const isGuestSession = !user && (isGuest || isDemoPath);

  return (
    <div>
      {/* Guest Mode Advisory Banner */}
      {isGuestSession && (
        <div className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-soft-sm">
          <div className="flex items-center gap-2 max-w-2xl">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              <strong>Guest Demo Mode:</strong> You are exploring with local memory. Sign in with Google, Facebook, or Email to save audits to the cloud and track updates.
            </span>
          </div>
          <Link to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`}>
            <button
              type="button"
              className="px-2.5 py-1 bg-white text-brand-navy rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors shrink-0 ml-3"
            >
              Sign In to Save
            </button>
          </Link>
        </div>
      )}

      {/* Render protected nested routes */}
      <Outlet />
    </div>
  );
};
