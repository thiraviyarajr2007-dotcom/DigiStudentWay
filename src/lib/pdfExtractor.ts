import * as pdfjsLib from 'pdfjs-dist';
import { Source } from '../types';
import { chunkDocumentText } from '../../api/_lib/chunking';

// Set up pdfjs worker using CDN fallback if local worker isn't configured in bundler
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Extracts plain text from an uploaded File (PDF or plain text).
 */
export async function extractTextFromFile(file: File): Promise<{
  title: string;
  fullText: string;
  source: Source;
}> {
  const fileName = file.name;
  let fullText = '';

  if (file.name.toLowerCase().endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;

    const pageTexts: string[] = [];
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean);
      pageTexts.push(`[Page ${pageNum}]\n` + pageStrings.join(' '));
    }
    fullText = pageTexts.join('\n\n');
  } else {
    // Treat as UTF-8 plain text (.txt, .md, .csv)
    fullText = await file.text();
  }

  const cleanText = fullText.trim();
  const chunks = chunkDocumentText(cleanText, { targetChunkSize: 750, overlap: 100 });

  const source: Source = {
    id: `src-upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
    url: `file://${fileName}`,
    domain: 'Local Document',
    crawledDate: new Date().toISOString().split('T')[0],
    sourceType: 'uploaded_doc',
    isOfficial: fileName.toLowerCase().includes('official') || fileName.toLowerCase().includes('gazette'),
    reliabilityScore: 85,
    excerpt: cleanText.slice(0, 320) + (cleanText.length > 320 ? '...' : ''),
    fullText: cleanText,
    chunks,
    credibilitySignals: {
      isOfficialDomain: false,
      hasHttps: true,
      hasPublishedDate: false,
      domainScore: 85,
      domainNotes: `Uploaded document: ${fileName} (${chunks.length} extracted chunks)`,
    },
  };

  return {
    title: source.title,
    fullText: cleanText,
    source,
  };
}
