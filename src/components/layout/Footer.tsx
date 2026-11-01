import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[rgba(148,163,184,0.15)] bg-[#080D1B]/90 dark:bg-[#080D1B]/90 backdrop-blur-xl py-12 text-slate-400 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md p-1 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="DigiStudentWay Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-extrabold text-lg text-white">
                DigiStudent<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Way</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              AI-assisted cross-source verification platform. Helping students and researchers identify missing prerequisites, contradictory statements, and outdated information before making critical decisions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> WCAG AA Compliant
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/30">
                <Sparkles className="w-3.5 h-3.5" /> Source-Grounded AI
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/app/analysis/demo" className="text-slate-400 hover:text-white transition-colors">
                  Scholarship Audit Dashboard
                </Link>
              </li>
              <li>
                <Link to="/app/new" className="text-slate-400 hover:text-white transition-colors">
                  Start New Source Scan
                </Link>
              </li>
              <li>
                <Link to="/app/history" className="text-slate-400 hover:text-white transition-colors">
                  Past Audits & Dark Spots
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  Transparency & Methodology
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-slate-400 hover:text-white transition-colors">
                  Authentication & Security
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy (Zero-PII)
                </Link>
              </li>
            </ul>
          </div>

          {/* Problem Statement Details */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-3">
              Core Capabilities
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Cross-source comparison across Education, Career & Job Offers, Public Services, Research, and Policy circulars.
            </p>
            <span className="text-[11px] font-mono text-slate-400 block">
              Version: 1.0.0
            </span>
          </div>
        </div>

        <div className="pt-8 border-t border-[rgba(148,163,184,0.15)] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} DigiStudentWay. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="hover:text-white underline underline-offset-2">
              Privacy Policy (Zero Student PII Stored)
            </Link>
            <span>•</span>
            <Link to="/how-it-works" className="hover:text-white underline underline-offset-2">
              Zero AI Hallucination Guard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

