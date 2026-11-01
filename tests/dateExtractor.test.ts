import { describe, it, expect } from 'vitest';
import { extractDatesFromHtml, extractCycleYear, parseDateSafe } from '../api/_lib/dateExtractor';

describe('Date & Cycle Year Extractor', () => {
  it('extracts date from OpenGraph / article meta tags', () => {
    const html = `
      <html>
        <head>
          <meta property="article:published_time" content="2026-09-15T10:30:00Z" />
        </head>
        <body><p>Scholarship circular content</p></body>
      </html>
    `;
    const result = extractDatesFromHtml(html, 'Scholarship circular content');
    expect(result.publishedDate).toBe('2026-09-15');
    expect(result.sourceConfidence).toBe('meta_tag');
  });

  it('extracts date from JSON-LD schema.org script blocks', () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "headline": "PMS Guidelines Released",
              "datePublished": "2026-08-30"
            }
          </script>
        </head>
        <body><h1>Guidelines</h1></body>
      </html>
    `;
    const result = extractDatesFromHtml(html, 'Guidelines');
    expect(result.publishedDate).toBe('2026-08-30');
    expect(result.sourceConfidence).toBe('json_ld');
  });

  it('falls back to regex for visible "Last updated" timestamps', () => {
    const html = `<html><body><p>Some header</p></body></html>`;
    const text = 'Notice on fee exemption. Last updated on: October 24, 2026 for college verification.';
    const result = extractDatesFromHtml(html, text);
    expect(result.publishedDate).toBe('2026-10-24');
    expect(result.sourceConfidence).toBe('regex_pattern');
  });

  it('extracts academic cycle year tokens like 2023-24 and 2026-27', () => {
    expect(extractCycleYear('Guidelines for Academic Session 2023-24')).toBe('2023-2024');
    expect(extractCycleYear('PMS Scheme 2026-27 Notification')).toBe('2026-2027');
    expect(extractCycleYear('General terms without years')).toBeUndefined();
  });

  it('safely parses human-formatted dates into standard ISO YYYY-MM-DD', () => {
    expect(parseDateSafe('15th September, 2026')).toBe('2026-09-15');
    expect(parseDateSafe('August 30 2026')).toBe('2026-08-30');
    expect(parseDateSafe('invalid-text-string')).toBeUndefined();
  });
});
