## 2025-02-23 - Prevent XSS in Anchor Tags
**Vulnerability:** Unsanitized user inputs (URLs from API) rendered directly into `href` attributes in `LandingPage.jsx`.
**Learning:** React escapes text nodes by default, but it DOES NOT protect against `href="javascript:..."`. If an attacker can inject a `javascript:` or `data:` URL, XSS is possible when the user clicks the link.
**Prevention:** Implement a strict allowlist URL sanitizer (e.g., `http:`, `https:`, `mailto:`, `tel:`) using the `URL` interface and pass all user-provided links through it before rendering them in `href` attributes.

## 2025-02-23 - Prevent XSS and Open Redirect via API Responses
**Vulnerability:** Unsanitized payment URLs from the API were used directly in `href` attributes (`PaymentStatus.jsx`) and assigned to `window.location.href` (`CheckoutModal.jsx`).
**Learning:** Even internal API responses should be treated as untrusted, especially when assigning to sinks like `window.location.href` which can lead to Open Redirect or XSS (via `javascript:` URLs).
**Prevention:** Always sanitize URLs from APIs using `sanitizeUrl` before using them in anchor tags or programmatic redirects.
