import { describe, it, expect } from 'vitest';
import { verifyQuoteInSource, normalizeText } from '../api/_lib/quoteVerifier';
import { Source } from '../src/types';

describe('Anti-Hallucination Quote Verifier', () => {
  const sampleSource: Source = {
    id: 'src-test-1',
    title: 'Test Official Circular',
    url: 'https://highered.state.gov.in/circulars/test',
    domain: 'highered.state.gov.in',
    crawledDate: '2026-10-31',
    sourceType: 'official',
    isOfficial: true,
    reliabilityScore: 95,
    excerpt: 'All candidates must submit a Tehsildar-issued certificate. Private ITR is rejected.',
    fullText: 'Section 4: Verification rules.\nAll candidates must submit a Tehsildar-issued certificate. Private employer salary slips or ITR are explicitly rejected by the Directorate. The cut-off date is October 31, 2026.',
    chunks: [
      {
        chunkIndex: 0,
        startChar: 0,
        endChar: 110,
        text: 'Section 4: Verification rules.\nAll candidates must submit a Tehsildar-issued certificate.',
      },
      {
        chunkIndex: 1,
        startChar: 105,
        endChar: 240,
        text: 'Private employer salary slips or ITR are explicitly rejected by the Directorate. The cut-off date is October 31, 2026.',
      },
    ],
  };

  it('successfully verifies exact verbatim quote from chunk 0', () => {
    const quote = 'All candidates must submit a Tehsildar-issued certificate.';
    const result = verifyQuoteInSource(quote, sampleSource, 0);

    expect(result.isVerified).toBe(true);
    expect(result.matchedChunkIndex).toBe(0);
    expect(result.charOffset).toBeDefined();
  });

  it('successfully verifies quote with whitespace and smart quotes deviations', () => {
    const quote = 'All   candidates\nmust submit a Tehsildar-issued certificate.';
    const result = verifyQuoteInSource(quote, sampleSource);

    expect(result.isVerified).toBe(true);
    expect(result.matchType).toBe('normalized_whitespace');
  });

  it('rejects hallucinated quotes not present in source text', () => {
    const hallucinatedQuote = 'Candidates may submit private company payslips if signed by a chartered accountant.';
    const result = verifyQuoteInSource(hallucinatedQuote, sampleSource);

    expect(result.isVerified).toBe(false);
    expect(result.rejectionReason).toContain('was not found in source text');
  });

  it('rejects empty or excessively short quotes', () => {
    const emptyResult = verifyQuoteInSource('', sampleSource);
    expect(emptyResult.isVerified).toBe(false);

    const shortResult = verifyQuoteInSource('rule 4', sampleSource);
    expect(shortResult.isVerified).toBe(false);
    expect(shortResult.rejectionReason).toContain('too short');
  });
});

