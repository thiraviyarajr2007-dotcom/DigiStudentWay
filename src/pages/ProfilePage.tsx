import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Moon,
  Sun,
  ShieldCheck,
  Bell,
  Sparkles,
  Save,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useTheme } from '../lib/theme';
import { useToast } from '../components/common/Toast';

export const ProfilePage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.student@university.edu');
  const [institution, setInstitution] = useState('State University of Technology');
  const [academicYear, setAcademicYear] = useState('2nd Year Undergraduate');
  const [homeState, setHomeState] = useState('State Domicile Quota');

  // Preference toggles
  const [enableAiHypotheses, setEnableAiHypotheses] = useState(true);
  const [strictStateVerification, setStrictStateVerification] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Profile and audit preferences updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Student Profile & Configuration
        </span>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-0.5">
          Account & Verification Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your academic background to ensure accurate state quota rules and income certificate matching.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Profile Details */}
        <Card className="p-6 sm:p-8 space-y-5 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 text-accent flex items-center justify-center font-bold text-lg shadow-glow-blue/20">
              AM
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Academic Identity
              </h3>
              <p className="text-xs text-slate-400">
                Used to tailor scholarship eligibility formulas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Student Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Educational Institution
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Program & Year
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance & Theme */}
        <Card className="p-6 sm:p-8 space-y-4 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
          <h3 className="font-heading font-bold text-base text-white">
            Interface Theme
          </h3>
          <p className="text-xs text-slate-400">
            Choose your preferred viewing contrast for long audit sessions.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm pt-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                theme === 'light'
                  ? 'border-amber-400 bg-amber-400/10 text-white font-bold shadow-soft-sm'
                  : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sun className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-semibold">Light Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'border-accent bg-accent/10 text-white font-bold shadow-glow-blue/20'
                  : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Moon className="w-6 h-6 text-accent" />
              <span className="text-xs font-semibold">Dark Theme (Default)</span>
            </button>
          </div>
        </Card>

        {/* Audit Engine Preferences */}
        <Card className="p-6 sm:p-8 space-y-4 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
          <h3 className="font-heading font-bold text-base text-white">
            Gap Engine Rule Preferences
          </h3>

          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={strictStateVerification}
                onChange={e => setStrictStateVerification(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-accent bg-white/5 border-white/20 focus:ring-accent"
              />
              <div className="text-xs">
                <span className="font-semibold text-white block">
                  Strict State Nodal Authority Verification Override
                </span>
                <span className="text-slate-400">
                  When a state circular conflicts with a central portal, automatically flag the state requirement as higher priority.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableAiHypotheses}
                onChange={e => setEnableAiHypotheses(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-accent bg-white/5 border-white/20 focus:ring-accent"
              />
              <div className="text-xs">
                <span className="font-semibold text-white block">
                  Surface AI Suggestion Dark Spots (Blue Dashed Border)
                </span>
                <span className="text-slate-400">
                  Allow AI hypothesis generation for unstated clauses (e.g. hostel mess allowances or attendance cut-offs).
                </span>
              </div>
            </label>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
