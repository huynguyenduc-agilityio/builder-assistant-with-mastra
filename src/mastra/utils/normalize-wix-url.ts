/**
 * Normalize a Wix static image URL to ensure proper fill parameters.
 *
 * Wix URLs can come in broken formats:
 *   - Slash-separated params: /v1/fill/w_175/h_175/quality_auto/file.jpg
 *   - With crop: /v1/crop/x_130,y_0,w_540,h_600/fill/w_90/h_100/quality_auto/file.jpg
 *
 * This normalizes them to the valid comma-separated format:
 *   /v1/fill/w_175,h_175,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/file.jpg
 */
export const normalizeWixUrl = (url: string): string => {
  if (!url.includes('wixstatic.com')) return url;

  // Extract the media path: everything up to and including the media ID
  const mediaMatch = url.match(/(https?:\/\/static\.wixstatic\.com\/media\/[^/]+)/);
  if (!mediaMatch) return url;
  const mediaPath = mediaMatch[1];

  // Extract the final filename (last path segment)
  const lastSlash = url.lastIndexOf('/');
  if (lastSlash <= mediaPath.length) return url;
  const filename = url.substring(lastSlash + 1);

  // Get everything between media path and filename
  const middle = url.substring(mediaPath.length, lastSlash);

  // Already valid? (has comma-separated params with al_c)
  if (middle.includes('al_c') && middle.includes(',h_')) {
    return url;
  }

  // Handle crop: /v1/crop/{cropParams}/fill/{fillParams...}
  let cropPart = '';
  let fillSection = middle;

  const cropMatch = middle.match(/\/v1\/crop\/([^/]+)\//);
  if (cropMatch) {
    cropPart = `/v1/crop/${cropMatch[1]}/`;
    const fillIdx = middle.indexOf('/fill/', cropMatch.index! + cropMatch[0].length - 1);
    fillSection = fillIdx >= 0 ? middle.substring(fillIdx) : middle.substring(cropMatch[0].length);
  }

  // Extract all tokens from the fill section (split by / and ,)
  const tokens = fillSection
    .replace(/^\/v1\/fill\/?|^\/fill\/?/, '')
    .split(/[/,]/)
    .map((t) => t.trim())
    .filter(Boolean);

  // Read existing w and h
  let w = 200;
  let h = 200;
  for (const t of tokens) {
    if (/^w_\d+$/.test(t)) w = parseInt(t.substring(2));
    if (/^h_\d+$/.test(t)) h = parseInt(t.substring(2));
  }

  const params = `w_${w},h_${h},al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto`;
  const prefix = cropPart || '/v1/';
  return `${mediaPath}${prefix}fill/${params}/${filename}`;
};
