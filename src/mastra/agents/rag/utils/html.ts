import {
  SCRIPT_TAG_PATTERN,
  STYLE_TAG_PATTERN,
  HTML_TAG_PATTERN,
  BLOCK_TAG_PATTERN,
} from '@/mastra/constants';

export const stripHtmlTags = (html: string): string => {
  const withoutScripts = html.replace(SCRIPT_TAG_PATTERN, '');
  const withoutStyles = withoutScripts.replace(STYLE_TAG_PATTERN, '');
  const withoutTags = withoutStyles.replace(HTML_TAG_PATTERN, ' ');
  const normalizedWhitespace = withoutTags.replace(/\s+/g, ' ').trim();
  return normalizedWhitespace;
};

/**
 * Strip HTML but preserve line breaks (block-level tags → newlines).
 * Used for structured parsing (e.g. speaker extraction) that needs line-by-line data.
 */
export const stripHtmlPreserveLines = (html: string): string => {
  let result = html;
  result = result.replace(SCRIPT_TAG_PATTERN, '');
  result = result.replace(STYLE_TAG_PATTERN, '');
  result = result.replace(BLOCK_TAG_PATTERN, '\n');
  result = result.replace(HTML_TAG_PATTERN, ' ');
  result = result.split('\n').map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
  return result;
};

/**
 * Clean the raw text by removing irrelevant sections (partners, footer).
 * Keeps AGENDA and OUR SPEAKERS sections for searchability.
 */
export const cleanTextContent = (text: string): string => {
  let cleaned = text;

  // Remove PARTNERS section (sponsor names are not useful for queries)
  const partnersIdx = cleaned.indexOf('PARTNERS');
  if (partnersIdx > -1) {
    const nextSectionIdx = cleaned.indexOf('OUR SPEAKERS', partnersIdx);
    const contactIdx = cleaned.indexOf('Contact us', partnersIdx);
    const endIdx = nextSectionIdx > -1 ? nextSectionIdx : (contactIdx > -1 ? contactIdx : partnersIdx + 500);
    cleaned = cleaned.substring(0, partnersIdx) + cleaned.substring(endIdx);
  }

  // Remove footer/contact duplicates
  const footerIdx = cleaned.lastIndexOf('Follow us');
  if (footerIdx > -1) {
    cleaned = cleaned.substring(0, footerIdx);
  }

  return cleaned.trim();
};
