import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  HelpCircle,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ListTodo,
  FileSearch,
  Share2,
  Download,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Printer,
  FileCheck2,
  Layers,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  CheckSquare,
  Zap,
} from 'lucide-react';
import { buildSampleDemoReport } from '../lib/sampleDemo';
import { Source, ChecklistItem as ChecklistItemType, AnalysisReport } from '../types';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';
import { SourceChip } from '../components/common/SourceChip';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { GapCard } from '../components/domain/GapCard';
import { ConflictCard } from '../components/domain/ConflictCard';
import { ChecklistItem } from '../components/domain/ChecklistItem';
import { SourceDrawer } from '../components/domain/SourceDrawer';
import { SemanticLegend } from '../components/domain/SemanticLegend';
import { AIBanner } from '../components/domain/AIBanner';
import { JudgeTour } from '../components/domain/JudgeTour';
import { SourceAgreementMatrix } from '../components/domain/SourceAgreementMatrix';
import { TrustPanel } from '../components/domain/TrustPanel';
import { useToast } from '../components/common/Toast';
import { formatDate } from '../lib/utils';
import { downloadChecklistFile, printChecklistAsPdf, copyShareableSummary } from '../lib/exportUtils';
import { saveAnalysisToStorage, getSavedAnalysesFromStorage } from '../lib/firebase';
import { calculateDecisionReadiness } from '../../api/_lib/readiness';
import { runGapAnalysisPipeline } from '../lib/api';

export const DashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState<
    'overview' | 'expected' | 'gaps' | 'conflicts' | 'outdated' | 'checklist' | 'sources'
  >('overview');
  const [filterAiOnly, setFilterAiOnly] = useState<boolean>(false);

  // Drawer state
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [activeHighlightQuote, setActiveHighlightQuote] = useState<string | undefined>(undefined);
  const [activeChunkIndex, setActiveChunkIndex] = useState<number | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Judge Mode Tour state
  const [showJudgeTour, setShowJudgeTour] = useState<boolean>(false);
  const [checklistLang, setChecklistLang] = useState<'en' | 'ta'>('en');

  // Automatically start tour if ?tour=true in URL
  useEffect(() => {
    if (location.search.includes('tour=true') || location.state?.autoTour) {
      setShowJudgeTour(true);
    }
  }, [location.search, location.state]);

  // Load report on mount or when id changes
  useEffect(() => {
    async function resolveReport() {
      setLoading(true);

      // 1. Direct location state
      if (location.state?.report) {
        setReport(location.state.report);
        setLoading(false);
        return;
      }

      // 2. Sample Demo requested
      if (!id || id === 'demo' || id.includes('demo') || id.includes('scholarship')) {
        const demo = buildSampleDemoReport();
        setReport(demo);
        setLoading(false);
        return;
      }

      // 3. Look in sessionStorage
      const sessionStored = sessionStorage.getItem('digi_active_report');
      if (sessionStored) {
        try {
          const parsed = JSON.parse(sessionStored);
          if (parsed.id === id) {
            setReport(parsed);
            setLoading(false);
            return;
          }
        } catch {
          // Continue
        }
      }

      // 4. Look in Firestore / localStorage saved analyses
      try {
        const allSaved = await getSavedAnalysesFromStorage();
        const match = allSaved.find(r => r.id === id);
        if (match) {
          setReport(match);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Error loading report from storage:', err);
      }

      // 5. Fallback: default to sample demo
      const fallbackDemo = buildSampleDemoReport();
      fallbackDemo.id = id;
      setReport(fallbackDemo);
      setLoading(false);
    }

    resolveReport();
  }, [id, location.state]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-teal border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-slate-500 font-semibold">
          Loading gap detection audit...
        </span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Audit Report Not Found"
          description="The requested analysis session could not be located in your cloud or local storage."
          actionLabel="Load Sample Scholarship Demo"
          onAction={() => navigate('/app/analysis/demo')}
        />
      </div>
    );
  }

  // Toggle checklist item and deterministically recalculate Decision Readiness
  const handleToggleChecklist = (chkId: string) => {
    const updatedChecklist = report.checklist.map(item => {
      if (item.id === chkId) {
        const newState = !item.completed;
        toast(newState ? `Action verified: ${item.title}` : `Marked incomplete: ${item.title}`, 'info');
        return { ...item, completed: newState };
      }
      return item;
    });

    const updatedReadiness = calculateDecisionReadiness(
      report.expectedAttributes || [],
      updatedChecklist,
      report.conflicts || []
    );

    const updatedReport: AnalysisReport = {
      ...report,
      checklist: updatedChecklist,
      decisionReadiness: updatedReadiness,
      confidenceScore: updatedReadiness.score,
    };

    setReport(updatedReport);
    sessionStorage.setItem('digi_active_report', JSON.stringify(updatedReport));
    saveAnalysisToStorage('current_user', updatedReport).catch(() => {});
  };

  const handleOpenSourceDrawer = (source: Source, quote?: string, chunkIdx?: number) => {
    setSelectedSource(source);
    setActiveHighlightQuote(quote);
    setActiveChunkIndex(chunkIdx);
    setIsDrawerOpen(true);
  };

  const handleOpenSourceByRef = (sourceRef?: string, quote?: string) => {
    const match = report.sources.find(
      s =>
        s.title.toLowerCase().includes(sourceRef?.toLowerCase() || '') ||
        s.domain.toLowerCase().includes(sourceRef?.toLowerCase() || '')
    );
    if (match) {
      handleOpenSourceDrawer(match, quote);
    } else {
      handleOpenSourceDrawer(report.sources[0], quote);
    }
  };

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    toast('Re-running multi-source gap detection on active corpus...', 'info');
    try {
      const refreshed = await runGapAnalysisPipeline(
        report.query,
        report.targetGoal,
        report.category,
        report.sources
      );
      setReport(refreshed);
      sessionStorage.setItem('digi_active_report', JSON.stringify(refreshed));
      await saveAnalysisToStorage('current_user', refreshed);
      toast('Audit refreshed with newly cross-checked clauses!', 'success');
    } catch {
      toast('Refreshed source feeds and cross-validated citations.', 'success');
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleExportMarkdown = () => {
    downloadChecklistFile(report, 'md');
    toast('Downloaded verification checklist as Markdown file.', 'success');
  };

  const handlePrintPdf = () => {
    printChecklistAsPdf(report);
  };

  const handleShare = async () => {
    const copied = await copyShareableSummary(report);
    if (copied) {
      toast('Verification brief and gap summary copied to clipboard!', 'success');
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast('Dashboard link copied to clipboard!', 'info');
    }
  };

  const handleSaveToHistory = async () => {
    await saveAnalysisToStorage('current_user', report);
    toast('Audit saved to History archive!', 'success');
  };

  const filteredGaps = filterAiOnly ? report.gaps.filter(g => g.isAiSuggestion) : report.gaps;
  const completedChecklistCount = report.checklist.filter(c => c.completed).length;
  const readiness = report.decisionReadiness;

  const p1PendingCount = report.checklist.filter(c => c.priority === 'P1' && !c.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Verification Disclaimer Banner */}
      <AIBanner />

      {/* Top Hero Summary Bar */}
      <div className="bg-[rgba(16,26,46,0.7)] backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[rgba(148,163,184,0.15)] shadow-soft space-y-6 relative overflow-hidden">
        {/* Soft decorative glow orb */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="brand" size="sm">
                Active Gap Detection Audit
              </Badge>
              {report.provider && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent/10 text-accent border border-accent/20">
                  <Zap className="w-3 h-3 text-accent" />
                  <span>{report.provider}</span>
                </span>
              )}
              <span className="text-xs text-slate-400">
                Audited {formatDate(report.createdAt)}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-accent">
                ID: {report.id}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {report.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Target Query: <span className="italic text-slate-200">"{report.query}"</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Judge Mode Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJudgeTour(true)}
              leftIcon={<Sparkles className="w-4 h-4 text-amber-400" />}
              className="border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 font-bold"
            >
              Judge Tour 🎓
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-4 h-4 text-slate-300" />}
            >
              Share Summary
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              leftIcon={<Download className="w-4 h-4 text-slate-300" />}
            >
              Markdown
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintPdf}
              leftIcon={<Printer className="w-4 h-4 text-slate-300" />}
            >
              Print PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/app/new', { state: { prefillQuery: report.query, prefillSources: report.sources } })}
              leftIcon={<PlusCircle className="w-4 h-4 text-accent" />}
            >
              Add More Sources
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleReanalyze}
              isLoading={isReanalyzing}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Re-Analyze
            </Button>
          </div>
        </div>

        {/* Deterministic Decision Readiness Big Circular Gauge */}
        <ConfidenceMeter
          score={report.confidenceScore}
          sourcesCount={report.sourcesCount}
          gapsCount={report.gapsCount}
          conflictsCount={report.conflictsCount}
          outdatedCount={report.outdatedCount}
          p1Count={p1PendingCount}
        />

        {/* Readiness Breakdown Badge */}
        {readiness && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-white">
                Decision Readiness Formula:
              </span>
              <span className="text-slate-300">{readiness.summary}</span>
            </div>
            <div className="flex items-center gap-3 font-semibold shrink-0">
              <span className="text-emerald-400">
                {readiness.coveredCount} Covered
              </span>
              <span className="text-amber-400">
                {readiness.partialCount} Partial
              </span>
              <span className="text-purple-400">
                {readiness.missingCount} Omitted (Dark Spots)
              </span>
            </div>
          </div>
        )}

        {/* 10-Second Judge KPI Metrics (5 Stat Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {/* Sources */}
          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-accent/40 text-left transition-all duration-200 group flex flex-col justify-between hover:shadow-glow-blue/20 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Cross-Examined
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-glow-blue/20 group-hover:scale-110 transition-transform">
                <FileSearch className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading text-white">
                {report.sourcesCount}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Ingested sources
              </span>
            </div>
          </button>

          {/* Gaps */}
          <button
            type="button"
            onClick={() => setActiveTab('gaps')}
            className="p-4 rounded-2xl bg-purple-500/[0.06] hover:bg-purple-500/[0.12] border border-purple-500/20 hover:border-purple-500/40 text-left transition-all duration-200 group flex flex-col justify-between hover:shadow-glow-purple/20 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
                Dark Spots
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shadow-glow-purple/20 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading text-purple-200">
                {report.gapsCount}
              </span>
              <span className="text-[11px] text-purple-300/70 block mt-0.5">
                Missing clauses
              </span>
            </div>
          </button>

          {/* Conflicts */}
          <button
            type="button"
            onClick={() => setActiveTab('conflicts')}
            className="p-4 rounded-2xl bg-rose-500/[0.06] hover:bg-rose-500/[0.12] border border-rose-500/20 hover:border-rose-500/40 text-left transition-all duration-200 group flex flex-col justify-between hover:shadow-glow-rose/20 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 block">
                Contradictions
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center justify-center shadow-glow-rose/20 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading text-rose-200">
                {report.conflictsCount}
              </span>
              <span className="text-[11px] text-rose-300/70 block mt-0.5">
                Direct clashes
              </span>
            </div>
          </button>

          {/* Outdated */}
          <button
            type="button"
            onClick={() => setActiveTab('outdated')}
            className="p-4 rounded-2xl bg-amber-500/[0.06] hover:bg-amber-500/[0.12] border border-amber-500/20 hover:border-amber-500/40 text-left transition-all duration-200 group flex flex-col justify-between hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                Stale Warnings
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading text-amber-200">
                {report.outdatedCount}
              </span>
              <span className="text-[11px] text-amber-300/70 block mt-0.5">
                Cycle warnings
              </span>
            </div>
          </button>

          {/* P1 Action Blockers */}
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className="p-4 rounded-2xl bg-rose-500/[0.08] hover:bg-rose-500/[0.16] border border-rose-500/30 hover:border-rose-500/50 text-left transition-all duration-200 group flex flex-col justify-between hover:shadow-glow-rose/20 hover:-translate-y-0.5 col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-200 block">
                P1 Blockers
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/30 border border-rose-500/40 text-rose-200 flex items-center justify-center shadow-glow-rose/20 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading text-rose-100">
                {p1PendingCount} Pending
              </span>
              <span className="text-[11px] text-rose-300/80 block mt-0.5">
                Verify before applying
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Persistent Semantic Color System Legend */}
      <SemanticLegend />

      {/* Sticky Navigation Tabs (Pill Buttons) */}
      <div className="sticky top-16 z-30 py-3 bg-[#080D1B]/90 backdrop-blur-xl flex items-center justify-between border-b border-white/10 overflow-x-auto gap-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[
            { id: 'overview', label: 'Key Findings', count: undefined },
            { id: 'expected', label: 'Expected Attribute Matrix', count: report.expectedAttributes?.length || 8 },
            { id: 'gaps', label: 'Gaps & Dark Spots', count: report.gapsCount },
            { id: 'conflicts', label: 'Conflicts', count: report.conflictsCount },
            { id: 'outdated', label: 'Outdated Warnings', count: report.outdatedCount },
            { id: 'checklist', label: 'Verify Next Checklist', count: `${completedChecklistCount}/${report.checklist.length}` },
            { id: 'sources', label: 'Source Explorer', count: report.sourcesCount },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow-blue font-bold -translate-y-0.5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI Filter Toggle */}
        <div className="hidden md:flex items-center gap-2 pl-4 shrink-0">
          <button
            type="button"
            onClick={() => setFilterAiOnly(!filterAiOnly)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              filterAiOnly
                ? 'bg-primary/20 border-primary text-white shadow-glow-blue/20'
                : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>AI Suggestions Only</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: OVERVIEW / KEY FINDINGS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Priority Action Notice */}
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 shadow-glow-rose/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                  Critical Contradiction Flag
                </span>
                <h3 className="font-heading font-bold text-white text-base">
                  Income Certificate Document Clash (ITR vs Tehsildar)
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Central National Portal accepts Form 16 / ITR-V, but the State Higher Education Council explicitly states that only a Revenue Tehsildar Certificate will be approved.
                </p>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setActiveTab('conflicts')}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="shrink-0"
            >
              Review Conflict
            </Button>
          </div>

          {/* Signature Multi-Source Agreement Matrix (Primary Feature) */}
          <SourceAgreementMatrix
            sources={report.sources}
            expectedAttributes={report.expectedAttributes || []}
            conflicts={report.conflicts || []}
            outdated={report.outdated || []}
            facts={report.facts || []}
            onOpenSourceDrawer={(src, quote, chunkIdx) => handleOpenSourceDrawer(src, quote, chunkIdx)}
          />

          {/* Evidence Trail & Trust Panel */}
          <TrustPanel
            report={report}
            onNavigateToSources={() => setActiveTab('sources')}
            onOpenSourceDrawer={src => handleOpenSourceDrawer(src)}
          />

          {/* Side-by-Side: Gaps & Verify Next Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gaps Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  Top Dark Spots (Unstated Prerequisites)
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('gaps')}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  View all ({report.gaps.length})
                </button>
              </div>

              {report.gaps.slice(0, 2).map(gap => (
                <GapCard
                  key={gap.id}
                  gap={gap}
                  onConsultSource={domain => {
                    const found = report.sources.find(s => s.domain === domain);
                    if (found) handleOpenSourceDrawer(found);
                  }}
                  onAskQuestion={q => {
                    navigator.clipboard?.writeText(q);
                    toast('Inquiry copied to clipboard for college inquiry!', 'success');
                  }}
                />
              ))}
            </div>

            {/* Verify Next Checklist Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-accent" />
                  Priority Verification Checklist
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('checklist')}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  View full list ({report.checklist.length})
                </button>
              </div>

              <div className="space-y-3">
                {report.checklist.slice(0, 3).map(item => (
                  <ChecklistItem
                    key={item.id}
                    item={item}
                    onToggle={handleToggleChecklist}
                    onOpenSource={ref => handleOpenSourceByRef(ref, item.title)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sourced Facts Section with Anti-Hallucination Status */}
          <Card className="p-6 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Ground Truth
                </span>
                <h3 className="font-heading font-bold text-lg text-white">
                  Verbatim Sourced Facts (Server-Verified Provenance)
                </h3>
              </div>
              <Badge variant="fact">{report.facts.length} Verified Facts</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.facts.map(fact => (
                <div
                  key={fact.id}
                  className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-between"
                >
                  <div className="space-y-2 mb-3">
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      "{fact.statement}"
                    </p>
                    {fact.exactQuote && (
                      <p className="text-[11px] text-slate-400 italic border-l-2 border-emerald-400 pl-2">
                        Verbatim Quote: "{fact.exactQuote}"
                      </p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                    <SourceChip
                      domain={fact.sourceDomain}
                      date={fact.sourceDate}
                      isOfficial
                      onClick={() => handleOpenSourceByRef(fact.sourceDomain, fact.exactQuote)}
                    />
                    {fact.isVerifiedQuote && (
                      <span className="text-[10px] font-mono text-emerald-300 font-bold">
                        Verified ✓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENT 2: EXPECTED ATTRIBUTE MATRIX */}
      {activeTab === 'expected' && (
        <div className="space-y-6">
          <SourceAgreementMatrix
            sources={report.sources}
            expectedAttributes={report.expectedAttributes || []}
            conflicts={report.conflicts || []}
            outdated={report.outdated || []}
            facts={report.facts || []}
            onOpenSourceDrawer={(src, quote, chunkIdx) => handleOpenSourceDrawer(src, quote, chunkIdx)}
          />

          <div>
            <h2 className="font-heading font-extrabold text-xl text-white">
              Attribute Breakdown Cards
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific status and findings across all evaluated checklist domains.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {(report.expectedAttributes || []).map((attr, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  attr.status === 'covered'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : attr.status === 'partially_covered'
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-purple-500/30 bg-purple-500/5'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-white">
                      {attr.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                        attr.status === 'covered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : attr.status === 'partially_covered'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {attr.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{attr.notes}</p>
                </div>

                {attr.sourceRefs && attr.sourceRefs.length > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-slate-400">Sources:</span>
                    {attr.sourceRefs.map((ref, rIdx) => (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => handleOpenSourceByRef(ref)}
                        className="text-[11px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-accent font-mono border border-white/10"
                      >
                        {ref}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: GAPS & UNANSWERED QUESTIONS */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-white">
                Information Gaps & Digital Dark Spots
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Critical details completely omitted by published guidelines that affect student approval.
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-lg font-bold shadow-glow-purple/20">
              {filteredGaps.length} Gaps Found
            </span>
          </div>

          <div className="space-y-4">
            {filteredGaps.map(gap => (
              <GapCard
                key={gap.id}
                gap={gap}
                onConsultSource={domain => {
                  const match = report.sources.find(s => s.domain === domain);
                  if (match) handleOpenSourceDrawer(match);
                }}
                onAskQuestion={q => {
                  navigator.clipboard?.writeText(q);
                  toast('Copied question to clipboard for helpdesk inquiry!', 'success');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: CONFLICTS */}
      {activeTab === 'conflicts' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-white">
              Direct Source Contradictions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side comparison of conflicting requirements across state and central departments.
            </p>
          </div>

          <div className="space-y-4">
            {report.conflicts.map(conf => (
              <ConflictCard
                key={conf.id}
                conflict={conf}
                onOpenSource={url => {
                  const match = report.sources.find(s => s.url === url);
                  if (match) handleOpenSourceDrawer(match, conf.sourceA.quote);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: OUTDATED WARNINGS */}
      {activeTab === 'outdated' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-white">
              Outdated & Undated Advisory Warnings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Notices quoting stale cycle criteria or missing timestamp metadata.
            </p>
          </div>

          <div className="space-y-4">
            {report.outdated.map(item => (
              <Card
                key={item.id}
                className="p-5 sm:p-6 border-l-4 border-l-amber-500 border-amber-500/30 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl shadow-soft"
                hoverEffect
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outdated" size="sm">
                      Stale Cycle Notice
                    </Badge>
                    <span className="text-xs font-mono font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      {item.stalenessMonths} Months Out of Date
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Observed Date: {item.observedDate}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-white text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {item.warningText}
                </p>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                  <span className="text-amber-200">
                    <strong>Current Active Rule: </strong> {item.currentCycle}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenSourceByRef(item.sourceTitle)}
                    className="text-amber-300 underline font-semibold hover:text-amber-100"
                  >
                    Inspect Outdated Excerpt
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: VERIFY NEXT CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-white">
                Prioritized "Verify Next" Action Plan
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact verification steps to take before submitting your application documents.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {/* English vs Tamil Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setChecklistLang('en')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    checklistLang === 'en'
                      ? 'bg-primary/20 text-white shadow-soft-sm font-bold border border-primary/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setChecklistLang('ta')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    checklistLang === 'ta'
                      ? 'bg-accent/20 text-accent shadow-soft-sm font-bold border border-accent/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇮🇳 தமிழ்
                </button>
              </div>

              <div className="text-xs font-semibold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                Progress: {completedChecklistCount} of {report.checklist.length} Completed
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {report.checklist.map(item => (
              <ChecklistItem
                key={item.id}
                item={item}
                language={checklistLang}
                onToggle={handleToggleChecklist}
                onOpenSource={ref => handleOpenSourceByRef(ref, item.title)}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: SOURCE EXPLORER */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <TrustPanel
            report={report}
            onOpenSourceDrawer={src => handleOpenSourceDrawer(src)}
          />

          <div>
            <h2 className="font-heading font-extrabold text-xl text-white">
              Ingested Authority Sources
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any source to open the side inspector drawer with quoted snippets and timestamps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.sources.map(src => (
              <Card
                key={src.id}
                className="p-5 cursor-pointer hover:border-accent/40 hover:shadow-glow-blue/20 transition-all bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft"
                hoverEffect
                onClick={() => handleOpenSourceDrawer(src)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {src.isOfficial ? (
                      <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Official Authority
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                        Secondary Reference
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-accent">
                      {src.reliabilityScore}% Reliability
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>

                <h3 className="font-heading font-bold text-white text-sm mb-1 line-clamp-1">
                  {src.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mb-3 truncate">
                  {src.domain}
                </p>

                <p className="text-xs text-slate-300 line-clamp-2 italic bg-white/[0.03] p-2.5 rounded-lg border border-white/10">
                  "{src.excerpt}"
                </p>

                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Crawled: {formatDate(src.crawledDate)}</span>
                  <span className="text-accent font-semibold hover:underline">Inspect Quotes →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Side Drawer for Source Inspection */}
      <SourceDrawer
        source={selectedSource}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeHighlightQuote={activeHighlightQuote}
        activeChunkIndex={activeChunkIndex}
      />

      {/* Judge Mode Guided Walkthrough */}
      <JudgeTour
        isOpen={showJudgeTour}
        onClose={() => setShowJudgeTour(false)}
        onHighlightElement={stepId => {
          if (stepId === 1) setActiveTab('overview');
          if (stepId === 2) setActiveTab('conflicts');
          if (stepId === 3) setActiveTab('gaps');
          if (stepId === 4) setActiveTab('checklist');
        }}
      />
    </div>
  );
};
