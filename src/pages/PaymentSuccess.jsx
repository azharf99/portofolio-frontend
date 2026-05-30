import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowLeft, Search, Calendar, CreditCard, Tag, Clock } from 'lucide-react';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function PaymentSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setHistory([]);
    
    if (!email.trim()) return;

    setLoading(true);
    try {
      const response = await api.get('/transactions/history', {
        params: { email: email.trim() }
      });
      setHistory(response.data?.data || []);
      setSearched(true);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'settlement':
      case 'success':
      case 'capture':
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-bold border border-green-150 dark:border-green-900/30">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {t('payment_success.status_settlement')}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-150 dark:border-amber-900/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            {t('payment_success.status_pending')}
          </span>
        );
      case 'expire':
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 px-2.5 py-1 rounded-full text-xs font-bold border border-gray-250 dark:border-gray-750/30">
            {t('payment_success.status_expire')}
          </span>
        );
      case 'cancel':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-bold border border-red-150 dark:border-red-900/30">
            {t('payment_success.status_cancel')}
          </span>
        );
      case 'deny':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-bold border border-red-150 dark:border-red-900/30">
            {t('payment_success.status_deny')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-red-55 text-red-700 dark:bg-red-900/30 dark:text-red-450 px-2.5 py-1 rounded-full text-xs font-bold border border-red-200">
            {t('payment_success.status_failure')}
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300 flex flex-col">
      <Helmet>
        <title>{t('payment_success.title')} | Azhar Faturohman Ahidin</title>
      </Helmet>

      {/* HEADER / NAVIGATION */}
      <header className="bg-white dark:bg-gray-900 shadow-sm py-5 transition-colors border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
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
      <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full">
        {/* Success Alert Box */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center mb-12 flex flex-col items-center">
          <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full mb-6 animate-bounce">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            {t('payment_success.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mb-8 leading-relaxed">
            {t('payment_success.subtitle')}
          </p>
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-300"
          >
            {t('services.see_more')}
          </button>
        </div>

        {/* Purchase History Tracking Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Clock className="text-blue-600 dark:text-blue-400" size={24} />
              {t('payment_success.track_history')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {t('payment_success.track_subtitle')}
            </p>
          </div>

          {/* Email Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('payment_success.email_placeholder')}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-bold py-3.5 px-8 rounded-2xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
            >
              {loading ? t('common.loading') : t('payment_success.btn_check')}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm mb-6">
              {error}
            </div>
          )}

          {/* Search Results */}
          {searched && (
            <div>
              {history.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-850 rounded-2xl">
                  {t('payment_success.empty')}
                </div>
              ) : (
                <div className="space-y-6">
                  {history.map((tx) => (
                    <div 
                      key={tx.order_id} 
                      className="border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 hover:shadow-md transition-all duration-300 bg-gray-50/30 dark:bg-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-gray-450 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                            {tx.order_id}
                          </span>
                          {getStatusBadge(tx.transaction_status)}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {tx.service?.title || 'Unknown Service'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {formatDate(tx.created_at)}
                          </span>
                          {tx.payment_type && (
                            <span className="flex items-center gap-1 uppercase">
                              <CreditCard size={13} />
                              {tx.payment_type}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-gray-800 shrink-0 gap-3">
                        <div className="text-right">
                          <span className="text-xs text-gray-400 dark:text-gray-500 block">
                            {t('payment_success.table_amount')}
                          </span>
                          <span className="text-lg font-black text-gray-900 dark:text-white">
                            {formatPrice(tx.gross_amount)}
                          </span>
                        </div>
                        
                        {tx.transaction_status === 'pending' && tx.payment_url && (
                          <a
                            href={tx.payment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl active:scale-[0.98] transition-all inline-flex items-center gap-1 shadow-sm shadow-blue-500/10"
                          >
                            <span>Bayar Sekarang</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
