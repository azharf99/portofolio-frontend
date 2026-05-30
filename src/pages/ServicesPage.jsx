import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import CheckoutModal from '../components/CheckoutModal';
import { ArrowLeft, ShoppingBag, Tag, Percent, ArrowRight } from 'lucide-react';

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPriceDiscountPercentage = (original, promo) => {
    if (!original || !promo || original <= promo) return 0;
    return Math.round(((original - promo) / original) * 100);
  };

  const handleOrderClick = (service) => {
    setSelectedService(service);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      <Helmet>
        <title>{t('services.all_products')} | Azhar Faturohman Ahidin</title>
        <meta name="description" content="List of premium services and digital products offered by Azhar Faturohman Ahidin, including landing pages, POS, and ERP development." />
      </Helmet>

      {/* HEADER / NAVIGATION */}
      <header className="bg-white dark:bg-gray-900 shadow-sm py-6 transition-colors border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t('login.back_to_home')}</span>
          </button>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
              {t('services.all_products')}
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-80 animate-pulse rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            {t('services.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const discount = getPriceDiscountPercentage(service.original_price, service.promo_price);
              return (
                <div
                  key={service.id}
                  className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 dark:from-blue-900/20 dark:to-indigo-800/20 relative flex items-center justify-center p-6 border-b border-gray-100 dark:border-gray-800">
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        <ShoppingBag size={44} />
                      </div>
                    )}

                    {discount > 0 && (
                      <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                        <Percent size={12} />
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/50 mb-6">
                      <div className="flex flex-col gap-1">
                        {service.original_price > 0 && service.original_price > service.promo_price && (
                          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                            <span>{t('services.original_price')}:</span>
                            <span className="line-through font-medium">
                              {formatPrice(service.original_price)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-gray-900 dark:text-white">
                            {formatPrice(service.promo_price)}
                          </span>
                          {service.original_price > 0 && service.original_price > service.promo_price && (
                            <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-0.5">
                              <Tag size={10} /> Promo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOrderClick(service)}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-300 cursor-pointer"
                    >
                      <span>{t('services.order_now')}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
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
