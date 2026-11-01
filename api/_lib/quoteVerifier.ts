import { Source, SourceChunk } from '../../src/types';

export interface QuoteVerificationResult {
  isVerified: boolean;
  matchType?: 'exact' | 'normalized_whitespace' | 'fuzzy_substring';
  matchedChunkIndex?: number;
  charOffset?: { start: number; end: number };
  rejectionReason?: string;
}

/**
 * Normalizes text for robust comparison by collapsing multiple whitespaces and standardizing quotes.
 */
export function normalizeText(str: string): string {
  return str
    .replace(/[\u2018\u2019]/g, "'") // Smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
    .replace(/[\u2013\u2014]/g, '-') // En-dash & em-dash
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Verifies whether a given quote extracted by the LLM truly exists within the provided source text or chunks.
 * Anti-hallucination guardrail to guarantee provenance.
 */
export function verifyQuoteInSource(
  quote: string,
  source: Source,
  preferredChunkIndex?: number
): QuoteVerificationResult {
  if (!quote || quote.trim().length === 0) {
    return { isVerified: false, rejectionReason: 'Empty quote provided' };
  }

  const rawQuote = quote.trim();
  const normQuote = normalizeText(rawQuote);

  // If quote is too short (< 10 chars), it has high probability of random matching
  if (normQuote.length < 10) {
    return {
      isVerified: false,
      rejectionReason: 'Quote is too short (< 10 chars) for meaningful attribution',
    };
  }

  const fullText = source.fullText || source.excerpt || '';
  const chunks: SourceChunk[] = source.chunks || [];

  // 1. Check preferred chunk first if provided
  if (preferredChunkIndex !== undefined && chunks[preferredChunkIndex]) {
    const chunkText = chunks[preferredChunkIndex].text;
    if (chunkText.includes(rawQuote)) {
      const idx = chunkText.indexOf(rawQuote);
      return {
        isVerified: true,
        matchType: 'exact',
        matchedChunkIndex: preferredChunkIndex,
        charOffset: {
          start: chunks[preferredChunkIndex].startChar + idx,
          end: chunks[preferredChunkIndex].startChar + idx + rawQuote.length,
        },
      };
    }

    if (normalizeText(chunkText).includes(normQuote)) {
      return {
        isVerified: true,
        matchType: 'normalized_whitespace',
        matchedChunkIndex: preferredChunkIndex,
      };
    }
  }

  // 2. Check all chunks
  for (const chunk of chunks) {
    if (chunk.text.includes(rawQuote)) {
      const idx = chunk.text.indexOf(rawQuote);
      return {
        isVerified: true,
        matchType: 'exact',
        matchedChunkIndex: chunk.chunkIndex,
        charOffset: {
          start: chunk.startChar + idx,
          end: chunk.startChar + idx + rawQuote.length,
        },
      };
    }

    if (normalizeText(chunk.text).includes(normQuote)) {
      return {
        isVerified: true,
        matchType: 'normalized_whitespace',
        matchedChunkIndex: chunk.chunkIndex,
      };
    }
  }

  // 3. Fallback: Search the full text directly
  if (fullText.includes(rawQuote)) {
    const idx = fullText.indexOf(rawQuote);
    return {
      isVerified: true,
      matchType: 'exact',
      charOffset: { start: idx, end: idx + rawQuote.length },
    };
  }

  const normFullText = normalizeText(fullText);
  if (normFullText.includes(normQuote)) {
    return {
      isVerified: true,
      matchType: 'normalized_whitespace',
    };
  }

  // 4. Substring test: If the quote is long, check if at least 70% of words appear contiguously
  const words = normQuote.split(' ');
  if (words.length >= 8) {
    const coreSlice = words.slice(1, -1).join(' ');
    if (normFullText.includes(coreSlice)) {
      return {
        isVerified: true,
        matchType: 'fuzzy_substring',
      };
    }
  }

  // Quote does NOT exist in source text -> Anti-Hallucination Rejection!
  return {
    isVerified: false,
    rejectionReason: `Verbatim quote was not found in source text for "${source.title || source.domain}". Flagged as ungrounded or modified claim.`,
  };
}

