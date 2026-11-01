import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto shadow-soft">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/60 px-3 py-1 rounded-full uppercase tracking-wider">
            404 Information Gap
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
