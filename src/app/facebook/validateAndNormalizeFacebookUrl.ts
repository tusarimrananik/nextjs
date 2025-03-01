export const validateAndNormalizeFacebookUrl = (url: string): string => {
    let normalized = url.trim().toLowerCase();
    normalized = normalized.replace(/^http:\/\//, 'https://');
    if (!normalized.startsWith('https://')) {
        normalized = `https://${normalized}`;
    }
    const facebookRegex = /^https:\/\/(www|m|mobile|lite)\.facebook\.com\//i;
    if (!facebookRegex.test(normalized)) {
        throw new Error('Invalid Facebook URL');
    }
    return normalized;
};