import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  Layers,
  GraduationCap,
  Building,
  FileText,
  Briefcase,
  ChevronRight,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  FileSearch,
  Check,
  ScanSearch,
  Scale,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../lib/authContext';
import { buildSampleDemoReport } from '../lib/sampleDemo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { enterGuestMode } = useAuth();
  const [selectedUseCase, setSelectedUseCase] = useState<string>('Scholarship');
  const [activeStepAnim, setActiveStepAnim] = useState<number>(0);

  // Auto-cycle the dark spot scanner animation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepAnim(prev => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

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
      label: 'University Admissions',
      badge: 'Seat Cancellation Risk',
      sampleQuery: 'Central University Spot Round Seat Confirmation & Fee Refund Norms',
      sampleGap: 'Hostel allotment deposit refund timeline is omitted from the seat allotment letter.',
      sampleConflict: 'University brochure says 10-day grace period; counseling portal says auto-cancellation.',
      sampleOutdated: 'Tuition deposit refund formula cites revoked 2022 UGC guideline.',
    },
    {
      id: 'Govt scheme',
      icon: Layers,
      label: 'Govt Student Subsidies',
      badge: 'Document Clashes',
      sampleQuery: 'State Laptop & Broadband Subsidy Scheme for Engineering Undergrads',
      sampleGap: 'Silent on whether polytechnic diploma lateral entry candidates qualify.',
      sampleConflict: 'Scheme pamphlet allows family ration card; bank branch mandates caste gazette.',
      sampleOutdated: 'Bank branch list contains merged rural regional banks from 2021.',
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
    <div className="space-y-24 py-6 sm:py-10 overflow-hidden">
      {/* =========================================================================
          HERO SECTION (Navy to Indigo Gradient Hero + Live Dark Spot Animation)
         ========================================================================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Soft blue/purple glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 blur-[120px] pointer-events-none -z-10 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-secondary/15 blur-[100px] pointer-events-none -z-10 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[250px] bg-accent/10 blur-[90px] pointer-events-none -z-10 rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Hackathon problem badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-accent/30 text-xs font-semibold text-accent shadow-soft-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Shinchan Hackathon 2026 • Problem: Digital Dark Spot</span>
          </div>

          {/* Main Headline with gradient text specifically on the key phrase 'MISSING' */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
            Search shows what exists.{' '}
            <span>DigiStudentWay shows what's{' '}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              MISSING
            </span>
            .
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Students lose scholarships and college admissions not from bad marks, but because information is <span className="font-semibold text-purple-400">omitted</span>, <span className="font-semibold text-rose-400">contradictory</span>, or <span className="font-semibold text-amber-400">years out of date</span> across fragmented circulars.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-glow-blue"
              onClick={handleLaunchSampleDemo}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Try Sample Scholarship Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-amber-500/40 bg-amber-500/10 text-amber-200 hover:text-amber-100 font-bold hover:border-amber-500/60"
              onClick={() => navigate('/app/analysis/demo?tour=true', { state: { autoTour: true } })}
              leftIcon={<Sparkles className="w-5 h-5 text-amber-400" />}
            >
              Watch 60-Second Demo (Judge Tour)
            </Button>
            <Link to="/app/new" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-slate-300 hover:text-white"
                leftIcon={<ScanSearch className="w-5 h-5" />}
              >
                Run Custom Scan
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> Zero AI Hallucinations
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-accent stroke-[3]" /> Exact Quoted Origin
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-purple-400 stroke-[3]" /> Prioritized Action Steps
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-amber-400 stroke-[3]" /> WCAG AA Accessible
            </span>
          </div>
        </div>

        {/* =========================================================================
            LIVE "DARK SPOT" DOCUMENT SIMULATION (Scanning Circular Animation)
           ========================================================================= */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-primary/30 via-secondary/20 to-transparent shadow-glow-blue/10">
            <Card glass className="p-6 sm:p-8 space-y-5 bg-[#101A2E]/90 backdrop-blur-2xl border border-[rgba(148,163,184,0.15)] rounded-3xl shadow-soft-xl">
              {/* Window Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[rgba(148,163,184,0.15)]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                    DigiStudentWay Gap Cross-Examiner
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                    <Sparkles className="w-3 h-3" /> Live Dark Spot Scan
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    PMS-2026-Corpus
                  </span>
                </div>
              </div>

              {/* Scanning Circular Lines */}
              <div className="space-y-3 font-sans">
                {/* Fact 1: Sourced Fact */}
                <div
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    activeStepAnim === 0
                      ? 'bg-emerald-500/15 border-emerald-500/40 shadow-sm'
                      : 'bg-white/5 border-[rgba(148,163,184,0.10)]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-200 font-mono">
                        Clause 3.1: Academic Eligibility
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      "Accredited full-time undergraduate courses (B.Tech, MBBS, B.Sc, B.Com, BA)."
                    </p>
                  </div>
                  <Badge variant="fact" size="sm" className="shrink-0">
                    Sourced Fact (scholarships.gov.in)
                  </Badge>
                </div>

                {/* Fact 2: Conflict Detected */}
                <div
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    activeStepAnim === 1
                      ? 'bg-rose-500/15 border-rose-500/40 shadow-sm'
                      : 'bg-white/5 border-[rgba(148,163,184,0.10)]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs font-bold text-rose-300 font-mono">
                        Clause 4.2: Income Document Clash
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Central NSP accepts <strong>Form 16 / ITR-V</strong> ⚡ State circular explicitly <strong className="text-rose-400">rejects ITR</strong> & mandates Tehsildar certificate.
                    </p>
                  </div>
                  <Badge variant="conflict" size="sm" className="shrink-0">
                    Contradiction Found
                  </Badge>
                </div>

                {/* Fact 3: The Dark Spot (Missing Clause) */}
                <div
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    activeStepAnim === 2
                      ? 'bg-purple-500/20 border-purple-500 shadow-glow-purple/20 ring-1 ring-purple-500/30'
                      : 'bg-purple-500/10 border-purple-500/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                      <span className="text-xs font-bold text-purple-300 font-mono">
                        Section 6: Year 2 Renewal Minimum CGPA Benchmark
                      </span>
                    </div>
                    <p className="text-xs text-purple-200 font-semibold">
                      [DIGITAL DARK SPOT DETECTED] — Neither circular nor state portal mentions what CGPA is required to retain funding next year.
                    </p>
                  </div>
                  <Badge variant="gap" size="sm" className="shrink-0 bg-purple-500/30 text-purple-200 border-purple-400/50 font-bold">
                    Omitted from All Sources
                  </Badge>
                </div>

                {/* Fact 4: Outdated warning */}
                <div
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    activeStepAnim === 3
                      ? 'bg-amber-500/15 border-amber-500/40 shadow-sm'
                      : 'bg-white/5 border-[rgba(148,163,184,0.10)]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold text-amber-300 font-mono">
                        Secondary Guide: Outdated Income Ceiling
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Advisory site published in 2023 quotes ₹2,50,000 ceiling. Current 2026 gazette raised ceiling to ₹3,50,000.
                    </p>
                  </div>
                  <Badge variant="outdated" size="sm" className="shrink-0">
                    37 Months Stale
                  </Badge>
                </div>
              </div>

              {/* Bottom Quick-Launch Bar */}
              <div className="pt-3 border-t border-[rgba(148,163,184,0.15)] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-mono">
                  Readiness Score: <strong className="text-amber-400 font-bold">58% (Caution)</strong> • 2 P1 verification actions needed
                </span>
                <button
                  type="button"
                  onClick={handleLaunchSampleDemo}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-white transition-colors"
                >
                  Explore Complete Analysis Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KEY NUMBERS / ANIMATED STAT COUNTERS
         ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 text-center space-y-1 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-accent">
              100%
            </span>
            <span className="text-xs font-semibold text-slate-200 block font-heading">
              Quoted Provenance
            </span>
            <p className="text-[11px] text-slate-400">Every finding mapped to chunk coordinates</p>
          </Card>

          <Card className="p-6 text-center space-y-1 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-emerald-400">
              0%
            </span>
            <span className="text-xs font-semibold text-slate-200 block font-heading">
              Hallucinated Claims
            </span>
            <p className="text-[11px] text-slate-400">Server-side anti-hallucination quote check</p>
          </Card>

          <Card className="p-6 text-center space-y-1 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-purple-400">
              5
            </span>
            <span className="text-xs font-semibold text-slate-200 block font-heading">
              High-Stakes Domains
            </span>
            <p className="text-[11px] text-slate-400">Scholarships, Admissions, Schemes, Exams, Internships</p>
          </Card>

          <Card className="p-6 text-center space-y-1 bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-amber-400">
              &lt; 10s
            </span>
            <span className="text-xs font-semibold text-slate-200 block font-heading">
              Judge Evaluation Clarity
            </span>
            <p className="text-[11px] text-slate-400">Deterministic mathematical Decision Readiness</p>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          "BEFORE VS AFTER" COMPARISON (Normal Search vs DigiStudentWay)
         ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent font-heading">
            The Fundamental Innovation
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Traditional Search vs DigiStudentWay
          </h2>
          <p className="text-sm text-slate-300">
            Why generic search engines and AI chatbots fail applicants when circulars contain hidden dark spots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Search Card */}
          <Card className="p-6 sm:p-8 bg-[#101A2E]/60 backdrop-blur-xl border border-rose-500/20 shadow-soft space-y-5 rounded-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(148,163,184,0.15)]">
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <h3 className="font-heading font-bold text-base text-white">
                Generic Search & AI Chatbots
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span><strong className="text-white">Summarizes only what exists:</strong> Blindly digests the text provided, giving the student false confidence while omitting what the university circular left out.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span><strong className="text-white">Buries contradictions:</strong> When State notices conflict with Central portals (ITR vs Tehsildar), chatbots blend them into contradictory prose.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span><strong className="text-white">Ignores institutional scrutiny windows:</strong> Reports national portal deadline (Nov 15), missing the internal college desk closure (Oct 31).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span><strong className="text-white">Unverified hallucination risk:</strong> Generates plausible sounding CGPA or document rules that have zero backing in raw official notices.</span>
              </li>
            </ul>
          </Card>

          {/* DigiStudentWay Innovation Card */}
          <Card className="p-6 sm:p-8 bg-[#101A2E]/80 backdrop-blur-xl border border-primary/40 shadow-glow-blue/10 space-y-5 rounded-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-primary/20">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <h3 className="font-heading font-bold text-base text-white">
                DigiStudentWay Gap Detection Platform
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span><strong className="text-white">Expected Information Checklist Matrix:</strong> Evaluates every scheme against 8 mandatory attributes (income ceiling, renewal benchmarks, desk deadlines, etc.).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span><strong className="text-white">Side-by-side contradiction resolution:</strong> Pinpoints conflicting clauses with exact verbatim quotes and tells you which authority supersedes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span><strong className="text-white">Staleness detection:</strong> Compares publication dates and active academic cycles (2026-27) against deprecated guidelines (2023).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                <span><strong className="text-white">Prioritized "Verify Next" Action Plan:</strong> Generates concrete P1/P2/P3 checklist items with specific institutional desks to contact before submission.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          3-STEP HOW IT WORKS
         ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent font-heading">
            The Engine Behind The Platform
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            How DigiStudentWay Illuminates Dark Spots
          </h2>
          <p className="text-sm text-slate-300">
            A three-step verification loop designed specifically for academic circulars and student administrative guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <Card className="p-6 relative group bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-accent font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform font-heading">
              1
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">
              Multi-Source Ingestion
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Paste portal URLs, upload PDF circulars locally via `pdfjs-dist`, or approve AI-suggested official gazettes with SSRF protection.
            </p>
            <div className="p-3 rounded-xl bg-[#080D1B]/80 text-xs font-mono text-slate-400 border border-white/5">
              ✓ Portal URLs • PDF Gazettes • Approved Suggestions
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-6 relative group border-t-2 border-t-secondary bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform font-heading">
              2
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">
              Dark Spot & Conflict Detection
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              3-tier fallback AI engine (Gemini ➔ OpenRouter ➔ Offline Sample) isolates missing criteria, flags contradictory clauses, and enforces server quote verification.
            </p>
            <div className="p-3 rounded-xl bg-purple-500/10 text-xs font-mono text-purple-300 border border-purple-500/20">
              ✓ Expected Matrix • Quote Verifier • Staleness Check
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-6 relative group bg-[#101A2E]/70 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft rounded-2xl" hoverEffect>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-extrabold text-lg mb-5 group-hover:scale-110 transition-transform font-heading">
              3
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">
              Prioritized "Verify Next" Plan
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Receive a deterministic Decision Readiness score and prioritized P1/P2/P3 checklist with exact contact steps before submitting documents.
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 text-xs font-mono text-amber-300 border border-amber-500/20">
              ✓ Readiness Score • P1-P3 Actions • Markdown Export
            </div>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          USE-CASE CHIPS & SCENARIO EXPLORER
         ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent font-heading">
            Multi-Domain Adaptability
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Tailored For Every Academic Decision
          </h2>
          <p className="text-sm text-slate-300">
            Select a domain to see how DigiStudentWay catches missing requirements before college deadlines.
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow-blue font-bold'
                    : 'bg-white/5 text-slate-300 border border-[rgba(148,163,184,0.15)] hover:border-accent/40'
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
        <Card className="p-6 sm:p-8 max-w-4xl mx-auto bg-[#101A2E]/80 backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft-xl rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[rgba(148,163,184,0.15)] gap-2">
            <div>
              <span className="text-xs text-accent font-bold tracking-wide uppercase font-heading">
                Active Scenario Test
              </span>
              <h3 className="font-heading font-bold text-lg text-white">
                {currentCase.sampleQuery}
              </h3>
            </div>
            <Link to="/app/new">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Test This Query
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30">
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block mb-1 font-heading">
                Hidden Gap Found:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentCase.sampleGap}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30">
              <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block mb-1 font-heading">
                Direct Contradiction:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentCase.sampleConflict}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1 font-heading">
                Outdated Reference:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentCase.sampleOutdated}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* =========================================================================
          TRUST, ZERO-PII & TRANSPARENCY SECTION
         ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#101A2E]/90 to-[#16223B]/90 backdrop-blur-2xl text-white relative overflow-hidden border border-[rgba(148,163,184,0.15)] shadow-soft-xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/20 border border-primary/30 text-accent text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-accent" /> Provenance Guarantee & Zero PII Policy
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl tracking-tight leading-snug">
              Every finding links to its exact source and verbatim quote. No guesswork.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              When applying for high-stakes scholarships, admissions, or reservations, you cannot trust a black-box chatbot that hallucinates criteria. DigiStudentWay retains raw excerpt coordinates with timestamps and parses PDFs on your device so private identity documents are never harvested.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/how-it-works">
                <Button variant="outline" size="sm">
                  Read Methodology & AI Limits
                </Button>
              </Link>
              <Link to="/privacy">
                <Button variant="ghost" size="sm" className="text-accent hover:text-white">
                  Zero Student PII Policy →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6 pb-12">
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          Don't let unstated rules derail your academic future.
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Audit your scholarship or admission notices with DigiStudentWay before college submission.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleLaunchSampleDemo}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Launch 1-Click Scholarship Demo
          </Button>
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
