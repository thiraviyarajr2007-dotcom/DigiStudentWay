import React, { useState } from 'react';
import { Search, Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, BookOpen, Quote } from 'lucide-react';
import { Source } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface DarkSpotInspectorProps {
  sources: Source[];
  onOpenSourceDrawer: (source: Source, quote?: string) => void;
}

interface QueryInspectionResult {
  query: string;
  verdict: 'stated' | 'conflicted' | 'dark_spot';
  summary: string;
  findings: Array<{
    source: Source;
    matchedSentence: string;
    isVerified: boolean;
  }>;
  resolutionGuidance: string;
}

export const DarkSpotInspector: React.FC<DarkSpotInspectorProps> = ({ sources, onOpenSourceDrawer }) => {
  const [searchDoubt, setSearchDoubt] = useState('');
  const [activeResult, setActiveResult] = useState<QueryInspectionResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const PRESET_QUERIES = [
    'Annual Family Income Ceiling',
    'Submission Deadline Date',
    'Renewal CGPA Requirement',
    'Mandatory Revenue Documents',
    'Service Bond or Penalty Clause',
  ];

  const inspectQueryAcrossSources = (queryText: string) => {
    const cleanQuery = queryText.trim().toLowerCase();
    if (!cleanQuery) return;

    setIsSearching(true);
    setSearchDoubt(queryText);

    // Normalize keywords for query
    const terms = cleanQuery
      .split(/\s+/)
      .filter(w => w.length > 2 && !['what', 'when', 'does', 'have', 'the', 'for', 'with', 'and'].includes(w));

    const matches: Array<{ source: Source; matchedSentence: string; isVerified: boolean }> = [];

    sources.forEach(src => {
      const text = src.fullText || src.excerpt || '';
      const sentences = text
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 15);

      sentences.forEach(sent => {
        const lowerSent = sent.toLowerCase();
        // Check if multiple query terms match
        const matchCount = terms.filter(t => lowerSent.includes(t)).length;
        if (matchCount >= Math.min(2, terms.length)) {
          matches.push({
            source: src,
            matchedSentence: sent,
            isVerified: true,
          });
        }
      });
    });

    // Check for conflict or absence
    if (matches.length === 0) {
      setActiveResult({
        query: queryText,
        verdict: 'dark_spot',
        summary: `Zero occurrences found across ${sources.length} circulars. This is an unaddressed Digital Dark Spot.`,
        findings: [],
        resolutionGuidance: `Neither circular mentions '${queryText}'. Do not assume approval; file a written inquiry with the nodal authority to obtain verified rules.`,
      });
    } else if (matches.length === 1) {
      setActiveResult({
        query: queryText,
        verdict: 'stated',
        summary: `Disclosed in 1 circular (${matches[0].source.title || matches[0].source.url}). Missing in other notices.`,
        findings: matches,
        resolutionGuidance: `Verify whether your local institution honors the terms specified in '${matches[0].source.title || 'the primary notice'}'.`,
      });
    } else {
      // Check if amounts or dates differ
      const numMatches = matches.map(m => (m.matchedSentence.match(/\d+[\d,.]*/g) || []).join(' '));
      const hasDivergence = numMatches.length > 1 && numMatches[0] !== numMatches[1];

      if (hasDivergence) {
        setActiveResult({
          query: queryText,
          verdict: 'conflicted',
          summary: `Contradicting specifications found across ${matches.length} separate notices.`,
          findings: matches,
          resolutionGuidance: `Different values are quoted across circulars. Cross-verify with the primary portal administrator before filing affidavits.`,
        });
      } else {
        setActiveResult({
          query: queryText,
          verdict: 'stated',
          summary: `Verified and corroborated across ${matches.length} sources.`,
          findings: matches,
          resolutionGuidance: `Information is mutually consistent. Ensure your supporting paperwork matches these exact dates and figures.`,
        });
      }
    }

    setIsSearching(false);
  };

  return (
    <Card className="p-6 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.18)] shadow-soft-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[11px] font-semibold text-accent mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Real-World Problem Solver</span>
          </div>
          <h3 className="font-heading font-extrabold text-lg text-white">
            Digital Dark Spot & Clause Cross-Examiner
          </h3>
          <p className="text-xs text-slate-300">
            Type any condition, eligibility rule, or doubt to test whether all circulars agree, disagree, or omit it completely.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 self-start sm:self-auto">
          {sources.length} Notices Loaded
        </span>
      </div>

      {/* Preset Query Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-slate-400">Quick Test Doubts:</span>
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => inspectQueryAcrossSources(preset)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-all hover:border-accent/30"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          inspectQueryAcrossSources(searchDoubt);
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchDoubt}
            onChange={e => setSearchDoubt(e.target.value)}
            placeholder="Type any specific question (e.g. Can distance students apply? What is the income limit?)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching || !searchDoubt.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white text-xs font-bold transition-all shadow-glow-blue flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          <span>Examine Notices</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Active Results Display */}
      {activeResult && (
        <div
          className={`p-4 rounded-2xl border transition-all animate-in fade-in duration-200 ${
            activeResult.verdict === 'dark_spot'
              ? 'bg-purple-950/20 border-purple-500/30 text-purple-200'
              : activeResult.verdict === 'conflicted'
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {activeResult.verdict === 'dark_spot' ? (
                <ShieldAlert className="w-4 h-4 text-purple-400" />
              ) : activeResult.verdict === 'conflicted' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-xs font-bold tracking-tight text-white">
                {activeResult.verdict === 'dark_spot'
                  ? 'Confirmed Digital Dark Spot (Omission)'
                  : activeResult.verdict === 'conflicted'
                  ? 'Conflicting Information Detected'
                  : 'Sourced & Corroborated'}
              </span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                activeResult.verdict === 'dark_spot'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : activeResult.verdict === 'conflicted'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {activeResult.verdict.replace('_', ' ')}
            </span>
          </div>

          <p className="text-xs font-medium text-slate-200 mb-3">{activeResult.summary}</p>

          {/* Matched Quotes */}
          {activeResult.findings.length > 0 && (
            <div className="space-y-2 mb-3">
              {activeResult.findings.map((f, i) => (
                <div
                  key={i}
                  onClick={() => onOpenSourceDrawer(f.source, f.matchedSentence)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-white/10 hover:border-accent/40 cursor-pointer transition-all flex items-start gap-2.5 group"
                >
                  <Quote className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <p className="text-xs text-slate-200 leading-relaxed font-serif italic">
                      "{f.matchedSentence}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-accent">{f.source.title || f.source.url}</span>
                      <span className="group-hover:text-white transition-colors flex items-center gap-1">
                        View in Source <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resolution Guidance */}
          <div className="pt-2.5 border-t border-white/10 flex items-start gap-2 text-xs">
            <span className="font-bold text-accent shrink-0">Action Advice:</span>
            <span className="text-slate-300 leading-relaxed">{activeResult.resolutionGuidance}</span>
          </div>
        </div>
      )}
    </Card>
  );
};
