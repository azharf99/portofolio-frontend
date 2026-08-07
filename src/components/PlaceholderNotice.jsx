import React from 'react';
import { useTranslation } from 'react-i18next';
import { CloudOff } from 'lucide-react';

/**
 * Shown above a section that is rendering static placeholder content because
 * the API is down. Deliberately quiet — the content is what matters, this is
 * just an honest note that it is not live data.
 */
export default function PlaceholderNotice({ className = '' }) {
  const { t } = useTranslation();

  return (
    <p
      className={`inline-flex items-center gap-2 text-xs text-nibi dark:text-nibiDark border border-sumi/10 dark:border-paperInk/10 px-3 py-2 ${className}`}
    >
      <CloudOff size={14} className="shrink-0" />
      {t('common.offline_notice')}
    </p>
  );
}
