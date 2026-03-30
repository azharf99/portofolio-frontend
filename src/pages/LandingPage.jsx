import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Download, Briefcase, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function LandingPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6; // Menampilkan 6 portofolio per halaman

  // Fungsi untuk memanggil API
  const fetchPortfolios = async () => {
    try {
      const response = await api.get('/portfolios', {
        params: { search, industry, page, limit }
      });
      setPortfolios(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // Setiap kali search, industry, atau page berubah, panggil API lagi
  useEffect(() => {
    fetchPortfolios();
  }, [search, industry, page]);

  // Hitung total halaman
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Helmet>
        <title>Azhar Faturohman Ahidin | Portofolio Profesional</title>
        <meta name="description" content="Portofolio profesional Azhar Faturohman Ahidin. Fokus pada Cybersecurity, Backend Development, dan System Architecture. Lihat proyek dan pengalaman saya di sini." />
        <meta name="keywords" content="Azhar Faturohman Ahidin, Portofolio, Cybersecurity, Backend Developer, Golang, React, System Architecture" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://azharfa.cloud/" />
        
        {/* Open Graph untuk Preview di WhatsApp/LinkedIn/Twitter */}
        <meta property="og:title" content="Azhar Faturohman Ahidin | Portofolio Profesional" />
        <meta property="og:description" content="Lihat karya dan pengalaman saya di bidang Cybersecurity dan Backend Development." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://azharfa.cloud/" />
      </Helmet>
      {/* HEADER / HERO SECTION */}
      <header className="bg-white shadow-sm py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Hi, Aku <span className="text-blue-600">Azhar Faturohman Ahidin</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Seorang profesional yang berdedikasi tinggi. Di bawah ini adalah karya dan proyek yang pernah aku selesaikan. Fokus utamaku mencakup Cybersecurity, Backend Development, dan System Architecture.
          </p>
          <a 
            href="/cv-azhar.pdf" 
            download 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Download size={20} />
            Download CV
          </a>
        </div>
      </header>

      {/* MAIN CONTENT (FILTER & LIST) */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Fitur Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari portofolio..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="w-full md:w-auto">
            <select 
              className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
            >
              <option value="">Semua Industri</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Web Development">Web Development</option>
              <option value="Fintech">Fintech</option>
            </select>
          </div>
        </div>

        {/* Grid Portofolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              Belum ada data portofolio yang sesuai.
            </div>
          ) : (
            portfolios.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  {/* Gunakan gambar dummy jika ImageURL kosong */}
                  <img src={item.image_url || `https://via.placeholder.com/400x200?text=${item.title}`} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                    {item.industry}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <Briefcase size={16} className="text-blue-500" />
                      {item.role}
                    </span>
                    {item.project_link && (
                      <a href={item.project_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Sebelumnya
            </button>
            <span className="text-gray-600 font-medium">Halaman {page} dari {totalPages}</span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        )}

      </main>
    </div>
  );
}