import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/authContext';
import { Loader2 } from 'lucide-react';
import { AppLayout } from './AppLayout';

export const ProtectedRoute: React.FC = () => {
  const { user, loading, isGuest } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D1B] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs font-semibold text-slate-400 font-mono">
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

  return <AppLayout />;
};

