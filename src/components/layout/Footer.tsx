import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-navy-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-navy p-1 flex items-center justify-center border border-slate-700">
                <img src="/logo.png" alt="DigiStudentWay Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                DigiStudent<span className="text-brand-teal">Way</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Shinchan Online Hackathon 2026 entry for the problem{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                "Digital Dark Spot: AI-Assisted Information Gap Detection Platform"
              </strong>
              . Helping students bridge the chasm between contradictory circulars, missing renewal clauses, and outdated criteria.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> WCAG AA Compliant
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                <Sparkles className="w-3.5 h-3.5" /> Source-Grounded AI
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/app/analysis/demo" className="text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors">
                  Scholarship Audit Dashboard
                </Link>
              </li>
              <li>
                <Link to="/app/new" className="text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors">
                  Start New Source Scan
                </Link>
              </li>
              <li>
                <Link to="/app/history" className="text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors">
                  Past Audits & Dark Spots
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors">
                  Transparency & Methodology
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors">
                  Authentication & Security
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors">
                  Privacy Policy (Zero-PII)
                </Link>
              </li>
            </ul>
          </div>

          {/* Problem Statement Details */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Hackathon Track
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              Focus Domains: Post-Matric Scholarships, Central University Admissions, Govt Schemes, National Entrance Exams, and Research Internships.
            </p>
            <span className="text-[11px] font-mono text-slate-500 block">
              Version: 1.0.0-hackathon2026
            </span>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} DigiStudentWay. Built for Shinchan Online Hackathon 2026.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 underline underline-offset-2">
              Privacy Policy (Zero Student PII Stored)
            </Link>
            <span>•</span>
            <Link to="/how-it-works" className="hover:text-slate-700 dark:hover:text-slate-300 underline underline-offset-2">
              Zero AI Hallucination Guard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
