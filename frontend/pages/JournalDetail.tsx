
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { journals as initialJournals } from '../data';
import { Category, Journal, Author } from '../types';
import { socketService } from '../src/services/socketService';
import { 
  Calendar, Clock, Download, Share2, Facebook, Twitter, Mail, Link2 
} from 'lucide-react';
import { 
  PDFPreview, DownloadPrompt, CitationPrompt, FeedbackPrompt, 
  NewsletterPrompt, RelatedJournalsPrompt, TableOfContents 
} from '../components/JournalDetailComponents';

const JournalDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [journals, setJournals] = useState<Journal[]>(() => {
    const saved = localStorage.getItem('db_journals');
    return saved ? JSON.parse(saved) : initialJournals;
  });

  useEffect(() => {
    const unsubscribe = socketService.subscribe((state) => {
      setJournals(state.journals);
    });
    return () => unsubscribe();
  }, []);

  const j = journals.find(item => item.slug === slug);

  if (!j) return <div className="py-20 text-center font-serif text-gray-400">Konten tidak ditemukan.</div>;

  const formattedDate = new Date(j.date_published).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Helper to render authors
  const renderAuthors = () => {
    return (j.authors as any[]).map((author, idx) => {
      if (typeof author === 'string') {
        return (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-tint flex items-center justify-center text-[10px] font-bold text-brand-celios">
              {author.charAt(0)}
            </div>
            <span className="text-sm font-semibold text-gray-900">{author}</span>
          </div>
        );
      }
      const a = author as Author;
      return (
        <div key={idx} className="space-y-1">
          <p className="font-semibold text-gray-900">{a.name} <span className="text-gray-500 font-normal text-xs">{a.credentials}</span></p>
          <p className="text-xs text-gray-500">{a.affiliation}</p>
        </div>
      );
    });
  };

  // LAYOUT 1: GARUDA STYLE (Preview Jurnal)
  if (j.category === Category.ARTIKEL_POPULER && !j.content) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">
                {j.journal_name || 'Journal of Communication Science'}
              </p>
              <p className="text-[10px] text-gray-400 font-medium mb-6">
                Vol {j.volume || '1'} No {j.issue || '2'} ({j.year}) : {j.journal_name}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
                {j.title}
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                {renderAuthors()}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-3 bg-gray-50/50 p-8 border-r border-gray-100 space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-400 mb-2">Publish Date</h4>
                  <p className="text-sm font-bold">{j.year}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-400 mb-2">DOI</h4>
                  <p className="text-xs text-blue-500 break-all">{j.doi || '10.1234/corpus.v1i2.567'}</p>
                </div>
                <div className="pt-4">
                   <a href={j.external_url} target="_blank" className="w-full py-3 bg-black text-white text-[10px] font-bold uppercase rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                      Original Source
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                   </a>
                </div>
              </div>
              <div className="md:col-span-9 p-8 md:p-12">
                <h3 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">Abstract</h3>
                <div className="font-serif text-lg leading-relaxed text-gray-700 italic">
                  {j.abstract}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LAYOUT 3: DOCUMENTARY STYLE (CELIOS x TOALA SPECIALIZED)
  if (j.category === Category.DOKUMENTER) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans pb-24">
        <div className="max-w-6xl mx-auto px-6 pt-12">
          
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
            <button 
              onClick={() => navigate('/karya/dokumenter')}
              className="flex items-center gap-2 text-gray-600 hover:text-brand-celios font-bold text-[10px] uppercase tracking-widest transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Dokumenter
            </button>
          </nav>

          {/* Header Section */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
              {j.title}
            </h1>
            <div className="flex items-center gap-3 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="text-brand-celios">Corpus Original</span>
            </div>
          </header>

          {/* Video Trailer Player */}
          <section className="mb-10">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl border border-gray-200">
              {j.video_url ? (
                <iframe 
                  src={`${j.video_url}?controls=1&mute=0&autoplay=0&rel=0`}
                  className="w-full h-full object-cover"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  <img src={j.cover_image} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
                  <svg className="w-16 h-16 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm font-bold uppercase tracking-widest relative z-10">Video Trailer Tidak Tersedia</p>
                </div>
              )}
            </div>
          </section>

          {/* Call-to-Action Box */}
          <section className="mb-12">
            <div className="bg-gray-100 rounded-2xl p-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl text-center md:text-left">
                <h3 className="text-xl font-black text-gray-900 mb-2">Tonton Dokumenter Lengkap</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Versi lengkap dari dokumenter ini tersedia secara gratis melalui platform distribusi eksternal kami. Silakan klik tombol untuk mulai menonton.
                </p>
              </div>
              <a 
                href={j.full_url || j.video_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-10 py-5 bg-brand-lime text-brand-celios rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-celios hover:text-white transition-all shadow-xl shadow-brand-lime/10 group"
              >
                Tonton Video Full
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </section>

          {/* Description Section */}
          <section className="max-w-4xl">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4">
              Tentang Dokumenter
              <div className="flex-grow h-px bg-gray-200"></div>
            </h2>
            <div className="text-gray-700 text-lg leading-[1.8] space-y-8 font-light">
              <p className="text-xl font-medium text-gray-900 mb-4 border-l-4 border-brand-lime pl-6 italic">
                {j.abstract}
              </p>
              <div className="editorial-body">
                {j.full_content ? (
                  j.full_content.split('\n').map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p>Dokumenter ini mengeksplorasi dimensi sosial dan kebijakan yang seringkali tidak terlihat di permukaan. Melalui wawancara eksklusif dan rekaman lapangan, Corpus menyajikan fakta secara visual untuk mendorong perubahan berbasis data.</p>
                )}
              </div>
            </div>

            {j.key_findings && (
              <div className="mt-16 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-celios mb-8">Poin Utama Investigasi</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {j.key_findings.map((kf, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="w-2 h-2 rounded-full bg-brand-lime mt-1.5 flex-shrink-0"></span>
                        <p className="text-gray-600 text-sm leading-relaxed">{kf}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  // LAYOUT 2: NEW ACADEMIC STYLE (Category.JURNAL or Category.ARTIKEL_POPULER)
  if ((j.category === Category.JURNAL || j.category === Category.ARTIKEL_POPULER) && j.content) {
    const tocItems = [
      { id: 'abstract', title: 'Abstrak' },
      { id: 'introduction', title: 'Pendahuluan' },
      ...(j.content.sections || []).map(s => ({ id: s.id, title: s.title })),
      ...(j.content.conclusion ? [{ id: 'conclusion', title: 'Kesimpulan' }] : []),
      ...(j.references && j.references.length > 0 ? [{ id: 'references', title: 'Referensi' }] : [])
    ];

    const relatedCount = journals.filter(item => item.category === j.category && item.id !== j.id).length;

    return (
      <div className="bg-white min-h-screen font-sans">
        {/* HERO SECTION */}
        <header className="bg-gray-50 border-b border-gray-200 py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-brand-celios text-white text-[10px] font-bold uppercase tracking-wider rounded">
                {j.category}
              </span>
              {j.doi && (
                <span className="text-xs font-medium text-gray-500">
                  DOI: {j.doi}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {j.title}
            </h1>
            
            {j.subtitle && (
              <p className="text-xl text-gray-600 mb-8 max-w-3xl">
                {j.subtitle}
              </p>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex flex-wrap gap-6">
                {renderAuthors()}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{j.reading_time || '10 min read'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href={j.pdf_url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-brand-celios text-white font-bold rounded-lg hover:bg-brand-dark transition-all flex items-center gap-2 shadow-lg shadow-brand-celios/10"
              >
                {j.hide_pdf_preview ? <Link2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                {j.hide_pdf_preview ? 'Kunjungi Source Jurnal' : 'Download PDF'}
              </a>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Bagikan
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT GRID */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* LEFT COLUMN: CONTENT */}
            <div className="lg:col-span-3">
              {/* ABSTRAK */}
              <section id="abstract" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstrak</h2>
                <div className="bg-gray-50 border-l-4 border-brand-celios p-6 rounded-r-lg">
                  <p className="text-gray-700 leading-relaxed italic">
                    {j.abstract}
                  </p>
                  {j.tags && (
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-bold text-gray-900">Kata Kunci:</span>
                      <span className="text-sm text-gray-600">{j.tags.join(', ')}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* PENDAHULUAN */}
              <section id="introduction" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pendahuluan</h2>
                <div 
                  className="journal-content prose prose-lg max-w-none text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: j.content.introduction }}
                />
              </section>

              {/* SECTIONS */}
              {j.content.sections && j.content.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                  <div 
                    className="journal-content prose prose-lg max-w-none text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </section>
              ))}

              {/* KESIMPULAN */}
              {j.content.conclusion && (
                <section id="conclusion" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Kesimpulan</h2>
                  <div 
                    className="journal-content prose prose-lg max-w-none text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: j.content.conclusion }}
                  />
                </section>
              )}

              {/* PDF PREVIEW */}
              {!j.hide_pdf_preview && <PDFPreview title={j.title} doi={j.doi} />}

              {/* DOWNLOAD PROMPT */}
              <DownloadPrompt title={j.title} pdfUrl={j.pdf_url} isSourceOnly={j.hide_pdf_preview} />

              {/* REFERENSI */}
              {j.references && j.references.length > 0 && (
                <section id="references" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Referensi</h2>
                  <ol className="space-y-3">
                    {j.references.map((ref, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                        <span className="font-medium text-gray-900 shrink-0">[{i + 1}]</span>
                        <span>{ref}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* PROMPTS */}
              <NewsletterPrompt />
              {relatedCount > 0 && <RelatedJournalsPrompt count={relatedCount} />}

              {/* SHARE SECTION */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Bagikan Jurnal Ini</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="p-3 border border-gray-300 rounded-lg text-blue-600 hover:bg-gray-50 transition-all">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg text-sky-500 hover:bg-gray-50 transition-all">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
                    <Mail className="w-5 h-5" />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
                    <Link2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div className="hidden lg:block">
              <TableOfContents items={tocItems} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT LAYOUT (Old Celios Style)
  return (
    <div className="bg-white min-h-screen">
      <header className="bg-gray-50 py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full mb-6 inline-block">Policy Brief & Research</span>
          <h1 className="serif-heading text-4xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-8">{j.title}</h1>
          <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>By {(j.authors as any[]).map(a => typeof a === 'string' ? a : a.name).join(', ')}</span>
            <span>•</span>
            <span>{j.year}</span>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <aside className="hidden lg:block lg:col-span-3">
             <div className="sticky top-28 space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-6">Contents</h4>
                <nav className="space-y-4">
                  {['Executive Summary', 'Key Findings', 'Analysis'].map(nav => (
                    <a key={nav} href="#" className="block text-xs font-bold text-gray-400 hover:text-black transition-colors">{nav}</a>
                  ))}
                </nav>
             </div>
          </aside>
          <div className="lg:col-span-9 max-w-3xl">
            <div className="prose prose-xl prose-gray max-w-none">
               <p className="text-2xl font-serif text-gray-500 italic mb-12 leading-relaxed">{j.abstract}</p>
               <div className="text-gray-800 leading-[1.9] space-y-10 text-lg">
                 {j.full_content ? j.full_content.split('\n').map((p, i) => <p key={i}>{p}</p>) : <p className="text-gray-300 italic">Content coming soon.</p>}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
