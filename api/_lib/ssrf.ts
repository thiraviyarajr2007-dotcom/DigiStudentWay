/**
 * SSRF and safe URL validation utility.
 * Protects serverless functions against private network probing and cloud metadata abuse.
 */

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // AWS / GCP / Azure metadata endpoint
  'metadata.google.internal',
  'instance-data',
]);

/**
 * Checks if an IPv4 address belongs to a private, loopback, or link-local range.
 */
export function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed IPv4 is treated as unsafe
  }

  const [a, b] = parts;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 10.0.0.0/8 (Private)
  if (a === 10) return true;
  // 172.16.0.0/12 (Private 172.16 - 172.31)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;
  // 169.254.0.0/16 (Link-local & Cloud Metadata)
  if (a === 169 && b === 254) return true;
  // 0.0.0.0/8 (Broadcast/Current network)
  if (a === 0) return true;

  return false;
}

/**
 * Validates whether a given URL is safe to fetch from server-side.
 */
export function isSafePublicUrl(urlString: string): { safe: boolean; reason?: string; url?: URL } {
  try {
    const url = new URL(urlString);

    // Only allow HTTP and HTTPS
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { safe: false, reason: `Disallowed protocol "${url.protocol}". Only HTTP/HTTPS allowed.` };
    }

    const hostname = url.hostname.toLowerCase();

    // Check blocked exact hostnames
    if (BLOCKED_HOSTNAMES.has(hostname)) {
      return { safe: false, reason: `Access to restricted internal host "${hostname}" is blocked.` };
    }

    // Check if hostname is an IP literal
    const isIpv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (isIpv4Pattern.test(hostname)) {
      if (isPrivateIPv4(hostname)) {
        return { safe: false, reason: `Access to private IP range "${hostname}" is prohibited.` };
      }
    }

    // Block common internal TLDs
    if (
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.corp') ||
      hostname.endsWith('.lan')
    ) {
      return { safe: false, reason: `Access to local network TLD "${hostname}" is blocked.` };
    }

    return { safe: true, url };
  } catch (err: any) {
    return { safe: false, reason: `Malformed URL string: ${err?.message || 'Invalid syntax'}` };
  }
}
