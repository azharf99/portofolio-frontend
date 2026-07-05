## 2025-02-23 - Prevent XSS in Anchor Tags
**Vulnerability:** Unsanitized user inputs (URLs from API) rendered directly into `href` attributes in `LandingPage.jsx`.
**Learning:** React escapes text nodes by default, but it DOES NOT protect against `href="javascript:..."`. If an attacker can inject a `javascript:` or `data:` URL, XSS is possible when the user clicks the link.
**Prevention:** Implement a strict allowlist URL sanitizer (e.g., `http:`, `https:`, `mailto:`, `tel:`) using the `URL` interface and pass all user-provided links through it before rendering them in `href` attributes.

## 2026-07-05 - Prevent XSS via Unsafe DOM Sinks (window.location.href)
**Vulnerability:** Unsanitized payment URLs from API responses were being assigned directly to `window.location.href` in `CheckoutModal.jsx` and rendered in anchor tag `href` attributes in `PaymentStatus.jsx`.
**Learning:** React escapes HTML, but does not protect against execution from JavaScript pseudo-protocol URLs (e.g., `javascript:alert(1)`) assigned to DOM sinks like `window.location.href` or `<a> href` attributes. If an API is compromised or reflects user input into these URLs, an attacker can achieve XSS.
**Prevention:** Always validate and sanitize URLs from external sources (even first-party APIs) using the custom `sanitizeUrl` utility before assigning them to sinks like `window.location.href` or `href` attributes.
