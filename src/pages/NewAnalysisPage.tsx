import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Link as LinkIcon,
  FileText,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  Globe,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Stepper, Step } from '../components/common/Stepper';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';
import { DomainCategory, Source, AnalysisProgress } from '../types';
import { fetchSourceViaApi, suggestSourcesViaApi, runGapAnalysisPipeline } from '../lib/api';
import { extractTextFromFile } from '../lib/pdfExtractor';
import { sampleDemoSources, SAMPLE_DEMO_QUERY, SAMPLE_DEMO_GOAL } from '../lib/sampleDemo';
import { saveAnalysisToStorage } from '../lib/firebase';
import { chunkDocumentText } from '../../api/_lib/chunking';
import { evaluateSourceCredibility } from '../../api/_lib/credibility';

export const NewAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);

  // Step 1: Research query & goals
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<DomainCategory>('scholarship');
  const [selectedGoal, setSelectedGoal] = useState<string>('Avoid Application Rejection');

  // Step 2: Ingested Sources state
  const [sourceTab, setSourceTab] = useState<'url' | 'text' | 'upload'>('url');
  const [urlInputs, setUrlInputs] = useState<string[]>(['']);
  const [fetchingUrlIndex, setFetchingUrlIndex] = useState<number | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');

  // Structured sources collection
  const [sources, setSources] = useState<Source[]>([]);

  // Check for prefilled data from Dashboard "Add More Sources" action
  useEffect(() => {
    if (location.state?.prefillQuery) {
      setQuery(location.state.prefillQuery);
    }
    if (location.state?.prefillSources && Array.isArray(location.state.prefillSources)) {
      setSources(location.state.prefillSources);
      setCurrentStep(2);
    }
  }, [location.state]);

  // Suggested sources state
  const [suggestedSources, setSuggestedSources] = useState<Array<{
    title: string;
    url: string;
    domain: string;
    snippet: string;
    reasonWhySuggested: string;
    isOfficial: boolean;
    userApproved: boolean;
  }>>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const steps: Step[] = [
    { id: 1, title: 'Inquiry & Goal', description: 'Define what you are verifying' },
    { id: 2, title: 'Add Sources', description: 'Ingest links, PDFs or texts' },
    { id: 3, title: 'Review & Run', description: 'Cross-check dark spots' },
  ];

  const goalChips = [
    'Avoid Application Rejection',
    'Verify Renewal Prerequisites',
    'Resolve Conflicting Document Formats',
    'Check Real Deadline vs College Cut-off',
    'Audit Income & Category Certificates',
  ];

  // =========================================================================
  // BUNDLED SAMPLE SCHOLARSHIP DEMO
  // =========================================================================
  const loadScholarshipDemo = () => {
    setQuery(SAMPLE_DEMO_QUERY);
    setCategory('scholarship');
    setSelectedGoal(SAMPLE_DEMO_GOAL);
    setSources([...sampleDemoSources]);
    toast('Preloaded 4 realistic scholarship sources (Central Portal, State Circular, 2023 Guide, Forum FAQ)!', 'success');
    setCurrentStep(2);
  };

  // URL ingestion handlers
  const handleFetchUrl = async (index: number) => {
    const url = urlInputs[index]?.trim();
    if (!url) {
      toast('Please enter a valid URL', 'error');
      return;
    }

    setFetchingUrlIndex(index);
    try {
      const fetched = await fetchSourceViaApi(url);
      setSources(prev => [...prev.filter(s => s.url !== url), fetched]);
      toast(`Fetched and parsed: ${fetched.title}`, 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to fetch source. You can paste the notice text instead.', 'error');
    } finally {
      setFetchingUrlIndex(null);
    }
  };

  // Pasted text ingestion
  const handleAddPastedText = () => {
    if (!pastedText.trim()) {
      toast('Please enter some notice text.', 'error');
      return;
    }

    const title = pastedTitle.trim() || `Manual Circular Snippet (${pastedText.slice(0, 30)}...)`;
    const chunks = chunkDocumentText(pastedText, { targetChunkSize: 750, overlap: 100 });
    const credibility = evaluateSourceCredibility('https://manual-entry.local', undefined, true);

    const newSource: Source = {
      id: `src-pasted-${Date.now()}`,
      title,
      url: 'https://manual-entry.local/circular',
      domain: 'Pasted Document',
      crawledDate: new Date().toISOString().split('T')[0],
      sourceType: 'pasted_text',
      isOfficial: false,
      reliabilityScore: 80,
      excerpt: pastedText.slice(0, 300) + (pastedText.length > 300 ? '...' : ''),
      fullText: pastedText,
      chunks,
      credibilitySignals: credibility,
    };

    setSources(prev => [...prev, newSource]);
    setPastedText('');
    setPastedTitle('');
    toast('Added pasted notice text to analysis corpus.', 'success');
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        toast(`Extracting text from ${file.name}...`, 'info');
        const extracted = await extractTextFromFile(file);
        setSources(prev => [...prev, extracted.source]);
        toast(`Extracted ${extracted.source.chunks?.length || 1} chunks from ${file.name}`, 'success');
      } catch (err: any) {
        toast(`Failed to read file ${file.name}: ${err?.message}`, 'error');
      }
    }
  };

  // AI Source suggestions
  const handleRequestSuggestions = async () => {
    if (!query.trim()) {
      toast('Please enter an inquiry in Step 1 first.', 'error');
      return;
    }
    setIsSuggesting(true);
    try {
      const results = await suggestSourcesViaApi(query);
      setSuggestedSources(results);
      toast(`Discovered ${results.length} relevant portals. Review and approve to ingest.`, 'info');
    } catch {
      toast('Could not retrieve suggestions at this moment.', 'warning');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleApproveSuggestion = async (item: typeof suggestedSources[0], idx: number) => {
    const updated = [...suggestedSources];
    updated[idx].userApproved = true;
    setSuggestedSources(updated);

    toast(`Ingesting approved source: ${item.domain}...`, 'info');
    try {
      const fetched = await fetchSourceViaApi(item.url);
      setSources(prev => [...prev.filter(s => s.url !== item.url), fetched]);
      toast(`Ingested approved source: ${fetched.title}`, 'success');
    } catch {
      // Fallback: create placeholder source
      const chunks = chunkDocumentText(item.snippet, { targetChunkSize: 750, overlap: 100 });
      const placeholder: Source = {
        id: `src-sugg-${Date.now()}`,
        title: item.title,
        url: item.url,
        domain: item.domain,
        crawledDate: new Date().toISOString().split('T')[0],
        sourceType: item.isOfficial ? 'official' : 'educational_portal',
        isOfficial: item.isOfficial,
        reliabilityScore: item.isOfficial ? 95 : 70,
        excerpt: item.snippet,
        fullText: item.snippet,
        chunks,
        credibilitySignals: evaluateSourceCredibility(item.url, undefined),
      };
      setSources(prev => [...prev, placeholder]);
      toast(`Added source reference: ${item.domain}`, 'success');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!query.trim()) {
        toast('Please enter your research inquiry or scheme name.', 'error');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (sources.length < 2) {
        toast('Please add at least 2 sources to cross-examine and detect dark spots.', 'error');
        return;
      }
      setCurrentStep(3);
    }
  };

  // =========================================================================
  // RUN REAL GAP DETECTION PIPELINE
  // =========================================================================
  const handleRunAnalysis = async () => {
    setIsRunning(true);
    try {
      const report = await runGapAnalysisPipeline(
        query,
        selectedGoal,
        category,
        sources,
        progress => {
          setAnalysisProgress(progress);
        }
      );

      // Save to Firestore and localStorage
      await saveAnalysisToStorage('anonymous_user', report);

      toast('Gap Detection & Anti-Hallucination verification complete!', 'success');
      // Pass the report to dashboard via route state and sessionStorage
      sessionStorage.setItem('digi_active_report', JSON.stringify(report));
      navigate(`/app/analysis/${report.id}`, { state: { report } });
    } catch (err: any) {
      toast(`Analysis error: ${err.message || 'Execution error'}`, 'error');
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Dark Spot Audit Setup</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            New Gap Detection Scan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cross-examine multiple notices to discover unstated criteria, document clashes, and stale cycles.
          </p>
        </div>

        {/* Demo Prefill Quick Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={loadScholarshipDemo}
          leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
          className="border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 shrink-0"
        >
          Use Sample Scholarship Demo
        </Button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-10">
        <Stepper steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      {/* STEP 1: Research Inquiry & Goal */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div>
            <label className="block font-heading font-bold text-sm text-slate-900 dark:text-white mb-2">
              What academic scheme, admission, or notification are you investigating?
            </label>
            <textarea
              rows={3}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. What should I verify before applying for the Post-Matric Merit Scholarship (PMS 2026) regarding income certificates and renewal rules?"
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-brand-navy-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Select Scheme Category
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'scholarship', label: 'Scholarship / Fellowship' },
                { id: 'admission', label: 'College / Uni Admission' },
                { id: 'govt_scheme', label: 'Govt Student Scheme' },
                { id: 'exam', label: 'Entrance / Competitive Exam' },
                { id: 'internship', label: 'Research Internship / Stipend' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as DomainCategory)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    category === cat.id
                      ? 'bg-brand-navy text-white dark:bg-brand-teal dark:text-brand-navy-950 shadow-soft-sm font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              What is your primary audit goal?
            </label>
            <div className="flex flex-wrap gap-2">
              {goalChips.map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setSelectedGoal(goal)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedGoal === goal
                      ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-700'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={handleNextStep}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Add Sources
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Ingest Sources */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 space-y-6">
          {/* Ingestion Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
            <button
              type="button"
              onClick={() => setSourceTab('url')}
              className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                sourceTab === 'url'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Paste Portal URLs</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceTab('text')}
              className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                sourceTab === 'text'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Circular Text</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceTab('upload')}
              className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                sourceTab === 'upload'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload PDF / Text</span>
            </button>
          </div>

          {/* Mode 1: URL Fetch */}
          {sourceTab === 'url' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Input public URL to fetch server-side with SSRF protection and Mozilla Readability parsing:
              </p>

              {urlInputs.map((u, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={u}
                      onChange={e => {
                        const copy = [...urlInputs];
                        copy[idx] = e.target.value;
                        setUrlInputs(copy);
                      }}
                      placeholder="e.g. https://scholarships.gov.in/guidelines/pms-2026"
                      className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-brand-navy-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      disabled={fetchingUrlIndex === idx || !u.trim()}
                      onClick={() => handleFetchUrl(idx)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-teal text-white rounded-lg text-xs font-semibold hover:bg-teal-600 disabled:opacity-50"
                    >
                      {fetchingUrlIndex === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Fetch'}
                    </button>
                  </div>
                  {urlInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setUrlInputs(urlInputs.filter((_, i) => i !== idx))}
                      className="p-2 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setUrlInputs([...urlInputs, ''])}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add another URL field
                </button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestSuggestions}
                  isLoading={isSuggesting}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-500" />}
                >
                  Suggest Authoritative Portals
                </Button>
              </div>

              {/* AI Suggested Sources Shelf */}
              {suggestedSources.length > 0 && (
                <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-dashed border-blue-300 dark:border-blue-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      AI Suggested Sources (Requires Your Approval Before Ingestion)
                    </span>
                    <span className="text-[10px] text-blue-600 font-mono">Not auto-ingested</span>
                  </div>

                  <div className="space-y-2">
                    {suggestedSources.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-brand-navy-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-800 dark:text-slate-100">{item.title}</span>
                            {item.isOfficial && (
                              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                                Official .gov/.edu
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 truncate max-w-lg font-mono text-[11px]">{item.url}</p>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1">{item.reasonWhySuggested}</p>
                        </div>

                        <button
                          type="button"
                          disabled={item.userApproved}
                          onClick={() => handleApproveSuggestion(item, idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                            item.userApproved
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold'
                              : 'bg-brand-navy dark:bg-slate-800 text-white hover:bg-slate-700'
                          }`}
                        >
                          {item.userApproved ? 'Approved ✓' : 'Approve & Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Paste Text */}
          {sourceTab === 'text' && (
            <div className="space-y-3">
              <input
                type="text"
                value={pastedTitle}
                onChange={e => setPastedTitle(e.target.value)}
                placeholder="Notice / Circular Title (e.g. State Higher Education Gazette Oct 2026)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-brand-navy-900 text-slate-900 dark:text-white"
              />
              <textarea
                rows={5}
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="Paste the official circular excerpt or email notification here..."
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-brand-navy-900 text-slate-900 dark:text-white font-mono"
              />
              <Button variant="secondary" size="sm" onClick={handleAddPastedText}>
                Add Text Notice to Corpus
              </Button>
            </div>
          )}

          {/* Mode 3: PDF / Document Upload */}
          {sourceTab === 'upload' && (
            <div className="space-y-3">
              <label className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-teal rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-brand-navy-950/40">
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 text-brand-teal mb-3 animate-bounce" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Select Official Gazette PDF or Circular (.pdf, .txt)
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Client-side text chunking with pdfjs-dist. Zero data sent to unverified endpoints.
                </span>
              </label>
            </div>
          )}

          {/* Active Ingested Sources Corpus */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Active Source Corpus ({sources.length} Ingested)
              </span>
              {sources.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSources([])}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {sources.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-400">
                No sources ingested yet. Paste a URL, upload a PDF circular, or click "Use Sample Scholarship Demo" above.
              </div>
            ) : (
              <div className="space-y-2">
                {sources.map(src => (
                  <div
                    key={src.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-brand-navy-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {src.isOfficial ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.2 rounded font-semibold">
                            <ShieldCheck className="w-3 h-3" /> Official Authority
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.2 rounded">
                            Reference
                          </span>
                        )}
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {src.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{src.domain} • {src.chunks?.length || 1} chunks</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSources(sources.filter(s => s.id !== src.id))}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setCurrentStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleNextStep}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Review & Run
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Review & Run */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                Ready For Verification
              </span>
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                Review Audit Parameters
              </h3>
            </div>
            <Badge variant="brand">Anti-Hallucination Guard Active</Badge>
          </div>

          <div className="space-y-4 bg-slate-50 dark:bg-brand-navy-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Inquiry / Scheme:</span>
              <p className="font-bold text-slate-900 dark:text-white">{query}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Category:</span>
                <span className="font-medium capitalize text-slate-800 dark:text-slate-200">
                  {category.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Audit Goal:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedGoal}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Ingested Sources for Cross-Correlation ({sources.length}):
              </span>
              <div className="space-y-1.5">
                {sources.map(s => (
                  <div key={s.id} className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-bold">{s.domain}</span>
                    <span className="text-slate-400 truncate">({s.title})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Staged Multi-Step Progress Feedback */}
          {isRunning && (
            <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-brand-navy-900 border border-teal-200 dark:border-teal-800 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
                  {analysisProgress?.message || 'Processing information gap audit...'}
                </span>
                <span className="font-mono font-bold text-brand-teal">{analysisProgress?.progressPercent || 30}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-teal-200/60 dark:bg-teal-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-teal to-teal-400 transition-all duration-300"
                  style={{ width: `${analysisProgress?.progressPercent || 30}%` }}
                />
              </div>

              {/* Staged Step Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {[
                  { step: 1, label: 'Fetching & chunking sources', threshold: 20 },
                  { step: 2, label: 'Extracting facts & quotes', threshold: 45 },
                  { step: 3, label: 'Detecting gaps & contradictions', threshold: 75 },
                  { step: 4, label: 'Building verify-next checklist', threshold: 95 },
                ].map(s => {
                  const currentPct = analysisProgress?.progressPercent || 0;
                  const isDone = currentPct >= s.threshold;
                  const isCurrent = currentPct < s.threshold && currentPct >= s.threshold - 25;
                  return (
                    <div
                      key={s.step}
                      className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
                        isDone
                          ? 'text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50/50 dark:bg-emerald-950/30'
                          : isCurrent
                          ? 'text-brand-teal font-bold bg-teal-100/60 dark:bg-teal-950/50'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-teal shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] shrink-0 font-mono">
                          {s.step}
                        </span>
                      )}
                      <span>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="ghost"
              size="md"
              disabled={isRunning}
              onClick={() => setCurrentStep(2)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Edit Sources
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleRunAnalysis}
              isLoading={isRunning}
              leftIcon={<Play className="w-4 h-4 fill-white" />}
            >
              Run Gap Detection Engine
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
