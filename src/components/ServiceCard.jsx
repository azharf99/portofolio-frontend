import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { sanitizeUrl } from '../lib/sanitizeUrl';

const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);

/**
 * A single service/bundle card. Two CTA modes, chosen by price:
 * - price > 0  -> "Order now", opens the checkout/payment flow (onOrder callback).
 * - price == 0 -> "Custom quote", CTA links straight to the service's WhatsApp
 *                 redirect_url instead of the checkout flow (nothing to charge yet).
 *
 * Placeholder records (is_placeholder, rendered when the backend is down) always
 * use the WhatsApp CTA even when priced — checkout needs the API to create the
 * transaction, so sending someone into that flow would only dead-end. The price
 * itself is still shown.
 */
export default function ServiceCard({ service, onOrder }) {
  const { t } = useTranslation();
  const effectivePrice = service.promo_price > 0 ? service.promo_price : service.original_price;
  // A discount only exists when there is an actual promo price. Without the
  // promo_price > 0 guard, a service priced normally (promo_price = 0) struck
  // through its own price as if it were a discount.
  const hasDiscount = service.promo_price > 0 && service.original_price > service.promo_price;
  const isCustomQuote = !effectivePrice || effectivePrice <= 0;
  const useContactCta = isCustomQuote || Boolean(service.is_placeholder);
  const features = (service.features || '')
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col h-full border border-sumi/10 dark:border-paperInk/10 bg-white dark:bg-aisumi2 p-6 md:p-7 transition-colors hover:border-ai/50 dark:hover:border-aiLight/50">
      {service.audience && (
        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-nibi dark:text-nibiDark mb-2">
          {service.audience}
        </span>
      )}
      <h3 className="font-display text-xl md:text-[1.35rem] text-sumi dark:text-paperInk mb-2 leading-snug">
        {service.title}
      </h3>
      <p className="text-sm text-nibi dark:text-nibiDark leading-relaxed mb-5">
        {service.description}
      </p>

      {isCustomQuote ? (
        <div className="mb-5">
          <p className="font-mono text-lg text-ai dark:text-aiLight">{t('services.custom_quote')}</p>
          <p className="text-xs text-nibi dark:text-nibiDark mt-0.5">{t('services.custom_quote_note')}</p>
        </div>
      ) : (
        <div className="mb-5">
          {hasDiscount && (
            <p className="text-xs text-nibi dark:text-nibiDark line-through font-mono">
              {formatPrice(service.original_price)}
            </p>
          )}
          <p className="font-mono text-2xl tabular-nums text-ai dark:text-aiLight">
            {formatPrice(effectivePrice)}
          </p>
          <p className="text-xs text-nibi dark:text-nibiDark mt-0.5">{t('services.starting_from')}</p>
        </div>
      )}

      {features.length > 0 && (
        <ul className="mb-6 flex-grow">
          {features.map((f, i) => (
            <li
              key={i}
              className="text-sm text-nibi dark:text-nibiDark py-2 border-t border-sumi/10 dark:border-paperInk/10 first:border-t-0"
            >
              {f}
            </li>
          ))}
        </ul>
      )}
      {features.length === 0 && <div className="flex-grow" />}

      {useContactCta ? (
        <a
          href={sanitizeUrl(service.redirect_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 border border-sumi dark:border-paperInk text-sumi dark:text-paperInk font-bold text-sm uppercase tracking-wide py-3 px-6 hover:bg-ai hover:border-ai hover:text-kinari dark:hover:bg-aiLight dark:hover:border-aiLight dark:hover:text-aisumi transition-colors"
        >
          <MessageCircle size={16} />
          <span>{t('services.ask_whatsapp')}</span>
        </a>
      ) : (
        <button
          onClick={() => onOrder(service)}
          className="inline-flex items-center justify-center gap-2 bg-sumi dark:bg-paperInk text-kinari dark:text-aisumi font-bold text-sm uppercase tracking-wide py-3 px-6 hover:bg-ai dark:hover:bg-aiLight transition-colors cursor-pointer"
        >
          <span>{t('services.order_now')}</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
