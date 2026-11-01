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

export const TOPIC_TEMPLATES: Record<DomainCategory, TopicTemplate> = {
  scholarship: {
    id: 'scholarship',
    name: 'Scholarship / Fellowship',
    badge: '🎓 Financial Aid',
    iconName: 'GraduationCap',
    description: 'Post-Matric, Merit-cum-Means, Central Sector & State Welfare Fellowships',
    defaultQuery:
      'What should I verify before applying for the Post-Matric Merit Scholarship (PMS 2026-27) regarding income certificate authority, college e-verification cutoff, and Year 2 renewal CGPA rules?',
    defaultGoal: 'Avoid Application Rejection & Renewal Cancellation',
    expectedAttributes: [
      {
        attributeId: 'eligibility',
        label: 'Academic Eligibility & Course Mode',
        description: 'Qualifying degree level, regular full-time vs distance mode, recognized institutions.',
      },
      {
        attributeId: 'income_ceiling',
        label: 'Gross Family Annual Income Limit',
        description: 'Exact family income ceiling (e.g. ₹2.5L vs ₹3.5L per annum) and parental category.',
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
        label: 'Official Government Application Portal URL',
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
  admission: {
    id: 'admission',
    name: 'College / University Admission',
    badge: '🏛️ Admissions',
    iconName: 'BookOpen',
    description: 'B.Tech, Medical, Arts & Science, Central University Seat Allocation (CUET / TNEA / JoSAA)',
    defaultQuery:
      'What are the unstated prerequisites, fee refund timelines, and document verification rules for B.Tech / University Admissions 2026-27?',
    defaultGoal: 'Prevent Seat Forfeiture & Fee Dispute Losses',
    expectedAttributes: [
      {
        attributeId: 'eligibility',
        label: 'Minimum Qualifying Marks & Subject Prerequisite',
        description: 'Aggregate percentage in mandatory subjects (Maths, Physics, Chem) and board equivalence.',
      },
      {
        attributeId: 'cutoff_marks',
        label: 'Category-wise Cutoff Percentiles & Ranks',
        description: 'Opening and closing ranks across General, OBC-NCL, SC/ST, and EWS quota seats.',
      },
      {
        attributeId: 'tuition_fees',
        label: 'Tuition, Caution Deposit & Hostel Fee Breakdown',
        description: 'Complete fee structure per semester including non-refundable charges.',
      },
      {
        attributeId: 'application_deadline',
        label: 'Choice Locking & Counselling Round 1 Cut-off',
        description: 'Strict registration cut-off, choice filling window, and seat allotment schedule.',
      },
      {
        attributeId: 'verification_documents',
        label: 'Original Transfer, Migration & Conduct Certificates',
        description: 'Mandatory physical certificates required at the time of campus reporting.',
      },
      {
        attributeId: 'counselling_process',
        label: 'Online Document Verification vs Physical Reporting',
        description: 'Hybrid verification stages, biometric registration, and freeze/float protocols.',
      },
      {
        attributeId: 'seat_matrix',
        label: 'Reserved vs Open Category Seat Matrix',
        description: 'Departmental seat distribution across state quota, all-India quota, and management quota.',
      },
      {
        attributeId: 'refund_policy',
        label: 'UGC Mandatory 100% Fee Refund Window',
        description: 'Clear cancellation cut-off date and percentage of tuition refund upon withdrawal.',
      },
    ],
  },
  govt_scheme: {
    id: 'govt_scheme',
    name: 'Government Student Scheme',
    badge: '🇮🇳 Govt Schemes',
    iconName: 'Landmark',
    description: 'State Free Laptop, Monthly Stipend, Bus Pass, Hostel Subsidy & Youth Aid Schemes',
    defaultQuery:
      'What are the hidden exclusions, bank linkage requirements, and renewal terms for the State Higher Education Youth Allowance / Laptop Scheme 2026?',
    defaultGoal: 'Ensure Timely Subsidy Credit Without Rejection',
    expectedAttributes: [
      {
        attributeId: 'eligibility_criteria',
        label: 'Domicile Certificate & Age Bracket Ceiling',
        description: 'Proof of continuous residence, state nativity certificate, and age qualification window.',
      },
      {
        attributeId: 'income_threshold',
        label: 'Ration Card / BPL Classification Benchmark',
        description: 'Antyodaya Anna Yojana (AAY) or priority household ration card requirements.',
      },
      {
        attributeId: 'application_mode',
        label: 'e-Seva Center Registration vs Online Form',
        description: 'Whether application must be physically submitted via district Taluk / e-Seva or online.',
      },
      {
        attributeId: 'required_certificates',
        label: 'Community, Nativity & Income Proof Formats',
        description: 'Mandatory certificates issued by competent revenue authorities with QR code verification.',
      },
      {
        attributeId: 'nodal_agency',
        label: 'Implementing Department & District Nodal Officer',
        description: 'Administrative nodal directorate responsible for budget sanctions and physical audit.',
      },
      {
        attributeId: 'disbursement_mode',
        label: 'Aadhaar Enabled Payment System / DBT Credit',
        description: 'Direct transfer to student bank account linked with Aadhaar NPCI mapper.',
      },
      {
        attributeId: 'grievance_redressal',
        label: 'CM Special Cell / Toll-Free Helpline Support',
        description: 'Official phone number and portal ticket system for delayed or rejected subsidies.',
      },
      {
        attributeId: 'renewal_terms',
        label: 'Annual Verification & Continuation Mandate',
        description: 'Requirement to submit annual collegiate attendance certificate to maintain subsidy.',
      },
    ],
  },
  exam: {
    id: 'exam',
    name: 'Entrance / Competitive Exam',
    badge: '📝 Competitive Exams',
    iconName: 'FileCheck2',
    description: 'JEE, NEET, GATE, UPSC, State PSC & Banking Entrance Examinations',
    defaultQuery:
      'What are the strict eligibility conditions, negative marking rules, scribe guidelines, and admit card deadlines for the National Entrance Examination 2026?',
    defaultGoal: 'Prevent Exam Hall Disqualification & Form Rejection',
    expectedAttributes: [
      {
        attributeId: 'educational_qualification',
        label: 'Passing Year & Board Recognition Criteria',
        description: 'Permissible qualifying exam years, minimum aggregate marks, and recognized education boards.',
      },
      {
        attributeId: 'age_limit',
        label: 'Upper Age Limit & Category Relaxation Norms',
        description: 'Cut-off reference date for age calculation and relaxations for reserved categories.',
      },
      {
        attributeId: 'exam_pattern',
        label: 'Sectional Blueprint, Negative Marking & Duration',
        description: 'Number of questions, marks per correct answer, negative marking penalty, total duration.',
      },
      {
        attributeId: 'registration_deadline',
        label: 'Fee Submission Cut-off & Correction Window',
        description: 'Final timestamp for online payment and available dates for correction of application details.',
      },
      {
        attributeId: 'admit_card_date',
        label: 'Hall Ticket Release & Photo Mismatch Protocol',
        description: 'Admit card download date and instructions in case of barcode or signature discrepancies.',
      },
      {
        attributeId: 'scribe_compensatory_time',
        label: 'PwD Reservation & Scribe Permission Protocol',
        description: 'Procedure to request a scribe, eligibility certificate format, and extra compensatory time.',
      },
      {
        attributeId: 'reservation_documents',
        label: 'OBC-NCL / EWS Certificate Issue Date Validity',
        description: 'Financial year certificate validity window (certificates issued before April 1 voided).',
      },
      {
        attributeId: 'exam_centers',
        label: 'City Allotment Preference & Reporting Time Protocols',
        description: 'Exam center selection order, gate closing time, and prohibited electronic items.',
      },
    ],
  },
  internship: {
    id: 'internship',
    name: 'Research Internship / Stipend',
    badge: '💼 Internships',
    iconName: 'Briefcase',
    description: 'IIT/IISc Summer Fellowships, Corporate Tech Internships & Government Research Labs',
    defaultQuery:
      'What are the stipend terms, university NOC requirements, IP rights ownership, and attendance rules for the Research Summer Internship 2026?',
    defaultGoal: 'Protect Academic Credit & Timely Stipend Release',
    expectedAttributes: [
      {
        attributeId: 'candidate_eligibility',
        label: 'Eligible Semesters, Minimum CGPA & Stream',
        description: 'Target year of study (e.g. 3rd year B.Tech), minimum CGPA cut-off, and eligible engineering branches.',
      },
      {
        attributeId: 'stipend_allowance',
        label: 'Monthly Stipend, Travel Allowance & Tax Deductions',
        description: 'Exact monthly stipend amount, round-trip train fare reimbursement, and TDS implications.',
      },
      {
        attributeId: 'duration_timeline',
        label: 'Minimum Duration, Weekly Hours & Joining Date',
        description: 'Required internship duration (e.g. 8-10 weeks), mandatory working hours, and flexible start dates.',
      },
      {
        attributeId: 'intellectual_property_rights',
        label: 'Patent, Research Paper Authorship & NDA Terms',
        description: 'Ownership of research outputs, student co-authorship rights, and non-disclosure obligations.',
      },
      {
        attributeId: 'university_noc_requirement',
        label: 'Mandatory College Head of Department Permission',
        description: 'Required No Objection Certificate (NOC) format from parent university registrar.',
      },
      {
        attributeId: 'selection_interview',
        label: 'Technical Assessment & Interview Rounds',
        description: 'Coding test platform, technical interview structure, and project proposal evaluation.',
      },
      {
        attributeId: 'accommodation_support',
        label: 'Campus Hostel Provision vs Self-Arranged PG',
        description: 'Subsidized hostel accommodation availability on host institute campus vs out-of-pocket expenses.',
      },
      {
        attributeId: 'offer_acceptance_deadline',
        label: 'Offer Response Window & Security Deposit',
        description: 'Days permitted to accept the offer letter and confirmation paperwork guidelines.',
      },
    ],
  },
};

export function getTemplateByCategory(category: DomainCategory): TopicTemplate {
  return TOPIC_TEMPLATES[category] || TOPIC_TEMPLATES.scholarship;
}

export function buildExpectedAttributeChecks(category: DomainCategory): ExpectedAttributeCheck[] {
  const template = getTemplateByCategory(category);
  return template.expectedAttributes.map(attr => ({
    attributeId: attr.attributeId,
    label: attr.label,
    status: 'not_found',
    notes: `Cross-checking corpus for: ${attr.description}`,
    sourceRefs: [],
  }));
}
