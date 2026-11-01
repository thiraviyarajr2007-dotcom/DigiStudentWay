import { Source, AnalysisReport } from '../types';
import { chunkDocumentText } from '../../api/_lib/chunking';
import { calculateDecisionReadiness, DEFAULT_SCHOLARSHIP_ATTRIBUTES } from '../../api/_lib/readiness';
import { evaluateSourceCredibility } from '../../api/_lib/credibility';

export const SAMPLE_DEMO_QUERY = 'What should I verify before applying for this scholarship?';
export const SAMPLE_DEMO_GOAL = 'Ensure zero-rejection application submission and verify renewal prerequisites';

export const sampleDemoSources: Source[] = [
  {
    id: 'src-demo-nsp',
    title: 'National Scholarship Portal - PMS Scheme Guidelines 2026-27',
    url: 'https://scholarships.gov.in/guidelines/pms-2026',
    domain: 'scholarships.gov.in',
    crawledDate: '2026-10-28',
    publishDate: '2026-09-15',
    sourceType: 'official',
    isOfficial: true,
    reliabilityScore: 98,
    excerpt:
      'All applicants for PMS 2026-27 must upload family gross annual income proof via Form 16 / ITR-V assessment order for the financial year. Portal final deadline for fresh applications is 15th November 2026. Direct Benefit Transfer (DBT) is split into two equal tranches through Aadhaar-seeded accounts.',
    highlightedText:
      'Form 16 / ITR-V assessment order for the financial year. Portal final deadline for fresh applications is 15th November 2026.',
    fullText: `National Post-Matric Scholarship Scheme (PMS) Guidelines for Academic Year 2026-27.
Published by Ministry of Social Justice & Empowerment, Government of India.
Section 3.1: Eligible programs include accredited full-time undergraduate courses (B.Tech, MBBS, B.Sc, B.Com, BA).
Section 4.2 (Income Proof): All applicants for PMS 2026-27 must upload family gross annual income proof via Form 16 / ITR-V assessment order for the financial year. The current income ceiling is ₹3,50,000 per annum.
Section 5: Submission Deadlines: Portal final deadline for fresh applications is 15th November 2026.
Section 8: Direct Benefit Transfer (DBT) requires mandatory Aadhaar-seeded NPCI mapping to applicant's primary savings bank account.
Section 9: Disbursement is split into two direct benefit transfer (DBT) tranches after institutional approval.`,
    credibilitySignals: evaluateSourceCredibility('https://scholarships.gov.in/guidelines/pms-2026', '2026-09-15'),
  },
  {
    id: 'src-demo-state',
    title: 'State Higher Education Council Circular No. 44/2026',
    url: 'https://highered.state.gov.in/circulars/pms-verification-rules',
    domain: 'highered.state.gov.in',
    crawledDate: '2026-10-27',
    publishDate: '2026-08-30',
    sourceType: 'official',
    isOfficial: true,
    reliabilityScore: 95,
    excerpt:
      'Only Income Certificate issued by Revenue Authority not below the rank of Tehsildar / Sub-Divisional Magistrate will be accepted for state quota verification. Private employer salary slips or ITR are explicitly rejected. Institute level e-verification cut-off is strictly 31st October 2026.',
    highlightedText:
      'Only Income Certificate issued by Revenue Authority not below the rank of Tehsildar... strictly 31st October 2026.',
    fullText: `State Higher Education Council Directorate of Collegiate Education, Circular No. 44/2026.
Subject: Strict State Verification Norms for Post-Matric Scholarships 2026-27.
Clause 2: Only Income Certificate issued by Revenue Authority not below the rank of Tehsildar / Sub-Divisional Magistrate will be accepted for state quota verification. Private employer salary slips or ITR are explicitly rejected.
Clause 4: Institutional Desk Review: Institute level e-verification cut-off is strictly 31st October 2026. Applications not submitted by 28th October cannot be verified in time by the college nodal officer.
Clause 7: Tuition fee reimbursement up to ₹50,000 per annum will be disbursed directly to college treasury accounts.`,
    credibilitySignals: evaluateSourceCredibility('https://highered.state.gov.in/circulars/pms-verification-rules', '2026-08-30'),
  },
  {
    id: 'src-demo-advisory',
    title: 'National Student Advisory Portal - PMS Eligibility Matrix',
    url: 'https://studentguide-edu.org/pms-scholarship-overview',
    domain: 'studentguide-edu.org',
    crawledDate: '2026-10-29',
    publishDate: '2023-09-12',
    sourceType: 'educational_portal',
    isOfficial: false,
    reliabilityScore: 62,
    excerpt:
      'The Post-Matric Merit Scheme maximum family income ceiling is capped at ₹2,50,000 per annum. Students must have secured at least 50% in Class 12 board examinations to qualify.',
    highlightedText:
      'family income ceiling is capped at ₹2,50,000 per annum (Outdated 2023 notification)',
    fullText: `StudentGuide Education Advisory: Everything you need to know about Post-Matric Scholarships.
Last revised: September 12, 2023.
Eligibility: The Post-Matric Merit Scheme maximum family income ceiling is capped at ₹2,50,000 per annum. Students must have secured at least 50% in Class 12 board examinations to qualify.
Note: Contact local cyber cafes for online application assistance.`,
    credibilitySignals: evaluateSourceCredibility('https://studentguide-edu.org/pms-scholarship-overview', '2023-09-12'),
  },
  {
    id: 'src-demo-forum',
    title: 'CollegeBuddies Community Q&A - PMS 2026 Discussion',
    url: 'https://collegebuddies-forum.in/threads/pms-renewal-rules-hostel-fees',
    domain: 'collegebuddies-forum.in',
    crawledDate: '2026-10-30',
    sourceType: 'forum',
    isOfficial: false,
    reliabilityScore: 48,
    excerpt:
      'Senior students mention that they received hostel allowance separately after submitting mess bills to the college clerk, and claimed you can also keep your state merit freeship active simultaneously.',
    highlightedText:
      'received hostel allowance separately after submitting mess bills... keep state merit freeship active',
    fullText: `Thread #88219: Post-Matric Scheme Renewal and Private Hostels.
Posted by user @tech_scholar:
Senior students mention that they received hostel allowance separately after submitting mess bills to the college clerk, and claimed you can also keep your state merit freeship active simultaneously.
However, nobody knows whether you need 60% or 75% attendance to get the second year renewal. Neither the website nor the brochure states any CGPA number!`,
    credibilitySignals: evaluateSourceCredibility('https://collegebuddies-forum.in/threads/pms-renewal-rules-hostel-fees', undefined),
  },
];

// Add chunks to all sample sources
sampleDemoSources.forEach(s => {
  s.chunks = chunkDocumentText(s.fullText || s.excerpt, { targetChunkSize: 750, overlap: 100 });
});

/**
 * Builds the realistic offline demo analysis report immediately for judges without requiring internet access.
 */
export function buildSampleDemoReport(): AnalysisReport {
  const expectedAttributes = [
    {
      attributeId: 'eligibility',
      label: 'Eligible Academic Courses & Grades',
      status: 'covered' as const,
      notes: 'Undergraduate accredited degree courses qualify (stated in Central Guidelines).',
      sourceRefs: ['scholarships.gov.in'],
    },
    {
      attributeId: 'income_ceiling',
      label: 'Family Income Ceiling & Formats',
      status: 'partially_covered' as const,
      notes: 'Contradiction between Central ITR-V vs State Tehsildar Certificate; stale ₹2.5L vs ₹3.5L.',
      sourceRefs: ['scholarships.gov.in', 'highered.state.gov.in', 'studentguide-edu.org'],
    },
    {
      attributeId: 'deadline',
      label: 'Application & Institutional Verification Deadlines',
      status: 'partially_covered' as const,
      notes: 'Portal deadline Nov 15 contradicts college cut-off Oct 31.',
      sourceRefs: ['scholarships.gov.in', 'highered.state.gov.in'],
    },
    {
      attributeId: 'documents',
      label: 'Required Certificates (Revenue, Caste, Bank)',
      status: 'covered' as const,
      notes: 'Income, Aadhaar-NPCI bank linking, and college verification forms specified.',
      sourceRefs: ['scholarships.gov.in', 'highered.state.gov.in'],
    },
    {
      attributeId: 'renewal',
      label: 'Subsequent Year Renewal Benchmarks & CGPA',
      status: 'not_found' as const,
      notes: 'DIGITAL DARK SPOT: None of the reviewed documents state the required minimum CGPA or attendance percentage to renew in Year 2!',
      sourceRefs: [],
    },
    {
      attributeId: 'portal_link',
      label: 'Official Portal URL & Submission Method',
      status: 'covered' as const,
      notes: 'https://scholarships.gov.in/guidelines/pms-2026',
      sourceRefs: ['scholarships.gov.in'],
    },
    {
      attributeId: 'disbursement',
      label: 'DBT Bank Account & Tranche Timeline',
      status: 'partially_covered' as const,
      notes: 'States 2 tranches, but calendar release dates are not specified.',
      sourceRefs: ['scholarships.gov.in'],
    },
    {
      attributeId: 'helpdesk',
      label: 'Official Nodal Officer Helpline & Redressal',
      status: 'partially_covered' as const,
      notes: 'College desk mentioned, but no toll-free telephone or officer email given.',
      sourceRefs: ['highered.state.gov.in'],
    },
  ];

  const checklist = [
    {
      id: 'chk-1',
      priority: 'P1' as const,
      title: 'Obtain Revenue Tehsildar Income Certificate (Do not rely solely on ITR-V)',
      reason: 'State Nodal verification strictly rejects ITR-V and requires Tehsildar / SDM revenue stamp.',
      actionType: 'request_document' as const,
      suggestedAction: 'Visit local e-Seva / Taluk office or apply online for Current Financial Year Revenue Income Certificate.',
      whereToVerify: 'District Revenue Office / Taluk e-Seva Center',
      sourceRef: 'State Higher Education Council Circular No. 44/2026',
      completed: false,
      deadline: 'Oct 25, 2026',
      type: 'sourced' as const,
    },
    {
      id: 'chk-2',
      priority: 'P1' as const,
      title: 'Submit Application to College Desk by October 28 (Ahead of Oct 31 Verification Cut-off)',
      reason: 'Even though portal is open until Nov 15, institute-level verification closes Oct 31.',
      actionType: 'verify_portal' as const,
      suggestedAction: 'Submit hard copies to college scholarship nodal desk 3 days ahead of October 31 cut-off.',
      whereToVerify: 'College Financial Aid / Scholarship Desk',
      sourceRef: 'Circular No. 44/2026 & Portal PMS Notice',
      completed: false,
      deadline: 'Oct 28, 2026',
      type: 'sourced' as const,
    },
    {
      id: 'chk-3',
      priority: 'P2' as const,
      title: 'Ask College Academic Dean for written minimum renewal GPA & attendance rule',
      reason: 'Renewal rules are completely missing from both state and central guidelines.',
      actionType: 'call_helpdesk' as const,
      suggestedAction: 'Send email to college nodal officer: "What is the minimum CGPA/attendance required to maintain PMS eligibility into Year 2?"',
      whereToVerify: 'Academic Registrar & Nodal Officer',
      sourceRef: 'Identified Information Dark Spot (Gap #1)',
      completed: false,
      type: 'sourced' as const,
    },
    {
      id: 'chk-4',
      priority: 'P2' as const,
      title: 'Verify Aadhaar-NPCI Bank Account Linking Status on UIDAI Portal',
      reason: 'DBT payments will automatically fail if the bank account is unlinked or inactive.',
      actionType: 'verify_portal' as const,
      suggestedAction: 'Log in to resident.uidai.gov.in/bank-mapper to confirm active NPCI mapping.',
      whereToVerify: 'UIDAI Resident Portal & Bank Branch',
      sourceRef: 'National Scholarship Portal PMS 2026-27',
      completed: true,
      type: 'sourced' as const,
    },
    {
      id: 'chk-5',
      priority: 'P3' as const,
      title: 'Verify Private PG vs Campus Hostel mess receipt eligibility',
      reason: 'Hostel allowance criteria is vague and student forums provide conflicting advice.',
      actionType: 'cross_check_guideline' as const,
      suggestedAction: 'Request standard format for hostel maintenance reimbursement from university finance section.',
      whereToVerify: 'University Hostel Warden / Finance Section',
      sourceRef: 'Identified AI Suggestion (Gap #3)',
      completed: false,
      type: 'ai_suggestion' as const,
    },
  ];

  const conflicts = [
    {
      id: 'conf-1',
      topic: 'Required Income Proof: ITR-V vs Tehsildar Certificate',
      summary: 'The central national portal accepts Income Tax Return (ITR-V/Form 16), whereas the state higher education circular explicitly rejects ITR and mandates a Tehsildar-issued certificate.',
      severity: 'high' as const,
      type: 'sourced' as const,
      confidence: 0.98,
      sourceA: {
        sourceId: 'src-demo-nsp',
        sourceTitle: 'National Scholarship Portal PMS 2026-27',
        quote: 'All applicants for PMS 2026-27 must upload family gross annual income proof via Form 16 / ITR-V assessment order for the financial year.',
        date: 'Sep 15, 2026',
        url: 'https://scholarships.gov.in/guidelines/pms-2026',
        isVerified: true,
      },
      sourceB: {
        sourceId: 'src-demo-state',
        sourceTitle: 'State Higher Education Council Circular 44/2026',
        quote: 'Only Income Certificate issued by Revenue Authority not below the rank of Tehsildar / Sub-Divisional Magistrate will be accepted for state quota verification. Private employer salary slips or ITR are explicitly rejected.',
        date: 'Aug 30, 2026',
        url: 'https://highered.state.gov.in/circulars/pms-verification-rules',
        isVerified: true,
      },
      resolutionTip: 'State Nodal Officer verification takes precedence during state quota allocation. Obtain the Tehsildar Revenue Certificate immediately to satisfy both criteria safely.',
      isAiSuggestion: false,
    },
    {
      id: 'conf-2',
      topic: 'Application Deadline vs College Verification Cut-Off',
      summary: 'The central portal states applications are open until November 15, but state colleges stop forwarding verifications on October 31.',
      severity: 'high' as const,
      type: 'sourced' as const,
      confidence: 0.95,
      sourceA: {
        sourceId: 'src-demo-nsp',
        sourceTitle: 'National Scholarship Portal PMS 2026-27',
        quote: 'Portal final deadline for fresh applications is 15th November 2026.',
        date: 'Sep 15, 2026',
        url: 'https://scholarships.gov.in/guidelines/pms-2026',
        isVerified: true,
      },
      sourceB: {
        sourceId: 'src-demo-state',
        sourceTitle: 'State Higher Education Council Circular 44/2026',
        quote: 'Institute level e-verification cut-off is strictly 31st October 2026.',
        date: 'Aug 30, 2026',
        url: 'https://highered.state.gov.in/circulars/pms-verification-rules',
        isVerified: true,
      },
      resolutionTip: 'Do not wait for the national portal deadline. Colleges require 3-5 business days for physical desk review before e-verification.',
      isAiSuggestion: false,
    },
  ];

  const gaps = [
    {
      id: 'gap-1',
      title: 'Renewal Academic CGPA / Attendance Threshold Completely Missing',
      description: 'None of the 4 authoritative or secondary sources define the required academic benchmark (minimum CGPA or 75% attendance) to renew the scholarship in 2nd, 3rd, and 4th years.',
      category: 'renewal' as const,
      severity: 'high' as const,
      sourcesConsulted: ['scholarships.gov.in', 'highered.state.gov.in'],
      isAiSuggestion: false,
      type: 'sourced' as const,
      confidence: 0.96,
      whyItMatters: 'If you fall below an unstated GPA threshold, subsequent disbursements could be silently paused without right to appeal.',
      suggestedQuestionToAsk: 'What exact minimum grade / attendance percentage is mandatory for Year 2 renewal sanctioning?',
      missingAttributeId: 'renewal',
    },
    {
      id: 'gap-2',
      title: 'Disbursement Schedule & DBT Tranche Release Timeline Unspecified',
      description: 'While the portal states financial support is issued in 2 tranches, zero calendar dates or verification milestones are provided for when universities must clear lists.',
      category: 'financial' as const,
      severity: 'medium' as const,
      sourcesConsulted: ['scholarships.gov.in'],
      isAiSuggestion: false,
      type: 'sourced' as const,
      confidence: 0.88,
      whyItMatters: 'Tuition deadlines at colleges typically fall in August and January; late disbursement might force unexpected personal out-of-pocket payment.',
      suggestedQuestionToAsk: 'On which specific calendar dates are Tranche 1 and Tranche 2 released into student bank accounts?',
      missingAttributeId: 'disbursement',
    },
    {
      id: 'gap-3',
      title: 'Hostel Allowance Breakdown vs Day Scholar Maintenance Difference',
      description: 'Guidelines mention a maintenance grant up to ₹12,000 per year, but do not state whether accredited private PG accommodations qualify or only university-owned halls.',
      category: 'eligibility' as const,
      severity: 'low' as const,
      sourcesConsulted: ['scholarships.gov.in', 'highered.state.gov.in', 'collegebuddies-forum.in'],
      isAiSuggestion: true,
      type: 'ai_suggestion' as const,
      confidence: 0.82,
      whyItMatters: 'Submitting rented PG receipts instead of government hostel warden endorsements could lead to partial claim rejection.',
      suggestedQuestionToAsk: 'Does the maintenance grant cover non-campus private hostels and what authorized signature is required on mess vouchers?',
    },
  ];

  const outdated = [
    {
      id: 'out-1',
      title: 'Family Income Ceiling Stated as ₹2.5 Lakh (2023 Cycle Rules)',
      warningText: 'Student advisory guide quotes the old ₹2.5 Lakh income ceiling from September 2023. The official 2026 gazette raised this threshold to ₹3.5 Lakh, meaning eligible students might self-disqualify by mistake.',
      observedDate: '2023-09-12',
      currentCycle: '2026-27 (Active Threshold ₹3,50,000)',
      sourceId: 'src-demo-advisory',
      sourceTitle: 'studentguide-edu.org',
      url: 'https://studentguide-edu.org/pms-scholarship-overview',
      riskLevel: 'high' as const,
      stalenessMonths: 37,
      type: 'sourced' as const,
      confidence: 0.95,
    },
    {
      id: 'out-2',
      title: 'Undated Forum Post Claiming Simultaneous Dual-Scheme Freeship',
      warningText: 'Forum thread claims candidates can claim state merit freeship while simultaneously drawing central scholarship DBT funds. This breaches 2025 "One-Student-One-Scholarship" DBT de-duplication rules.',
      observedDate: 'Undated (Archived 2025)',
      currentCycle: 'Strict 2026 Anti-Duplication Rule',
      sourceId: 'src-demo-forum',
      sourceTitle: 'collegebuddies-forum.in',
      url: 'https://collegebuddies-forum.in/threads/pms-renewal-rules-hostel-fees',
      riskLevel: 'medium' as const,
      stalenessMonths: 12,
      type: 'sourced' as const,
      confidence: 0.85,
    },
  ];

  const facts = [
    {
      id: 'fact-1',
      statement: 'Accredited full-time undergraduate degrees (B.Tech, MBBS, B.Sc, B.Com, BA) at UGC-approved institutes qualify for PMS assistance.',
      sourceId: 'src-demo-nsp',
      sourceTitle: 'National Scholarship Portal PMS 2026-27',
      sourceDomain: 'scholarships.gov.in',
      sourceDate: '2026-09-15',
      sourceUrl: 'https://scholarships.gov.in/guidelines/pms-2026',
      confidenceScore: 99,
      type: 'sourced' as const,
      exactQuote: 'Eligible programs include accredited full-time undergraduate courses (B.Tech, MBBS, B.Sc, B.Com, BA).',
      chunkIndex: 0,
      isVerifiedQuote: true,
    },
    {
      id: 'fact-2',
      statement: 'Direct Benefit Transfer (DBT) requires mandatory Aadhaar-seeded NPCI mapping to applicant\'s active savings bank account.',
      sourceId: 'src-demo-nsp',
      sourceTitle: 'National Scholarship Portal PMS 2026-27',
      sourceDomain: 'scholarships.gov.in',
      sourceDate: '2026-09-15',
      sourceUrl: 'https://scholarships.gov.in/guidelines/pms-2026',
      confidenceScore: 98,
      type: 'sourced' as const,
      exactQuote: 'Direct Benefit Transfer (DBT) requires mandatory Aadhaar-seeded NPCI mapping to applicant\'s primary savings bank account.',
      chunkIndex: 0,
      isVerifiedQuote: true,
    },
    {
      id: 'fact-3',
      statement: 'Full tuition fee reimbursement up to ₹50,000 per academic year is remitted directly to registered institution treasury.',
      sourceId: 'src-demo-state',
      sourceTitle: 'State Higher Education Council Circular 44/2026',
      sourceDomain: 'highered.state.gov.in',
      sourceDate: '2026-08-30',
      sourceUrl: 'https://highered.state.gov.in/circulars/pms-verification-rules',
      confidenceScore: 95,
      type: 'sourced' as const,
      exactQuote: 'Tuition fee reimbursement up to ₹50,000 per annum will be disbursed directly to college treasury accounts.',
      chunkIndex: 0,
      isVerifiedQuote: true,
    },
  ];

  const decisionReadiness = calculateDecisionReadiness(expectedAttributes, checklist, conflicts);

  return {
    id: 'rep-demo-scholarship-pms-2026',
    title: 'National Post-Matric Merit Scholarship (PMS 2026-27)',
    query: SAMPLE_DEMO_QUERY,
    targetGoal: SAMPLE_DEMO_GOAL,
    category: 'scholarship',
    sourcesCount: sampleDemoSources.length,
    gapsCount: gaps.length,
    conflictsCount: conflicts.length,
    outdatedCount: outdated.length,
    factsCount: facts.length,
    confidenceScore: decisionReadiness.score,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'completed',
    sources: sampleDemoSources,
    gaps,
    conflicts,
    outdated,
    facts,
    checklist,
    expectedAttributes,
    decisionReadiness,
  };
}

export const SAMPLE_CAREER_QUERY =
  'What should I verify before accepting this Senior Software Engineer job offer regarding IP assignment, notice periods, and relocation clawbacks?';
export const SAMPLE_CAREER_GOAL =
  'Protect side-project intellectual property and ensure transparent termination & clawback terms';

export const sampleCareerSources: Source[] = [
  {
    id: 'src-career-offer',
    title: 'Acme Cloud Systems - Employment Offer Letter & Term Sheet',
    url: 'https://careers.acmecloud.internal/offers/senior-eng-2026',
    domain: 'acmecloud.com',
    crawledDate: '2026-10-25',
    publishDate: '2026-10-15',
    sourceType: 'official',
    isOfficial: true,
    reliabilityScore: 99,
    excerpt:
      'Base salary of $165,000 per annum with a 15% target performance bonus. Notice period during the initial 6-month probationary review period is 30 days written notice by either party. A relocation allowance of $5,000 is provided subject to a 24-month retention commitment.',
    highlightedText:
      'probationary review period is 30 days written notice... relocation allowance of $5,000 is provided subject to a 24-month retention commitment',
    fullText: `Acme Cloud Systems Inc. Employment Offer Letter.
Date: October 15, 2026.
Candidate: Senior Full-Stack Engineer.
Compensation: Base salary of $165,000 per annum, paid semi-monthly, plus 15% annual target performance incentive.
Probation & Notice: Notice period during the initial 6-month probationary review period is 30 days written notice by either party.
Relocation: A relocation allowance of $5,000 is provided subject to a 24-month retention commitment. If you voluntarily leave within 24 months, 100% of the allowance must be repaid.
Benefits: Group health, dental, and vision insurance commencing on the first day of the calendar month following employment.`,
    credibilitySignals: evaluateSourceCredibility('https://acmecloud.com/careers/offer', '2026-10-15'),
  },
  {
    id: 'src-career-handbook',
    title: 'Acme Global Employee Handbook & IP Policy (v4.2)',
    url: 'https://intranet.acmecloud.internal/handbook/ip-and-conduct',
    domain: 'acmecloud.internal',
    crawledDate: '2026-10-25',
    publishDate: '2026-08-01',
    sourceType: 'official',
    isOfficial: true,
    reliabilityScore: 96,
    excerpt:
      'All employees, regardless of tenure, must provide a minimum of 90 days written notice prior to departure, subject to mandatory garden leave. All intellectual property, software code, and patentable ideas conceived during employment belong solely to the company unless registered on Schedule A prior to joining.',
    highlightedText:
      'minimum of 90 days written notice prior to departure... All intellectual property, software code, and patentable ideas conceived during employment belong solely to the company',
    fullText: `Acme Global Corporate Handbook & Policies.
Section 9 (Resignation & Notice): All employees, regardless of tenure, must provide a minimum of 90 days written notice prior to departure, subject to mandatory garden leave. Failure to provide 90 days notice may result in forfeiture of accrued paid time off.
Section 14 (Proprietary Information & Inventions Agreement): All intellectual property, software code, and patentable ideas conceived during employment belong solely to the company unless registered on Schedule A prior to joining.
Section 16 (Non-Solicitation): For a period of 12 months post-employment, departing employees may not solicit company personnel or enterprise clients.`,
    credibilitySignals: evaluateSourceCredibility('https://acmecloud.internal/handbook', '2026-08-01'),
  },
  {
    id: 'src-career-wiki',
    title: 'Acme Operations Wiki - Relocation & Stipend FAQ (Archived)',
    url: 'https://wiki.acmecloud.internal/hr/relocation-faq',
    domain: 'acmecloud.internal',
    crawledDate: '2026-10-26',
    publishDate: '2022-04-10',
    sourceType: 'educational_portal',
    isOfficial: false,
    reliabilityScore: 55,
    excerpt:
      'Relocation expenses up to $3,000 will be reimbursed directly upon submitting travel receipts. No repayment obligation or clawback is enforced for voluntary departures.',
    highlightedText:
      'up to $3,000 will be reimbursed... No repayment obligation or clawback is enforced (Outdated 2022 Wiki)',
    fullText: `Acme Talent Operations Knowledgebase.
Last modified: April 10, 2022.
Relocation expenses up to $3,000 will be reimbursed directly upon submitting travel receipts. No repayment obligation or clawback is enforced for voluntary departures after 90 days of joining.`,
    credibilitySignals: evaluateSourceCredibility('https://wiki.acmecloud.internal/hr/relocation-faq', '2022-04-10'),
  },
];

sampleCareerSources.forEach(s => {
  s.chunks = chunkDocumentText(s.fullText || s.excerpt, { targetChunkSize: 750, overlap: 100 });
});

export function buildCareerSampleDemoReport(): AnalysisReport {
  const expectedAttributes = [
    {
      attributeId: 'compensation_breakdown',
      label: 'Base Salary, Bonus & Benefits Effective Date',
      status: 'covered' as const,
      notes: '$165,000 base + 15% target bonus confirmed in offer letter.',
      sourceRefs: ['acmecloud.com'],
    },
    {
      attributeId: 'notice_period',
      label: 'Resignation Notice & Probationary Period',
      status: 'partially_covered' as const,
      notes: 'DIRECT CONFLICT: Offer letter states 30 days notice during probation; handbook mandates 90 days notice for all staff.',
      sourceRefs: ['acmecloud.com', 'acmecloud.internal'],
    },
    {
      attributeId: 'ip_assignment',
      label: 'Personal Inventions & Open-Source Carve-Out',
      status: 'not_found' as const,
      notes: 'DIGITAL DARK SPOT: Neither document provides terms or exclusion procedures for pre-existing personal open-source projects created off-hours.',
      sourceRefs: [],
    },
    {
      attributeId: 'clawback_terms',
      label: 'Relocation Stipend Repayment Schedule',
      status: 'partially_covered' as const,
      notes: 'Outdated 2022 internal wiki quotes $3,000 with zero clawback; 2026 offer demands 100% repayment within 24 months.',
      sourceRefs: ['acmecloud.com', 'acmecloud.internal'],
    },
    {
      attributeId: 'non_compete_clause',
      label: 'Non-Solicitation & Post-Employment Restraints',
      status: 'covered' as const,
      notes: '12-month client & employee non-solicit clause in handbook.',
      sourceRefs: ['acmecloud.internal'],
    },
    {
      attributeId: 'workplace_policy',
      label: 'Core Working Hours & Attendance Protocols',
      status: 'partially_covered' as const,
      notes: 'Full-time employment confirmed, but in-office vs remote requirements omitted.',
      sourceRefs: ['acmecloud.com'],
    },
  ];

  const checklist = [
    {
      id: 'chk-c1',
      priority: 'P1' as const,
      title: 'Request Schedule A Carve-Out for Pre-Existing Open-Source Projects',
      reason: 'Handbook Section 14 assigns all intellectual property to company unless explicitly excluded in writing before start date.',
      actionType: 'request_document' as const,
      suggestedAction: 'Email recruiter: "Please provide Schedule A Prior Inventions list to formally carve out my personal open-source repositories."',
      whereToVerify: 'Corporate Legal / HR Talent Operations',
      sourceRef: 'Employee Handbook Section 14',
      completed: false,
      deadline: 'Prior to signing',
      type: 'sourced' as const,
    },
    {
      id: 'chk-c2',
      priority: 'P1' as const,
      title: 'Clarify 30 vs 90 Day Notice Period in Written Offer Addendum',
      reason: 'Offer letter specifies 30 days while handbook specifies 90 days with mandatory garden leave.',
      actionType: 'call_helpdesk' as const,
      suggestedAction: 'Ask HR in writing: "Please confirm that the 30-day notice period in the offer letter supersedes Section 9 of the general handbook."',
      whereToVerify: 'HR Talent Lead',
      sourceRef: 'Offer Letter Term Sheet & Handbook Sec 9',
      completed: false,
      deadline: 'Prior to signing',
      type: 'sourced' as const,
    },
    {
      id: 'chk-c3',
      priority: 'P2' as const,
      title: 'Confirm Pro-Rata Relocation Repayment Terms',
      reason: 'Offer letter specifies 100% repayment even if departing at month 23; request standard monthly proration.',
      actionType: 'cross_check_guideline' as const,
      suggestedAction: 'Request standard monthly pro-rata reduction for the $5,000 relocation allowance.',
      whereToVerify: 'HR Benefits Specialist',
      sourceRef: 'Offer Letter Relocation Clause',
      completed: false,
      type: 'sourced' as const,
    },
  ];

  const conflicts = [
    {
      id: 'conf-c1',
      topic: 'Probationary Notice Period Contradiction',
      summary:
        'The Offer Letter guarantees a 30-day notice period during the first 6 months, whereas the Employee Handbook stipulates a mandatory 90-day notice period for all staff with forced garden leave.',
      severity: 'high' as const,
      type: 'sourced' as const,
      confidence: 0.98,
      attributeClashed: 'notice_period',
      sourceA: {
        sourceId: 'src-career-offer',
        sourceTitle: 'Acme Offer Letter & Term Sheet',
        quote: 'Notice period during the initial 6-month probationary review period is 30 days written notice by either party.',
        date: '2026-10-15',
        url: 'https://careers.acmecloud.internal/offers/senior-eng-2026',
        chunkIndex: 0,
        isVerified: true,
      },
      sourceB: {
        sourceId: 'src-career-handbook',
        sourceTitle: 'Acme Global Employee Handbook (v4.2)',
        quote: 'All employees, regardless of tenure, must provide a minimum of 90 days written notice prior to departure, subject to mandatory garden leave.',
        date: '2026-08-01',
        url: 'https://intranet.acmecloud.internal/handbook/ip-and-conduct',
        chunkIndex: 0,
        isVerified: true,
      },
      resolutionTip:
        'Ensure the executed offer letter explicitly contains an integration clause stating that the offer letter terms supersede any conflicting provisions in the general company handbook.',
    },
  ];

  const gaps = [
    {
      id: 'gap-c1',
      title: 'Personal Open-Source & Off-Hours Side Projects Exemption Omitted',
      description:
        'Neither document specifies the boundaries for personal coding projects created entirely on private hardware during non-work hours, risking company copyright ownership over personal inventions.',
      category: 'eligibility' as const,
      severity: 'high' as const,
      sourcesConsulted: ['acmecloud.com', 'acmecloud.internal'],
      isAiSuggestion: false,
      type: 'sourced' as const,
      confidence: 0.96,
      whyItMatters:
        'Without a written Schedule A carve-out prior to signing, standard IP assignment agreements grant the employer ownership claims over any software created during the term of employment.',
      suggestedQuestionToAsk:
        'Does the company require formal registration of personal open-source projects on Schedule A, and is off-hours coding on personal devices exempted from IP assignment?',
      missingAttributeId: 'ip_assignment',
    },
  ];

  const outdated = [
    {
      id: 'out-c1',
      title: 'Stale Relocation Policy on Internal Operations Wiki',
      warningText:
        'An archived internal HR wiki page published in April 2022 cites a $3,000 relocation stipend without clawback obligations, whereas the active 2026 offer terms enforce a $5,000 allowance with a 24-month retention commitment.',
      observedDate: '2022-04-10',
      currentCycle: '2026-27',
      sourceId: 'src-career-wiki',
      sourceTitle: 'Acme Operations Wiki (2022 Archive)',
      url: 'https://wiki.acmecloud.internal/hr/relocation-faq',
      riskLevel: 'medium' as const,
      stalenessMonths: 54,
      type: 'sourced' as const,
      confidence: 0.94,
    },
  ];

  const facts = [
    {
      id: 'fact-c1',
      statement: 'Base salary is $165,000 per annum, paid semi-monthly, plus 15% annual target performance incentive.',
      sourceId: 'src-career-offer',
      sourceTitle: 'Acme Offer Letter & Term Sheet',
      sourceDomain: 'acmecloud.com',
      sourceDate: '2026-10-15',
      sourceUrl: 'https://careers.acmecloud.internal/offers/senior-eng-2026',
      confidenceScore: 99,
      type: 'sourced' as const,
      exactQuote: 'Compensation: Base salary of $165,000 per annum, paid semi-monthly, plus 15% annual target performance incentive.',
      chunkIndex: 0,
      isVerifiedQuote: true,
    },
    {
      id: 'fact-c2',
      statement: 'Relocation allowance is $5,000 subject to a 24-month retention commitment.',
      sourceId: 'src-career-offer',
      sourceTitle: 'Acme Offer Letter & Term Sheet',
      sourceDomain: 'acmecloud.com',
      sourceDate: '2026-10-15',
      sourceUrl: 'https://careers.acmecloud.internal/offers/senior-eng-2026',
      confidenceScore: 98,
      type: 'sourced' as const,
      exactQuote: 'Relocation: A relocation allowance of $5,000 is provided subject to a 24-month retention commitment.',
      chunkIndex: 0,
      isVerifiedQuote: true,
    },
    {
      id: 'fact-c3',
      statement: 'Departing employees are bound by a 12-month post-employment client and talent non-solicitation restriction.',
      sourceId: 'src-career-handbook',
      sourceTitle: 'Acme Employee Handbook',
      sourceDomain: 'acmecloud.internal',
      sourceDate: '2026-08-01',
      sourceUrl: 'https://intranet.acmecloud.internal/handbook/ip-and-conduct',
      confidenceScore: 95,
      type: 'sourced' as const,
      exactQuote: 'For a period of 12 months post-employment, departing employees may not solicit company personnel or enterprise clients.',
      chunkIndex: 0,
      isVerifiedQuote: true,
    },
  ];

  const decisionReadiness = calculateDecisionReadiness(expectedAttributes, checklist, conflicts);

  return {
    id: 'rep-demo-career-offer-2026',
    title: 'Senior Software Engineer Job Offer & Employment Terms',
    query: SAMPLE_CAREER_QUERY,
    targetGoal: SAMPLE_CAREER_GOAL,
    category: 'career',
    sourcesCount: sampleCareerSources.length,
    gapsCount: gaps.length,
    conflictsCount: conflicts.length,
    outdatedCount: outdated.length,
    factsCount: facts.length,
    confidenceScore: decisionReadiness.score,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'completed',
    sources: sampleCareerSources,
    gaps,
    conflicts,
    outdated,
    facts,
    checklist,
    expectedAttributes,
    decisionReadiness,
  };
}

