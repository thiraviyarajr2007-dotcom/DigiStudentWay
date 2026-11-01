import { runSourceSuggestionWithFallback } from './_lib/ai';
import { checkRateLimit } from './_lib/rateLimit';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Rate limiting: 30 suggestion requests per minute
  const rate = checkRateLimit(req, 30, 60000);
  if (!rate.allowed) {
    return res.status(429).json({
      error: 'Too many source suggestion requests. Please wait a moment.',
      retryAfter: rate.retryAfter,
    });
  }

  try {
    const { query } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Valid "query" string is required.' });
    }

    const tavilyKey = process.env.TAVILY_API_KEY;

    // 1. If Tavily Key exists, perform web search
    if (tavilyKey) {
      try {
        const tavilyResp = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: tavilyKey,
            query: `${query} official notification guidelines eligibility .gov.in OR .edu.in`,
            search_depth: 'basic',
            include_domains: ['gov.in', 'nic.in', 'edu.in', 'ac.in', 'nta.ac.in', 'ugc.ac.in'],
            max_results: 5,
          }),
        });

        if (tavilyResp.ok) {
          const data = await tavilyResp.json();
          const suggestions = (data.results || []).map((r: any) => ({
            title: r.title,
            url: r.url,
            domain: new URL(r.url).hostname,
            snippet: r.content?.slice(0, 200) || '',
            reasonWhySuggested: 'Discovered via Tavily web search index across official educational domains.',
            isOfficial: r.url.includes('.gov.in') || r.url.includes('.edu.in') || r.url.includes('.ac.in'),
            userApproved: false,
          }));

          return res.status(200).json({
            provider: 'Tavily Search',
            label: 'AI Suggested Sources (Requires User Review & Approval)',
            suggestions,
          });
        }
      } catch (err) {
        console.warn('Tavily search fallback:', err);
      }
    }

    // 2. Use Gemini / OpenRouter Fallback Chain
    const result = await runSourceSuggestionWithFallback(query);

    return res.status(200).json({
      provider: result.providerName,
      label: 'AI Suggested Sources (Requires User Review & Approval)',
      suggestions: result.suggestions,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: `Failed to suggest sources: ${err?.message || 'Internal error'}`,
    });
  }
}
