import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  CheckCircle2,
  FileText,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  Flame,
  Check,
  Eye,
  ScanSearch,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { SourceChip } from '../components/common/SourceChip';
import { useAuth } from '../lib/authContext';
import { buildSampleDemoReport } from '../lib/sampleDemo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { enterGuestMode } = useAuth();
  const [selectedUseCase, setSelectedUseCase] = useState<string>('Scholarship');

  const handleLaunchSampleDemo = () => {
    enterGuestMode();
    const demo = buildSampleDemoReport();
    sessionStorage.setItem('digi_active_report', JSON.stringify(demo));
    navigate('/app/analysis/demo');
  };

  const useCases = [
    {
      id: 'Scholarship',
      icon: GraduationCap,
      label: 'Scholarship Schemes',
      badge: 'High Impact',
      sampleQuery: 'National Merit Scholarship PMS 2026 renewal & income certificate criteria',
      sampleGap: 'Renewal CGPA benchmarks completely absent from central & state portals.',
      sampleConflict: 'Central portal asks for ITR-V; State circular requires Tehsildar Certificate.',
      sampleOutdated: 'Advisory site still quotes old 2023 ₹2.5L income limit instead of 2026 ₹3.5L.',
    },
    {
      id: 'College admission',
      icon: Building,
      label: 'College Admissions',
      badge: 'Deadlines',
      sampleQuery: 'Central University PG Counselling 2026 Category Certificate Rules',
      sampleGap: 'No clause specifying if OBC-NCL certificate issued after April 1, 2026 is mandatory.',
      sampleConflict: 'University brochure says 10-day grace period; counseling portal says auto-cancellation.',
      sampleOutdated: 'Tuition deposit refund formula cites revoked 2022 UGC guideline.',
    },
    {
      id: 'Govt scheme',
      icon: Layers,
      label: 'Govt Student Subsidies',
      badge: 'Verification',
      sampleQuery: 'State Laptop & Broadband Subsidy Scheme for Engineering Undergrads',
      sampleGap: 'Silent on whether polytechnic diploma lateral entry candidates qualify.',
      sampleConflict: 'Scheme pamphlet allows family ration card; bank branch mandates caste gazette.',
      sampleOutdated: 'Bank list contains merged rural regional banks from 2021.',
    },
    {
      id: 'Exam',
      icon: FileText,
      label: 'Competitive Exams',
      badge: 'Crucial Rules',
      sampleQuery: 'National Eligibility Test Scribe & Compensatory Time Norms',
      sampleGap: 'Zero instructions on whether hospital CMO signature requires district countersign.',
      sampleConflict: 'Information bulletin specifies 20 min/hr; test center admit card specifies 15 min.',
      sampleOutdated: 'Prohibited items clause still refers to non-digital pens.',
    },
    {
      id: 'Internship',
      icon: Briefcase,
      label: 'Research Internships',
      badge: 'Stipends & IP',
      sampleQuery: 'National Lab Summer Research Fellowship 2026 Intellectual Property Rights',
      sampleGap: 'No policy stated regarding student publication rights for joint inventions.',
      sampleConflict: 'Lab circular requires university NOC before May; college dean office closes in June.',
      sampleOutdated: 'Stipend amount shown reflects 2020 pre-revision rates.',
    },
  ];

  const currentCase = useCases.find(u => u.id === selectedUseCase) || useCases[0];

  return (
    <div className="space-y-24 py-8 sm:py-12 overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-teal/20 via-purple-500/15 to-amber-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Hackathon problem badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-navy-50 dark:bg-brand-navy-900 border border-brand-teal/30 text-xs font-semibold text-brand-navy-700 dark:text-brand-teal-300 shadow-soft-sm">
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping" />
            <span>Shinchan Hackathon 2026 • Problem: Digital Dark Spot</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand-navy dark:text-white tracking-tight leading-[1.15]">
            Search shows what exists.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-teal-500 to-amber-500">
              DigiStudentWay shows what's MISSING.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Students lose scholarships and admissions not because they fail exams, but because information is <span className="font-semibold text-purple-600 dark:text-purple-400">omitted</span>, <span className="font-semibold text-rose-600 dark:text-rose-400">contradictory</span>, or <span className="font-semibold text-amber-600 dark:text-amber-400">years out of date</span> across fragmented government sites.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleLaunchSampleDemo}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Try Sample Scholarship Demo
            </Button>
            <Link to="/app/new" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<ScanSearch className="w-5 h-5" />}
              >
                Run Custom Gap Scan
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-brand-teal" /> Zero Hallucinations
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-brand-teal" /> Exact Quoted Origin
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-brand-teal" /> Actionable Next Steps
            </span>
          </div>
        </div>

        {/* Hero Interactive Gap Simulation Card */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="p-1.5 rounded-3xl bg-gradient-to-b from-brand-teal/30 via-slate-200/50 dark:via-slate-800 to-transparent shadow-soft-xl">
            <Card glass className="p-6 sm:p-8">
              {/* Card top bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-brand-teal" />
                  <span className="text-xs font-mono font-semibold text-slate-500 ml-2">
                    DigiStudentWay AI Gap Analyzer v1.0
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="gap" size="sm">
                    Dark Spot Detected
                  </Badge>
                  <Badge variant="conflict" size="sm">
                    Contradiction
                  </Badge>
                </div>
              </div>

              {/* Simulation Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {/* Column 1: Sources Scanned */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    1. Scanned Sources (3)
                  </span>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-brand-navy-950 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> scholarships.gov.in
                      </div>
                      <p className="text-[11px] text-slate-500">"Requires Form 16 / ITR-V for family income proof."</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-brand-navy-950 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> highered.state.gov.in
                      </div>
                      <p className="text-[11px] text-slate-500">"Mandates Tehsildar Certificate. ITR is explicitly rejected."</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-brand-navy-950 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> studentguide-edu.org
                      </div>
                      <p className="text-[11px] text-slate-500">"Income ceiling ₹2.5 Lakh (Outdated 2023 notification)"</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: What Traditional Search Shows vs What We Find */}
                <div className="space-y-3 md:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    2. Cross-Correlation & Information Gap Matrix
                  </span>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        CRITICAL UNSTATED PREREQUISITE (GAP)
                      </span>
                      <span className="text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded font-mono font-bold">
                        MISSING
                      </span>
                    </div>
                    <p className="text-xs text-purple-950 dark:text-purple-200 font-medium">
                      Year 2 Renewal Benchmark is nowhere in the published documents! Will your scholarship stop if you get a 6.5 CGPA? Neither portal specifies.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        DIRECT CONFLICT DETECTED
                      </span>
                      <span className="text-[10px] bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded font-mono font-bold">
                        REJECTION RISK
                      </span>
                    </div>
                    <p className="text-xs text-rose-950 dark:text-rose-200">
                      If you submit ITR-V following Central Portal rules, the State Nodal Officer will reject your file on Oct 31 before you can correct it.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
                      Prioritized Verification Step Generated:
                    </span>
                    <Link
                      to="/app/analysis/demo"
                      className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
                    >
                      View Full Checklist <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            The Engine Behind The Platform
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            How DigiStudentWay Illuminates Dark Spots
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            A three-step verification loop designed specifically for academic and administrative student welfare documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <Card className="p-6 relative group" hoverEffect>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-brand-teal font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
              Multi-Source Ingestion
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Feed URLs, gazette PDFs, or official notices. The platform crawls authoritative portals, institutional circulars, and community advisories.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-navy-950 text-xs font-mono text-slate-500">
              ✓ Portal URLs • PDF Gazettes • Raw Circulars
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-6 relative group border-t-2 border-t-brand-teal" hoverEffect>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
              Dark Spot & Conflict Detection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Semantic correlation algorithms cross-check dates, prerequisites, and deadlines. It pinpoints what is absent, conflicting, or outdated.
            </p>
            <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 text-xs font-mono text-purple-700 dark:text-purple-300">
              ✓ Missing renewal • Clause clash • Staleness scan
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-6 relative group" hoverEffect>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
              Prioritized "Verify Next" Plan
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Get an actionable P1/P2/P3 checklist with exact questions to ask your college nodal officer or helpdesk before hitting submit.
            </p>
            <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 text-xs font-mono text-amber-700 dark:text-amber-300">
              ✓ P1/P2/P3 actions • Helpdesk scripts • Direct links
            </div>
          </Card>
        </div>
      </section>

      {/* Interactive Use-Case Showcase */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Multi-Domain Adaptability
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Tailored For Every Academic Decision
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Select a domain to see how DigiStudentWay prevents real-world student rejections.
          </p>
        </div>

        {/* Use-case chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {useCases.map(uc => {
            const Icon = uc.icon;
            const isSelected = uc.id === selectedUseCase;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => setSelectedUseCase(uc.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-navy text-white shadow-soft dark:bg-brand-teal dark:text-brand-navy-950 font-bold'
                    : 'bg-white dark:bg-brand-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-teal/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{uc.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({uc.badge})</span>
              </button>
            );
          })}
        </div>

        {/* Selected Use-case Card */}
        <Card className="p-6 sm:p-8 max-w-4xl mx-auto bg-white dark:bg-brand-navy-900 border-slate-200 dark:border-slate-800 shadow-soft-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200/80 dark:border-slate-800 gap-2">
            <div>
              <span className="text-xs text-brand-teal font-bold tracking-wide uppercase">
                Active Scenario Test
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                {currentCase.sampleQuery}
              </h3>
            </div>
            <Link to="/new">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Test This Query
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60">
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block mb-1">
                Hidden Gap Found:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentCase.sampleGap}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block mb-1">
                Direct Contradiction:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentCase.sampleConflict}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block mb-1">
                Outdated Reference:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentCase.sampleOutdated}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Trust & Provenance Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-navy-900 text-white relative overflow-hidden border border-slate-800 shadow-soft-xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Provenance Guarantee
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl tracking-tight leading-snug">
              Every finding links to its exact source and quote. No AI guesswork.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              When applying for high-stakes government scholarships or university admissions, you cannot trust a black-box chatbot that hallucinates guidelines. DigiStudentWay retains raw excerpt snapshots with timestamps, so you can show the exact clause to your registrar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl font-extrabold font-mono text-brand-teal block">100%</span>
                <span className="text-xs text-slate-300">Verifiable Primary Sources</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl font-extrabold font-mono text-amber-400 block">0</span>
                <span className="text-xs text-slate-300">Untracked AI Claims</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl font-extrabold font-mono text-purple-400 block">&lt; 10s</span>
                <span className="text-xs text-slate-300">Dashboard Clarity for Judges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6 pb-12">
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Don't let unstated rules derail your academic journey.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Audit your scholarship or admission notices with DigiStudentWay before submitting.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Explore Scholarship Audit
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline" size="lg">
              Create Student Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
