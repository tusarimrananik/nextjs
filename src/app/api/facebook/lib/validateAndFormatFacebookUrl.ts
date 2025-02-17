
export function validateAndFormatFacebookUrl(
    facebookProfileUrl: string
): {
    status: 'valid' | 'invalid';
    errors: string[];
    formattedFacebookProfileUrl: string;
} {
    // Remove all spaces and convert to lowercase.
    const cleanedUrl = facebookProfileUrl.replace(/\s+/g, '').toLowerCase();

    // Regex explanation:
    // ^(?:https?:\/\/)?          -> Optionally match "http://" or "https://"
    // (?:www\.|web\.|m\.|mbasic\.)? -> Optionally match one of the subdomains: www., web., m., or mbasic.
    // (facebook|fb)\.com\/        -> Match "facebook.com" or "fb.com" followed by a slash.
    // ([a-z0-9._]+)               -> Capture the username (allowing lowercase letters, numbers, dots, and underscores).
    // \/?$                       -> Optionally allow a trailing slash until the end of the string.
    const regex =
        /^(?:https?:\/\/)?(?:www\.|web\.|m\.|mbasic\.)?(facebook|fb)\.com\/([a-z0-9._]+)\/?$/;

    const match = cleanedUrl.match(regex);

    if (match) {
        // Extract the username from the captured group.
        const username = match[2];

        // Format the URL into the standard form.
        const formattedUrl = `https://www.facebook.com/${username}`;

        return {
            status: 'valid',
            errors: [],
            formattedFacebookProfileUrl: formattedUrl,
        };
    } else {
        return {
            status: 'invalid',
            errors: ['Invalid Facebook profile URL'],
            formattedFacebookProfileUrl: '',
        };
    }
}
