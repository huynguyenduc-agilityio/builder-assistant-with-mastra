import { normalizeWixUrl } from '@/mastra/utils';
import type { ExtractedImage } from '@/mastra/types';
import {
  SKIP_ALT_TEXTS,
  ALT_SUFFIX_PATTERN,
  WIX_HASH_PATTERN,
  IMG_TAG_PATTERN,
  ALT_ATTR_PATTERN,
  WIX_MEDIA_ID_PATTERN,
  FILE_EXTENSION_PATTERN,
} from '@/mastra/constants';

const extractNameFromUrl = (url: string): string => {
  const lastSegment = url.split('/').pop() || '';
  const decoded = decodeURIComponent(lastSegment).replace(/\.\w+$/, '');
  if (WIX_HASH_PATTERN.test(decoded)) return '';
  const cleaned = decoded
    .replace(ALT_SUFFIX_PATTERN, '')
    .replace(/_/g, ' ')
    .trim();
  return cleaned.toLowerCase();
};

/**
 * Extract all image URLs from raw HTML with alt text and filename info.
 */
export const extractImagesFromHtml = (html: string): ExtractedImage[] => {
  const images: ExtractedImage[] = [];
  const seenIndex = new Map<string, number>();

  const imgRegex = new RegExp(IMG_TAG_PATTERN.source, IMG_TAG_PATTERN.flags);
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const rawSrc = match[1];

    if (!rawSrc || rawSrc.length < 10) continue;
    if (rawSrc.startsWith('data:') || rawSrc.startsWith('blob:')) continue;
    if (!rawSrc.includes('wixstatic.com')) continue;

    const mediaIdMatch = rawSrc.match(WIX_MEDIA_ID_PATTERN);
    const mediaId = mediaIdMatch ? mediaIdMatch[1] : rawSrc;

    const altMatch = fullTag.match(ALT_ATTR_PATTERN);
    let alt = altMatch ? altMatch[1].trim() : '';
    alt = alt.replace(FILE_EXTENSION_PATTERN, '');
    alt = alt.replace(ALT_SUFFIX_PATTERN, '').replace(/_/g, ' ').trim();

    const src = normalizeWixUrl(rawSrc);
    const filename = extractNameFromUrl(rawSrc);

    const existingIdx = seenIndex.get(mediaId);
    if (existingIdx !== undefined) {
      const existing = images[existingIdx];
      if (!existing.alt && alt) {
        images[existingIdx] = { src, alt, filename };
      }
      continue;
    }

    seenIndex.set(mediaId, images.length);
    images.push({ src, alt, filename });
  }

  return images;
};

/**
 * Associate images with text chunks using precise matching:
 * - Match by alt text (speaker name in alt matches text in chunk)
 * - Match by URL filename (decoded filename matches text in chunk)
 *
 * Stores as structured "alt|url" pairs for better LLM matching.
 */
export const associateImagesWithChunks = (
  chunks: Array<{ text: string }>,
  images: ExtractedImage[],
): Array<string[]> => {
  return chunks.map((chunk) => {
    const chunkLower = chunk.text.toLowerCase();
    const chunkNoSpaces = chunkLower.replace(/\s+/g, '');
    const matched: string[] = [];

    for (const image of images) {
      let isMatch = false;

      if (image.alt && image.alt.length > 2) {
        const altLower = image.alt.toLowerCase();
        if (SKIP_ALT_TEXTS.has(altLower)) continue;

        if (chunkLower.includes(altLower)) {
          isMatch = true;
        }
        if (!isMatch) {
          const altNoSpaces = altLower.replace(/\s+/g, '');
          if (altNoSpaces.length > 3 && chunkNoSpaces.includes(altNoSpaces)) {
            isMatch = true;
          }
        }
      }

      if (!isMatch && image.filename && image.filename.length > 3) {
        if (chunkLower.includes(image.filename)) {
          isMatch = true;
        }
        if (!isMatch) {
          const filenameNoSpaces = image.filename.replace(/\s+/g, '');
          if (filenameNoSpaces.length > 3 && chunkNoSpaces.includes(filenameNoSpaces)) {
            isMatch = true;
          }
        }
      }

      if (isMatch) {
        const label = image.alt || image.filename || '';
        matched.push(`${label}|${image.src}`);
      }
    }

    return [...new Set(matched)];
  });
};
