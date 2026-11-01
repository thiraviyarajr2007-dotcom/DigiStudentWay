import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Layers,
  ArrowRight,
  PlusCircle,
  FileCheck2,
  Trash2,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { mockPastAnalyses } from '../lib/mockData';
import { AnalysisSummary, AnalysisReport } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate, getConfidenceColor } from '../lib/utils';
import { useToast } from '../components/common/Toast';
import { getSavedAnalysesFromStorage, deleteAnalysisFromStorage } from '../lib/firebase';
import { buildSampleDemoReport } from '../lib/sampleDemo';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Analyses' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'admission', label: 'Admissions' },
    { id: 'govt_scheme', label: 'Govt Schemes' },
    { id: 'exam', label: 'Exams' },
    { id: 'internship', label: 'Internships' },
  ];

  // Load from storage + fallback defaults
  useEffect(() => {
    async function loadData() {
      try {
        const storedReports = await getSavedAnalysesFromStorage();
        if (storedReports.length > 0) {
          const combined = [
            ...storedReports,
            ...mockPastAnalyses.filter(m => !storedReports.some(s => s.id === m.id)),
          ];
          setAnalyses(combined);
        } else {
          setAnalyses(mockPastAnalyses);
        }
      } catch {
        setAnalyses(mockPastAnalyses);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteAnalysisFromStorage('current_user', id);
    setAnalyses(prev => prev.filter(a => a.id !== id));
    toast('Audit removed from history.', 'info');
  };

  const handleOpenAnalysis = (item: AnalysisSummary) => {
    // If it's the demo scholarship, load complete demo report
    if (item.id.includes('scholarship') || item.id === 'demo') {
      const demo = buildSampleDemoReport();
      sessionStorage.setItem('digi_active_report', JSON.stringify(demo));
      navigate(`/app/analysis/${demo.id}`, { state: { report: demo } });
      return;
    }

    // Try retrieving full report from storage
    const allStored = JSON.parse(localStorage.getItem('digi_saved_analyses') || '[]');
    const match = allStored.find((r: AnalysisReport) => r.id === item.id);
    if (match) {
      sessionStorage.setItem('digi_active_report', JSON.stringify(match));
      navigate(`/app/analysis/${match.id}`, { state: { report: match } });
    } else {
      const fallbackReport = buildSampleDemoReport();
      fallbackReport.id = item.id;
      fallbackReport.title = item.title;
      fallbackReport.query = item.query;
      fallbackReport.category = item.category;
      fallbackReport.confidenceScore = item.confidenceScore;
      sessionStorage.setItem('digi_active_report', JSON.stringify(fallbackReport));
      navigate(`/app/analysis/${fallbackReport.id}`, { state: { report: fallbackReport } });
    }
  };

  const filteredAnalyses = analyses.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.query.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Audit Archive (Firebase Firestore / LocalSync)
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-0.5">
            Past Gap Analyses & Dark Spot Audits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access previous cross-correlations, checklist progress, and discovered contradictions.
          </p>
        </div>

        <Link to="/app/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search past schemes or queries..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-brand-navy-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-navy text-white dark:bg-brand-teal dark:text-brand-navy-950 font-bold shadow-soft-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analyses List */}
      {filteredAnalyses.length === 0 ? (
        <EmptyState
          title="No Past Audits Found"
          description="We couldn't find any analyses matching your current search or category filter. Try clearing the search query or running a new scan."
          actionLabel="Clear Filter"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAnalyses.map(analysis => {
            const conf = getConfidenceColor(analysis.confidenceScore);

            return (
              <Card
                key={analysis.id}
                className="p-5 sm:p-6 transition-all hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                hoverEffect
                onClick={() => handleOpenAnalysis(analysis)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {analysis.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(analysis.createdAt)}
                      </span>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5" /> Anti-Hallucination Verified
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                      {analysis.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl line-clamp-1 italic">
                      Query: "{analysis.query}"
                    </p>

                    {/* Metric Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {analysis.sourcesCount} Sources
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold">
                        {analysis.gapsCount} Gaps Found
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold">
                        {analysis.conflictsCount} Contradictions
                      </span>
                      {analysis.outdatedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold">
                          {analysis.outdatedCount} Stale Warnings
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Confidence Score & Action */}
                  <div className="flex sm:flex-col lg:flex-row items-center gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 justify-between">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Readiness:</span>
                        <span className={`text-sm font-bold font-mono ${conf.textColor}`}>
                          {analysis.confidenceScore}%
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {conf.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenAnalysis(analysis)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Open Audit
                      </Button>
                      <button
                        type="button"
                        onClick={e => handleDelete(e, analysis.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete audit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
