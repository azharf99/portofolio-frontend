import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { isServerDown } from '../services/api';
import CheckoutModal from './CheckoutModal';
import ServiceCard from './ServiceCard';
import PlaceholderNotice from './PlaceholderNotice';
import { PLACEHOLDER_SERVICES } from '../data/placeholderContent';
import { ArrowRight } from 'lucide-react';

export default function ServicesSection({ limit = 6, showSeeMore = true }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingPlaceholder, setUsingPlaceholder] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/services', {
          params: { page: 1, limit: limit }
        });
        setServices(response.data.data || []);
        setUsingPlaceholder(false);
      } catch (err) {
        // Backend down (5xx / unreachable): fall back to the static service
        // list so visitors still see what is on offer and how to reach out.
        if (isServerDown(err)) {
          setServices(PLACEHOLDER_SERVICES.slice(0, limit));
          setUsingPlaceholder(true);
        } else {
          setError(err.message || t('common.error'));
          setUsingPlaceholder(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [limit, t]);

  const handleOrderClick = (service) => {
    setSelectedService(service);
    setIsCheckoutOpen(true);
  };

  if (loading) {
    return (
      <section className="border-b border-sumi/10 dark:border-paperInk/10 py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-6 w-40 bg-kinari2 dark:bg-aisumi2 animate-pulse mb-3"></div>
          <div className="h-4 w-72 bg-kinari2 dark:bg-aisumi2 animate-pulse mb-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-sumi/10 dark:border-paperInk/10 divide-x divide-sumi/10 dark:divide-paperInk/10">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-72 animate-pulse bg-kinari2 dark:bg-aisumi2" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border-b border-sumi/10 dark:border-paperInk/10 py-16 px-6 text-center">
        <p className="text-sm text-nibi dark:text-nibiDark">{error}</p>
      </section>
    );
  }

  if (services.length === 0) {
    return null; // Don't render anything if there are no services
  }

  return (
    <section className="border-b border-sumi/10 dark:border-paperInk/10 py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 md:mb-14">
          <span className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-nibi dark:text-nibiDark">
            {t('sections.services')}
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-sumi dark:text-paperInk mt-2 mb-3">
            {t('services.title')}
          </h2>
          <p className="text-sm md:text-base text-nibi dark:text-nibiDark max-w-xl">
            {t('services.subtitle')}
          </p>
          {usingPlaceholder && <PlaceholderNotice className="mt-5" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-sumi/10 dark:border-paperInk/10 divide-y md:divide-y-0 md:divide-x divide-sumi/10 dark:divide-paperInk/10">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} onOrder={handleOrderClick} />
          ))}
        </div>

        {showSeeMore && !usingPlaceholder && services.length >= limit && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 border border-sumi/20 dark:border-paperInk/20 text-sumi dark:text-paperInk text-sm font-semibold uppercase tracking-wide px-6 py-3 hover:border-ai hover:text-ai dark:hover:border-aiLight dark:hover:text-aiLight transition-colors"
            >
              <span>{t('services.see_more')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        service={selectedService}
      />
    </section>
  );
}
