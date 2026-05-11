export function sanitizeUrl(url) {
  if (!url) return '#';
  try {
    const parsed = new URL(url, 'http://localhost');
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return url;
    }
  } catch {
    return '#';
  }
  return '#';
}
