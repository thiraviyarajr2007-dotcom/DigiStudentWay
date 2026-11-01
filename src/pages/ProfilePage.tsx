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

  const [name, setName] = useState('Shinchan Nohara');
  const [email, setEmail] = useState('shinchan.student@rathinam.ac.in');
  const [institution, setInstitution] = useState('Rathinam Group of Institutions');
  const [academicYear, setAcademicYear] = useState('2nd Year B.Tech (Computer Science)');
  const [homeState, setHomeState] = useState('Tamil Nadu (State Quota)');

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
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Student Profile & Configuration
        </span>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-0.5">
          Account & Verification Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your academic background to ensure accurate state quota rules and income certificate matching.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Profile Details */}
        <Card className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold text-lg">
              SN
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Academic Identity
              </h3>
              <p className="text-xs text-slate-500">
                Used to tailor scholarship eligibility formulas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-brand-navy-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-brand-navy-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Educational Institution
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-brand-navy-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Program & Year
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-brand-navy-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                />
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance & Theme */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            Interface Theme
          </h3>
          <p className="text-xs text-slate-500">
            Choose your preferred viewing contrast for long audit sessions.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm pt-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                theme === 'light'
                  ? 'border-brand-teal bg-teal-50/50 text-brand-navy font-bold shadow-soft-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sun className="w-6 h-6 text-amber-500" />
              <span className="text-xs font-semibold">Light Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'border-brand-teal bg-brand-navy-800 text-white font-bold shadow-soft-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Moon className="w-6 h-6 text-brand-teal" />
              <span className="text-xs font-semibold">Dark Theme</span>
            </button>
          </div>
        </Card>

        {/* Audit Engine Preferences */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            Gap Engine Rule Preferences
          </h3>

          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={strictStateVerification}
                onChange={e => setStrictStateVerification(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-brand-teal focus:ring-brand-teal"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Strict State Nodal Authority Verification Override
                </span>
                <span className="text-slate-500">
                  When a state circular conflicts with a central portal, automatically flag the state requirement as higher priority.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableAiHypotheses}
                onChange={e => setEnableAiHypotheses(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-brand-teal focus:ring-brand-teal"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Surface AI Suggestion Dark Spots (Blue Dashed Border)
                </span>
                <span className="text-slate-500">
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
