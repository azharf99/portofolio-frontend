import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LogOut, Plus, Edit, Trash2, UserCog } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { clearToken } from '../lib/auth';
import { registerUnauthorizedHandler } from '../services/api';

export default function AdminDashboard() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchPortfolios = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/portfolios?limit=100');
      setPortfolios(response.data.data || []);
    } catch (error) {
      setError(error.message || 'Gagal mengambil data portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    registerUnauthorizedHandler(() => navigate('/admin/login', { replace: true }));
    fetchPortfolios();
  }, [navigate]);

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login', { replace: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus portofolio ini?')) {
      try {
        await api.delete(`/admin/portfolios/${id}`);
        setMessage('Portfolio berhasil dihapus.');
        fetchPortfolios();
      } catch (error) {
        setError(error.message || 'Gagal menghapus data.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <Helmet>
        <title>Dashboard | Admin Azhar Faturohman Ahidin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Navbar Admin */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
            Lihat Web Public
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-8 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Kelola Portofolio</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/users/1/edit')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition"
            >
              <UserCog size={18} /> Kelola User
            </button>
            <button
              onClick={() => navigate('/admin/portfolios/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition"
            >
              <Plus size={18} /> Tambah Baru
            </button>
          </div>
        </div>
        {message && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {/* Tabel Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="p-4 font-semibold">Judul</th>
                <th className="p-4 font-semibold">Industri</th>
                <th className="p-4 font-semibold">Tipe</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : portfolios.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{item.title}</td>
                  <td className="p-4 text-gray-600">{item.industry}</td>
                  <td className="p-4 text-gray-600">{item.type}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => navigate(`/admin/portfolios/${item.id}/edit`, { state: { portfolio: item } })} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && portfolios.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">Belum ada portofolio. Silakan tambah baru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}