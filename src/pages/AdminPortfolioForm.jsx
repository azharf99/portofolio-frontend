import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const emptyForm = {
  title: '',
  description: '',
  role: '',
  type: '',
  industry: '',
  tech_stack: '',
  project_link: '',
  image_url: '', // existing image URL
  start_date: '',
  end_date: '',
  is_published: true,
};

function isValidUrl(url) {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function AdminPortfolioForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const editingPortfolio = state?.portfolio || null;
  const isEdit = Boolean(id);

  const handleImageError = (e) => {
    const target = e.target;
    if (!target.dataset.retryCount) {
      target.dataset.retryCount = '0';
    }
    const count = parseInt(target.dataset.retryCount);
    
    if (count < 5) {
      target.dataset.retryCount = (count + 1).toString();
      const delay = Math.pow(2, count) * 1000 + Math.random() * 1000;
      
      setTimeout(() => {
        const currentSrc = target.src;
        target.src = '';
        target.src = currentSrc;
      }, delay);
    }
  };

  const [formData, setFormData] = useState(() => {
    if (!editingPortfolio) return emptyForm;
    return {
      ...emptyForm,
      ...editingPortfolio,
      start_date: editingPortfolio.start_date?.slice(0, 10) || '',
      end_date: editingPortfolio.end_date?.slice(0, 10) || '',
    };
  });
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const pageTitle = useMemo(
    () => (isEdit ? `${t('form.edit_title')} | Admin` : `${t('form.add_title')} | Admin`),
    [isEdit, t]
  );

  const validateForm = () => {
    const requiredFields = ['title', 'description', 'role', 'type', 'industry'];
    for (const field of requiredFields) {
      if (!String(formData[field] || '').trim()) {
        return t('form.error_required');
      }
    }

    if (!isValidUrl(formData.project_link)) return t('form.error_invalid_url');

    // Main Image wajib saat Create jika tidak ada image_url
    if (!isEdit && !mainImage) {
      return t('form.error_image_required');
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) return t('form.error_date_range');
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
    // Tambahkan field text
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    // Tambahkan file image utama
    if (mainImage) {
      data.append('image', mainImage);
    }

    // Tambahkan file gallery
    galleryImages.forEach((file) => {
      data.append('images', file);
    });

    try {
      if (isEdit) {
        await api.put(`/admin/portfolios/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/portfolios', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setSuccess(t('form.success_save'));
      setTimeout(() => navigate('/admin/portfolios'), 700);
    } catch (err) {
      setError(err.message || t('form.error_save'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      if (name === 'image') {
        setMainImage(files[0]);
      } else if (name === 'images') {
        setGalleryImages(Array.from(files));
      }
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? t('form.edit_title') : t('form.add_title')}</h1>
          <ThemeToggle />
        </div>

        {isEdit && !editingPortfolio && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
            {t('form.error_not_found')}
          </div>
        )}
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_title')}</label>
            <input id="title" required name="title" value={formData.title} onChange={handleChange} placeholder={t('form.placeholder_title')} className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_role')}</label>
            <input id="role" required name="role" value={formData.role} onChange={handleChange} placeholder={t('form.placeholder_role')} className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="industry" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_industry')}</label>
            <input id="industry" required name="industry" value={formData.industry} onChange={handleChange} placeholder={t('form.placeholder_industry')} className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_type')}</label>
            <input id="type" required name="type" value={formData.type} onChange={handleChange} placeholder={t('form.placeholder_type')} className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="tech_stack" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_tech_stack')}</label>
            <input id="tech_stack" name="tech_stack" value={formData.tech_stack} onChange={handleChange} placeholder={t('form.placeholder_tech_stack')} className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_description')}</label>
            <textarea id="description" required name="description" value={formData.description} onChange={handleChange} placeholder={t('form.placeholder_description')} rows={4} className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="project_link" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_project_url')}</label>
            <input id="project_link" name="project_link" value={formData.project_link} onChange={handleChange} placeholder="https://..." className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_main_image')}</label>
            <div className="flex items-start gap-4">
              {(mainImage || formData.image_url) && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
                  <img 
                    src={mainImage ? URL.createObjectURL(mainImage) : formData.image_url} 
                    alt="Preview" 
                    onError={!mainImage ? handleImageError : undefined}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <div className="flex-grow">
                <input id="image" type="file" name="image" onChange={handleChange} accept="image/*" className="w-full text-sm p-1.5 border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50" />
                {formData.image_url && !mainImage && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">Current: {formData.image_url}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_gallery')}</label>
            <div className="flex flex-col gap-3">
              {/* Existing Gallery Preview */}
              {formData.images && formData.images.length > 0 && !galleryImages.length && (
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                  {formData.images.map((img) => (
                    <div key={img.id} className="w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                      <img src={img.image_url} alt="Gallery" onError={handleImageError} className="w-full h-full object-cover" title={img.image_url} />
                    </div>
                  ))}
                </div>
              )}
              {/* New Uploads Preview */}
              {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                  {galleryImages.map((file, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-md overflow-hidden border border-blue-200">
                      <img src={URL.createObjectURL(file)} alt="New Gallery" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <input id="images" type="file" name="images" multiple onChange={handleChange} accept="image/*" className="w-full text-sm p-1.5 border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="start_date" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_start_date')}</label>
            <input id="start_date" type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="end_date" className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">{t('form.label_end_date')}</label>
            <input id="end_date" type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="p-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none" />
          </div>
          <label className="md:col-span-2 inline-flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-1">
            <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            {t('form.label_published')}
          </label>
          <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-50 dark:border-gray-800">
            <button type="button" onClick={() => navigate('/admin/portfolios')} className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors">{t('form.button_cancel')}</button>
            <button type="submit" disabled={saving} className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-70 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
              {saving ? t('form.button_saving') : t('form.button_save')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
