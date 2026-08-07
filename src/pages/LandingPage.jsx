import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ServicesSection from '../components/ServicesSection';
import { useTranslation } from 'react-i18next';
import { Search, Download, Briefcase, ExternalLink, X, Mail, MessageCircle } from 'lucide-react';


const Github = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { sanitizeUrl } from '../lib/sanitizeUrl';
import { Helmet } from 'react-helmet-async';

const DEFAULT_LIMIT = 6;

// Small rail label used to open every section — the one deliberately "Japanese"
// structural device in this layout: vertical (tategaki-style) text on desktop,
// horizontal on mobile. See src/index.css for the palette this leans on.
function RailLabel({ children }) {
  return (
    <div className="md:h-full">
      <span
        className="inline-flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.3em] uppercase text-nibi dark:text-nibiDark
                   md:[writing-mode:vertical-rl] md:[transform:rotate(180deg)] md:min-h-32"
      >
        {children}
        <span className="block w-6 h-px md:w-px md:h-12 bg-sumi/15 dark:bg-paperInk/15" />
      </span>
    </div>
  );
}

function Portrait() {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);

  return (
    <div>
      <div className="aspect-[4/5] w-full max-w-[15rem] border border-sumi/10 dark:border-paperInk/10 bg-gradient-to-br from-kinari2 to-kinari dark:from-aisumi2 dark:to-aisumi overflow-hidden flex items-center justify-center">
        {!failed ? (
          <img
            src="/profile.jpg"
            alt="Azhar Faturohman Ahidin"
            className="w-full h-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="font-display text-5xl text-nibi dark:text-nibiDark opacity-50">AF</span>
        )}
      </div>
      <p className="mt-3 text-[0.68rem] tracking-[0.12em] uppercase text-nibi dark:text-nibiDark">
        {t('about.portrait_pending')}
      </p>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
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
      setError(error.message || t('common.error'));
      setPortfolios([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, industry, limit, page, type, t]);

  const handleImageError = (e) => {
    const target = e.target;
    if (!target.dataset.retryCount) {
      target.dataset.retryCount = '0';
    }
    const count = parseInt(target.dataset.retryCount);

    // Maksimal 5 kali retry
    if (count < 5) {
      target.dataset.retryCount = (count + 1).toString();
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s + random jitter
      const delay = Math.pow(2, count) * 1000 + Math.random() * 1000;

      setTimeout(() => {
        const currentSrc = target.src;
        // Reset src untuk memicu reload
        target.src = '';
        target.src = currentSrc;
      }, delay);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-kinari dark:bg-aisumi font-body transition-colors duration-300">
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

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-sumi/10 dark:border-paperInk/10">
        <span className="font-display text-lg text-sumi dark:text-paperInk">
          <b className="font-bold">Azhar</b> Faturohman
        </span>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* HERO */}
      <section className="border-b border-sumi/10 dark:border-paperInk/10 px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[168px_1fr] gap-8">
          <RailLabel>{t('sections.profile')}</RailLabel>
          <div className="max-w-2xl">
            <p className="text-sm md:text-base font-medium text-ai dark:text-aiLight mb-4">
              {t('hero.role_line')}
            </p>
            <h1 className="font-display font-bold text-[2.4rem] leading-[1.05] md:text-6xl text-sumi dark:text-paperInk mb-6 text-balance">
              Azhar Faturohman Ahidin
            </h1>
            <p className="text-base text-nibi dark:text-nibiDark max-w-xl mb-10 leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#work"
                className="inline-flex items-center gap-2 bg-sumi dark:bg-paperInk text-kinari dark:text-aisumi px-6 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-ai dark:hover:bg-aiLight transition-colors"
              >
                {t('sections.work')}
              </a>
              <a
                href="/cv-azhar.pdf"
                download
                className="inline-flex items-center gap-2 border border-sumi/20 dark:border-paperInk/20 text-sumi dark:text-paperInk px-6 py-3.5 text-sm font-semibold uppercase tracking-wide hover:border-ai hover:text-ai dark:hover:border-aiLight dark:hover:text-aiLight transition-colors"
              >
                <Download size={16} />
                {t('hero.download_cv')}
              </a>
              <a
                href="https://github.com/azharf99"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-sumi/20 dark:border-paperInk/20 text-sumi dark:text-paperInk px-6 py-3.5 text-sm font-semibold uppercase tracking-wide hover:border-ai hover:text-ai dark:hover:border-aiLight dark:hover:text-aiLight transition-colors"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/azharfa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-sumi/20 dark:border-paperInk/20 text-sumi dark:text-paperInk px-6 py-3.5 text-sm font-semibold uppercase tracking-wide hover:border-ai hover:text-ai dark:hover:border-aiLight dark:hover:text-aiLight transition-colors"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-b border-sumi/10 dark:border-paperInk/10 px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[168px_1fr] gap-8">
          <RailLabel>{t('sections.about')}</RailLabel>
          <div className="grid grid-cols-1 sm:grid-cols-[15rem_1fr] gap-8 md:gap-12 items-start">
            <Portrait />
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-sumi dark:text-paperInk mb-5">
                {t('about.heading')}
              </h2>
              <p className="text-sm md:text-base text-nibi dark:text-nibiDark leading-relaxed mb-8 max-w-xl">
                {t('about.bio')}
              </p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-sumi/10 dark:border-paperInk/10 pt-6 max-w-xl">
                <div>
                  <dt className="text-[0.68rem] tracking-[0.12em] uppercase text-nibi dark:text-nibiDark mb-1">{t('about.fact_experience')}</dt>
                  <dd className="text-sm text-sumi dark:text-paperInk font-medium">{t('about.fact_experience_value')}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] tracking-[0.12em] uppercase text-nibi dark:text-nibiDark mb-1">{t('about.fact_focus')}</dt>
                  <dd className="text-sm text-sumi dark:text-paperInk font-medium">{t('about.fact_focus_value')}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] tracking-[0.12em] uppercase text-nibi dark:text-nibiDark mb-1">{t('about.fact_stack')}</dt>
                  <dd className="text-sm text-sumi dark:text-paperInk font-medium">{t('about.fact_stack_value')}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] tracking-[0.12em] uppercase text-nibi dark:text-nibiDark mb-1">{t('about.fact_available')}</dt>
                  <dd className="text-sm text-sumi dark:text-paperInk font-medium">{t('about.fact_available_value')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <ServicesSection limit={6} showSeeMore={true} />

      {/* WORK / PORTFOLIO */}
      <section className="border-b border-sumi/10 dark:border-paperInk/10 px-6 py-16 md:py-24" id="work">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[168px_1fr] gap-8">
          <RailLabel>{t('sections.work')}</RailLabel>
          <div>
            <div className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-sumi dark:text-paperInk mb-3">
                {t('work.heading')}
              </h2>
              <p className="text-sm md:text-base text-nibi dark:text-nibiDark max-w-xl">
                {t('work.subtitle')}
              </p>
            </div>

            {/* Fitur Search & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-8">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nibi dark:text-nibiDark" size={18} />
                <input
                  type="text"
                  disabled={loading}
                  placeholder={t('search.placeholder')}
                  className="w-full pl-9 pr-4 py-2.5 border border-sumi/15 dark:border-paperInk/15 bg-white dark:bg-aisumi2 text-sumi dark:text-paperInk text-sm focus:outline-none focus:border-ai dark:focus:border-aiLight transition-colors disabled:opacity-50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto flex gap-3">
                <select
                  disabled={loading}
                  className="w-full md:w-44 px-3 py-2.5 border border-sumi/15 dark:border-paperInk/15 focus:outline-none focus:border-ai dark:focus:border-aiLight bg-white dark:bg-aisumi2 text-sumi dark:text-paperInk text-sm transition-colors disabled:opacity-50"
                  value={industry}
                  onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
                >
                  <option value="">{t('search.all_industries')}</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Fintech">Fintech</option>
                </select>
                <select
                  disabled={loading}
                  className="w-full md:w-44 px-3 py-2.5 border border-sumi/15 dark:border-paperInk/15 focus:outline-none focus:border-ai dark:focus:border-aiLight bg-white dark:bg-aisumi2 text-sumi dark:text-paperInk text-sm transition-colors disabled:opacity-50"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">{t('search.all_types')}</option>
                  <option value="Web App">Web App</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="API Service">API Service</option>
                </select>
              </div>
            </div>

            {/* Grid Portofolio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border border-sumi/10 dark:border-paperInk/10">
              {loading ? (
                [...Array(6)].map((_, idx) => (
                  <div key={idx} className="h-72 animate-pulse bg-kinari2 dark:bg-aisumi2 border-b border-r border-sumi/10 dark:border-paperInk/10" />
                ))
              ) : error ? (
                <div className="col-span-full text-center py-14 text-sm text-nibi dark:text-nibiDark">
                  {error}
                  <div className="mt-3">
                    <button
                      onClick={fetchPortfolios}
                      className="text-ai dark:text-aiLight font-semibold underline underline-offset-2"
                    >
                      {t('common.retry')}
                    </button>
                  </div>
                </div>
              ) : portfolios.length === 0 ? (
                <div className="col-span-full text-center py-14 text-sm text-nibi dark:text-nibiDark">
                  {t('portfolio.empty')}
                </div>
              ) : (
                portfolios.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPortfolio(item)}
                    className="border-b border-r border-sumi/10 dark:border-paperInk/10 flex flex-col cursor-pointer group bg-white dark:bg-aisumi2 hover:bg-kinari2 dark:hover:bg-aisumi transition-colors"
                  >
                    <div className="h-44 bg-kinari2 dark:bg-aisumi relative overflow-hidden">
                      <img
                        src={item.image_url || `https://placehold.co/400x200?text=${item.title}`}
                        alt={item.title}
                        loading="lazy"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 bg-kinari/90 dark:bg-aisumi/90 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-sumi dark:text-paperInk">
                        {item.industry}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-display text-lg text-sumi dark:text-paperInk mb-2 group-hover:text-ai dark:group-hover:text-aiLight transition-colors">{item.title}</h3>
                      <p className="text-sm text-nibi dark:text-nibiDark mb-4 line-clamp-2">{item.description}</p>

                      <div className="mt-auto pt-4 border-t border-sumi/10 dark:border-paperInk/10 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-nibi dark:text-nibiDark font-medium">
                          <Briefcase size={14} className="text-ai dark:text-aiLight" />
                          {item.role}
                        </span>
                        <div className="flex items-center gap-1 text-ai dark:text-aiLight font-semibold text-xs">
                          {t('portfolio.detail')} <ExternalLink size={12} />
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
                  className="absolute inset-0 bg-sumi/70 dark:bg-black/80 backdrop-blur-sm"
                  onClick={() => setSelectedPortfolio(null)}
                />
                <div className="relative bg-kinari dark:bg-aisumi2 w-full max-w-4xl max-h-[90vh] border border-sumi/10 dark:border-paperInk/10 shadow-2xl overflow-hidden flex flex-col">
                  {/* Header Modal */}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-sumi/10 dark:border-paperInk/10">
                    <h2 className="font-display text-xl text-sumi dark:text-paperInk truncate pr-4">
                      {selectedPortfolio.title}
                    </h2>
                    <button
                      onClick={() => setSelectedPortfolio(null)}
                      className="p-2 hover:bg-kinari2 dark:hover:bg-aisumi transition-colors"
                    >
                      <X size={22} className="text-nibi dark:text-nibiDark" />
                    </button>
                  </div>

                  {/* Konten Modal */}
                  <div className="overflow-y-auto p-6 flex-grow">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Bagian Gambar & Galeri */}
                      <div>
                        <div className="overflow-hidden bg-kinari2 dark:bg-aisumi aspect-video mb-4">
                          <img
                            src={selectedPortfolio.image_url || `https://placehold.co/800x450?text=${selectedPortfolio.title}`}
                            alt={selectedPortfolio.title}
                            loading="lazy"
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {selectedPortfolio.images && selectedPortfolio.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {selectedPortfolio.images.map((img) => (
                              <a
                                key={img.id}
                                href={sanitizeUrl(img.image_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="aspect-square overflow-hidden bg-kinari2 dark:bg-aisumi border border-sumi/10 dark:border-paperInk/10 hover:border-ai dark:hover:border-aiLight transition-colors"
                              >
                                <img
                                  src={img.image_url}
                                  alt="Gallery Item"
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                  onError={handleImageError}
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bagian Informasi */}
                      <div className="flex flex-col">
                        <div className="mb-6">
                          <h4 className="text-[0.68rem] font-bold text-nibi dark:text-nibiDark uppercase tracking-[0.12em] mb-2">{t('portfolio.project_description')}</h4>
                          <p className="text-sm text-sumi dark:text-paperInk leading-relaxed whitespace-pre-wrap">
                            {selectedPortfolio.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <h4 className="text-[0.68rem] font-bold text-nibi dark:text-nibiDark uppercase tracking-[0.12em] mb-1">{t('portfolio.role')}</h4>
                            <p className="text-sm text-sumi dark:text-paperInk font-medium">{selectedPortfolio.role}</p>
                          </div>
                          <div>
                            <h4 className="text-[0.68rem] font-bold text-nibi dark:text-nibiDark uppercase tracking-[0.12em] mb-1">{t('portfolio.industry')}</h4>
                            <p className="text-sm text-sumi dark:text-paperInk font-medium">{selectedPortfolio.industry}</p>
                          </div>
                          <div>
                            <h4 className="text-[0.68rem] font-bold text-nibi dark:text-nibiDark uppercase tracking-[0.12em] mb-1">{t('portfolio.type')}</h4>
                            <p className="text-sm text-sumi dark:text-paperInk font-medium">{selectedPortfolio.type}</p>
                          </div>
                          {selectedPortfolio.tech_stack && (
                            <div>
                              <h4 className="text-[0.68rem] font-bold text-nibi dark:text-nibiDark uppercase tracking-[0.12em] mb-1">{t('portfolio.tech_stack')}</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedPortfolio.tech_stack.split(',').map((tech, i) => (
                                  <span key={i} className="text-[10px] bg-ai/10 dark:bg-aiLight/10 text-ai dark:text-aiLight px-2 py-0.5 font-semibold">
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
                              href={sanitizeUrl(selectedPortfolio.project_link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full bg-sumi dark:bg-paperInk text-kinari dark:text-aisumi font-bold text-sm uppercase tracking-wide py-3 px-6 hover:bg-ai dark:hover:bg-aiLight transition-colors"
                            >
                              {t('portfolio.visit_project')} <ExternalLink size={16} />
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
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border border-sumi/15 dark:border-paperInk/15 text-sm text-sumi dark:text-paperInk disabled:opacity-40 hover:border-ai dark:hover:border-aiLight transition-colors"
                >
                  {t('pagination.previous')}
                </button>
                <span className="text-sm text-nibi dark:text-nibiDark font-mono tabular-nums">{t('pagination.page_info', { page, total: totalPages })}</span>
                <button
                  disabled={page === totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-sumi/15 dark:border-paperInk/15 text-sm text-sumi dark:text-paperInk disabled:opacity-40 hover:border-ai dark:hover:border-aiLight transition-colors"
                >
                  {t('pagination.next')}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-6 py-16 md:py-24" id="contact">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[168px_1fr] gap-8">
          <RailLabel>{t('sections.contact')}</RailLabel>
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
            <h2 className="font-display text-3xl md:text-5xl leading-[1.1] text-sumi dark:text-paperInk text-balance">
              {t('contact.heading')}
            </h2>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:azharfaturohman29@gmail.com"
                className="flex items-center justify-between gap-3 pb-3 border-b border-sumi/15 dark:border-paperInk/15 text-sumi dark:text-paperInk hover:text-ai dark:hover:text-aiLight hover:border-ai dark:hover:border-aiLight transition-colors"
              >
                <span className="text-[0.68rem] tracking-[0.12em] uppercase text-nibi dark:text-nibiDark flex items-center gap-2">
                  <Mail size={14} /> {t('contact.email')}
                </span>
                <span className="font-mono text-sm">azharfaturohman29@gmail.com</span>
              </a>
              <a
                href="https://wa.me/6285702570200"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 pb-3 border-b border-sumi/15 dark:border-paperInk/15 text-sumi dark:text-paperInk hover:text-ai dark:hover:text-aiLight hover:border-ai dark:hover:border-aiLight transition-colors"
              >
                <span className="text-[0.68rem] tracking-[0.12em] uppercase text-nibi dark:text-nibiDark flex items-center gap-2">
                  <MessageCircle size={14} /> {t('contact.whatsapp')}
                </span>
                <span className="font-mono text-sm">+62 857-0257-0200</span>
              </a>
              <a
                href="https://github.com/azharf99"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 pb-3 border-b border-sumi/15 dark:border-paperInk/15 text-sumi dark:text-paperInk hover:text-ai dark:hover:text-aiLight hover:border-ai dark:hover:border-aiLight transition-colors"
              >
                <span className="text-[0.68rem] tracking-[0.12em] uppercase text-nibi dark:text-nibiDark flex items-center gap-2">
                  <Github size={14} /> {t('contact.github')}
                </span>
                <span className="font-mono text-sm">@azharf99</span>
              </a>
              <a
                href="https://www.linkedin.com/in/azharfa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 pb-3 border-b border-sumi/15 dark:border-paperInk/15 text-sumi dark:text-paperInk hover:text-ai dark:hover:text-aiLight hover:border-ai dark:hover:border-aiLight transition-colors"
              >
                <span className="text-[0.68rem] tracking-[0.12em] uppercase text-nibi dark:text-nibiDark flex items-center gap-2">
                  <Linkedin size={14} /> {t('contact.linkedin')}
                </span>
                <span className="font-mono text-sm">/in/azharfa</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-nibi dark:text-nibiDark border-t border-sumi/10 dark:border-paperInk/10">
        <span>© {new Date().getFullYear()} Azhar Faturohman Ahidin</span>
      </footer>
    </div>
  );
}
