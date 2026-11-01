import { describe, it, expect } from 'vitest';
import { isSafePublicUrl, isPrivateIPv4 } from '../api/_lib/ssrf';

describe('SSRF Safety & Protocol Validator', () => {
  it('blocks private loopback and local IPs', () => {
    expect(isPrivateIPv4('127.0.0.1')).toBe(true);
    expect(isPrivateIPv4('10.0.0.5')).toBe(true);
    expect(isPrivateIPv4('192.168.1.1')).toBe(true);
    expect(isPrivateIPv4('172.16.0.1')).toBe(true);
    expect(isPrivateIPv4('169.254.169.254')).toBe(true); // Cloud metadata
  });

  it('permits public valid IPv4 addresses', () => {
    expect(isPrivateIPv4('8.8.8.8')).toBe(false);
    expect(isPrivateIPv4('1.1.1.1')).toBe(false);
  });

  it('blocks internal URLs and non-http schemes', () => {
    expect(isSafePublicUrl('file:///etc/passwd').safe).toBe(false);
    expect(isSafePublicUrl('ftp://example.com/file').safe).toBe(false);
    expect(isSafePublicUrl('http://localhost:3000').safe).toBe(false);
    expect(isSafePublicUrl('http://127.0.0.1:8080').safe).toBe(false);
    expect(isSafePublicUrl('http://169.254.169.254/latest/meta-data').safe).toBe(false);
    expect(isSafePublicUrl('http://internal.corp').safe).toBe(false);
  });

  it('permits legitimate public educational portals', () => {
    expect(isSafePublicUrl('https://scholarships.gov.in/guidelines').safe).toBe(true);
    expect(isSafePublicUrl('https://highered.state.gov.in/circulars').safe).toBe(true);
    expect(isSafePublicUrl('https://www.ugc.ac.in/notices').safe).toBe(true);
  });
});
