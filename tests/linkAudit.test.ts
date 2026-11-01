import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Define the valid route regex patterns supported in App.tsx
const VALID_ROUTE_PATTERNS: RegExp[] = [
  /^\/$/,                                // Home / landing
  /^\/auth(\?.*)?$/,                     // Auth page with optional query params
  /^\/how-it-works$/,                    // Transparency page
  /^\/privacy$/,                         // Privacy policy
  /^\/app\/new$/,                        // New Analysis
  /^\/app\/analysis\/[a-zA-Z0-9_\-]+$/,  // Analysis dashboard
  /^\/app\/history$/,                    // History archive
  /^\/app\/settings$/,                   // Profile and settings
  // Redirect routes defined in App.tsx
  /^\/dashboard$/,
  /^\/new$/,
  /^\/history$/,
  /^\/profile$/,
  /^\/settings$/,
  /^\/transparency$/,
];

function isValidDestination(url: string): boolean {
  // Strip hash or query params if any
  const cleanUrl = url.split('#')[0];
  return VALID_ROUTE_PATTERNS.some(pattern => pattern.test(cleanUrl));
}

function getAllSourceFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllSourceFiles(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Link Audit & Routing Integrity', () => {
  it('every <Link to="..."> and navigate() target in src maps to an existing route', () => {
    const srcDir = path.resolve(__dirname, '../src');
    const sourceFiles = getAllSourceFiles(srcDir);
    const brokenLinks: Array<{ file: string; target: string }> = [];

    // Regex to match <Link to="..."> or <Link to={`...`}>
    const linkToRegex = /<Link\s+[^>]*to=["'`]([^"'`$]+)["'`]/g;
    // Regex to match navigate('...') or navigate("...")
    const navigateRegex = /navigate\(["'`]([^"'`$]+)["'`]/g;

    for (const filePath of sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check Link to targets
      let match;
      while ((match = linkToRegex.exec(content)) !== null) {
        const target = match[1];
        // Skip external or mailto links
        if (target.startsWith('http') || target.startsWith('mailto:')) continue;
        if (!isValidDestination(target)) {
          brokenLinks.push({ file: path.basename(filePath), target });
        }
      }

      // Check navigate targets
      while ((match = navigateRegex.exec(content)) !== null) {
        const target = match[1];
        if (target.startsWith('http') || target.startsWith('mailto:')) continue;
        if (!isValidDestination(target)) {
          brokenLinks.push({ file: path.basename(filePath), target });
        }
      }
    }

    if (brokenLinks.length > 0) {
      console.error('Found broken or unregistered route destinations:', brokenLinks);
    }

    expect(brokenLinks).toHaveLength(0);
  });
});
