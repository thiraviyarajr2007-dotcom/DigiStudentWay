/**
 * Health check endpoint for deployment verification.
 * Returns ONLY booleans (never exposes any key, token, or secret value).
 */

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const gemini = Boolean(
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0
  );

  const openrouter = Boolean(
    process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 0
  );

  const firebase = Boolean(
    process.env.VITE_FIREBASE_PROJECT_ID ||
    process.env.VITE_FIREBASE_API_KEY ||
    process.env.FIREBASE_PROJECT_ID
  );

  return res.status(200).json({
    gemini,
    openrouter,
    firebase,
    timestamp: new Date().toISOString(),
  });
}

