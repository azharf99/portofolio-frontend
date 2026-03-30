import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LogOut, Plus, Edit, Trash2, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AdminDashboard() {
  const [portfolios, setPortfolios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', description: '', role: '', type: '', industry: '', tech_stack: '', project_link: '', image_url: '' });
  const navigate = useNavigate();

  const fetchPortfolios = async () => {
    try {
      // Kita ambil banyak data sekaligus untuk dashboard (limit 100)
      const response = await api.get('/portfolios?limit=100');
      setPortfolios(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      if (error.response?.status === 401) handleLogout(); // Jika token expired
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleOpenModal = (portfolio = null) => {
    if (portfolio) {
      setFormData(portfolio); // Mode Edit
    } else {
      setFormData({ id: null, title: '', description: '', role: '', type: '', industry: '', tech_stack: '', project_link: '', image_url: '' }); // Mode Tambah
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update (Ingat rutenya ada di grup /admin)
        await api.put(`/admin/portfolios/${formData.id}`, formData);
      } else {
        // Create baru
        await api.post('/admin/portfolios', formData);
      }
      setIsModalOpen(false);
      fetchPortfolios(); // Refresh data
      alert('Data berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan data: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus portofolio ini?')) {
      try {
        await api.delete(`/admin/portfolios/${id}`);
        fetchPortfolios();
      } catch (error) {
        alert('Gagal menghapus data');
      }
    }
  };

  // Fungsi mengubah state form
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition"
          >
            <Plus size={18} /> Tambah Baru
          </button>
        </div>

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
              {portfolios.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{item.title}</td>
                  <td className="p-4 text-gray-600">{item.industry}</td>
                  <td className="p-4 text-gray-600">{item.type}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {portfolios.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">Belum ada portofolio. Silakan tambah baru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Form CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Portofolio' : 'Tambah Portofolio'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Project *</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peran (Role)</label>
                  <input name="role" value={formData.role} onChange={handleChange} placeholder="Contoh: Backend Developer" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industri</label>
                  <input name="industry" value={formData.industry} onChange={handleChange} placeholder="Contoh: Cybersecurity" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Project</label>
                  <input name="type" value={formData.type} onChange={handleChange} placeholder="Contoh: Web App" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                  <input name="tech_stack" value={formData.tech_stack} onChange={handleChange} placeholder="Golang, React, Docker" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Gambar (URL)</label>
                  <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Project (URL)</label>
                  <input name="project_link" value={formData.project_link} onChange={handleChange} placeholder="https://github.com/..." className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}