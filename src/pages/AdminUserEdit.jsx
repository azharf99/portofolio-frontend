import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

export default function AdminUserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() && !password.trim()) {
      setError(t('user.error_required'));
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {};
      if (username.trim()) payload.username = username.trim();
      if (password.trim()) payload.password = password;

      await api.put(`/admin/users/${id}`, payload);
      setSuccess(t('user.success_update'));
    } catch (err) {
      setError(err.message || t('user.error_update'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t('user.confirm_delete'))) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/admin/users/${id}`);
      setSuccess(t('user.success_delete'));
      setTimeout(() => navigate('/admin/portfolios'), 700);
    } catch (err) {
      setError(err.message || t('user.error_delete'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kinari dark:bg-aisumi font-body pb-12 transition-colors duration-300">
      <Helmet>
        <title>{t('user.edit_title')} | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="max-w-xl mx-auto pt-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-xl text-sumi dark:text-paperInk">
            {t('user.edit_title')} <span className="font-mono text-base text-nibi dark:text-nibiDark">#{id}</span>
          </h1>
          <ThemeToggle />
        </div>
        {error && (
          <div className="mb-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 p-3 text-sm text-green-700 dark:text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-aisumi2 border border-sumi/10 dark:border-paperInk/10 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-sumi dark:text-paperInk mb-1 px-1">
              {t('user.label_username')}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 border border-sumi/15 dark:border-paperInk/15 bg-white dark:bg-aisumi text-sumi dark:text-paperInk focus:outline-none focus:border-ai dark:focus:border-aiLight transition-colors"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-sumi dark:text-paperInk mb-1 px-1">
              {t('user.label_password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-sumi/15 dark:border-paperInk/15 bg-white dark:bg-aisumi text-sumi dark:text-paperInk focus:outline-none focus:border-ai dark:focus:border-aiLight transition-colors"
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wide disabled:opacity-70 transition-colors"
            >
              {t('user.button_delete')}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/portfolios')}
                className="px-4 py-2.5 border border-sumi/15 dark:border-paperInk/15 hover:border-ai dark:hover:border-aiLight text-sumi dark:text-paperInk text-sm font-medium transition-colors"
              >
                {t('user.button_back')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-sumi dark:bg-paperInk text-kinari dark:text-aisumi text-sm font-bold uppercase tracking-wide hover:bg-ai dark:hover:bg-aiLight disabled:opacity-70 transition-colors"
              >
                {loading ? t('user.button_saving') : t('user.button_save')}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
