import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

export const AnalysisResponseSchema = z.object({
  facts: z.array(
    z.object({
      statement: z.string(),
      sourceId: z.string(),
      quote: z.string(),
      chunkIndex: z.number().optional(),
      confidence: z.number().min(0).max(1).default(0.9),
      type: z.enum(['sourced', 'ai_suggestion', 'uncertain']).default('sourced'),
    })
  ),
  expectedChecklist: z.array(
    z.object({
      attributeId: z.string(),
      label: z.string(),
      status: z.enum(['covered', 'partially_covered', 'not_found']),
      notes: z.string(),
      sourceRefs: z.array(z.string()).default([]),
    })
  ),
  conflicts: z.array(
    z.object({
      topic: z.string(),
      summary: z.string(),
      severity: z.enum(['high', 'medium', 'low']).default('high'),
      type: z.enum(['sourced', 'ai_suggestion', 'uncertain']).default('sourced'),
      confidence: z.number().min(0).max(1).default(0.85),
      sourceA: z.object({
        sourceId: z.string(),
        sourceTitle: z.string().default('Source A'),
        quote: z.string(),
        date: z.string().default('Unknown'),
        chunkIndex: z.number().optional(),
      }),
      sourceB: z.object({
        sourceId: z.string(),
        sourceTitle: z.string().default('Source B'),
        quote: z.string(),
        date: z.string().default('Unknown'),
        chunkIndex: z.number().optional(),
      }),
      resolutionTip: z.string(),
    })
  ),
  outdatedWarnings: z.array(
    z.object({
      title: z.string(),
      warningText: z.string(),
      observedDate: z.string(),
      currentCycle: z.string(),
      sourceId: z.string(),
      riskLevel: z.enum(['high', 'medium', 'low']).default('high'),
      stalenessMonths: z.number().default(12),
      confidence: z.number().min(0).max(1).default(0.85),
    })
  ),
  unansweredGaps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['eligibility', 'renewal', 'document', 'deadline', 'financial', 'procedure']).default('procedure'),
      severity: z.enum(['high', 'medium', 'low']).default('medium'),
      whyItMatters: z.string(),
      suggestedQuestionToAsk: z.string(),
      missingAttributeId: z.string().optional(),
      isAiSuggestion: z.boolean().default(false),
      type: z.enum(['sourced', 'ai_suggestion', 'uncertain']).default('sourced'),
      confidence: z.number().min(0).max(1).default(0.85),
    })
  ),
  verifyNextChecklist: z.array(
    z.object({
      priority: z.enum(['P1', 'P2', 'P3']),
      title: z.string(),
      reason: z.string(),
      actionType: z.enum(['call_helpdesk', 'verify_portal', 'request_document', 'cross_check_guideline']).default('verify_portal'),
      suggestedAction: z.string(),
      whereToVerify: z.string(),
      sourceRef: z.string().optional(),
      sourceId: z.string().optional(),
      linkedGapOrConflictId: z.string().optional(),
      deadline: z.string().optional(),
      type: z.enum(['sourced', 'ai_suggestion', 'uncertain']).default('sourced'),
    })
  ),
});

export type RawAnalysisOutput = z.infer<typeof AnalysisResponseSchema>;

/**
 * Executes an async task with exponential backoff on transient errors.
 */
export async function callWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (attempt < retries) {
        const jitter = Math.random() * 300;
        await new Promise(r => setTimeout(r, delayMs * Math.pow(2, attempt - 1) + jitter));
      }
    }
  }
  throw lastError;
}

/**
 * Calls Gemini 2.5 Flash to execute the gap detection prompt.
 */
export async function runGeminiGapAnalysis(
  query: string,
  sourcesPayload: Array<{
    id: string;
    title: string;
    domain: string;
    publishDate?: string;
    crawledDate: string;
    chunks: Array<{ chunkIndex: number; text: string }>;
  }>,
  apiKey?: string
): Promise<RawAnalysisOutput> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey: key });

  const prompt = `
You are the DigiStudentWay Information Gap & Contradiction Detection Engine for the Shinchan Online Hackathon 2026.
Problem: "Digital Dark Spot: AI-Assisted Information Gap Detection".
Goal: Identify what is MISSING, CONFLICTING, or OUTDATED across multiple academic / governmental notices.

TODAY'S REFERENCE DATE: 2026-11-01. Current Active Academic Cycle: 2026-27.

USER INQUIRY: "${query}"

INGESTED SOURCE CORPUS:
${JSON.stringify(sourcesPayload, null, 2)}

STRICT ANALYSIS RULES:
1. ANTI-HALLUCINATION QUOTE MANDATE:
   - For every key fact, you MUST copy an EXACT, VERBATIM quote from a specific chunk text. Do not paraphrase quotes. The server will run string-matching against the raw chunks; if the quote does not exist, it will be flagged or rejected!
   - Supply the exact "chunkIndex".

2. EXPECTED ATTRIBUTE CHECKLIST:
   - For scholarship/admissions/schemes, check all core attributes:
     [eligibility, income_ceiling, deadline, documents, renewal, portal_link, disbursement, helpdesk]
   - Mark each as:
     * "covered": Clearly and unambiguously stated with explicit benchmarks.
     * "partially_covered": Mentioned, but key details are omitted (e.g. mentions renewal exists, but omits CGPA benchmark).
     * "not_found": Completely absent from all reviewed documents (A Digital Dark Spot!).

3. DIRECT CONFLICT DETECTION:
   - Detect pairs of claims from different sources on the same attribute that disagree (e.g. Source A says Form 16 / ITR-V required, Source B says only Tehsildar Revenue Certificate allowed and ITR is rejected; or National deadline Nov 15 vs College cut-off Oct 31).
   - Provide exact verbatim quotes from both Source A and Source B.

4. OUTDATED WARNINGS:
   - Identify sources that refer to expired cycles (e.g. 2023 or 2024 rules like old income ceiling ₹2.5L when 2026 circular is ₹3.5L), or undated forum posts.

5. UNANSWERED QUESTIONS & GAPS:
   - Identify high-stakes questions a student MUST ask their college dean or helpdesk before submitting because no reviewed notice answers them.

6. PRIORITIZED VERIFY-NEXT CHECKLIST:
   - Generate prioritized actions (P1: Critical/blocking deadline or document, P2: Prerequisite clarification, P3: Secondary allowance).
   - Specify concrete "whereToVerify" (e.g. "College Scholarship Nodal Desk", "District Revenue Office").

7. CAUTIONARY FORMULATION:
   - Use nuanced phrasing such as "Potential gap detected", "Possible contradiction", "Reported requirement".
   - Assign a realistic confidence score between 0.70 and 0.99.

Format response STRICTLY as valid JSON adhering to the required schema.
`;

  return await callWithBackoff(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    const parsedJson = JSON.parse(text);
    return AnalysisResponseSchema.parse(parsedJson);
  }, 3, 1200);
}
