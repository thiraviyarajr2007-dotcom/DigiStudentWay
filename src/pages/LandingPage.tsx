import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Check,
  ScanSearch,
  Zap,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  Clock,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../lib/authContext';
import { buildSampleDemoReport, buildCareerSampleDemoReport } from '../lib/sampleDemo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { enterGuestMode } = useAuth();
  const [activeStepAnim, setActiveStepAnim] = useState<number>(0);

  // Auto-cycle the dark spot scanner animation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepAnim(prev => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleLaunchScholarshipDemo = () => {
    enterGuestMode();
    const demo = buildSampleDemoReport();
    sessionStorage.setItem('digi_active_report', JSON.stringify(demo));
    navigate('/app/analysis/demo');
  };

  const handleLaunchCareerDemo = () => {
    enterGuestMode();
    const demo = buildCareerSampleDemoReport();
    sessionStorage.setItem('digi_active_report', JSON.stringify(demo));
    navigate('/app/analysis/career');
  };

  return (
    <div className="space-y-20 py-6 sm:py-10 overflow-hidden">
      {/* =========================================================================
          SECTION 1: HERO & LIVE DARK SPOT SCANNER (Max 6 word heading, 1 line desc)
         ========================================================================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-primary/20 blur-[120px] pointer-events-none -z-10 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[380px] h-[260px] bg-secondary/15 blur-[100px] pointer-events-none -z-10 rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-accent/30 text-xs font-semibold text-accent shadow-soft-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>AI-Assisted Information Gap & Conflict Detection</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
            Detect What Official Documents{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              LEAVE OUT
            </span>
            .
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Spot missing prerequisites, conflicting clauses, and outdated criteria across multiple sources before deciding.
          </p>

          {/* 1-Click Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-glow-blue"
              onClick={handleLaunchScholarshipDemo}
              leftIcon={<GraduationCap className="w-5 h-5 text-accent" />}
            >
              Run Sample: Scholarship
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-white border-purple-500/40 hover:border-purple-400"
              onClick={handleLaunchCareerDemo}
              leftIcon={<Briefcase className="w-5 h-5 text-purple-400" />}
            >
              Run Sample: Job Offer
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-amber-500/40 bg-amber-500/10 text-amber-200 hover:text-amber-100 font-bold hover:border-amber-500/60"
              onClick={() => navigate('/app/analysis/demo?tour=true', { state: { autoTour: true } })}
              leftIcon={<Sparkles className="w-5 h-5 text-amber-400" />}
            >
              Watch 60-Second Demo
            </Button>
            <Link to="/app/new" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-slate-300 hover:text-white"
                leftIcon={<ScanSearch className="w-5 h-5" />}
              >
                Custom Scan
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> Zero AI Hallucinations
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-accent stroke-[3]" /> Exact Quoted Origin
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-purple-400 stroke-[3]" /> Prioritized Verification Steps
            </span>
          </div>
        </div>

        {/* Live Gap Detection Visual Simulation */}
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-primary/30 via-secondary/20 to-transparent shadow-glow-blue/10">
            <Card glass className="p-5 sm:p-7 space-y-4 bg-[#101A2E]/90 backdrop-blur-2xl border border-[rgba(148,163,184,0.15)] rounded-3xl shadow-soft-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[rgba(148,163,184,0.15)]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                    Cross-Examination Scanner
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                  <Sparkles className="w-3 h-3" /> Live Detection Loop
                </span>
              </div>

              <div className="space-y-2.5 font-sans">
                {/* 1: Sourced Fact */}
                <div
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeStepAnim === 0
                      ? 'bg-emerald-500/15 border-emerald-500/40 shadow-sm'
                      : 'bg-white/5 border-[rgba(148,163,184,0.10)]'
                  }`}
                >
                  <div className="text-xs text-slate-200">
                    <span className="font-bold text-emerald-400 mr-2">Sourced Fact:</span>
                    Accredited full-time degree programs qualify for assistance.
                  </div>
                  <Badge variant="fact" size="sm" className="shrink-0">
                    Sourced Quote
                  </Badge>
                </div>

                {/* 2: Conflict */}
                <div
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeStepAnim === 1
                      ? 'bg-rose-500/15 border-rose-500/40 shadow-sm'
                      : 'bg-white/5 border-[rgba(148,163,184,0.10)]'
                  }`}
                >
                  <div className="text-xs text-slate-200">
                    <span className="font-bold text-rose-400 mr-2">Contradiction:</span>
                    Central portal accepts ITR-V, but State circular explicitly mandates Revenue Tehsildar Certificate.
                  </div>
                  <Badge variant="conflict" size="sm" className="shrink-0">
                    Possible Conflict
                  </Badge>
                </div>

                {/* 3: Dark Spot */}
                <div
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeStepAnim === 2
                      ? 'bg-purple-500/20 border-purple-500 shadow-glow-purple/20 ring-1 ring-purple-500/30'
                      : 'bg-purple-500/10 border-purple-500/30'
                  }`}
                >
                  <div className="text-xs text-purple-200 font-medium">
                    <span className="font-bold text-purple-300 mr-2">[Digital Dark Spot]:</span>
                    Subsequent year renewal GPA benchmarks completely omitted across all official notices.
                  </div>
                  <Badge variant="gap" size="sm" className="shrink-0 bg-purple-500/30 text-purple-200 font-bold">
                    Potential Gap
                  </Badge>
                </div>

                {/* 4: Outdated */}
                <div
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeStepAnim === 3
                      ? 'bg-amber-500/15 border-amber-500/40 shadow-sm'
                      : 'bg-white/5 border-[rgba(148,163,184,0.10)]'
                  }`}
                >
                  <div className="text-xs text-slate-200">
                    <span className="font-bold text-amber-400 mr-2">Outdated:</span>
                    Secondary advisory circular references expired 2023 income limit ($2,500 vs $3,500 active).
                  </div>
                  <Badge variant="outdated" size="sm" className="shrink-0">
                    37 Months Stale
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: KEY NUMBERS (Max 6 word heading, 1 line desc)
         ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Evidence-Grounded Gap Detection At Scale
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Deterministic mathematical verification scoring across all domains.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 text-center space-y-1 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-accent">100%</span>
            <span className="text-xs font-semibold text-slate-200 block font-heading">Quoted Provenance</span>
            <p className="text-[11px] text-slate-400">Verbatim quotes verified against source text</p>
          </Card>

          <Card className="p-5 text-center space-y-1 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-emerald-400">0%</span>
            <span className="text-xs font-semibold text-slate-200 block font-heading">Hallucination Tolerance</span>
            <p className="text-[11px] text-slate-400">Server rejects unverified claims</p>
          </Card>

          <Card className="p-5 text-center space-y-1 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-purple-400">6</span>
            <span className="text-xs font-semibold text-slate-200 block font-heading">Supported Core Domains</span>
            <p className="text-[11px] text-slate-400">Education, Career, Public Services, Research, Business</p>
          </Card>

          <Card className="p-5 text-center space-y-1 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-amber-400">&lt; 10s</span>
            <span className="text-xs font-semibold text-slate-200 block font-heading">Decision Readiness Score</span>
            <p className="text-[11px] text-slate-400">Computed via deterministic penalty formula</p>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TRADITIONAL SEARCH VS GAP DETECTION (Max 6 word heading, 1 line desc)
         ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Traditional Search vs Gap Detection
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Why search engines leave users blind to omitted requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-[#101A2E]/60 backdrop-blur-xl border border-rose-500/20 shadow-soft space-y-4 rounded-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[rgba(148,163,184,0.15)]">
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <h3 className="font-heading font-bold text-sm text-white">Conventional Keyword Search</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>Digests only provided text, omitting unstated prerequisites.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>Blends conflicting guidelines into misleading summaries.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>Misses internal desk review deadlines.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>Generates plausible claims without verbatim proof.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-[#101A2E]/80 backdrop-blur-xl border border-primary/40 shadow-glow-blue/10 space-y-4 rounded-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <h3 className="font-heading font-bold text-sm text-white">DigiStudentWay Gap Detection</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>Evaluates all sources against mandatory decision checklists.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>Pinpoints contradictory clauses with side-by-side quotes.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>Flags outdated guidelines and expired regulatory cycles.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>Generates prioritized verification steps before submission.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: 3-STEP VERIFICATION WORKFLOW (Max 6 word heading, 1 line desc)
         ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            How Gap Detection Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Three simple steps to uncover blind spots and verify critical details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-accent font-extrabold text-base mb-3 font-heading">
              1
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-1">Collect Sources</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Input portal URLs, paste text notices, or review suggested documents.
            </p>
            <div className="p-2 rounded-lg bg-[#080D1B]/80 text-[11px] font-mono text-slate-400 border border-white/5">
              URLs • Pasted Text • Documents
            </div>
          </Card>

          <Card className="p-5 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-extrabold text-base mb-3 font-heading">
              2
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-1">Cross-Examine Corpus</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Isolate missing attributes, contradictory statements, and stale terms.
            </p>
            <div className="p-2 rounded-lg bg-purple-500/10 text-[11px] font-mono text-purple-300 border border-purple-500/20">
              Gap Matrix • Quote Verifier • Staleness
            </div>
          </Card>

          <Card className="p-5 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-extrabold text-base mb-3 font-heading">
              3
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-1">Verify Next Steps</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Get a deterministic readiness score and prioritized P1-P3 action plan.
            </p>
            <div className="p-2 rounded-lg bg-amber-500/10 text-[11px] font-mono text-amber-300 border border-amber-500/20">
              Readiness Score • Action Plan • Export
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
