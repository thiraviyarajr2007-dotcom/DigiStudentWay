import { SourceChunk } from '../../src/types';

export interface ChunkOptions {
  targetChunkSize?: number;
  overlap?: number;
}

/**
 * Splits plain text into deterministic overlapping chunks with character offsets.
 */
export function chunkDocumentText(text: string, options: ChunkOptions = {}): SourceChunk[] {
  const { targetChunkSize = 750, overlap = 100 } = options;

  if (!text || text.trim().length === 0) {
    return [];
  }

  const cleanText = text.replace(/\r\n/g, '\n').trim();
  const chunks: SourceChunk[] = [];

  let startChar = 0;
  let chunkIndex = 0;

  while (startChar < cleanText.length) {
    let endChar = Math.min(startChar + targetChunkSize, cleanText.length);

    // If we're not at the very end of the text, try to break at a newline or sentence boundary
    if (endChar < cleanText.length) {
      const boundaryWindow = cleanText.slice(Math.max(startChar, endChar - 80), endChar + 40);
      const newlineBreak = boundaryWindow.lastIndexOf('\n');
      const periodBreak = boundaryWindow.lastIndexOf('. ');

      if (newlineBreak !== -1 && newlineBreak >= 20) {
        endChar = Math.max(startChar, endChar - 80) + newlineBreak + 1;
      } else if (periodBreak !== -1 && periodBreak >= 20) {
        endChar = Math.max(startChar, endChar - 80) + periodBreak + 2;
      }
    }

    const chunkContent = cleanText.slice(startChar, endChar).trim();

    if (chunkContent.length > 0) {
      chunks.push({
        chunkIndex,
        startChar,
        endChar,
        text: chunkContent,
      });
      chunkIndex++;
    }

    if (endChar >= cleanText.length) {
      break;
    }

    // Advance startChar with overlap
    startChar = Math.max(endChar - overlap, startChar + 1);
  }

  return chunks;
}

