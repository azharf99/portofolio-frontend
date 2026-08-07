/**
 * Static fallback content shown when the backend is unreachable (5xx / network
 * failure) so the public pages never render an empty Work or Services section.
 *
 * Source of truth for the copy below:
 *   - product-placeholder.txt  (project root)
 *   - service-placeholder.txt  (project root)
 * Keep this file in sync by hand when those files change.
 *
 * Shapes match the API payloads (`GET /portfolios`, `GET /services`) so the same
 * cards render either way. `is_placeholder` marks the record as offline copy:
 * ServiceCard uses it to send visitors to WhatsApp instead of a checkout flow
 * that cannot succeed while the backend is down.
 */

const WHATSAPP_URL = 'https://wa.me/6285702570200';

export const PLACEHOLDER_PORTFOLIOS = [
  {
    id: 'placeholder-url-shortener',
    is_placeholder: true,
    industry: 'Infrastructure',
    title: 'URL Shortener',
    description: 'Self-hosted link shortener with click analytics and custom slugs.',
    tech_stack: 'Go, Redis',
    project_link: 'https://url.azharfa.cloud',
  },
  {
    id: 'placeholder-link-in-bio',
    is_placeholder: true,
    industry: 'Product',
    title: 'Link-in-Bio Tool',
    description: "Lightweight landing-page builder for creators' social profiles.",
    tech_stack: 'React, Go',
    project_link: 'https://link.azharfa.cloud',
  },
  {
    id: 'placeholder-logicflow',
    is_placeholder: true,
    industry: 'Education',
    title: 'LogicFlow.id',
    description: 'Coding school platform — course delivery, cohorts, and student tracking.',
    tech_stack: 'Next.js, PostgreSQL',
    project_link: 'https://logicflow.id',
  },
  {
    id: 'placeholder-whatsapp-gateway',
    is_placeholder: true,
    industry: 'Messaging',
    title: 'WhatsApp Gateway',
    description: 'Multi-device messaging API for business notifications at scale.',
    tech_stack: 'Go, WebSocket',
    project_link: 'https://wa.azharfa.cloud',
  },
  {
    id: 'placeholder-telegram-gateway',
    is_placeholder: true,
    industry: 'Messaging',
    title: 'Telegram Userbot Gateway',
    description: 'Automated Telegram messaging layer with queueing and retries.',
    tech_stack: 'Go, MTProto',
    project_link: 'https://tele.azharfa.cloud',
  },
  {
    id: 'placeholder-erp-suite',
    is_placeholder: true,
    industry: 'Enterprise',
    title: 'ERP Suite',
    description: 'HR, finance, supply chain, and CRM unified in one system.',
    tech_stack: 'Go, React',
    project_link: 'https://erp.azharfa.cloud',
  },
];

export const PLACEHOLDER_SERVICES = [
  {
    id: 'placeholder-umkm-starter',
    is_placeholder: true,
    audience: 'For Cafés & Restaurants',
    title: 'UMKM Starter',
    description:
      "A point-of-sale system and a booking-ready landing page, running the day it's delivered.",
    original_price: 3000000,
    promo_price: 0,
    features:
      'POS with inventory & sales reports, Receipt printing, 1-page business landing site, WhatsApp & Email Notification',
    redirect_url: WHATSAPP_URL,
  },
  {
    id: 'placeholder-learning-suite',
    is_placeholder: true,
    audience: 'For Schools & Course Providers',
    title: 'Learning Suite',
    description:
      'An LMS for course delivery, grading, and enrollment — built for how a school actually runs a term.',
    // Custom quote: depends on student count & features.
    original_price: 0,
    promo_price: 0,
    features:
      'Course & cohort management, Assignments & grading, Student/parent portal, WhatsApp & Email Notification',
    redirect_url: WHATSAPP_URL,
  },
  {
    id: 'placeholder-enterprise-suite',
    is_placeholder: true,
    audience: 'For Growing Companies',
    title: 'Enterprise Suite',
    description:
      'ERP covering HR, finance, supply chain, and CRM — one system instead of five spreadsheets.',
    original_price: 5000000,
    promo_price: 0,
    features: 'HR & payroll module, Finance & supply chain, CRM & reporting dashboard',
    redirect_url: WHATSAPP_URL,
  },
];

/**
 * Mirrors the search/filter the API does, so the Work section keeps behaving
 * sensibly while it is running on placeholder data. Placeholder records carry no
 * `type`, so selecting a type filter correctly narrows the list to nothing.
 */
export function filterPlaceholderPortfolios({ search = '', industry = '', type = '' } = {}) {
  const query = search.trim().toLowerCase();

  return PLACEHOLDER_PORTFOLIOS.filter((item) => {
    if (industry && item.industry !== industry) return false;
    if (type && item.type !== type) return false;
    if (!query) return true;

    return [item.title, item.description, item.industry, item.tech_stack]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(query));
  });
}
