import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lock, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { setToken } from '../lib/auth';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError(t('login.error_required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { username, password });
      setToken(response.data.token);
      navigate('/admin/portfolios', { replace: true });
    } catch (err) {
      setError(err.message || t('login.error_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 font-sans transition-colors">
      <Helmet>
        <title>{t('login.title')} | Azhar Faturohman Ahidin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('login.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{t('login.subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 text-center border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('login.username')}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder={t('login.password')}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? t('login.button_loading') : t('login.button')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            &larr; {t('login.back_to_home')}
          </button>
        </div>
      </div>
    </div>
  );
}