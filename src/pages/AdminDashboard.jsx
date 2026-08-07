import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { LogOut, Plus, Edit, Trash2, UserCog } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { clearLoggedIn } from '../lib/auth';
import { registerUnauthorizedHandler } from '../services/api';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil activeTab dari state router jika kembali dari form submit, default ke 'portfolios'
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'portfolios');

  const [portfolios, setPortfolios] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/portfolios?limit=100');
      setPortfolios(response.data.data || []);
    } catch (error) {
      setError(error.message || t('admin.fetch_error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/services?limit=100');
      setServices(response.data.data || []);
    } catch (error) {
      setError(error.message || t('admin.fetch_error_services'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    registerUnauthorizedHandler(() => navigate('/admin/login', { replace: true }));
    if (activeTab === 'portfolios') {
      fetchPortfolios();
    } else {
      fetchServices();
    }
  }, [navigate, activeTab, fetchPortfolios, fetchServices]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // Tetap lanjut ke halaman login meski request logout gagal (mis. sudah expired) —
      // yang penting flag UI lokal dan navigasi tetap bersih.
    } finally {
      clearLoggedIn();
      navigate('/admin/login', { replace: true });
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (window.confirm(t('admin.confirm_delete'))) {
      try {
        await api.delete(`/admin/portfolios/${id}`);
        setMessage(t('admin.delete_success'));
        fetchPortfolios();
      } catch (error) {
        setError(error.message || t('admin.delete_error'));
      }
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm(t('admin.confirm_delete_service'))) {
      try {
        await api.delete(`/admin/services/${id}`);
        setMessage(t('admin.delete_success_service'));
        fetchServices();
      } catch (error) {
        setError(error.message || t('admin.delete_error_service'));
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-kinari dark:bg-aisumi font-body pb-12 transition-colors duration-300">
      <Helmet>
        <title>Dashboard | Admin Azhar Faturohman Ahidin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Navbar Admin */}
      <nav className="bg-white dark:bg-aisumi2 px-6 py-4 flex justify-between items-center border-b border-sumi/10 dark:border-paperInk/10">
        <h1 className="font-display text-lg text-sumi dark:text-paperInk">{t('admin.dashboard_title')}</h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <button onClick={() => navigate('/')} className="text-sm font-medium text-nibi dark:text-nibiDark hover:text-ai dark:hover:text-aiLight transition-colors">
            {t('admin.view_public')}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
            <LogOut size={16} /> {t('admin.logout')}
          </button>
        </div>
      </nav>

      {/* Tab Switcher */}
      <div className="max-w-6xl mx-auto mt-6 px-6">
        <div className="flex border-b border-sumi/10 dark:border-paperInk/10">
          <button
            onClick={() => { setActiveTab('portfolios'); setMessage(''); setError(''); }}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'portfolios'
                ? 'border-ai text-ai dark:border-aiLight dark:text-aiLight'
                : 'border-transparent text-nibi dark:text-nibiDark hover:text-sumi dark:hover:text-paperInk'
            }`}
          >
            {t('admin.manage_portfolio')}
          </button>
          <button
            onClick={() => { setActiveTab('services'); setMessage(''); setError(''); }}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'services'
                ? 'border-ai text-ai dark:border-aiLight dark:text-aiLight'
                : 'border-transparent text-nibi dark:text-nibiDark hover:text-sumi dark:hover:text-paperInk'
            }`}
          >
            {t('admin.manage_services')}
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto mt-6 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl text-sumi dark:text-paperInk">
            {activeTab === 'portfolios' ? t('admin.manage_portfolio') : t('admin.manage_services')}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/users/1/edit')}
              className="bg-white dark:bg-aisumi2 hover:border-ai dark:hover:border-aiLight text-sumi dark:text-paperInk px-4 py-2.5 border border-sumi/15 dark:border-paperInk/15 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <UserCog size={16} /> {t('admin.manage_user')}
            </button>
            <button
              onClick={() => navigate(activeTab === 'portfolios' ? '/admin/portfolios/new' : '/admin/services/new')}
              className="bg-sumi dark:bg-paperInk text-kinari dark:text-aisumi px-4 py-2.5 flex items-center gap-2 text-sm font-bold uppercase tracking-wide hover:bg-ai dark:hover:bg-aiLight transition-colors"
            >
              <Plus size={16} /> {t('admin.add_new')}
            </button>
          </div>
        </div>
        {message && <div className="mb-4 border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-400">{message}</div>}
        {error && <div className="mb-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}

        {/* Portfolios Table */}
        {activeTab === 'portfolios' && (
          <div className="bg-white dark:bg-aisumi2 border border-sumi/10 dark:border-paperInk/10 overflow-hidden transition-colors overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-kinari2 dark:bg-aisumi border-b border-sumi/10 dark:border-paperInk/10 text-[0.68rem] uppercase tracking-wide text-nibi dark:text-nibiDark">
                  <th className="p-4 font-bold">{t('admin.table_title')}</th>
                  <th className="p-4 font-bold">{t('admin.table_industry')}</th>
                  <th className="p-4 font-bold">{t('admin.table_type')}</th>
                  <th className="p-4 font-bold text-center">{t('admin.table_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-sm text-nibi dark:text-nibiDark">{t('common.loading')}</td>
                  </tr>
                ) : portfolios.map((item) => (
                  <tr key={item.id} className="border-b border-sumi/10 dark:border-paperInk/10 hover:bg-kinari2 dark:hover:bg-aisumi transition-colors">
                    <td className="p-4 font-medium text-sm text-sumi dark:text-paperInk">{item.title}</td>
                    <td className="p-4 text-sm text-nibi dark:text-nibiDark">{item.industry}</td>
                    <td className="p-4 text-sm text-nibi dark:text-nibiDark">{item.type}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => navigate(`/admin/portfolios/${item.id}/edit`, { state: { portfolio: item } })} className="text-ai dark:text-aiLight hover:opacity-70 border border-sumi/15 dark:border-paperInk/15 p-2 transition-opacity">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeletePortfolio(item.id)} className="text-red-600 dark:text-red-400 hover:opacity-70 border border-sumi/15 dark:border-paperInk/15 p-2 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && portfolios.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-sm text-nibi dark:text-nibiDark">{t('admin.empty')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Services Table */}
        {activeTab === 'services' && (
          <div className="bg-white dark:bg-aisumi2 border border-sumi/10 dark:border-paperInk/10 overflow-hidden transition-colors overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-kinari2 dark:bg-aisumi border-b border-sumi/10 dark:border-paperInk/10 text-[0.68rem] uppercase tracking-wide text-nibi dark:text-nibiDark">
                  <th className="p-4 font-bold">{t('admin.table_title')}</th>
                  <th className="p-4 font-bold">{t('admin.table_original_price')}</th>
                  <th className="p-4 font-bold">{t('admin.table_promo_price')}</th>
                  <th className="p-4 font-bold text-center">{t('admin.table_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-sm text-nibi dark:text-nibiDark">{t('common.loading')}</td>
                  </tr>
                ) : services.map((item) => (
                  <tr key={item.id} className="border-b border-sumi/10 dark:border-paperInk/10 hover:bg-kinari2 dark:hover:bg-aisumi transition-colors">
                    <td className="p-4 font-medium text-sm text-sumi dark:text-paperInk">{item.title}</td>
                    <td className="p-4 text-sm font-mono tabular-nums text-nibi dark:text-nibiDark">{formatPrice(item.original_price)}</td>
                    <td className="p-4 text-sm font-mono tabular-nums font-bold text-ai dark:text-aiLight">{formatPrice(item.promo_price)}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => navigate(`/admin/services/${item.id}/edit`, { state: { service: item } })} className="text-ai dark:text-aiLight hover:opacity-70 border border-sumi/15 dark:border-paperInk/15 p-2 transition-opacity">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteService(item.id)} className="text-red-600 dark:text-red-400 hover:opacity-70 border border-sumi/15 dark:border-paperInk/15 p-2 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && services.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-sm text-nibi dark:text-nibiDark">{t('admin.empty_services')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
