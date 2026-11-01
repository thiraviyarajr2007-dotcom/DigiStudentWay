export type DomainCategory = 'scholarship' | 'admission' | 'govt_scheme' | 'exam' | 'internship';

export type SemanticType = 'fact' | 'conflict' | 'outdated' | 'gap' | 'ai' | 'uncertainty';

export type PriorityLevel = 'P1' | 'P2' | 'P3';

export type ItemType = 'sourced' | 'ai_suggestion' | 'uncertain';

export interface SourceChunk {
  chunkIndex: number;
  startChar: number;
  endChar: number;
  text: string;
}

export interface CredibilitySignals {
  isOfficialDomain: boolean;
  hasHttps: boolean;
  hasPublishedDate: boolean;
  domainScore: number; // 0 - 100
  domainNotes: string;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  domain: string;
  favicon?: string;
  publishDate?: string;
  crawledDate: string;
  sourceType: 'official' | 'gazette' | 'educational_portal' | 'forum' | 'archive' | 'pasted_text' | 'uploaded_doc';
  isOfficial: boolean;
  reliabilityScore: number; // 0 - 100
  excerpt: string;
  highlightedText?: string;
  fullText?: string;
  chunks?: SourceChunk[];
  credibilitySignals?: CredibilitySignals;
}

export interface ExpectedAttributeCheck {
  attributeId: string;
  label: string;
  status: 'covered' | 'partially_covered' | 'not_found';
  notes: string;
  sourceRefs: string[];
}

export interface DecisionReadiness {
  score: number; // 0 - 100 computed deterministically
  level: 'ready' | 'caution' | 'not_ready';
  label: string;
  coveredCount: number;
  partialCount: number;
  missingCount: number;
  p1PendingCount: number;
  summary: string;
}

export interface FactItem {
  id: string;
  statement: string;
  sourceId: string;
  sourceTitle: string;
  sourceDomain: string;
  sourceDate: string;
  sourceUrl: string;
  confidenceScore: number; // 0 - 100
  confidence?: number; // 0.0 - 1.0
  type?: ItemType;
  exactQuote?: string;
  chunkIndex?: number;
  isVerifiedQuote?: boolean;
}

export interface GapItem {
  id: string;
  title: string;
  description: string;
  category: 'eligibility' | 'renewal' | 'document' | 'deadline' | 'financial' | 'procedure';
  severity: 'high' | 'medium' | 'low';
  sourcesConsulted: string[]; // Source IDs or domain names
  isAiSuggestion: boolean;
  type?: ItemType;
  confidence?: number; // 0.0 - 1.0
  whyItMatters: string;
  suggestedQuestionToAsk: string;
  missingAttributeId?: string;
}

export interface ConflictQuote {
  sourceId: string;
  sourceTitle: string;
  quote: string;
  date: string;
  url: string;
  chunkIndex?: number;
  isVerified?: boolean;
}

export interface ConflictItem {
  id: string;
  topic: string;
  summary: string;
  severity: 'high' | 'medium' | 'low';
  type?: ItemType;
  confidence?: number; // 0.0 - 1.0
  sourceA: ConflictQuote;
  sourceB: ConflictQuote;
  resolutionTip: string;
  isAiSuggestion?: boolean;
  attributeClashed?: string;
}

export interface OutdatedItem {
  id: string;
  title: string;
  warningText: string;
  observedDate: string;
  currentCycle: string;
  sourceId: string;
  sourceTitle: string;
  url: string;
  riskLevel: 'high' | 'medium' | 'low';
  stalenessMonths: number;
  type?: ItemType;
  confidence?: number;
}

export interface ChecklistItem {
  id: string;
  priority: PriorityLevel;
  title: string;
  reason: string;
  actionType: 'call_helpdesk' | 'verify_portal' | 'request_document' | 'cross_check_guideline';
  suggestedAction: string;
  whereToVerify?: string; // e.g., "Official State Directorate Helpdesk", "College Nodal Officer"
  sourceRef?: string;
  sourceId?: string;
  linkedGapOrConflictId?: string;
  completed: boolean;
  deadline?: string;
  type?: ItemType;
}

export interface AnalysisSummary {
  id: string;
  title: string;
  query: string;
  targetGoal: string;
  category: DomainCategory;
  sourcesCount: number;
  gapsCount: number;
  conflictsCount: number;
  outdatedCount: number;
  factsCount: number;
  confidenceScore: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
  status: 'completed' | 'processing' | 'failed';
  readinessScore?: number;
  provider?: string;
  providerTag?: 'gemini' | 'openrouter' | 'offline_sample';
}

export interface AnalysisReport extends AnalysisSummary {
  sources: Source[];
  gaps: GapItem[];
  conflicts: ConflictItem[];
  outdated: OutdatedItem[];
  facts: FactItem[];
  checklist: ChecklistItem[];
  expectedAttributes?: ExpectedAttributeCheck[];
  decisionReadiness?: DecisionReadiness;
  unansweredQuestions?: string[];
}

export type AnalysisStage =
  | 'idle'
  | 'fetching'
  | 'chunking'
  | 'analyzing'
  | 'verifying'
  | 'synthesizing'
  | 'complete'
  | 'error';

export interface AnalysisProgress {
  stage: AnalysisStage;
  message: string;
  progressPercent: number;
}
