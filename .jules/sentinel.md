## 2025-02-23 - Prevent XSS in Anchor Tags
**Vulnerability:** Unsanitized user inputs (URLs from API) rendered directly into `href` attributes in `LandingPage.jsx`.
**Learning:** React escapes text nodes by default, but it DOES NOT protect against `href="javascript:..."`. If an attacker can inject a `javascript:` or `data:` URL, XSS is possible when the user clicks the link.
**Prevention:** Implement a strict allowlist URL sanitizer (e.g., `http:`, `https:`, `mailto:`, `tel:`) using the `URL` interface and pass all user-provided links through it before rendering them in `href` attributes.

## 2026-06-14 - Prevent XSS/Open Redirect in Payment Flow
**Vulnerability:** The API response for payment history included a `payment_url` that was rendered directly into the `href` attribute without validation.
**Learning:** Just like standard link generation, dynamic URLs generated through transaction histories (like Midtrans payment URLs) must also be sanitized, as they could be manipulated if an attacker intercepts or tampers with the API response, leading to XSS.
**Prevention:** Apply the existing `sanitizeUrl` utility to all dynamic URLs before passing them to the `href` attribute, ensuring only allowed protocols are rendered.
