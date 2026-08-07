import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const emptyForm = {
  title: '',
  description: '',
  features: '',
  original_price: 0,
  promo_price: 0,
  redirect_url: '',
  image_url: '',
  is_active: true,
};

const inputClass = "p-2.5 border border-sumi/15 dark:border-paperInk/15 bg-white dark:bg-aisumi text-sumi dark:text-paperInk focus:outline-none focus:border-ai dark:focus:border-aiLight transition-colors";
const labelClass = "text-sm font-semibold text-sumi dark:text-paperInk px-1";
const hintClass = "text-xs text-nibi dark:text-nibiDark px-1";
const fileInputClass = "w-full text-sm p-1.5 border border-sumi/15 dark:border-paperInk/15 bg-white dark:bg-aisumi text-nibi dark:text-nibiDark file:mr-4 file:py-1 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-kinari2 dark:file:bg-aisumi2 file:text-ai dark:file:text-aiLight hover:file:opacity-80";

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
    data.append('features', formData.features || '');
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
    <div className="min-h-screen bg-kinari dark:bg-aisumi font-body pb-12 transition-colors duration-300">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="max-w-4xl mx-auto pt-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-xl text-sumi dark:text-paperInk">
            {isEdit ? t('form.service_edit_title') : t('form.service_add_title')}
          </h1>
          <ThemeToggle />
        </div>

        {isEdit && !editingService && (
          <div className="mb-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-3 text-sm text-amber-700 dark:text-amber-400">
            {t('form.error_not_found')}
          </div>
        )}
        {error && <div className="mb-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}
        {success && <div className="mb-4 border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 p-3 text-sm text-green-700 dark:text-green-400">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-aisumi2 border border-sumi/10 dark:border-paperInk/10 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Service / Product Title
            </label>
            <input
              id="title"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Landing Page Development"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="description" className={labelClass}>
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
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="features" className={labelClass}>
              {t('form.label_features')}
            </label>
            <textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder={t('form.placeholder_features')}
              rows={2}
              className={inputClass}
            />
            <p className={hintClass}>{t('form.hint_features')}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="original_price" className={labelClass}>
              {t('form.label_original_price')}
            </label>
            <input
              id="original_price"
              type="number"
              required
              name="original_price"
              value={formData.original_price}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="promo_price" className={labelClass}>
              {t('form.label_promo_price')}
            </label>
            <input
              id="promo_price"
              type="number"
              required
              name="promo_price"
              value={formData.promo_price}
              onChange={handleChange}
              className={inputClass}
            />
            <p className={hintClass}>{t('form.hint_custom_quote')}</p>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="redirect_url" className={labelClass}>
              {t('form.label_redirect_url')}
            </label>
            <input
              id="redirect_url"
              name="redirect_url"
              value={formData.redirect_url}
              onChange={handleChange}
              placeholder={t('form.placeholder_redirect_url')}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className={labelClass}>
              Service Image
            </label>
            <div className="flex items-start gap-4">
              {(imageFile || formData.image_url) && (
                <div className="w-20 h-20 overflow-hidden border border-sumi/15 dark:border-paperInk/15 bg-kinari2 dark:bg-aisumi shrink-0">
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
                  className={fileInputClass}
                />
              </div>
            </div>
          </div>

          <label className="md:col-span-2 inline-flex items-center gap-3 text-sm text-sumi dark:text-paperInk cursor-pointer p-1">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 border-sumi/30 dark:border-paperInk/30 text-ai focus:ring-ai"
            />
            {t('form.label_active')}
          </label>

          <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-sumi/10 dark:border-paperInk/10">
            <button
              type="button"
              onClick={() => navigate('/admin/portfolios', { state: { activeTab: 'services' } })}
              className="px-6 py-2.5 border border-sumi/15 dark:border-paperInk/15 hover:border-ai dark:hover:border-aiLight text-sumi dark:text-paperInk font-medium text-sm transition-colors"
            >
              {t('form.button_cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-sumi dark:bg-paperInk text-kinari dark:text-aisumi font-bold text-sm uppercase tracking-wide disabled:opacity-70 hover:bg-ai dark:hover:bg-aiLight transition-colors"
            >
              {saving ? t('form.button_saving') : t('form.button_save')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
