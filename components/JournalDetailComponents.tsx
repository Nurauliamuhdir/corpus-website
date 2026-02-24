
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Download, Share2, FileText, ZoomIn, 
  Bell, Quote, MessageSquare, BookOpen, Facebook, Twitter, Mail, Link2, Check, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Author } from '../types';

// --- PDF PREVIEW ---
interface PDFPreviewProps {
  title: string;
  doi?: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ title, doi }) => {
  return (
    <div className="mb-12 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div className="bg-gradient-to-r from-brand-celios to-brand-dark p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">Preview Jurnal PDF</p>
            <p className="text-[10px] opacity-80">Klik untuk melihat atau download...</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white text-brand-celios text-[10px] font-bold uppercase rounded hover:bg-gray-100 transition-colors">Lihat PDF</button>
          <button className="px-3 py-1.5 bg-brand-celios/50 text-white text-[10px] font-bold uppercase rounded hover:bg-brand-celios/70 transition-colors">Download</button>
        </div>
      </div>
      
      <div className="bg-gray-100 p-6 md:p-12 flex justify-center">
        <div className="relative w-full max-w-[500px] aspect-[8.5/11] bg-white shadow-2xl border-2 border-gray-200 p-8 overflow-hidden select-none">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-8xl font-black text-gray-100 rotate-[-45deg] opacity-50">PREVIEW</span>
          </div>

          {/* PDF Content Mockup */}
          <div className="relative z-10 h-full flex flex-col">
            <div className="border-b-2 border-gray-100 pb-2 mb-6 flex justify-between items-end">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Journal Pro Research</span>
              <span className="text-[8px] font-bold text-brand-celios">{doi || 'DOI: 10.XXXXX/XXXXX'}</span>
            </div>
            
            <h3 className="text-center text-sm font-bold text-gray-900 mb-8 leading-tight px-4">
              {title}
            </h3>

            <div className="space-y-6">
              <div>
                <div className="text-[8px] font-bold text-gray-900 uppercase mb-2">Abstract</div>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-gray-200 w-full rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-full rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-11/12 rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-full rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-4/5 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="text-[8px] font-bold text-gray-900 uppercase mb-2">Keywords</div>
                <div className="h-1.5 bg-gray-100 w-1/2 rounded-full"></div>
              </div>

              <div>
                <div className="text-[8px] font-bold text-gray-900 uppercase mb-2">1. Introduction</div>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-gray-200 w-full rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-full rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-full rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-11/12 rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-full rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-full rounded-full"></div>
                  <div className="h-1.5 bg-gray-200 w-10/12 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 flex justify-end">
              <span className="text-[8px] text-gray-400">Page 1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-medium">
        <ZoomIn className="w-3 h-3" />
        Ini adalah preview halaman pertama. Download untuk melihat dokumen lengkap.
      </div>
    </div>
  );
};

// --- DOWNLOAD PROMPT ---
export const DownloadPrompt: React.FC<{ title: string; pdfUrl?: string; isSourceOnly?: boolean }> = ({ title, pdfUrl, isSourceOnly }) => {
  return (
    <div className="mb-12 bg-gradient-to-br from-brand-tint to-white border-2 border-brand-celios/20 p-6 rounded-xl flex items-start gap-4">
      <div className="bg-brand-celios p-3 rounded-lg text-white shrink-0">
        {isSourceOnly ? <Link2 className="w-6 h-6" /> : <Download className="w-6 h-6" />}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {isSourceOnly ? 'Akses Jurnal Lengkap' : 'Download Full PDF'}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {isSourceOnly 
            ? 'Penelitian ini dipublikasikan secara eksternal. Silakan kunjungi tautan sumber untuk membaca artikel selengkapnya.' 
            : 'Dapatkan akses ke seluruh data penelitian, metodologi lengkap, dan daftar pustaka dalam format PDF.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <a 
            href={pdfUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2 bg-brand-celios text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-brand-dark transition-all flex items-center gap-2"
          >
            {isSourceOnly ? 'Kunjungi Source Jurnal' : 'Download PDF (2.4 MB)'}
          </a>
          {!isSourceOnly && (
            <button className="px-5 py-2 border-2 border-brand-celios text-brand-celios text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-brand-celios hover:text-white transition-all">
              Lihat Preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- CITATION PROMPT ---
export const CitationPrompt: React.FC<{ title: string; authors: any[]; year: number; doi?: string }> = ({ title, authors, year, doi }) => {
  const [copied, setCopied] = useState(false);
  
  const authorNames = authors.map(a => typeof a === 'string' ? a : a.name).join(', ');
  const citation = `${authorNames} (${year}). ${title}. ${doi ? `https://doi.org/${doi}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-12 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 p-6 rounded-xl flex items-start gap-4">
      <div className="bg-purple-600 p-3 rounded-lg text-white shrink-0">
        <Quote className="w-6 h-6" />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">Kutip Jurnal Ini</h3>
        <p className="text-gray-600 text-sm mb-4">Gunakan format sitasi APA untuk merujuk penelitian ini dalam karya ilmiah Anda.</p>
        <div className="bg-white border border-purple-200 p-4 rounded-lg font-mono text-xs text-gray-700 mb-4 break-all">
          {citation}
        </div>
        <button 
          onClick={handleCopy}
          className="px-5 py-2 bg-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
        >
          {copied ? <><Check className="w-4 h-4" /> Tersalin!</> : 'Salin Sitasi'}
        </button>
      </div>
    </div>
  );
};

// --- FEEDBACK PROMPT ---
export const FeedbackPrompt: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-xl flex items-start gap-4">
      <div className="bg-green-600 p-3 rounded-lg text-white shrink-0">
        <MessageSquare className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">Beri Penilaian</h3>
        <p className="text-gray-600 text-sm mb-4">Apakah jurnal ini membantu riset Anda? Berikan penilaian untuk membantu kami meningkatkan kualitas konten.</p>
        
        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-300 p-3 rounded-lg text-green-800 text-sm font-medium flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Terima kasih atas penilaian Anda!
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hover || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
              {rating > 0 && <span className="ml-2 text-lg font-bold text-gray-700">{rating}/5</span>}
            </div>
            <button 
              disabled={rating === 0}
              onClick={() => setSubmitted(true)}
              className="px-5 py-2 bg-green-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kirim Penilaian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- NEWSLETTER PROMPT ---
export const NewsletterPrompt: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl flex items-start gap-4">
      <div className="bg-blue-600 p-3 rounded-lg text-white shrink-0">
        <Bell className="w-6 h-6" />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">Dapatkan Jurnal Terbaru</h3>
        <p className="text-gray-600 text-sm mb-4">Berlangganan newsletter kami untuk mendapatkan notifikasi riset dan policy brief terbaru langsung di email Anda.</p>
        
        {subscribed ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-100 border border-green-300 p-3 rounded-lg text-green-800 text-sm font-medium flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Terima kasih! Email Anda telah didaftarkan.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
            />
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-all"
            >
              Berlangganan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- RELATED JOURNALS PROMPT ---
export const RelatedJournalsPrompt: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="mb-12 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 p-6 rounded-xl flex items-start gap-4">
      <div className="bg-amber-600 p-3 rounded-lg text-white shrink-0">
        <BookOpen className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">Jurnal Terkait Lainnya</h3>
        <p className="text-gray-600 text-sm mb-4">Kami menemukan {count} jurnal lain yang relevan dengan topik penelitian ini.</p>
        <button className="px-5 py-2 bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-amber-700 transition-all">
          Lihat Jurnal Terkait
        </button>
      </div>
    </div>
  );
};

// --- TABLE OF CONTENTS ---
interface TOCItem {
  id: string;
  title: string;
  subsections?: Array<{ id: string; title: string }>;
}

export const TableOfContents: React.FC<{ items: TOCItem[] }> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
      item.subsections?.forEach((sub) => {
        const subEl = document.getElementById(sub.id);
        if (subEl) observer.observe(subEl);
      });
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-24 space-y-6">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">Table of Contents</h4>
      <nav className="space-y-1">
        {items.map((item) => (
          <div key={item.id} className="space-y-1">
            <button
              onClick={() => scrollTo(item.id)}
              className={`block w-full text-left text-sm py-1.5 transition-all ${
                activeId === item.id 
                  ? 'text-brand-celios font-bold border-l-2 border-brand-celios pl-3' 
                  : 'text-gray-500 hover:text-gray-900 pl-3 border-l-2 border-transparent'
              }`}
            >
              {item.title}
            </button>
            {item.subsections?.map((sub) => (
              <button
                key={sub.id}
                onClick={() => scrollTo(sub.id)}
                className={`block w-full text-left text-xs py-1 transition-all pl-6 ${
                  activeId === sub.id 
                    ? 'text-brand-celios font-bold' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {sub.title}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};
