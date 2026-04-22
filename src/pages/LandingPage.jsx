import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import { Search, Download, Briefcase, ExternalLink, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_LIMIT = 6;

export default function LandingPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const limit = DEFAULT_LIMIT;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchPortfolios = useCallback(async () => {
    const safePage = Number.isInteger(page) && page > 0 ? page : 1;
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT;

    setLoading(true);
    setError('');
    try {
      const response = await api.get('/portfolios', {
        params: { search: debouncedSearch, industry, type, page: safePage, limit: safeLimit }
      });
      setPortfolios(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      setError(error.message || 'Gagal mengambil data portfolio.');
      setPortfolios([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, industry, limit, page, type]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
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
      <header className="bg-white dark:bg-gray-900 shadow-sm py-16 transition-colors border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <div className="absolute right-6 -top-10">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Hi, Aku <span className="text-blue-600 dark:text-blue-400">Azhar Faturohman Ahidin</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
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
              disabled={loading}
              placeholder="Cari portofolio..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors disabled:opacity-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto flex gap-3">
            <select
              disabled={loading}
              className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors disabled:opacity-50"
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
            >
              <option value="">Semua Industri</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Web Development">Web Development</option>
              <option value="Fintech">Fintech</option>
            </select>
            <select
              disabled={loading}
              className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors disabled:opacity-50"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Tipe</option>
              <option value="Web App">Web App</option>
              <option value="Mobile App">Mobile App</option>
              <option value="API Service">API Service</option>
            </select>
          </div>
        </div>

        {/* Grid Portofolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, idx) => (
              <div key={idx} className="h-80 animate-pulse rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800" />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-10 text-red-600 dark:text-red-400">{error}</div>
          ) : portfolios.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
              Belum ada data portofolio yang sesuai.
            </div>
          ) : (
            portfolios.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPortfolio(item)}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all flex flex-col cursor-pointer group"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                  {/* Gunakan gambar dummy jika ImageURL kosong */}
                  <img
                    src={item.image_url || `https://placehold.co/400x200?text=${item.title}`}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                    {item.industry}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

                  <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <Briefcase size={16} className="text-blue-500 dark:text-blue-400" />
                      {item.role}
                    </span>
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      Detail <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Detail Portfolio */}
        {selectedPortfolio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedPortfolio(null)}
            />
            <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
              {/* Header Modal */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
                  {selectedPortfolio.title}
                </h2>
                <button
                  onClick={() => setSelectedPortfolio(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Konten Modal */}
              <div className="overflow-y-auto p-6 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Bagian Gambar & Galeri */}
                  <div>
                    <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video mb-4">
                      <img
                        src={selectedPortfolio.image_url || `https://placehold.co/800x450?text=${selectedPortfolio.title}`}
                        alt={selectedPortfolio.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {selectedPortfolio.images && selectedPortfolio.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedPortfolio.images.map((img) => (
                          <a
                            key={img.id}
                            href={img.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                          >
                            <img
                              src={img.image_url}
                              alt="Gallery Item"
                              loading="lazy"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Simple retry for 429 or other errors
                                const target = e.target;
                                if (!target.dataset.retried) {
                                  target.dataset.retried = 'true';
                                  setTimeout(() => {
                                    const currentSrc = target.src;
                                    target.src = '';
                                    target.src = currentSrc;
                                  }, 1000);
                                }
                              }}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bagian Informasi */}
                  <div className="flex flex-col">
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Deskripsi Proyek</h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {selectedPortfolio.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Role</h4>
                        <p className="text-gray-900 dark:text-gray-200 font-medium">{selectedPortfolio.role}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Industry</h4>
                        <p className="text-gray-900 dark:text-gray-200 font-medium">{selectedPortfolio.industry}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Type</h4>
                        <p className="text-gray-900 dark:text-gray-200 font-medium">{selectedPortfolio.type}</p>
                      </div>
                      {selectedPortfolio.tech_stack && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Tech Stack</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedPortfolio.tech_stack.split(',').map((tech, i) => (
                              <span key={i} className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-semibold">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedPortfolio.project_link && (
                      <div className="mt-auto">
                        <a
                          href={selectedPortfolio.project_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200"
                        >
                          Visit Project <ExternalLink size={18} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              Sebelumnya
            </button>
            <span className="text-gray-600 dark:text-gray-400 font-medium">Halaman {page} dari {totalPages}</span>
            <button
              disabled={page === totalPages || loading}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              Selanjutnya
            </button>
          </div>
        )}

      </main>
    </div>
  );
}