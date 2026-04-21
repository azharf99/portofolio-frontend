import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';

export default function AdminUserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() && !password.trim()) {
      setError('Isi minimal username atau password.');
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
      setSuccess('User berhasil diperbarui.');
    } catch (err) {
      setError(err.message || 'Gagal memperbarui user.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/admin/users/${id}`);
      setSuccess('User berhasil dihapus.');
      setTimeout(() => navigate('/admin/portfolios'), 700);
    } catch (err) {
      setError(err.message || 'Gagal menghapus user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <Helmet>
        <title>Edit User | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="max-w-xl mx-auto pt-10 px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit User Admin (ID: {id})</h1>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username baru (opsional)</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password baru (opsional)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-lg" />
          </div>
          <div className="flex justify-between pt-2">
            <button type="button" onClick={handleDelete} disabled={loading} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-70">
              Hapus User
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={() => navigate('/admin/portfolios')} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                Kembali
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70">
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
