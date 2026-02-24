
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-brand-primary/10 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                <span className="text-white font-serif font-bold text-2xl">C</span>
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight text-brand-primary">Corpus</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Platform publikasi akademik independen yang berfokus pada penyediaan data dan analisis 
              komunikasi untuk mendukung perubahan sosial berbasis riset di Indonesia.
            </p>
          </div>
          
          <div>
            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-8">Navigasi</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-brand-primary text-[10px] font-bold uppercase tracking-widest transition-colors">Beranda</Link></li>
              <li><Link to="/karya/riset" className="text-gray-400 hover:text-brand-primary text-[10px] font-bold uppercase tracking-widest transition-colors">Arsip Riset</Link></li>
              <li><Link to="/aktivitas-berita" className="text-gray-400 hover:text-brand-primary text-[10px] font-bold uppercase tracking-widest transition-colors">Aktivitas & Berita</Link></li>
              <li><Link to="/tentang-kami" className="text-gray-400 hover:text-brand-primary text-[10px] font-bold uppercase tracking-widest transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-8">Ikuti Kami</h3>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 border border-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary/40 hover:text-brand-primary hover:border-brand-primary transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-12 h-12 border border-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary/40 hover:text-brand-primary hover:border-brand-primary transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-24 pt-12 border-t border-brand-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black">
            © {new Date().getFullYear()} Corpus. Independent Research Center.
          </p>
          <div className="flex gap-8">
             <Link to="/login" className="text-gray-300 hover:text-brand-primary text-[10px] uppercase tracking-[0.3em] font-black transition-colors">Admin Portal</Link>
             <span className="text-gray-100">|</span>
             <p className="text-gray-300 text-[10px] uppercase tracking-[0.3em] font-black">Secure Read-Only Experience</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
