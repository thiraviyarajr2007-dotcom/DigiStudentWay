import { CredibilitySignals } from '../../src/types';

/**
 * Computes heuristic credibility indicators for an ingested document source.
 * Emphasized in UI as probabilistic signals rather than authoritative truth.
 */
export function evaluateSourceCredibility(
  urlStr: string,
  publishedDate?: string,
  isUploadedOrPasted = false
): CredibilitySignals {
  if (isUploadedOrPasted) {
    return {
      isOfficialDomain: false,
      hasHttps: true,
      hasPublishedDate: Boolean(publishedDate),
      domainScore: 75,
      domainNotes: 'User-provided primary document text snapshot.',
    };
  }

  let domain = '';
  let hasHttps = false;

  try {
    const url = new URL(urlStr);
    domain = url.hostname.toLowerCase();
    hasHttps = url.protocol === 'https:';
  } catch {
    domain = urlStr.toLowerCase();
  }

  const isGov =
    domain.endsWith('.gov.in') ||
    domain.endsWith('.nic.in') ||
    domain.endsWith('.gov') ||
    domain.includes('.gov.') ||
    domain.includes('.nic.');

  const isEdu =
    domain.endsWith('.edu.in') ||
    domain.endsWith('.ac.in') ||
    domain.endsWith('.edu') ||
    domain.includes('.ac.');

  let domainScore = 50;
  let domainNotes = 'Secondary reference portal or third-party forum.';

  if (isGov) {
    domainScore = 95;
    domainNotes = 'Official Government or Directorate domain (.gov / .nic). High primary authority.';
  } else if (isEdu) {
    domainScore = 88;
    domainNotes = 'Accredited university or academic institution domain (.edu / .ac).';
  } else if (domain.endsWith('.org')) {
    domainScore = 70;
    domainNotes = 'Non-profit or statutory organization portal.';
  }

  // Bonus for HTTPS
  if (hasHttps) {
    domainScore = Math.min(100, domainScore + 5);
  }

  // Penalty if completely undated
  if (!publishedDate) {
    domainScore = Math.max(20, domainScore - 15);
    domainNotes += ' Warning: Notice has no visible timestamp metadata.';
  }

  return {
    isOfficialDomain: isGov || isEdu,
    hasHttps,
    hasPublishedDate: Boolean(publishedDate),
    domainScore,
    domainNotes,
  };
}
