import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { LogOut, Plus, Edit, Trash2, UserCog } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { clearToken } from '../lib/auth';
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

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login', { replace: true });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-12 transition-colors duration-300">
      <Helmet>
        <title>Dashboard | Admin Azhar Faturohman Ahidin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Navbar Admin */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">{t('admin.dashboard_title')}</h1>
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <ThemeToggle />
          <button onClick={() => navigate('/')} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
            {t('admin.view_public')}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 transition">
            <LogOut size={16} /> {t('admin.logout')}
          </button>
        </div>
      </nav>

      {/* Tab Switcher */}
      <div className="max-w-6xl mx-auto mt-6 px-6">
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => { setActiveTab('portfolios'); setMessage(''); setError(''); }}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition ${
              activeTab === 'portfolios'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('admin.manage_portfolio')}
          </button>
          <button
            onClick={() => { setActiveTab('services'); setMessage(''); setError(''); }}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition ${
              activeTab === 'services'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('admin.manage_services')}
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto mt-6 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'portfolios' ? t('admin.manage_portfolio') : t('admin.manage_services')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/users/1/edit')}
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm font-medium transition"
            >
              <UserCog size={18} /> {t('admin.manage_user')}
            </button>
            <button
              onClick={() => navigate(activeTab === 'portfolios' ? '/admin/portfolios/new' : '/admin/services/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition shadow-lg shadow-blue-200 dark:shadow-none"
            >
              <Plus size={18} /> {t('admin.add_new')}
            </button>
          </div>
        </div>
        {message && <div className="mb-4 rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-400">{message}</div>}
        {error && <div className="mb-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}

        {/* Portfolios Table */}
        {activeTab === 'portfolios' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                  <th className="p-4 font-semibold">{t('admin.table_title')}</th>
                  <th className="p-4 font-semibold">{t('admin.table_industry')}</th>
                  <th className="p-4 font-semibold">{t('admin.table_type')}</th>
                  <th className="p-4 font-semibold text-center">{t('admin.table_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">{t('common.loading')}</td>
                  </tr>
                ) : portfolios.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{item.title}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{item.industry}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{item.type}</td>
                    <td className="p-4 flex justify-center gap-3">
                      <button onClick={() => navigate(`/admin/portfolios/${item.id}/edit`, { state: { portfolio: item } })} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg transition">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeletePortfolio(item.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && portfolios.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">{t('admin.empty')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Services Table */}
        {activeTab === 'services' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                  <th className="p-4 font-semibold">{t('admin.table_title')}</th>
                  <th className="p-4 font-semibold">{t('admin.table_original_price')}</th>
                  <th className="p-4 font-semibold">{t('admin.table_promo_price')}</th>
                  <th className="p-4 font-semibold text-center">{t('admin.table_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">{t('common.loading')}</td>
                  </tr>
                ) : services.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{item.title}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{formatPrice(item.original_price)}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 font-bold text-green-600 dark:text-green-400">{formatPrice(item.promo_price)}</td>
                    <td className="p-4 flex justify-center gap-3">
                      <button onClick={() => navigate(`/admin/services/${item.id}/edit`, { state: { service: item } })} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg transition">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteService(item.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && services.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">{t('admin.empty_services')}</td>
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