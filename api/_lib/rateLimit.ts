/**
 * In-memory sliding window rate limiter for Vercel serverless functions.
 * Protects AI analysis endpoints from abuse and brute-force traffic.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  req: any,
  limit = 20,
  windowMs = 60000
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  const record = ipMap.get(ip);

  // Periodically clean expired records to prevent unbounded memory growth
  if (ipMap.size > 2000) {
    for (const [key, val] of ipMap.entries()) {
      if (val.resetAt < now) ipMap.delete(key);
    }
  }

  if (!record || record.resetAt < now) {
    ipMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}
