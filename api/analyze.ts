import { runGeminiGapAnalysis } from './_lib/gemini';
import { verifyQuoteInSource } from './_lib/quoteVerifier';
import { calculateDecisionReadiness } from './_lib/readiness';
import { Source, AnalysisReport, FactItem, ConflictItem, GapItem, ChecklistItem } from '../src/types';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { query, targetGoal, category = 'scholarship', sources = [] } = req.body || {};

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required in request body.' });
    }

    if (!Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({ error: 'At least one source with text chunks is required for analysis.' });
    }

    // Prepare source payload for Gemini
    const sourcesPayload = sources.map((s: Source) => ({
      id: s.id,
      title: s.title || s.domain,
      domain: s.domain,
      publishDate: s.publishDate,
      crawledDate: s.crawledDate,
      chunks: (s.chunks && s.chunks.length > 0)
        ? s.chunks.map(c => ({ chunkIndex: c.chunkIndex, text: c.text }))
        : [{ chunkIndex: 0, text: s.fullText || s.excerpt || '' }],
    }));

    // Create source lookup dictionary for verification
    const sourceMap = new Map<string, Source>();
    sources.forEach(s => sourceMap.set(s.id, s));

    let rawOutput;
    try {
      rawOutput = await runGeminiGapAnalysis(query, sourcesPayload);
    } catch (aiErr: any) {
      console.warn('Gemini analysis failed or no API key, invoking deterministic fallback:', aiErr?.message);
      return res.status(503).json({
        error: `AI Gap Analysis unavailable: ${aiErr?.message || 'Check GEMINI_API_KEY'}`,
        suggestion: 'Ensure GEMINI_API_KEY is configured in .env or run the Bundled Sample Demo in offline mode.',
      });
    }

    // =========================================================================
    // SERVER-SIDE ANTI-HALLUCINATION VERIFICATION OF QUOTES
    // =========================================================================

    // 1. Verify facts
    const verifiedFacts: FactItem[] = rawOutput.facts.map((fact, idx) => {
      const src = sourceMap.get(fact.sourceId) || sources[0];
      const verification = verifyQuoteInSource(fact.quote, src, fact.chunkIndex);

      return {
        id: `fact-${idx + 1}`,
        statement: fact.statement,
        sourceId: src.id,
        sourceTitle: src.title,
        sourceDomain: src.domain,
        sourceDate: src.publishDate || 'Undated',
        sourceUrl: src.url,
        confidenceScore: Math.round(fact.confidence * 100),
        confidence: fact.confidence,
        type: verification.isVerified ? fact.type : 'ai_suggestion',
        exactQuote: fact.quote,
        chunkIndex: verification.matchedChunkIndex ?? fact.chunkIndex,
        isVerifiedQuote: verification.isVerified,
      };
    });

    // 2. Verify conflicts (both quotes from Source A and Source B)
    const verifiedConflicts: ConflictItem[] = rawOutput.conflicts.map((conf, idx) => {
      const srcA = sourceMap.get(conf.sourceA.sourceId) || sources[0];
      const srcB = sourceMap.get(conf.sourceB.sourceId) || (sources[1] || sources[0]);

      const verifyA = verifyQuoteInSource(conf.sourceA.quote, srcA, conf.sourceA.chunkIndex);
      const verifyB = verifyQuoteInSource(conf.sourceB.quote, srcB, conf.sourceB.chunkIndex);

      return {
        id: `conf-${idx + 1}`,
        topic: conf.topic,
        summary: conf.summary,
        severity: conf.severity,
        type: (verifyA.isVerified && verifyB.isVerified) ? conf.type : 'ai_suggestion',
        confidence: conf.confidence,
        sourceA: {
          sourceId: srcA.id,
          sourceTitle: srcA.title,
          quote: conf.sourceA.quote,
          date: srcA.publishDate || conf.sourceA.date || 'Undated',
          url: srcA.url,
          chunkIndex: verifyA.matchedChunkIndex ?? conf.sourceA.chunkIndex,
          isVerified: verifyA.isVerified,
        },
        sourceB: {
          sourceId: srcB.id,
          sourceTitle: srcB.title,
          quote: conf.sourceB.quote,
          date: srcB.publishDate || conf.sourceB.date || 'Undated',
          url: srcB.url,
          chunkIndex: verifyB.matchedChunkIndex ?? conf.sourceB.chunkIndex,
          isVerified: verifyB.isVerified,
        },
        resolutionTip: conf.resolutionTip,
        isAiSuggestion: !verifyA.isVerified || !verifyB.isVerified,
      };
    });

    // 3. Format gaps
    const verifiedGaps: GapItem[] = rawOutput.unansweredGaps.map((gap, idx) => ({
      id: `gap-${idx + 1}`,
      title: gap.title,
      description: gap.description,
      category: gap.category,
      severity: gap.severity,
      sourcesConsulted: sources.map(s => s.domain),
      isAiSuggestion: gap.isAiSuggestion,
      type: gap.type,
      confidence: gap.confidence,
      whyItMatters: gap.whyItMatters,
      suggestedQuestionToAsk: gap.suggestedQuestionToAsk,
      missingAttributeId: gap.missingAttributeId,
    }));

    // 4. Format checklist
    const verifiedChecklist: ChecklistItem[] = rawOutput.verifyNextChecklist.map((item, idx) => ({
      id: `chk-${idx + 1}`,
      priority: item.priority,
      title: item.title,
      reason: item.reason,
      actionType: item.actionType,
      suggestedAction: item.suggestedAction,
      whereToVerify: item.whereToVerify,
      sourceRef: item.sourceRef,
      sourceId: item.sourceId,
      linkedGapOrConflictId: item.linkedGapOrConflictId,
      completed: false,
      deadline: item.deadline,
      type: item.type,
    }));

    // 5. Outdated warnings
    const verifiedOutdated = rawOutput.outdatedWarnings.map((out, idx) => {
      const src = sourceMap.get(out.sourceId) || sources[0];
      return {
        id: `out-${idx + 1}`,
        title: out.title,
        warningText: out.warningText,
        observedDate: out.observedDate,
        currentCycle: out.currentCycle,
        sourceId: src.id,
        sourceTitle: src.title,
        url: src.url,
        riskLevel: out.riskLevel,
        stalenessMonths: out.stalenessMonths,
        type: 'sourced' as const,
        confidence: out.confidence,
      };
    });

    // =========================================================================
    // DETERMINISTIC DECISION READINESS CALCULATION
    // =========================================================================
    const decisionReadiness = calculateDecisionReadiness(
      rawOutput.expectedChecklist,
      verifiedChecklist,
      verifiedConflicts
    );

    const reportId = `rep-${Date.now()}`;
    const report: AnalysisReport = {
      id: reportId,
      title: query,
      query,
      targetGoal: targetGoal || 'Identify information dark spots and verify requirements before submission',
      category: category as any,
      sourcesCount: sources.length,
      gapsCount: verifiedGaps.length,
      conflictsCount: verifiedConflicts.length,
      outdatedCount: verifiedOutdated.length,
      factsCount: verifiedFacts.length,
      confidenceScore: decisionReadiness.score,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'completed',
      sources,
      gaps: verifiedGaps,
      conflicts: verifiedConflicts,
      outdated: verifiedOutdated,
      facts: verifiedFacts,
      checklist: verifiedChecklist,
      expectedAttributes: rawOutput.expectedChecklist,
      decisionReadiness,
    };

    return res.status(200).json({ report });
  } catch (err: any) {
    return res.status(500).json({
      error: `Analysis execution failed: ${err?.message || 'Unknown internal error'}`,
    });
  }
}
