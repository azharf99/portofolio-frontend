import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';

const emptyForm = {
  title: '',
  description: '',
  role: '',
  type: '',
  industry: '',
  tech_stack: '',
  project_link: '',
  image_url: '',
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
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const editingPortfolio = state?.portfolio || null;
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(() => {
    if (!editingPortfolio) return emptyForm;
    return {
      ...emptyForm,
      ...editingPortfolio,
      start_date: editingPortfolio.start_date?.slice(0, 10) || '',
      end_date: editingPortfolio.end_date?.slice(0, 10) || '',
    };
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const pageTitle = useMemo(
    () => (isEdit ? 'Edit Portfolio | Admin' : 'Tambah Portfolio | Admin'),
    [isEdit]
  );

  const validateForm = () => {
    const requiredFields = ['title', 'description', 'role', 'type', 'industry'];
    for (const field of requiredFields) {
      if (!String(formData[field] || '').trim()) {
        return 'Field wajib belum lengkap.';
      }
    }

    if (!isValidUrl(formData.project_link)) return 'Project link harus URL valid.';
    if (!isValidUrl(formData.image_url)) return 'Image URL harus URL valid.';

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) return 'Tanggal selesai tidak boleh lebih kecil dari tanggal mulai.';
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

    const payload = {
      ...formData,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
    };

    try {
      if (isEdit) {
        await api.put(`/admin/portfolios/${id}`, payload);
      } else {
        await api.post('/admin/portfolios', payload);
      }
      setSuccess('Data berhasil disimpan.');
      setTimeout(() => navigate('/admin/portfolios'), 700);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="max-w-4xl mx-auto pt-10 px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Portfolio' : 'Tambah Portfolio'}</h1>

        {isEdit && !editingPortfolio && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
            Data awal edit tidak ditemukan. Silakan kembali ke list dan pilih data yang ingin diedit.
          </div>
        )}
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required name="title" value={formData.title} onChange={handleChange} placeholder="Judul project" className="p-2 border rounded-lg" />
          <input required name="role" value={formData.role} onChange={handleChange} placeholder="Role" className="p-2 border rounded-lg" />
          <input required name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry" className="p-2 border rounded-lg" />
          <input required name="type" value={formData.type} onChange={handleChange} placeholder="Type" className="p-2 border rounded-lg" />
          <input name="tech_stack" value={formData.tech_stack} onChange={handleChange} placeholder="Tech stack" className="p-2 border rounded-lg md:col-span-2" />
          <textarea required name="description" value={formData.description} onChange={handleChange} placeholder="Deskripsi" rows={4} className="p-2 border rounded-lg md:col-span-2" />
          <input name="project_link" value={formData.project_link} onChange={handleChange} placeholder="Project URL" className="p-2 border rounded-lg" />
          <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded-lg" />
          <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="p-2 border rounded-lg" />
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="p-2 border rounded-lg" />
          <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} />
            Tampilkan di halaman publik
          </label>
          <div className="md:col-span-2 flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => navigate('/admin/portfolios')} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Batal</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
