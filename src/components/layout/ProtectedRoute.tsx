import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/authContext';
import { Loader2 } from 'lucide-react';
import { AppLayout } from './AppLayout';

export const ProtectedRoute: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D1B] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs font-semibold text-slate-400 font-mono">
          Loading workspace...
        </span>
      </div>
    );
  }

  // Login is optional: Analysis works for guests; login only to save history in cloud.
  // Evaluators and guests are never blocked.
  return <AppLayout />;
};

