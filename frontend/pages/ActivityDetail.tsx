
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { activities as initialActivities } from '../data';
import { ActivityItem } from '../types';
import { socketService } from '../src/services/socketService';

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('db_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  useEffect(() => {
    const unsubscribe = socketService.subscribe((state) => {
      setActivities(state.activities);
    });
    return () => unsubscribe();
  }, []);

  const news = activities.find(a => a.id === id);

  if (!news) return <div className="py-20 text-center font-serif">Berita tidak ditemukan.</div>;

  return (
    <div className="bg-[#FCFCFA] min-h-screen font-sans text-gray-900">
      {/* Editorial Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 text-center">
          <nav className="flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 gap-3">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="opacity-30">/</span>
            <Link to="/aktivitas-berita" className="hover:text-black transition-colors">Aktivitas & Berita</Link>
          </nav>
          
          <h1 className="serif-heading text-4xl md:text-6xl font-bold leading-[1.1] text-gray-900 mb-8 tracking-tight">
            {news.title}
          </h1>
          
          <div className="flex flex-col items-center gap-4">
            <div className="h-px w-12 bg-gray-200"></div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span className="text-black">{news.author || 'Redaksi Corpus'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{news.location || 'Jakarta'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{news.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <figure className="mb-16 -mx-6 md:mx-0">
          <div className="overflow-hidden shadow-2xl md:rounded-2xl aspect-[16/9] bg-gray-100">
            <img src={news.image} className="w-full h-full object-cover" alt={news.title} />
          </div>
          <figcaption className="mt-4 px-6 md:px-0 text-[11px] text-gray-400 italic font-medium flex justify-between items-center">
            <span>{news.image_caption || 'Dokumentasi Corpus.'}</span>
            <span className="uppercase tracking-widest not-italic opacity-60">Foto: Redaksi</span>
          </figcaption>
        </figure>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Article Body */}
          <div className="lg:col-span-12">
            <div className="prose prose-stone prose-lg max-w-none">
              <div className="text-gray-800 leading-[1.8] font-sans text-lg space-y-8 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-gray-900">
                {news.content ? (
                  news.content.split('\n').map((p, i) => (
                    p.trim() ? <p key={i} className="mb-6">{p}</p> : <br key={i} />
                  ))
                ) : (
                  <p className="text-xl font-medium text-gray-600 italic">
                    {news.description}
                  </p>
                )}
              </div>
            </div>

            {/* Tags & Footer */}
            <div className="mt-20 pt-10 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-wrap gap-2">
                  {['Riset', 'Kebijakan', 'Digital', 'Komunikasi'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-full hover:bg-gray-200 hover:text-black transition-all cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Share:</span>
                  <div className="flex gap-2">
                    {['FB', 'TW', 'WA'].map(s => (
                      <button key={s} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[10px] font-black hover:bg-black hover:text-white hover:border-black transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-16">
              <Link to="/aktivitas-berita" className="group p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2 block">Kembali ke Indeks</span>
                <h4 className="text-xl font-bold group-hover:text-brand-primary transition-colors">Lihat Semua Berita & Aktivitas</h4>
              </Link>
              
              {activities.filter(a => a.id !== id)[0] && (
                <Link to={`/aktivitas-berita/${activities.filter(a => a.id !== id)[0].id}`} className="group p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2 block">Berita Selanjutnya</span>
                  <h4 className="text-xl font-bold group-hover:text-brand-primary transition-colors line-clamp-1">
                    {activities.filter(a => a.id !== id)[0].title}
                  </h4>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <section className="bg-[#1a1a1a] py-24 text-white mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="serif-heading text-3xl font-bold mb-6">Dapatkan Analisis Mingguan</h3>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">Berlangganan newsletter kami untuk mendapatkan update riset dan kebijakan digital langsung di email Anda.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Alamat Email Anda" className="flex-grow bg-white/10 border border-white/10 px-6 py-4 rounded-full outline-none focus:border-white transition-all" />
            <button className="px-10 py-4 bg-white text-black rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivityDetail;
