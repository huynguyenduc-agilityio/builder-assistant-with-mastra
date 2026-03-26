import type { PartnerEntry } from '@/mastra/types';
import { IMG_TAG_PATTERN, ALT_ATTR_PATTERN } from '@/mastra/constants';

/**
 * Partner category headings used on the DevDay website.
 * Order matters — they appear sequentially in the HTML.
 */
const PARTNER_CATEGORIES = [
  'Organizer',
  'Supported by',
  'Platinum sponsor',
  'Platinum Sponsor',
  'Gold Sponsor',
  'Gold sponsor',
  'Silver Sponsor',
  'Silver sponsor',
  'Exhibitor',
  'Companion',
  'Media Partner',
  'Media partner',
] as const;

/**
 * Extract structured partner/sponsor entries from raw HTML.
 *
 * Partner names on the DevDay website are stored as image `alt` attributes
 * inside the Partners section. The plain-text extraction loses them because
 * `stripHtmlTags` drops `alt` values.
 *
 * Strategy:
 * 1. Locate the Partners section in the HTML (look for "Partners" heading).
 * 2. Find the end of the Partners section (next major section heading).
 * 3. Within that HTML slice, split by category headings.
 * 4. Extract partner names from `<img alt="...">` tags in each category.
 */
export const extractStructuredPartnerChunks = (html: string): string[] => {
  const entries: PartnerEntry[] = [];

  // Find Partners section bounds in the HTML
  const partnersStart = findPartnersSection(html);
  if (partnersStart === -1) return [];

  // Find the end of the Partners section (next major section)
  const partnersEnd = findPartnersSectionEnd(html, partnersStart);
  const partnersHtml = html.substring(partnersStart, partnersEnd);

  // Parse each category and extract partner names from img alt attributes
  for (const category of PARTNER_CATEGORIES) {
    const categoryIdx = partnersHtml.indexOf(category);
    if (categoryIdx === -1) continue;

    // Find the next category to bound this one
    let nextCategoryIdx = partnersHtml.length;
    for (const nextCat of PARTNER_CATEGORIES) {
      if (nextCat === category) continue;
      const idx = partnersHtml.indexOf(nextCat, categoryIdx + category.length);
      if (idx > -1 && idx < nextCategoryIdx) {
        nextCategoryIdx = idx;
      }
    }

    const categoryHtml = partnersHtml.substring(categoryIdx, nextCategoryIdx);
    const names = extractPartnerNamesFromHtml(categoryHtml);

    // Normalize category (title case, singular form)
    const normalizedCategory = normalizeCategory(category);

    for (const name of names) {
      // Avoid duplicates within the same category
      const isDuplicate = entries.some(
        (e) =>
          e.name.toLowerCase() === name.toLowerCase() &&
          e.category === normalizedCategory,
      );
      if (!isDuplicate) {
        entries.push({ name, category: normalizedCategory });
      }
    }
  }

  if (entries.length === 0) return [];

  // Group by category for a cleaner chunk structure
  const grouped = new Map<string, string[]>();
  for (const entry of entries) {
    const existing = grouped.get(entry.category) || [];
    existing.push(entry.name);
    grouped.set(entry.category, existing);
  }

  // Create one chunk that lists all partners by category
  const lines: string[] = ['DevDay 2026 Partners / Sponsors:'];
  for (const [category, names] of grouped) {
    lines.push(`${category}: ${names.join(', ')}`);
  }

  return [lines.join('\n')];
};

/**
 * Find the start of the Partners section in the HTML.
 * Looks for headings containing "Partners" (e.g. "DevDay 2026 Partners").
 */
const findPartnersSection = (html: string): number => {
  // Try common heading patterns
  const patterns = [/Partners\s*<\//i, /Partners\s*$/im];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match.index !== undefined) {
      return match.index;
    }
  }

  // Fallback: simple text search
  const idx = html.indexOf('Partners');
  return idx;
};

/**
 * Find the end of the Partners section by looking for the next major section.
 */
const findPartnersSectionEnd = (html: string, start: number): number => {
  // Look for next section headings that typically follow Partners
  const nextSections = [
    'Agenda',
    'OUR SPEAKERS',
    'Speakers',
    'Recap',
    'Experience',
    'Contact',
  ];

  let endIdx = html.length;
  for (const section of nextSections) {
    const idx = html.indexOf(section, start + 100);
    if (idx > -1 && idx < endIdx) {
      endIdx = idx;
    }
  }

  return endIdx;
};

/**
 * Extract partner names from `<img alt="...">` tags within an HTML fragment.
 * Filters out generic/empty alt texts.
 */
const extractPartnerNamesFromHtml = (html: string): string[] => {
  const names: string[] = [];
  const imgRegex = new RegExp(IMG_TAG_PATTERN.source, IMG_TAG_PATTERN.flags);
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const altMatch = fullTag.match(ALT_ATTR_PATTERN);

    if (altMatch) {
      const alt = altMatch[1]?.trim();
      if (
        alt &&
        alt.length > 1 &&
        !alt.startsWith('http') &&
        !alt.includes('.png') &&
        !alt.includes('.jpg') &&
        !alt.includes('.svg') &&
        alt.toLowerCase() !== 'logo' &&
        alt.toLowerCase() !== 'image' &&
        alt.toLowerCase() !== 'icon'
      ) {
        names.push(alt);
      }
    }
  }

  return names;
};

/**
 * Normalize category names to a consistent format.
 */
const normalizeCategory = (category: string): string => {
  const map: Record<string, string> = {
    Organizer: 'Organizer',
    'Supported by': 'Supported by',
    'Platinum sponsor': 'Platinum Sponsor',
    'Platinum Sponsor': 'Platinum Sponsor',
    'Gold Sponsor': 'Gold Sponsor',
    'Gold sponsor': 'Gold Sponsor',
    'Silver Sponsor': 'Silver Sponsor',
    'Silver sponsor': 'Silver Sponsor',
    Exhibitor: 'Exhibitor',
    Companion: 'Companion',
    'Media Partner': 'Media Partner',
    'Media partner': 'Media Partner',
  };
  return map[category] || category;
};
