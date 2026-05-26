import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const emptyForm = {
  title: '',
  description: '',
  original_price: 0,
  promo_price: 0,
  redirect_url: '',
  image_url: '',
  is_active: true,
};

export default function AdminServiceForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const editingService = state?.service || null;
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(() => {
    if (!editingService) return emptyForm;
    return {
      ...emptyForm,
      ...editingService,
    };
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const pageTitle = useMemo(
    () => (isEdit ? `${t('form.service_edit_title')} | Admin` : `${t('form.service_add_title')} | Admin`),
    [isEdit, t]
  );

  const validateForm = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return t('form.error_required');
    }
    if (formData.original_price < 0 || formData.promo_price < 0) {
      return 'Price must be greater than or equal to 0';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('original_price', String(formData.original_price));
    data.append('promo_price', String(formData.promo_price));
    data.append('redirect_url', formData.redirect_url || '');
    data.append('is_active', String(formData.is_active));

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (isEdit) {
        await api.put(`/admin/services/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/services', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setSuccess(t('form.success_save_service'));
      setTimeout(() => navigate('/admin/portfolios', { state: { activeTab: 'services' } }), 700);
    } catch (err) {
      setError(err.message || t('form.error_save'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setImageFile(files[0]);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-12 transition-colors duration-300">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="max-w-4xl mx-auto pt-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? t('form.service_edit_title') : t('form.service_add_title')}
          </h1>
          <ThemeToggle />
        </div>

        {isEdit && !editingService && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
            {t('form.error_not_found')}
          </div>
        )}
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
              Service / Product Title
            </label>
            <input
              id="title"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Landing Page Development"
              className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
              Description
            </label>
            <textarea
              id="description"
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the service..."
              rows={4}
              className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="original_price" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
              {t('form.label_original_price')}
            </label>
            <input
              id="original_price"
              type="number"
              required
              name="original_price"
              value={formData.original_price}
              onChange={handleChange}
              className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="promo_price" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
              {t('form.label_promo_price')}
            </label>
            <input
              id="promo_price"
              type="number"
              required
              name="promo_price"
              value={formData.promo_price}
              onChange={handleChange}
              className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="redirect_url" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
              {t('form.label_redirect_url')}
            </label>
            <input
              id="redirect_url"
              name="redirect_url"
              value={formData.redirect_url}
              onChange={handleChange}
              placeholder={t('form.placeholder_redirect_url')}
              className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
              Service Image
            </label>
            <div className="flex items-start gap-4">
              {(imageFile || formData.image_url) && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-grow">
                <input
                  id="image"
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full text-sm p-1.5 border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
                />
              </div>
            </div>
          </div>

          <label className="md:col-span-2 inline-flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-1">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {t('form.label_active')}
          </label>

          <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-50 dark:border-gray-800">
            <button
              type="button"
              onClick={() => navigate('/admin/portfolios', { state: { activeTab: 'services' } })}
              className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
            >
              {t('form.button_cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-70 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              {saving ? t('form.button_saving') : t('form.button_save')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
