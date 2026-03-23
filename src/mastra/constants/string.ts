export const VIETNAMESE_PATTERN =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

/** Delimiter for separating multiple image entries in vector metadata. */
export const IMAGE_URLS_DELIMITER = ';;;';

/**
 * Company/org alt texts that should be skipped during image-chunk matching.
 * These are sponsor logos, social media icons, etc. — not speaker avatars.
 */
export const SKIP_ALT_TEXTS = new Set([
  'binance', 'enosta', 'orochi', 'astraler', 'saigon technology', 'enouvo',
  'superteamvn', 'mgm', 'cmc global', 'orient software', 'rikei', 'kozoom',
  'kms', 'goline global', 'tecalliance', 'aptos', 'open web',
  'tas dg', 'agility io', 'axon active vietnam', 'facebook', 'linkedin',
  'duy tân university', 'duy tan university',
]);
