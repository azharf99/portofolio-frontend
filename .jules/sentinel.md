## 2025-02-23 - Prevent XSS in Anchor Tags
**Vulnerability:** Unsanitized user inputs (URLs from API) rendered directly into `href` attributes in `LandingPage.jsx`.
**Learning:** React escapes text nodes by default, but it DOES NOT protect against `href="javascript:..."`. If an attacker can inject a `javascript:` or `data:` URL, XSS is possible when the user clicks the link.
**Prevention:** Implement a strict allowlist URL sanitizer (e.g., `http:`, `https:`, `mailto:`, `tel:`) using the `URL` interface and pass all user-provided links through it before rendering them in `href` attributes.

## $(date +%Y-%m-%d) - [Vulnerable Dependencies]
**Vulnerability:** Found out-of-date, highly vulnerable dependencies in package.json including axios, vite, postcss, and follow-redirects.
**Learning:** These dependencies had known SSRF, path traversal, and prototype pollution vulnerabilities.
**Prevention:** Regularly run `npm audit` to check for and upgrade vulnerable dependencies to prevent security loopholes via third-party packages.
