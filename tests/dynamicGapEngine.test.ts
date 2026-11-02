import { describe, it, expect } from 'vitest';
import { runDynamicGapEngine } from '../src/lib/dynamicGapEngine';
import { Source } from '../src/types';

describe('Dynamic Cross-Examination & Dark Spot Gap Engine', () => {
  const sampleSources: Source[] = [
    {
      id: 'src_central',
      title: 'Central PMS Scholarship Circular 2026',
      url: 'https://scholarships.gov.in/circular-2026',
      domain: 'scholarships.gov.in',
      sourceType: 'official',
      crawledDate: '2026-10-01',
      isOfficial: true,
      reliabilityScore: 98,
      fullText:
        'Official Post-Matric Scholarship guidelines for academic session 2026. The annual family income ceiling is fixed at ₹2,50,000 per annum for all categories. Students who passed with minimum aggregate of 60% are eligible. Portal submission deadline is 31st October 2026. Mandatory documents include valid Aadhaar, Income Certificate, and Caste Certificate.',
      excerpt: 'Annual income ceiling is ₹2,50,000 per annum. Portal deadline is 31st October 2026.',
    },
    {
      id: 'src_state',
      title: 'State Welfare Department Directive',
      url: 'https://welfare.state.gov.in/notice-2026',
      domain: 'welfare.state.gov.in',
      sourceType: 'gazette',
      crawledDate: '2026-10-05',
      isOfficial: true,
      reliabilityScore: 95,
      fullText:
        'State welfare directive for institutional verification. The annual family income ceiling is updated to ₹8,00,000 per annum. Application closing date is 15th November 2026. Required documents must be endorsed by the district collectorate.',
      excerpt: 'Income ceiling updated to ₹8,00,000 per annum. Closing date is 15th November 2026.',
    },
  ];

  it('detects numeric income ceiling contradiction with exact quotes', () => {
    const report = runDynamicGapEngine(
      'PMS Scholarship Income & Deadlines',
      'Avoid Application Rejection',
      'scholarship',
      sampleSources
    );

    expect(report.conflicts.length).toBeGreaterThan(0);
    const incomeConflict = report.conflicts.find(c => c.topic.includes('Income'));
    expect(incomeConflict).toBeDefined();
    expect(incomeConflict?.severity).toBe('high');
    expect(incomeConflict?.sourceA.quote).toContain('2,50,000');
    expect(incomeConflict?.sourceB.quote).toContain('8,00,000');
  });

  it('detects deadline divergence between central and state circulars', () => {
    const report = runDynamicGapEngine(
      'PMS Scholarship Deadlines',
      'Avoid Missing Cutoff',
      'scholarship',
      sampleSources
    );

    const deadlineConflict = report.conflicts.find(c => c.topic.includes('Closing Date') || c.topic.includes('Deadline'));
    expect(deadlineConflict).toBeDefined();
    expect(deadlineConflict?.sourceA.quote).toContain('31st October');
    expect(deadlineConflict?.sourceB.quote).toContain('15th November');
  });

  it('flags unmentioned conditions as confirmed Digital Dark Spots', () => {
    const report = runDynamicGapEngine(
      'PMS Scholarship Analysis',
      'Avoid Application Rejection',
      'scholarship',
      sampleSources
    );

    const renewalGap = report.gaps.find(g => g.missingAttributeId === 'renewal_criteria');
    expect(renewalGap).toBeDefined();
    expect(renewalGap?.severity).toBe('high');
    expect(renewalGap?.title).toContain('Complete Absence');
  });

  it('dynamically calculates Decision Readiness Score and counts', () => {
    const report = runDynamicGapEngine(
      'PMS Scholarship Analysis',
      'Avoid Application Rejection',
      'scholarship',
      sampleSources
    );

    expect(report.decisionReadiness?.score).toBeLessThan(75);
    expect(report.decisionReadiness?.missingCount).toBeGreaterThan(0);
    expect(report.decisionReadiness?.level).not.toBe('ready');
  });

  it('handles general and career domains seamlessly', () => {
    const careerSources: Source[] = [
      {
        id: 'offer_doc',
        title: 'Employment Offer Letter',
        url: 'https://company.internal/offer',
        domain: 'company.internal',
        sourceType: 'uploaded_doc',
        crawledDate: '2026-10-10',
        isOfficial: false,
        reliabilityScore: 80,
        fullText:
          'Software Engineer Offer. Fixed component is ₹18,00,000 per annum with performance bonus. Resignation notice period is 90 days. Mandatory service agreement bond of 2 years applies with penalty.',
        excerpt: 'Notice period 90 days. Mandatory bond of 2 years.',
      },
    ];

    const report = runDynamicGapEngine(
      'Software Engineer Offer Evaluation',
      'Analyze Employment Risk',
      'career',
      careerSources
    );

    expect(report.gaps.length).toBeGreaterThan(0);
    const ipGap = report.gaps.find(g => g.missingAttributeId === 'ip_assignment');
    expect(ipGap).toBeDefined();
  });
});
