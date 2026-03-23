/** Clean common suffixes from image alt text and filenames. e.g. "Christie Lee_Profile" → "Christie Lee" */
export const ALT_SUFFIX_PATTERN = /_(?:Profile|DTU|Axon Active|photo|avatar|pic)$/i;

/** Detect Wix hash-based filenames (no useful human-readable name). e.g. "484b05_xxx~mv2" */
export const WIX_HASH_PATTERN = /^[a-f0-9]{6}_[a-f0-9]+~mv2$/i;

/** Room numbers used at DevDay agenda. */
export const ROOM_PATTERN = /^(?:60[123]|115[1-8]|1158)$/;

/** Language codes used in agenda entries. */
export const LANG_PATTERN = /^(?:EN|VN|EN & VN|EN \\& VN)$/;

/** Match <img> tags and capture src attribute. */
export const IMG_TAG_PATTERN = /<img\s+[^>]*?src\s*=\s*["']([^"']+)["'][^>]*?>/gi;

/** Extract alt attribute from an HTML tag. */
export const ALT_ATTR_PATTERN = /alt\s*=\s*["']([^"']*)["']/i;

/** Extract Wix media ID from URL. */
export const WIX_MEDIA_ID_PATTERN = /media\/([^/]+)/;

/** Remove file extensions (e.g. ".jpg", ".png"). */
export const FILE_EXTENSION_PATTERN = /\.\w{2,4}$/;

/** Match HTML script tags (for removal). */
export const SCRIPT_TAG_PATTERN = /<script[\s\S]*?<\/script>/gi;

/** Match HTML style tags (for removal). */
export const STYLE_TAG_PATTERN = /<style[\s\S]*?<\/style>/gi;

/** Match all HTML tags (for removal). */
export const HTML_TAG_PATTERN = /<\/?[^>]+(>|$)/g;

/** Match block-level HTML tags (for line-break preservation). */
export const BLOCK_TAG_PATTERN = /<\/?(?:div|p|h[1-6]|li|tr|br|section|article|header|footer|nav|aside|main|figure|figcaption|blockquote|ul|ol|dl|dt|dd|hr)[^>]*>/gi;

/** Match time patterns like "10:30". */
export const TIME_PATTERN = /^\d{1,2}:\d{2}/;

/** Match panel discussion headers. */
export const PANEL_DISCUSSION_PATTERN = /Panel Discussion \d+\n([^\n]+)\n((?:[^\n]+\n)+?)(?=\d{1,2}:\d{2}|$)/g;
