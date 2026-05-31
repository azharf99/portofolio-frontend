import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { sanitizeUrl } from '../lib/sanitizeUrl';

export default function CheckoutModal({ isOpen, onClose, service }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !service) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const activePrice = service.promo_price > 0 ? service.promo_price : service.original_price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError(t('checkout.error_required'));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/checkout', {
        service_id: service.id,
        name: name,
        email: email,
        phone: phone
      });

      const paymentUrl = response.data?.data?.payment_url;
      if (paymentUrl) {
        const safeUrl = sanitizeUrl(paymentUrl);
        if (safeUrl === '#') {
           throw new Error('Security Error: Invalid payment URL received.');
        }
        window.location.href = safeUrl;
      } else {
        throw new Error('No payment URL returned from the server.');
      }
    } catch (err) {
      setError(err.message || t('common.error'));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with backdrop-blur */}
      <div 
        className="fixed inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
        {/* Decorative Header Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('checkout.title')}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          {/* Service Summary Card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/80 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {t('portfolio.type')}
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {service.title}
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                {formatPrice(activePrice)}
              </span>
              {service.original_price > activePrice && (
                <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                  {formatPrice(service.original_price)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            {t('checkout.subtitle')}
          </p>

          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 flex items-start gap-3 text-red-700 dark:text-red-400 text-sm">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {t('checkout.name')} <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-2xl bg-gray-100/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {t('checkout.email')} <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-2xl bg-gray-100/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {t('checkout.phone')}
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-2xl bg-gray-100/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="081234567890"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3.5 px-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {t('checkout.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? t('checkout.submitting') : t('checkout.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
