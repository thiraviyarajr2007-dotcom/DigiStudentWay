import { describe, it, expect } from 'vitest';
import { mapAuthError } from '../src/lib/authContext';
import { buildSampleDemoReport, buildCareerSampleDemoReport } from '../src/lib/sampleDemo';
import { SAMPLE_CAREER_OFFLINE_OUTPUT, SAMPLE_OFFLINE_OUTPUT } from '../api/_lib/ai';
import { AnalysisResponseSchema } from '../api/_lib/gemini';

describe('Authentication Logic & Guest Access Rules', () => {
  it('maps wrong password and invalid credentials to friendly message', () => {
    expect(mapAuthError({ code: 'auth/wrong-password' })).toContain('Incorrect email or password');
    expect(mapAuthError({ code: 'auth/invalid-credential' })).toContain('Incorrect email or password');
  });

  it('maps user not found and email in use errors', () => {
    expect(mapAuthError({ code: 'auth/user-not-found' })).toContain('No account exists');
    expect(mapAuthError({ code: 'auth/email-already-in-use' })).toContain('already exists');
  });

  it('maps weak password and invalid email errors', () => {
    expect(mapAuthError({ code: 'auth/weak-password' })).toContain('at least 6 characters');
    expect(mapAuthError({ code: 'auth/invalid-email' })).toContain('valid institutional or personal email');
  });

  it('maps popup blocked error for mobile/strict browser fallback', () => {
    expect(mapAuthError({ code: 'auth/popup-blocked' })).toContain('Popup was blocked');
  });

  it('maps too many requests lockout', () => {
    expect(mapAuthError({ code: 'auth/too-many-requests' })).toContain('temporarily disabled');
  });

  it('returns fallback message for unknown error', () => {
    expect(mapAuthError({ message: 'Custom OAuth issue' })).toBe('Custom OAuth issue');
  });
});

describe('Domain Generalization: Multi-Sample Verification', () => {
  it('buildSampleDemoReport (Scholarship) produces complete verified report', () => {
    const report = buildSampleDemoReport();
    expect(report.category).toBe('scholarship');
    expect(report.sources.length).toBe(4);
    expect(report.conflicts.length).toBeGreaterThan(0);
    expect(report.gaps.length).toBeGreaterThan(0);
    expect(report.facts.length).toBeGreaterThan(0);
    expect(report.checklist.length).toBeGreaterThan(0);
    expect(report.decisionReadiness?.score).toBeGreaterThan(0);
  });

  it('buildCareerSampleDemoReport (Job Offer) produces valid domain-agnostic report', () => {
    const report = buildCareerSampleDemoReport();
    expect(report.category).toBe('career');
    expect(report.sources.length).toBe(3);
    expect(report.conflicts.length).toBeGreaterThan(0);
    expect(report.conflicts[0].topic).toContain('Notice Period');
    expect(report.gaps.length).toBeGreaterThan(0);
    expect(report.gaps[0].missingAttributeId).toBe('ip_assignment');
    expect(report.facts.length).toBe(3);
    expect(report.facts[0].isVerifiedQuote).toBe(true);
    expect(report.decisionReadiness?.score).toBeGreaterThan(0);
  });

  it('SAMPLE_CAREER_OFFLINE_OUTPUT conforms strictly to AnalysisResponseSchema', () => {
    const parsed = AnalysisResponseSchema.parse(SAMPLE_CAREER_OFFLINE_OUTPUT);
    expect(parsed.facts.length).toBeGreaterThan(0);
    expect(parsed.expectedChecklist.length).toBeGreaterThan(0);
    expect(parsed.conflicts.length).toBeGreaterThan(0);
    expect(parsed.unansweredGaps.length).toBeGreaterThan(0);
    expect(parsed.verifyNextChecklist.length).toBeGreaterThan(0);
  });
});

