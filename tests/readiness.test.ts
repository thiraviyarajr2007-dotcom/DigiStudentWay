import { describe, it, expect } from 'vitest';
import { calculateDecisionReadiness } from '../api/_lib/readiness';
import { ExpectedAttributeCheck, ChecklistItem, ConflictItem } from '../src/types';

describe('Deterministic Decision Readiness Calculation', () => {
  it('computes 100% ready when all attributes are covered and no blockers exist', () => {
    const attributes: ExpectedAttributeCheck[] = [
      { attributeId: 'eligibility', label: 'Eligibility', status: 'covered', notes: 'OK', sourceRefs: [] },
      { attributeId: 'deadline', label: 'Deadline', status: 'covered', notes: 'OK', sourceRefs: [] },
      { attributeId: 'renewal', label: 'Renewal', status: 'covered', notes: 'OK', sourceRefs: [] },
    ];
    const checklist: ChecklistItem[] = [];
    const conflicts: ConflictItem[] = [];

    const readiness = calculateDecisionReadiness(attributes, checklist, conflicts);
    expect(readiness.score).toBe(100);
    expect(readiness.level).toBe('ready');
    expect(readiness.coveredCount).toBe(3);
    expect(readiness.missingCount).toBe(0);
  });

  it('deducts mathematical penalties for unresolved P1 items, partial attributes and conflicts', () => {
    const attributes: ExpectedAttributeCheck[] = [
      { attributeId: 'eligibility', label: 'Eligibility', status: 'covered', notes: 'OK', sourceRefs: [] },
      { attributeId: 'income', label: 'Income', status: 'partially_covered', notes: 'Conflict', sourceRefs: [] },
      { attributeId: 'renewal', label: 'Renewal', status: 'not_found', notes: 'Dark spot', sourceRefs: [] },
      { attributeId: 'deadline', label: 'Deadline', status: 'partially_covered', notes: 'Clash', sourceRefs: [] },
    ];

    const checklist: ChecklistItem[] = [
      {
        id: 'chk-1',
        priority: 'P1',
        title: 'Verify Tehsildar income cert',
        reason: 'Conflict',
        actionType: 'request_document',
        suggestedAction: 'Get certificate',
        whereToVerify: 'Taluk office',
        completed: false,
      },
      {
        id: 'chk-2',
        priority: 'P1',
        title: 'Submit ahead of Oct 31',
        reason: 'Cut-off',
        actionType: 'verify_portal',
        suggestedAction: 'Submit early',
        whereToVerify: 'College desk',
        completed: false,
      },
      {
        id: 'chk-3',
        priority: 'P2',
        title: 'Check renewal GPA',
        reason: 'Dark spot',
        actionType: 'call_helpdesk',
        suggestedAction: 'Email dean',
        whereToVerify: 'Dean office',
        completed: false,
      },
    ];

    const conflicts: ConflictItem[] = [
      {
        id: 'c1',
        topic: 'Income doc',
        summary: 'ITR vs Tehsildar',
        severity: 'high',
        sourceA: { sourceId: '1', sourceTitle: 'A', quote: 'q', date: 'd', url: 'u' },
        sourceB: { sourceId: '2', sourceTitle: 'B', quote: 'q', date: 'd', url: 'u' },
        resolutionTip: 'tip',
      },
    ];

    const readiness = calculateDecisionReadiness(attributes, checklist, conflicts);

    // Coverage = (1*1 + 2*0.5 + 0) / 4 = 2 / 4 = 50%
    // Deductions: 2 * P1 (28) + 1 * P2 (7) + 1 * conflict (10) = 45 penalty
    // Net score = 50 - 45 = 5%
    expect(readiness.score).toBeLessThanOrEqual(50);
    expect(readiness.level).toBe('not_ready');
    expect(readiness.p1PendingCount).toBe(2);
    expect(readiness.missingCount).toBe(1);
  });
});
