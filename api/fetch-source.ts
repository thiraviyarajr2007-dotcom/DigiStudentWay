import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { isSafePublicUrl } from './_lib/ssrf';
import { extractDatesFromHtml } from './_lib/dateExtractor';
import { chunkDocumentText } from './_lib/chunking';
import { evaluateSourceCredibility } from './_lib/credibility';
import { Source } from '../src/types';

export default async function handler(req: any, res: any) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { url } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid "url" string is required in request body.' });
    }

    // 1. SSRF Safety check
    const safetyCheck = isSafePublicUrl(url);
    if (!safetyCheck.safe) {
      return res.status(403).json({
        error: `SSRF Protection: ${safetyCheck.reason}`,
        fallbackNotice: 'For internal or restricted networks, please copy the notice text and use the "Paste Circular Text" option.',
      });
    }

    const targetUrl = safetyCheck.url!;

    // 2. Fetch with 10s timeout and 5MB size guard
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(targetUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 DigiStudentWayBot/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({
          error: 'Connection timed out after 10 seconds. The target government or university server was unreachable.',
          suggestion: 'You can copy and paste the circular text manually.',
        });
      }
      return res.status(502).json({
        error: `Failed to fetch URL: ${fetchErr.message || 'Network error'}`,
        suggestion: 'Please verify the link is accessible or paste notice text directly.',
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Target server responded with HTTP status ${response.status} (${response.statusText}).`,
        suggestion: 'Please verify the link or paste the text directly.',
      });
    }

    // Check content-length limit (5 MB)
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 5 * 1024 * 1024) {
      return res.status(413).json({
        error: 'Page exceeds maximum size limit of 5MB. Please upload specific sections or paste text.',
      });
    }

    const html = await response.text();

    // 3. Parse with JSDOM and Readability
    const dom = new JSDOM(html, { url: targetUrl.toString() });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const title = article?.title?.trim() || dom.window.document.title?.trim() || targetUrl.hostname;
    const mainText = article?.textContent?.trim() || dom.window.document.body?.textContent?.trim() || '';

    if (mainText.length < 50) {
      return res.status(422).json({
        error: 'Could not extract sufficient text from page (likely JavaScript-rendered or portal login required).',
        suggestion: 'Please copy the notice text directly and paste it into the "Paste Circular Text" tab.',
      });
    }

    // 4. Date extraction
    const dateResult = extractDatesFromHtml(html, mainText);
    const publishedDate = dateResult.publishedDate;

    // 5. Chunking
    const chunks = chunkDocumentText(mainText, { targetChunkSize: 750, overlap: 100 });

    // 6. Credibility Evaluation
    const credibility = evaluateSourceCredibility(targetUrl.toString(), publishedDate);

    const source: Source = {
      id: `src-${Math.random().toString(36).substring(2, 9)}`,
      title,
      url: targetUrl.toString(),
      domain: targetUrl.hostname,
      crawledDate: new Date().toISOString().split('T')[0],
      publishDate: publishedDate,
      sourceType: credibility.isOfficialDomain ? 'official' : 'educational_portal',
      isOfficial: credibility.isOfficialDomain,
      reliabilityScore: credibility.domainScore,
      excerpt: mainText.slice(0, 320) + (mainText.length > 320 ? '...' : ''),
      fullText: mainText,
      chunks,
      credibilitySignals: credibility,
    };

    return res.status(200).json({ source, dates: dateResult });
  } catch (err: any) {
    return res.status(500).json({
      error: `Internal server error during source processing: ${err?.message || 'Unknown error'}`,
    });
  }
}
