import { DomainCategory, ExpectedAttributeCheck } from '../types';

export interface TopicAttributeTemplate {
  attributeId: string;
  label: string;
  description: string;
}

export interface TopicTemplate {
  id: DomainCategory;
  name: string;
  badge: string;
  iconName: string;
  description: string;
  defaultQuery: string;
  defaultGoal: string;
  expectedAttributes: TopicAttributeTemplate[];
}

export const TOPIC_TEMPLATES: Record<string, TopicTemplate> = {
  education: {
    id: 'education',
    name: 'Education & Admissions',
    badge: '🎓 Education',
    iconName: 'GraduationCap',
    description: 'Degree programs, admissions, prerequisites, tuition fees, and credit transfer policies',
    defaultQuery:
      'What are the unstated prerequisites, fee refund timelines, and document verification rules for University Admissions?',
    defaultGoal: 'Prevent Admission Forfeiture & Fee Dispute Losses',
    expectedAttributes: [
      {
        attributeId: 'eligibility',
        label: 'Minimum Academic Eligibility & Subjects',
        description: 'Qualifying coursework, minimum GPA/percentage, and recognized equivalence.',
      },
      {
        attributeId: 'application_deadline',
        label: 'Registration & Final Cutoff Deadlines',
        description: 'Hard closing timestamps, choice filling deadlines, and document submission windows.',
      },
      {
        attributeId: 'fee_structure',
        label: 'Tuition Fees, Deposits & Additional Charges',
        description: 'Semester tuition fees, caution deposit, laboratory costs, and non-refundable fees.',
      },
      {
        attributeId: 'verification_docs',
        label: 'Mandatory Verification Documents',
        description: 'Required transcripts, conduct certificates, and physical verification mandates.',
      },
      {
        attributeId: 'refund_policy',
        label: 'Withdrawal & Fee Refund Schedule',
        description: 'Statutory cancellation timeline and refundable percentage upon withdrawal.',
      },
      {
        attributeId: 'credit_transfer',
        label: 'Credit Transfer & Evaluation Benchmarks',
        description: 'Prior learning recognition, lateral entry criteria, and minimum passing GPA.',
      },
      {
        attributeId: 'official_portal',
        label: 'Official Application Portal URL',
        description: 'Authoritative direct application link without third-party intermediaries.',
      },
      {
        attributeId: 'grievance_contact',
        label: 'Admissions Office & Nodal Officer Contact',
        description: 'Designated registrar email, phone numbers, and physical enquiry desk location.',
      },
    ],
  },
  career: {
    id: 'career',
    name: 'Career & Employment',
    badge: '💼 Career',
    iconName: 'Briefcase',
    description: 'Job offers, employment contracts, equity terms, non-competes, and remote work rules',
    defaultQuery:
      'What should I verify before accepting this Job Offer regarding IP assignment, non-compete clause, relocation clawback, and notice period?',
    defaultGoal: 'Protect Intellectual Property & Ensure Transparent Compensation Terms',
    expectedAttributes: [
      {
        attributeId: 'compensation_breakdown',
        label: 'Base Salary, Bonus & Vesting Schedule',
        description: 'Fixed base pay, performance incentive milestones, and stock option vesting frequency.',
      },
      {
        attributeId: 'notice_period',
        label: 'Probationary & Permanent Notice Period',
        description: 'Resignation notice duration during probation vs permanent employment and garden leave rules.',
      },
      {
        attributeId: 'ip_assignment',
        label: 'Inventions & Side-Project IP Rights',
        description: 'Carve-out for personal off-hours creations and prior inventions disclosure requirements.',
      },
      {
        attributeId: 'non_compete_clause',
        label: 'Non-Compete & Non-Solicit Restrictions',
        description: 'Geographic and temporal post-employment restrictions on competitive industry activities.',
      },
      {
        attributeId: 'clawback_terms',
        label: 'Relocation & Signing Bonus Clawback',
        description: 'Repayment schedule and prorated terms if leaving company within 12-24 months.',
      },
      {
        attributeId: 'workplace_policy',
        label: 'Remote vs In-Office Attendance Mandate',
        description: 'Mandatory physical office days, core collaboration hours, and relocation assistance.',
      },
      {
        attributeId: 'benefits_coverage',
        label: 'Healthcare, Insurance & Paid Time Off',
        description: 'Medical coverage effective date, annual leave accrual, and parental leave entitlements.',
      },
      {
        attributeId: 'termination_severance',
        label: 'Termination Clauses & Severance Protocol',
        description: 'Conditions for termination with/without cause and severance pay calculations.',
      },
    ],
  },
  govt_service: {
    id: 'govt_service',
    name: 'Government & Public Services',
    badge: '🏛️ Public Services',
    iconName: 'Landmark',
    description: 'Civic schemes, welfare subsidies, citizen services, identity documents, and permits',
    defaultQuery:
      'What are the hidden exclusions, bank linkage requirements, and renewal terms for this Public Service Scheme?',
    defaultGoal: 'Ensure Benefit Approval & Avoid Administrative Rejection',
    expectedAttributes: [
      {
        attributeId: 'domicile_eligibility',
        label: 'Domicile & Nativity Prerequisites',
        description: 'Proof of continuous residence, state identity credentials, and age eligibility window.',
      },
      {
        attributeId: 'income_ceiling',
        label: 'Income & Socioeconomic Classification',
        description: 'Income ceiling, tax filing status exemptions, and priority category mandates.',
      },
      {
        attributeId: 'application_channel',
        label: 'Online Portal vs Citizen Service Center',
        description: 'Whether application must be physically submitted via regional centers or web portal.',
      },
      {
        attributeId: 'required_certificates',
        label: 'Prescribed Authority Certificate Formats',
        description: 'Required issuing authority rank, digital signatures, and QR code verification.',
      },
      {
        attributeId: 'disbursement_method',
        label: 'Disbursement Method & Bank Account Linkage',
        description: 'Direct Benefit Transfer (DBT) prerequisites, Aadhaar/identity mapping requirements.',
      },
      {
        attributeId: 'redressal_channel',
        label: 'Grievance Redressal & Helpdesk Details',
        description: 'Official department escalation desk, toll-free helpline, and appeal timelines.',
      },
      {
        attributeId: 'renewal_continuation',
        label: 'Periodic Audit & Renewal Mandates',
        description: 'Annual re-verification schedules, self-declaration forms, and continuation criteria.',
      },
      {
        attributeId: 'processing_timeline',
        label: 'Statutory Processing Timeline & SLA',
        description: 'Public service guarantee turnaround time and inspection benchmarks.',
      },
    ],
  },
  research: {
    id: 'research',
    name: 'Research & Publications',
    badge: '🔬 Research',
    iconName: 'FileCheck2',
    description: 'Grant proposals, scientific literature, clinical trials, methodology papers, and patents',
    defaultQuery:
      'What are the methodology discrepancies, funding disclosures, and reproducibility gaps across these research studies?',
    defaultGoal: 'Identify Unreplicated Claims & Methodological Dark Spots',
    expectedAttributes: [
      {
        attributeId: 'sample_methodology',
        label: 'Sample Size, Demographics & Methodology',
        description: 'Cohort size, selection bias controls, randomization, and experimental design.',
      },
      {
        attributeId: 'statistical_significance',
        label: 'Statistical Significance & Confidence Intervals',
        description: 'P-value thresholds, effect sizes, power calculations, and error bounds.',
      },
      {
        attributeId: 'funding_disclosure',
        label: 'Funding Sources & Conflict of Interest Disclosures',
        description: 'Commercial sponsor declarations, institutional grants, and investigator affiliations.',
      },
      {
        attributeId: 'replication_data',
        label: 'Open Data & Code Availability',
        description: 'Public repository links, raw dataset availability, and software pipeline reproducibility.',
      },
      {
        attributeId: 'baseline_comparison',
        label: 'Baseline Benchmarks & Control Groups',
        description: 'Validation against standard industry or academic control baselines.',
      },
      {
        attributeId: 'limitations_stated',
        label: 'Stated Assumptions & Limitations',
        description: 'Scope boundaries, environmental constraints, and unaddressed edge cases.',
      },
      {
        attributeId: 'ethical_approval',
        label: 'Ethics Review & Institutional Approval (IRB)',
        description: 'Human or animal subject review board compliance and consent protocols.',
      },
      {
        attributeId: 'publication_date',
        label: 'Peer-Reviewed Status & Citation Currency',
        description: 'Publication date, preprint status, and subsequent corrigendum or retractions.',
      },
    ],
  },
  business: {
    id: 'business',
    name: 'Business & Vendor Contracts',
    badge: '📊 Business',
    iconName: 'Building',
    description: 'Service agreements, vendor SLAs, procurement tenders, compliance policies, and pricing',
    defaultQuery:
      'What are the unstated renewal price hikes, SLA breach remedies, and liability caps in this Vendor Service Agreement?',
    defaultGoal: 'Prevent Contractual Hidden Costs & Liability Exposure',
    expectedAttributes: [
      {
        attributeId: 'pricing_schedule',
        label: 'Pricing, Hidden Fees & Renewal Escalation',
        description: 'Fixed fees vs variable usage tiers, setup costs, and annual price escalation caps.',
      },
      {
        attributeId: 'sla_uptime',
        label: 'Service Level Agreement (SLA) & Penalties',
        description: 'Guaranteed uptime percentage, measurement intervals, and financial credit formulas.',
      },
      {
        attributeId: 'liability_cap',
        label: 'Limitation of Liability & Indemnification',
        description: 'Aggregate liability ceiling (e.g. 12 months fees) and excluded damages categories.',
      },
      {
        attributeId: 'termination_convenience',
        label: 'Termination for Convenience & Exit Fees',
        description: 'Required notice days, early termination penalties, and transition assistance obligations.',
      },
      {
        attributeId: 'data_ownership',
        label: 'Data Ownership, Privacy & Retrieval',
        description: 'Customer data ownership rights, compliance with privacy regulations, and export formats.',
      },
      {
        attributeId: 'audit_rights',
        label: 'Security Certifications & Audit Rights',
        description: 'SOC2/ISO certifications, penetration testing reports, and customer audit access.',
      },
      {
        attributeId: 'governing_law',
        label: 'Governing Law & Dispute Resolution',
        description: 'Jurisdiction, applicable law, mandatory arbitration, and court venues.',
      },
      {
        attributeId: 'support_tiers',
        label: 'Support Tiers & Incident Response Times',
        description: 'P1 incident response turnaround SLA, dedicated support contacts, and weekend coverage.',
      },
    ],
  },
  scholarship: {
    id: 'scholarship',
    name: 'Scholarships & Fellowships',
    badge: '🎓 Financial Aid',
    iconName: 'GraduationCap',
    description: 'Merit-cum-means, post-matric, research fellowships, and institutional grants',
    defaultQuery:
      'What should I verify before applying for this scholarship regarding income proof authority, portal deadlines, and renewal CGPA rules?',
    defaultGoal: 'Avoid Application Rejection & Ensure Seamless Continuation',
    expectedAttributes: [
      {
        attributeId: 'eligibility',
        label: 'Academic Eligibility & Course Mode',
        description: 'Qualifying degree level, regular full-time vs distance mode, recognized institutions.',
      },
      {
        attributeId: 'income_ceiling',
        label: 'Gross Family Annual Income Limit',
        description: 'Exact family income ceiling and allowable parental income documents.',
      },
      {
        attributeId: 'deadline',
        label: 'Portal Cut-off vs Institute Verification Cut-off',
        description: 'Discrepancy between central portal closing date and collegiate desk scrutiny deadline.',
      },
      {
        attributeId: 'documents',
        label: 'Required Income Proof Authority (Tehsildar vs ITR)',
        description: 'Format mandate: Revenue Tehsildar certificate vs employer salary slip or Form 16 / ITR.',
      },
      {
        attributeId: 'renewal',
        label: 'Renewal CGPA Benchmark & Backlog Policy',
        description: 'Minimum grade point average required for continuation; impact of semester arrears.',
      },
      {
        attributeId: 'portal_link',
        label: 'Official Application Portal URL',
        description: 'Direct verified URL to apply online without phishing or third-party intermediaries.',
      },
      {
        attributeId: 'disbursement',
        label: 'Direct Benefit Transfer (DBT) & Tranche Schedule',
        description: 'Aadhaar-seeded bank mandate, installment breakdown, tuition vs maintenance grant.',
      },
      {
        attributeId: 'helpdesk',
        label: 'Grievance Redressal & Nodal Officer Contact',
        description: 'Designated collegiate nodal officer and state directorate helpline numbers.',
      },
    ],
  },
};

// Aliases for backwards compatibility
TOPIC_TEMPLATES.admission = TOPIC_TEMPLATES.education;
TOPIC_TEMPLATES.govt_scheme = TOPIC_TEMPLATES.govt_service;
TOPIC_TEMPLATES.exam = TOPIC_TEMPLATES.education;
TOPIC_TEMPLATES.internship = TOPIC_TEMPLATES.career;

export const CORE_TOPIC_TEMPLATES: TopicTemplate[] = [
  TOPIC_TEMPLATES.education,
  TOPIC_TEMPLATES.career,
  TOPIC_TEMPLATES.govt_service,
  TOPIC_TEMPLATES.research,
  TOPIC_TEMPLATES.business,
  TOPIC_TEMPLATES.scholarship,
];

export function getTemplateByCategory(category: string): TopicTemplate {
  return TOPIC_TEMPLATES[category] || TOPIC_TEMPLATES.education;
}

export function buildExpectedAttributeChecks(category: string): ExpectedAttributeCheck[] {
  const template = getTemplateByCategory(category);
  return template.expectedAttributes.map(attr => ({
    attributeId: attr.attributeId,
    label: attr.label,
    status: 'not_found',
    notes: `Cross-checking corpus for: ${attr.description}`,
    sourceRefs: [],
  }));
}
