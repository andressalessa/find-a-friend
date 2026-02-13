/**
 * Builds the full URL for an image stored in uploads (filename only in DB).
 */
export function getImageUrl(baseUrl: string, filename: string): string {
    const base = baseUrl.replace(/\/$/, "");
    return `${base}/uploads/${filename}`;
}
