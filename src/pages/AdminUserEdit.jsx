import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-12 transition-colors duration-300">
      <Helmet>
        <title>{t('user.edit_title')} | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="max-w-xl mx-auto pt-10 px-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('user.edit_title')} (ID: {id})
        </h1>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/30 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('user.label_username')}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('user.label_password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-70 transition-colors"
            >
              {t('user.button_delete')}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/admin/portfolios')}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
              >
                {t('user.button_back')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70 transition-colors"
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
