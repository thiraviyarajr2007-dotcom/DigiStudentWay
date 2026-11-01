import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6 p-8 rounded-3xl bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
        <div className="w-20 h-20 rounded-3xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto shadow-glow-purple/20">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            404 Information Gap
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            The notice or document you are looking for has been relocated or never existed in the official portal directory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" leftIcon={<Home className="w-4 h-4" />} className="w-full">
              Back to Home
            </Button>
          </Link>
          <Link to="/app/analysis/demo" className="w-full sm:w-auto">
            <Button variant="primary" size="md" leftIcon={<LayoutDashboard className="w-4 h-4" />} className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
