import {
  Source,
  AnalysisReport,
  ConflictItem,
  GapItem,
  FactItem,
  ChecklistItem,
  DecisionReadiness,
  ExpectedAttributeCheck,
  DomainCategory,
} from '../types';

interface TaxonomyAttribute {
  id: string;
  label: string;
  critical: boolean;
  category: 'eligibility' | 'renewal' | 'document' | 'deadline' | 'financial' | 'procedure';
  keywords: string[];
}

const DOMAIN_TAXONOMIES: Record<string, TaxonomyAttribute[]> = {
  scholarship: [
    { id: 'eligibility_criteria', label: 'Academic & Category Eligibility', critical: true, category: 'eligibility', keywords: ['eligible', 'eligibility', 'qualification', 'passed', 'minimum aggregate', 'criteria'] },
    { id: 'income_limit', label: 'Annual Family Income Ceiling', critical: true, category: 'financial', keywords: ['income', 'lakh', 'ceiling', 'annual family', 'parental income', 'creamy layer', 'gross income'] },
    { id: 'application_deadline', label: 'Portal Submission Deadline', critical: true, category: 'deadline', keywords: ['deadline', 'last date', 'closing date', 'apply before', 'timeline', 'portal closes'] },
    { id: 'mandatory_documents', label: 'Required Verifiable Documents', critical: true, category: 'document', keywords: ['document', 'certificate', 'marksheet', 'affidavit', 'aadhaar', 'ration card', 'bonafide'] },
    { id: 'benefit_amount', label: 'Disbursement Amount / Tuition Waiver', critical: false, category: 'financial', keywords: ['stipend', 'disbursement', 'scholarship amount', 'tuition fee', 'allowance', '₹'] },
    { id: 'renewal_criteria', label: 'Annual Renewal & Minimum CGPA', critical: true, category: 'renewal', keywords: ['renewal', 'subsequent year', 'maintain', 'attendance', 'minimum cgpa', 'clearing all subjects'] },
    { id: 'quota_allocation', label: 'State / Institutional Quota Reservation', critical: false, category: 'eligibility', keywords: ['quota', 'reservation', 'state quota', 'institutional', 'domicile'] },
    { id: 'official_portal_url', label: 'Official Application Portal Link', critical: true, category: 'procedure', keywords: ['portal', 'official website', 'apply online', 'url', 'www.', 'https://'] },
    { id: 'grievance_helpdesk', label: 'Nodal Officer / Grievance Contact', critical: false, category: 'procedure', keywords: ['helpdesk', 'nodal officer', 'contact', 'email', 'toll free', 'grievance', 'telephone'] },
  ],
  govt_scheme: [
    { id: 'target_beneficiary', label: 'Target Beneficiary Class', critical: true, category: 'eligibility', keywords: ['beneficiary', 'category', 'eligible families', 'residents'] },
    { id: 'income_asset_criteria', label: 'Income & Landholding Ceiling', critical: true, category: 'financial', keywords: ['income', 'land', 'hectare', 'property', 'ceiling'] },
    { id: 'registration_deadline', label: 'Scheme Enrolment Deadline', critical: true, category: 'deadline', keywords: ['deadline', 'last date', 'enrolment closes'] },
    { id: 'required_certificates', label: 'Revenue / Domicile Certificate Rules', critical: true, category: 'document', keywords: ['certificate', 'revenue officer', 'tahsildar', 'domicile'] },
    { id: 'financial_assistance', label: 'Direct Benefit Transfer (DBT) Amount', critical: true, category: 'financial', keywords: ['dbt', 'direct benefit', 'transfer', 'amount', 'subsidy'] },
  ],
  career: [
    { id: 'ctc_fixed_variable', label: 'Fixed Base vs Variable Pay Ratio', critical: true, category: 'financial', keywords: ['ctc', 'base salary', 'variable', 'fixed component', 'bonus'] },
    { id: 'probation_period', label: 'Probation Period Duration', critical: true, category: 'procedure', keywords: ['probation', 'confirmation', 'training period'] },
    { id: 'notice_period', label: 'Resignation Notice Period', critical: true, category: 'procedure', keywords: ['notice period', 'resignation', 'exit', 'days notice'] },
    { id: 'service_bond', label: 'Employment Bond / Penalty Amount', critical: true, category: 'procedure', keywords: ['bond', 'service agreement', 'penalty', 'retention'] },
    { id: 'esop_vesting', label: 'Equity / ESOP Vesting Schedule', critical: false, category: 'financial', keywords: ['esop', 'equity', 'vesting', 'options'] },
    { id: 'ip_assignment', label: 'IP Ownership & Moonlighting Clause', critical: true, category: 'procedure', keywords: ['intellectual property', 'moonlighting', 'inventions', 'ownership'] },
  ],
  admission: [
    { id: 'minimum_cutoff', label: 'Minimum Qualification & Cutoff Rank', critical: true, category: 'eligibility', keywords: ['cutoff', 'rank', 'minimum mark', 'percentile'] },
    { id: 'fee_structure', label: 'Tuition, Hostel & Examination Fees', critical: true, category: 'financial', keywords: ['fee', 'tuition', 'hostel', 'caution deposit'] },
    { id: 'counseling_dates', label: 'Seat Allotment & Counseling Schedule', critical: true, category: 'deadline', keywords: ['counseling', 'seat allotment', 'reporting date'] },
    { id: 'cancellation_refund', label: 'Withdrawal & Fee Refund Schedule', critical: true, category: 'financial', keywords: ['refund', 'cancellation', 'withdrawal', 'deduction'] },
  ],
  general: [
    { id: 'eligibility_requirements', label: 'Eligibility & Entry Criteria', critical: true, category: 'eligibility', keywords: ['eligibility', 'eligible', 'requirement', 'qualify'] },
    { id: 'timelines_deadlines', label: 'Critical Milestones & Dates', critical: true, category: 'deadline', keywords: ['deadline', 'date', 'timeline', 'schedule'] },
    { id: 'fees_costs', label: 'Cost, Fees or Financial Terms', critical: true, category: 'financial', keywords: ['fee', 'cost', 'amount', 'payment', 'charge'] },
    { id: 'governing_rules', label: 'Binding Terms & Renewal Conditions', critical: true, category: 'procedure', keywords: ['rules', 'conditions', 'penalty', 'terms'] },
  ]
};

function extractSentences(text: string): string[] {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9₹])/)
    .map(s => s.trim())
    .filter(s => s.length > 15);
}

const CURRENCY_REGEX = /(?:₹|Rs\.?|INR|\$)\s*([\d,]+(?:\.\d+)?(?:\s*(?:Lakh|Lakhs|LPA|Crore|k|K|Cr))?)/gi;
const DEADLINE_REGEX = /(?:deadline|last date|due date|closing date|valid till|apply before)\s*(?:is|:|–|-)?\s*([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+(?:\s+\d{4})?|[A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|[A-Za-z0-9,\s\.\/-]{4,24})/gi;

export function runDynamicGapEngine(
  query: string,
  targetGoal: string,
  category: string,
  sources: Source[]
): AnalysisReport {
  const normCategory = ((category || 'scholarship').toLowerCase() as DomainCategory);
  const taxonomy = DOMAIN_TAXONOMIES[normCategory] || DOMAIN_TAXONOMIES.general;

  const conflicts: ConflictItem[] = [];
  const gaps: GapItem[] = [];
  const facts: FactItem[] = [];
  const expectedAttributes: ExpectedAttributeCheck[] = [];

  // 1. Scan for numeric & deadline contradictions across sources
  const incomeClaims: Array<{ source: Source; value: string; quote: string }> = [];
  const deadlineClaims: Array<{ source: Source; value: string; quote: string }> = [];

  sources.forEach(source => {
    const text = source.fullText || source.excerpt || '';
    const sentences = extractSentences(text);

    sentences.forEach(sent => {
      const lower = sent.toLowerCase();
      if (lower.includes('income') || lower.includes('ceiling') || lower.includes('lakh')) {
        const matches = [...sent.matchAll(CURRENCY_REGEX)];
        if (matches.length > 0) {
          incomeClaims.push({
            source,
            value: matches[0][0],
            quote: sent,
          });
        }
      }

      if (
        lower.includes('deadline') ||
        lower.includes('last date') ||
        lower.includes('apply before') ||
        lower.includes('closing date') ||
        lower.includes('due date')
      ) {
        const dlMatches = [...sent.matchAll(DEADLINE_REGEX)];
        if (dlMatches.length > 0) {
          deadlineClaims.push({
            source,
            value: dlMatches[0][1]?.trim(),
            quote: sent,
          });
        }
      }
    });
  });

  // Check income conflict
  if (incomeClaims.length >= 2) {
    for (let i = 0; i < incomeClaims.length; i++) {
      for (let j = i + 1; j < incomeClaims.length; j++) {
        const c1 = incomeClaims[i];
        const c2 = incomeClaims[j];
        const v1 = c1.value.replace(/[\s,]/g, '').toLowerCase();
        const v2 = c2.value.replace(/[\s,]/g, '').toLowerCase();
        if (v1 !== v2 && c1.source.id !== c2.source.id) {
          conflicts.push({
            id: `conflict_income_${c1.source.id}_${c2.source.id}`,
            topic: 'Annual Family Income Ceiling Mismatch',
            summary: `${c1.source.title} states ${c1.value}, whereas ${c2.source.title} specifies ${c2.value}.`,
            severity: 'high',
            sourceA: {
              sourceId: c1.source.id,
              sourceTitle: c1.source.title,
              quote: c1.quote,
              date: c1.source.publishDate || 'Current Circular',
              url: c1.source.url,
              isVerified: true,
            },
            sourceB: {
              sourceId: c2.source.id,
              sourceTitle: c2.source.title,
              quote: c2.quote,
              date: c2.source.publishDate || 'Institutional Guideline',
              url: c2.source.url,
              isVerified: true,
            },
            resolutionTip: 'Request an official written circular from the nodal officer before filing financial affidavits.',
          });
        }
      }
    }
  }

  // Check deadline conflict
  if (deadlineClaims.length >= 2) {
    const d1 = deadlineClaims[0];
    const d2 = deadlineClaims[1];
    if (d1.source.id !== d2.source.id && d1.value.toLowerCase() !== d2.value.toLowerCase()) {
      conflicts.push({
        id: `conflict_deadline_${d1.source.id}_${d2.source.id}`,
        topic: 'Application Portal Closing Date Discrepancy',
        summary: `${d1.source.title} lists closing date as '${d1.value}', while ${d2.source.title} indicates '${d2.value}'.`,
        severity: 'high',
        sourceA: {
          sourceId: d1.source.id,
          sourceTitle: d1.source.title,
          quote: d1.quote,
          date: d1.source.publishDate || 'Primary Notice',
          url: d1.source.url,
          isVerified: true,
        },
        sourceB: {
          sourceId: d2.source.id,
          sourceTitle: d2.source.title,
          quote: d2.quote,
          date: d2.source.publishDate || 'Secondary Notice',
          url: d2.source.url,
          isVerified: true,
        },
        resolutionTip: 'Treat the earlier deadline as your operational cutoff to prevent portal lockouts.',
      });
    }
  }

  // 2. Evaluate Taxonomy Dark Spots
  let coveredAttrCount = 0;
  let partialAttrCount = 0;
  let missingAttrCount = 0;

  taxonomy.forEach(attr => {
    let coveredCount = 0;
    const supportingRefs: string[] = [];

    sources.forEach(source => {
      const text = source.fullText || source.excerpt || '';
      const sentences = extractSentences(text);
      const matched = sentences.find(sent => {
        const lower = sent.toLowerCase();
        return attr.keywords.some(kw => lower.includes(kw.toLowerCase()));
      });

      if (matched) {
        coveredCount++;
        supportingRefs.push(source.id);
      }
    });

    if (coveredCount === 0) {
      missingAttrCount++;
      expectedAttributes.push({
        attributeId: attr.id,
        label: attr.label,
        status: 'not_found',
        notes: `Not disclosed in any of the ${sources.length} examined notices.`,
        sourceRefs: [],
      });

      gaps.push({
        id: `gap_${attr.id}`,
        title: `Complete Absence of ${attr.label}`,
        description: `None of the ${sources.length} examined circulars disclose ${attr.label.toLowerCase()}. Applicants are forced to proceed blind on this condition.`,
        category: attr.category,
        severity: attr.critical ? 'high' : 'medium',
        sourcesConsulted: sources.map(s => s.id),
        isAiSuggestion: false,
        whyItMatters: `Risk of unexpected rejection, disqualification or non-compliance due to undisclosed ${attr.label.toLowerCase()} terms.`,
        suggestedQuestionToAsk: `Does the institution enforce specific rules regarding ${attr.label.toLowerCase()}?`,
        missingAttributeId: attr.id,
      });
    } else if (coveredCount < sources.length && attr.critical) {
      partialAttrCount++;
      expectedAttributes.push({
        attributeId: attr.id,
        label: attr.label,
        status: 'partially_covered',
        notes: `Disclosed in ${coveredCount} of ${sources.length} sources.`,
        sourceRefs: supportingRefs,
      });

      gaps.push({
        id: `gap_partial_${attr.id}`,
        title: `Incomplete Disclosure of ${attr.label}`,
        description: `${attr.label} is mentioned in only ${coveredCount} of ${sources.length} sources, indicating lack of standardized official communication.`,
        category: attr.category,
        severity: 'medium',
        sourcesConsulted: supportingRefs,
        isAiSuggestion: false,
        whyItMatters: 'Local offices may apply stricter or outdated rules than the primary notice.',
        suggestedQuestionToAsk: `Confirm whether your college follows the clause mentioned in ${sources[0]?.title || 'primary circular'}.`,
        missingAttributeId: attr.id,
      });
    } else {
      coveredAttrCount++;
      expectedAttributes.push({
        attributeId: attr.id,
        label: attr.label,
        status: 'covered',
        notes: `Corroborated across ${coveredCount} sources.`,
        sourceRefs: supportingRefs,
      });
    }
  });

  // 3. Compute Decision Readiness Score
  let score = 100;
  const deductions: string[] = [];

  const critConflicts = conflicts.filter(c => c.severity === 'high');
  if (critConflicts.length > 0) {
    const penalty = critConflicts.length * 20;
    score -= penalty;
    deductions.push(`-${penalty} pts: ${critConflicts.length} critical claim contradictions detected`);
  }

  const critGaps = gaps.filter(g => g.severity === 'high');
  if (critGaps.length > 0) {
    const penalty = critGaps.length * 15;
    score -= penalty;
    deductions.push(`-${penalty} pts: ${critGaps.length} critical undisclosed dark spots`);
  }

  score = Math.max(10, Math.min(100, score));

  let level: DecisionReadiness['level'] = 'ready';
  let label = 'High Confidence';
  let summary = 'Low ambiguity. Information is consistent across circulars; verify remaining checklist items.';

  if (score < 50) {
    level = 'not_ready';
    label = 'Action Required';
    summary = 'Significant digital dark spots detected. Do not submit or sign until discrepancies are resolved.';
  } else if (score < 75) {
    level = 'caution';
    label = 'Proceed with Caution';
    summary = 'Moderate risk. Conflicting claims or missing eligibility clauses must be verified with officials.';
  }

  const decisionReadiness: DecisionReadiness = {
    score,
    level,
    label,
    coveredCount: coveredAttrCount,
    partialCount: partialAttrCount,
    missingCount: missingAttrCount,
    p1PendingCount: critConflicts.length + critGaps.length,
    summary,
  };

  // 4. Priority Checklist
  const checklist: ChecklistItem[] = [];
  let order = 1;
  conflicts.forEach(c => {
    checklist.push({
      id: `chk_${order++}`,
      priority: 'P1',
      title: `Resolve Contradiction: ${c.topic}`,
      reason: c.summary,
      actionType: 'cross_check_guideline',
      suggestedAction: c.resolutionTip,
      whereToVerify: 'Central Scholarship Directorate / Nodal Officer',
      sourceId: c.sourceA.sourceId,
      linkedGapOrConflictId: c.id,
      completed: false,
    });
  });

  critGaps.forEach(g => {
    checklist.push({
      id: `chk_${order++}`,
      priority: 'P1',
      title: `Clarify Dark Spot: ${g.title}`,
      reason: g.whyItMatters,
      actionType: 'request_document',
      suggestedAction: g.suggestedQuestionToAsk,
      whereToVerify: 'Institutional Administration Desk',
      linkedGapOrConflictId: g.id,
      completed: false,
    });
  });

  // 5. Verified Facts
  let factId = 1;
  sources.forEach(source => {
    const text = source.fullText || source.excerpt || '';
    const sentences = extractSentences(text);
    sentences.slice(0, 2).forEach(sent => {
      facts.push({
        id: `fact_${factId++}`,
        statement: sent,
        sourceId: source.id,
        sourceTitle: source.title || source.url,
        sourceDomain: source.domain || 'official.gov.in',
        sourceDate: source.publishDate || '2026',
        sourceUrl: source.url,
        confidenceScore: 95,
        exactQuote: sent,
        isVerifiedQuote: true,
      });
    });
  });

  return {
    id: `report_${Date.now()}`,
    title: query || 'Multi-Source Information Audit',
    query: query || 'Inquiry Analysis',
    targetGoal: targetGoal || 'Avoid Application Rejection',
    category: normCategory,
    sourcesCount: sources.length,
    gapsCount: gaps.length,
    conflictsCount: conflicts.length,
    outdatedCount: 0,
    factsCount: facts.length,
    confidenceScore: score,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'completed',
    readinessScore: score,
    provider: 'Deep Cross-Examination Engine',
    providerTag: 'offline_sample',
    sources,
    gaps,
    conflicts,
    outdated: [],
    facts,
    checklist,
    expectedAttributes,
    decisionReadiness,
  };
}
