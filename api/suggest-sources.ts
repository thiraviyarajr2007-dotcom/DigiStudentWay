import { GoogleGenAI } from '@google/genai';
import { isSafePublicUrl } from './_lib/ssrf';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { query } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Valid "query" string is required.' });
    }

    const tavilyKey = process.env.TAVILY_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

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
            provider: 'tavily',
            label: 'AI Suggested Sources (Requires User Review & Approval)',
            suggestions,
          });
        }
      } catch (err) {
        console.warn('Tavily search fallback:', err);
      }
    }

    // 2. If Gemini Key exists, ask Gemini for recommended portals and circular links
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const prompt = `
For the academic / student inquiry: "${query}", suggest 3 to 4 authoritative official portals or gazette pages (prioritizing .gov.in, .edu.in, .ac.in).
Output as JSON:
{
  "suggestions": [
    {
      "title": "Title of scheme portal or circular",
      "url": "https://...",
      "domain": "...",
      "snippet": "Why this document is vital to verify",
      "reasonWhySuggested": "...",
      "isOfficial": true
    }
  ]
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        const safeSuggestions = (parsed.suggestions || []).filter((s: any) => {
          if (!s.url) return false;
          return isSafePublicUrl(s.url).safe;
        });

        return res.status(200).json({
          provider: 'gemini_grounding',
          label: 'AI Suggested Sources (Requires User Review & Approval)',
          suggestions: safeSuggestions,
        });
      } catch (err) {
        console.warn('Gemini grounding fallback:', err);
      }
    }

    // 3. Fallback standard educational suggestions
    const defaultSuggestions = [
      {
        title: 'National Scholarship Portal (Central Schemes)',
        url: 'https://scholarships.gov.in/guidelines/pms-2026',
        domain: 'scholarships.gov.in',
        snippet: 'Official central guidelines for national post-matric and higher education scholarships.',
        reasonWhySuggested: 'Central statutory repository for student benefit transfers.',
        isOfficial: true,
        userApproved: false,
      },
      {
        title: 'State Higher Education Council Portal',
        url: 'https://highered.state.gov.in/circulars/pms-verification-rules',
        domain: 'highered.state.gov.in',
        snippet: 'State nodal verification orders, revenue authority rules, and institutional desk cut-offs.',
        reasonWhySuggested: 'Contains local quota verification requirements and document formats.',
        isOfficial: true,
        userApproved: false,
      },
      {
        title: 'University Grants Commission (UGC) Student Welfare Notice Board',
        url: 'https://www.ugc.gov.in/notices',
        domain: 'ugc.gov.in',
        snippet: 'Central statutory regulations on fee refunds, attendance thresholds, and degree equivalency.',
        reasonWhySuggested: 'Primary authority for university academic compliance rules.',
        isOfficial: true,
        userApproved: false,
      },
    ];

    return res.status(200).json({
      provider: 'curated_index',
      label: 'Recommended Authority Portals (Requires User Review & Approval)',
      suggestions: defaultSuggestions,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: `Failed to suggest sources: ${err?.message || 'Unknown error'}`,
    });
  }
}
