import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import CheckoutModal from '../components/CheckoutModal';
import ServiceCard from '../components/ServiceCard';
import { ArrowLeft } from 'lucide-react';

export default function ServicesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/services', {
          params: { page: 1, limit: 100 } // Fetch all services for the dedicated page
        });
        setServices(response.data.data || []);
      } catch (err) {
        setError(err.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [t]);

  const handleOrderClick = (service) => {
    setSelectedService(service);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-kinari dark:bg-aisumi font-body transition-colors duration-300">
      <Helmet>
        <title>{t('services.all_products')} | Azhar Faturohman Ahidin</title>
        <meta name="description" content="List of premium services and digital products offered by Azhar Faturohman Ahidin, including landing pages, POS, and ERP development." />
      </Helmet>

      {/* HEADER / NAVIGATION */}
      <header className="border-b border-sumi/10 dark:border-paperInk/10 py-6 sticky top-0 z-40 bg-kinari/95 dark:bg-aisumi/95 backdrop-blur-sm transition-colors">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sumi dark:text-paperInk hover:text-ai dark:hover:text-aiLight font-medium text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            <span>{t('login.back_to_home')}</span>
          </button>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-12">
          <span className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-nibi dark:text-nibiDark">
            {t('sections.services')}
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-sumi dark:text-paperInk mt-2 mb-3">
            {t('services.all_products')}
          </h1>
          <p className="text-sm md:text-base text-nibi dark:text-nibiDark max-w-xl">
            {t('services.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 border border-sumi/10 dark:border-paperInk/10 divide-x divide-sumi/10 dark:divide-paperInk/10">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-72 animate-pulse bg-kinari2 dark:bg-aisumi2" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-sm text-nibi dark:text-nibiDark">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-10 text-sm text-nibi dark:text-nibiDark">
            {t('services.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 border border-sumi/10 dark:border-paperInk/10 divide-y md:divide-y-0 md:divide-x divide-sumi/10 dark:divide-paperInk/10">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} onOrder={handleOrderClick} />
            ))}
          </div>
        )}
      </main>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        service={selectedService}
      />
    </div>
  );
}
