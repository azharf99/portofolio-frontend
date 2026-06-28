## 2025-02-23 - Prevent XSS in Anchor Tags
**Vulnerability:** Unsanitized user inputs (URLs from API) rendered directly into `href` attributes in `LandingPage.jsx`.
**Learning:** React escapes text nodes by default, but it DOES NOT protect against `href="javascript:..."`. If an attacker can inject a `javascript:` or `data:` URL, XSS is possible when the user clicks the link.
**Prevention:** Implement a strict allowlist URL sanitizer (e.g., `http:`, `https:`, `mailto:`, `tel:`) using the `URL` interface and pass all user-provided links through it before rendering them in `href` attributes.

## 2024-05-27 - Prevent XSS in Payment URLs
**Vulnerability:** Unsanitized payment URLs from API response assigned directly to `window.location.href` and `href` attributes.
**Learning:** Even internal redirects or dynamic links (like `paymentUrl`) fetched from an API can be vectors for XSS (`javascript:`) or Open Redirect if the API payload is compromised.
**Prevention:** Always use the existing `src/lib/sanitizeUrl.js` utility before navigating via `window.location.href` or rendering `href` links for any external URLs.
