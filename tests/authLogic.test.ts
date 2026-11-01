import { describe, it, expect, beforeEach } from 'vitest';
import { mapAuthError } from '../src/lib/authContext';
import { localAuth } from '../src/lib/localAuth';
import { buildSampleDemoReport, buildCareerSampleDemoReport } from '../src/lib/sampleDemo';
import { SAMPLE_CAREER_OFFLINE_OUTPUT, SAMPLE_OFFLINE_OUTPUT } from '../api/_lib/ai';
import { AnalysisResponseSchema } from '../api/_lib/gemini';

describe('Local Authentication Resilience', () => {
  beforeEach(() => {
    localAuth.signOut();
  });

  it('signs in pre-seeded demo student successfully', () => {
    const user = localAuth.signInWithEmail('demo@student.org', 'password123');
    expect(user.email).toBe('demo@student.org');
    expect(user.displayName).toBe('Alex Morgan');
    expect(localAuth.getCurrentUser()?.uid).toBe(user.uid);
  });

  it('rejects incorrect password with auth/wrong-password code', () => {
    expect(() => {
      localAuth.signInWithEmail('demo@student.org', 'wrongpassword');
    }).toThrowError();

    try {
      localAuth.signInWithEmail('demo@student.org', 'wrongpassword');
    } catch (err: any) {
      expect(err.code).toBe('auth/wrong-password');
    }
  });

  it('rejects unregistered email with auth/user-not-found code', () => {
    try {
      localAuth.signInWithEmail('nobody@example.com', 'password123');
    } catch (err: any) {
      expect(err.code).toBe('auth/user-not-found');
    }
  });

  it('registers new student account and prevents duplicate emails', () => {
    const testEmail = `student_${Date.now()}@college.edu`;
    const created = localAuth.signUpWithEmail(testEmail, 'mypassword123', 'Jane Student');
    expect(created.email).toBe(testEmail);
    expect(created.displayName).toBe('Jane Student');

    // Attempt duplicate signup
    try {
      localAuth.signUpWithEmail(testEmail, 'differentpass', 'Jane Duplicate');
      expect.fail('Should have thrown email-already-in-use');
    } catch (err: any) {
      expect(err.code).toBe('auth/email-already-in-use');
    }
  });

  it('supports simulated Google sign-in with instant verified user', () => {
    const googleUser = localAuth.signInWithGoogle();
    expect(googleUser.email).toContain('gmail.com');
    expect(googleUser.emailVerified).toBe(true);
    expect(localAuth.getCurrentUser()?.uid).toBe(googleUser.uid);
  });

  it('clears active user on signOut', () => {
    localAuth.signInWithEmail('demo@student.org', 'password123');
    expect(localAuth.getCurrentUser()).not.toBeNull();
    localAuth.signOut();
    expect(localAuth.getCurrentUser()).toBeNull();
  });
});

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

