import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lock, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { markLoggedIn } from '../lib/auth';
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
      // Token dikirim balik sebagai cookie httpOnly oleh backend, bukan di response body.
      await api.post('/login', { username, password });
      markLoggedIn();
      navigate('/admin/portfolios', { replace: true });
    } catch (err) {
      setError(err.message || t('login.error_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kinari dark:bg-aisumi flex items-center justify-center p-4 font-body transition-colors">
      <Helmet>
        <title>{t('login.title')} | Azhar Faturohman Ahidin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="bg-white dark:bg-aisumi2 p-8 border border-sumi/10 dark:border-paperInk/10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="border border-sumi/15 dark:border-paperInk/15 w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <Lock className="text-ai dark:text-aiLight" size={26} />
          </div>
          <h1 className="font-display text-2xl text-sumi dark:text-paperInk">{t('login.title')}</h1>
          <p className="text-sm text-nibi dark:text-nibiDark mt-2">{t('login.subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 text-sm mb-6 text-center border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nibi dark:text-nibiDark" size={18} />
            <input
              type="text"
              placeholder={t('login.username')}
              required
              className="w-full pl-10 pr-4 py-3 border border-sumi/15 dark:border-paperInk/15 bg-white dark:bg-aisumi text-sumi dark:text-paperInk focus:outline-none focus:border-ai dark:focus:border-aiLight transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nibi dark:text-nibiDark" size={18} />
            <input
              type="password"
              placeholder={t('login.password')}
              required
              className="w-full pl-10 pr-4 py-3 border border-sumi/15 dark:border-paperInk/15 bg-white dark:bg-aisumi text-sumi dark:text-paperInk focus:outline-none focus:border-ai dark:focus:border-aiLight transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sumi dark:bg-paperInk text-kinari dark:text-aisumi font-bold text-sm uppercase tracking-wide py-3.5 hover:bg-ai dark:hover:bg-aiLight transition-colors disabled:opacity-70"
          >
            {loading ? t('login.button_loading') : t('login.button')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="text-sm text-nibi dark:text-nibiDark hover:text-ai dark:hover:text-aiLight transition-colors">
            &larr; {t('login.back_to_home')}
          </button>
        </div>
      </div>
    </div>
  );
}
