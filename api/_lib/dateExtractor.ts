/**
 * Date extraction utility for academic and governmental notices.
 * Parses HTML meta tags, JSON-LD schema, regex patterns, and cycle year tokens.
 */

export interface DateExtractionResult {
  publishedDate?: string;
  updatedDate?: string;
  cycleYear?: string;
  rawMatchedString?: string;
  sourceConfidence: 'meta_tag' | 'json_ld' | 'regex_pattern' | 'cycle_token' | 'none';
}

/**
 * Searches for academic cycle year references (e.g. 2023-24, 2025-2026, 2026-27).
 */
export function extractCycleYear(text: string): string | undefined {
  const cycleRegex = /\b(20[12]\d)\s*[-/–]\s*(20[12]\d|\d{2})\b/;
  const match = text.match(cycleRegex);
  if (match) {
    let startYear = match[1];
    let endYear = match[2];
    if (endYear.length === 2) {
      endYear = `${startYear.slice(0, 2)}${endYear}`;
    }
    return `${startYear}-${endYear}`;
  }
  return undefined;
}

/**
 * Parses dates from HTML document head and body text.
 */
export function extractDatesFromHtml(html: string, docText: string): DateExtractionResult {
  const result: DateExtractionResult = {
    sourceConfidence: 'none',
  };

  // 1. Meta tag extraction (OpenGraph, Dublin Core, Article)
  const metaPatterns = [
    /<meta\s+(?:property|name)=["']article:published_time["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']article:published_time["']/i,
    /<meta\s+(?:property|name)=["']article:modified_time["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']og:updated_time["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']date["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']dc.date["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']pubdate["']\s+content=["']([^"']+)["']/i,
  ];

  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const parsed = parseDateSafe(match[1]);
      if (parsed) {
        result.publishedDate = parsed;
        result.sourceConfidence = 'meta_tag';
        result.rawMatchedString = match[1];
        break;
      }
    }
  }

  // 2. JSON-LD Schema.org parsing
  if (!result.publishedDate) {
    const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          const date = item.datePublished || item.dateModified || item.uploadDate;
          if (date) {
            const parsed = parseDateSafe(String(date));
            if (parsed) {
              result.publishedDate = parsed;
              result.sourceConfidence = 'json_ld';
              result.rawMatchedString = String(date);
              break;
            }
          }
        }
      } catch {
        // Ignore JSON-LD parse errors
      }
      if (result.publishedDate) break;
    }
  }

  // 3. Fallback regex on visible text ("Last Updated: DD Month YYYY", "Dated: 12-09-2023")
  if (!result.publishedDate) {
    const textDateRegexes = [
      /(?:last\s+updated|updated\s+on|published\s+on|date\s+of\s+notification|dated)[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
      /(?:last\s+updated|updated\s+on|published\s+on|dated)[:\s]+(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+\d{4})/i,
      /(?:last\s+updated|updated|dated)[:\s]+(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/i,
      /(?:last\s+updated|updated|dated)[:\s]+(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/i,
    ];

    for (const rx of textDateRegexes) {
      const match = docText.match(rx);
      if (match && match[1]) {
        const parsed = parseDateSafe(match[1]);
        if (parsed) {
          result.publishedDate = parsed;
          result.sourceConfidence = 'regex_pattern';
          result.rawMatchedString = match[1];
          break;
        }
      }
    }
  }

  // 4. Always scan for cycle years in the text (e.g. "2023-24", "2026-27")
  const cycle = extractCycleYear(docText);
  if (cycle) {
    result.cycleYear = cycle;
  }

  return result;
}

/**
 * Safely parses arbitrary date string into ISO YYYY-MM-DD format.
 */
export function parseDateSafe(raw: string): string | undefined {
  try {
    const cleaned = raw.replace(/(st|nd|rd|th),?/gi, '').trim();
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) {
      // Return YYYY-MM-DD preserving calendar date without UTC offset shifting
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Continue
  }
  return undefined;
}
