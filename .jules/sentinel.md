## 2025-02-23 - Prevent XSS in Anchor Tags
**Vulnerability:** Unsanitized user inputs (URLs from API) rendered directly into `href` attributes in `LandingPage.jsx`.
**Learning:** React escapes text nodes by default, but it DOES NOT protect against `href="javascript:..."`. If an attacker can inject a `javascript:` or `data:` URL, XSS is possible when the user clicks the link.
**Prevention:** Implement a strict allowlist URL sanitizer (e.g., `http:`, `https:`, `mailto:`, `tel:`) using the `URL` interface and pass all user-provided links through it before rendering them in `href` attributes.

## 2025-02-23 - Prevent XSS in dynamic URL assignments (window.location / hrefs)
**Vulnerability:** Unsanitized payment URL fetched from API used in `window.location.href = ...` and rendered directly in `href` tag in `PaymentSuccess.jsx`.
**Learning:** External URLs returned from the API must be sanitized not only when put in an anchor tag's `href` attribute, but also when programmatically navigating the browser using `window.location.href`. An attacker could return a `javascript:...` URL to execute arbitrary code.
**Prevention:** Always run API-provided dynamic URLs through the `sanitizeUrl` utility before programmatic redirects or using them in the DOM to avoid javascript execution via XSS.
