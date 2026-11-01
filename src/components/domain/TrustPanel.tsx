import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Lock,
  Landmark,
  FileSearch,
} from 'lucide-react';
import { AnalysisReport, Source } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export interface TrustPanelProps {
  report: AnalysisReport;
  onNavigateToSources?: () => void;
  onOpenSourceDrawer?: (source: Source) => void;
}

export const TrustPanel: React.FC<TrustPanelProps> = ({
  report,
  onNavigateToSources,
  onOpenSourceDrawer,
}) => {
  const sources = report.sources || [];
  const officialSources = sources.filter(s => s.isOfficial || s.credibilitySignals?.isOfficialDomain);
  const httpsSources = sources.filter(s => s.url.startsWith('https://'));
  const undatedSources = sources.filter(s => !s.publishDate || s.publishDate === 'Undated');
  
  // Calculate verified vs unverified findings
  const verifiedFactsCount = (report.facts || []).filter(f => f.isVerifiedQuote).length;
  const totalFactsCount = (report.facts || []).length;
  const rejectedQuotesCount = report.rejectedQuotesCount || 0;

  // Unfetched sources or dark spot attributes
  const missingAttributes = (report.expectedAttributes || []).filter(a => a.status === 'not_found');
  const unfetchedSources = report.unfetchedSources || [];

  return (
    <Card className="p-6 sm:p-8 space-y-6 overflow-hidden border-2 border-slate-200 dark:border-slate-800">
      {/* Permanent Required Banner */}
      <div
        className="p-4 rounded-2xl border border-dashed border-blue-300 dark:border-blue-800/80 bg-blue-50/70 dark:bg-blue-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-soft-sm"
        role="alert"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-blue-950 dark:text-blue-100 text-xs sm:text-sm block">
              Permanent Guardrail Mandate:
            </span>
            <p className="text-xs text-blue-900/90 dark:text-blue-200 mt-0.5 font-medium leading-relaxed">
              <strong>"AI findings are potential gaps, not guaranteed facts."</strong> Every conclusion must be treated as an alert requiring physical or portal verification before final academic submission.
            </p>
          </div>
        </div>
        <Badge variant="ai" size="sm" className="shrink-0">
          Transparency Standard
        </Badge>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-brand-teal text-xs font-semibold mb-1 border border-brand-teal/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Anti-Hallucination & Provenance Audit</span>
          </div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            Evidence Trail & Verification Integrity
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent breakdown of reviewed documents, server quote checks, and what could NOT be verified.
          </p>
        </div>

        {/* AI Provider Badge */}
        {report.provider && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-300 font-semibold">{report.provider}</span>
          </div>
        )}
      </div>

      {/* 3 Core Trust Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Signal 1: Server Anti-Hallucination Guard */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Server Quote Verification
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {verifiedFactsCount}/{totalFactsCount}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Server-side anti-hallucination engine matches every key finding verbatim against raw chunk coordinates. Unmatched AI claims are demoted to hypotheses.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {rejectedQuotesCount === 0 ? '0 Hallucinations Detected' : `${rejectedQuotesCount} Quotes Demoted`}
          </div>
        </div>

        {/* Signal 2: Official vs Secondary Portals */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-brand-teal" />
                Authoritative Domains
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {officialSources.length}/{sources.length} Official
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {officialSources.length} of {sources.length} sources originate from authoritative state/national .gov or .edu institutional directories.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> {httpsSources.length}/{sources.length} HTTPS
            </span>
          </div>
        </div>

        {/* Signal 3: Staleness & Undated Warnings */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Publication Timestamps
              </span>
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                {sources.length - undatedSources.length}/{sources.length} Dated
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {undatedSources.length > 0
                ? `${undatedSources.length} source lacks an official publish date. Findings from undated sources are flagged with amber caution icons.`
                : 'All ingested sources carry verified publication metadata.'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Active Academic Year: 2026-27
          </div>
        </div>
      </div>

      {/* Dedicated Panel: "What this analysis could NOT verify" */}
      <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-4">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-purple-950 dark:text-purple-100">
                What This Analysis Could NOT Verify
              </h4>
              <p className="text-xs text-purple-800/80 dark:text-purple-300">
                Strict boundaries and unaddressed domains identified across the input document corpus.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2.5 py-1 rounded-lg shrink-0">
            {missingAttributes.length} Unstated Domains
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
          {/* Missing attributes list */}
          {missingAttributes.map(attr => (
            <div
              key={attr.attributeId}
              className="p-3 rounded-xl bg-white dark:bg-brand-navy-900 border border-purple-200/80 dark:border-purple-800/80 flex items-start gap-2"
            >
              <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {attr.label}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {attr.notes}
                </span>
              </div>
            </div>
          ))}

          {/* Undated sources alert */}
          {undatedSources.map(src => (
            <div
              key={src.id}
              className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 flex items-start gap-2"
            >
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 dark:text-amber-200 block truncate">
                  {src.title}
                </span>
                <span className="text-[11px] text-amber-800 dark:text-amber-300">
                  No verified publish date in HTML/meta tags.
                </span>
              </div>
            </div>
          ))}

          {/* Failed / Unfetched sources if any */}
          {unfetchedSources.length > 0 &&
            unfetchedSources.map((failedUrl: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-950 dark:text-rose-200 block truncate">
                    Failed URL: {failedUrl}
                  </span>
                  <span className="text-[11px] text-rose-800 dark:text-rose-300">
                    Could not fetch server-side. Click to paste text instead.
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
};
