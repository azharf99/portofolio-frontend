## 2025-02-23 - Prevent XSS in Anchor Tags
**Vulnerability:** Unsanitized user inputs (URLs from API) rendered directly into `href` attributes in `LandingPage.jsx`.
**Learning:** React escapes text nodes by default, but it DOES NOT protect against `href="javascript:..."`. If an attacker can inject a `javascript:` or `data:` URL, XSS is possible when the user clicks the link.
**Prevention:** Implement a strict allowlist URL sanitizer (e.g., `http:`, `https:`, `mailto:`, `tel:`) using the `URL` interface and pass all user-provided links through it before rendering them in `href` attributes.
## 2024-03-24 - Unsanitized Payment URL Navigation
**Vulnerability:** User was redirected via window.location.href or <a> tags based on an unsanitized API response field (tx.payment_url).
**Learning:** When navigating users based on dynamic or remote URLs, we must always sanitize it to prevent DOM-based XSS (e.g. javascript: URLs).
**Prevention:** Utilize the existing src/lib/sanitizeUrl.js whenever user or API input dictates window navigation or hyperlink destinations.
