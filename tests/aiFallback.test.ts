import { describe, it, expect } from 'vitest';
import { SAMPLE_OFFLINE_OUTPUT } from '../api/_lib/ai';
import { AnalysisResponseSchema } from '../api/_lib/gemini';
import { checkRateLimit } from '../api/_lib/rateLimit';

describe('AI Fallback & Resilience Engine', () => {
  it('SAMPLE_OFFLINE_OUTPUT conforms strictly to AnalysisResponseSchema', () => {
    const parsed = AnalysisResponseSchema.parse(SAMPLE_OFFLINE_OUTPUT);
    expect(parsed.facts.length).toBeGreaterThan(0);
    expect(parsed.expectedChecklist.length).toBe(8);
    expect(parsed.conflicts.length).toBeGreaterThan(0);
    expect(parsed.unansweredGaps.length).toBeGreaterThan(0);
    expect(parsed.verifyNextChecklist.length).toBeGreaterThan(0);
  });

  it('rate limiter allows requests within limit and rejects after limit', () => {
    const fakeReq = {
      headers: { 'x-forwarded-for': '198.51.100.42' },
    };

    // First 5 requests allowed with limit 5
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(fakeReq, 5, 10000);
      expect(result.allowed).toBe(true);
    }

    // 6th request rejected
    const blocked = checkRateLimit(fakeReq, 5, 10000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });
});
