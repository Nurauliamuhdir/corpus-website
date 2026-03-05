
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activities as initialActivities } from '../data';
import { ActivityItem } from '../types';
import { socketService } from '../src/services/socketService';

const Activity: React.FC = () => {
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-0.5 w-12 bg-black"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">News & Updates</span>
          </div>
          <h1 className="serif-heading text-4xl md:text-5xl font-bold text-gray-900 mb-6">Aktivitas & Berita Utama</h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Informasi terkini mengenai agenda riset, diskusi publik, dan pencapaian akademik Corpus di lapangan.
          </p>
        </div>

        {activities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Berita Utama (Headline) */}
              <div className="lg:col-span-8">
                <Link to={`/aktivitas-berita/${activities[0].id}`} className="group block">
                  <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl">
                    <img src={activities[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-10 left-10 right-10">
                      <span className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 inline-block">Terpopuler</span>
                      <h2 className="serif-heading text-3xl md:text-5xl font-bold text-white leading-tight">
                        {activities[0].title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed line-clamp-3 mb-6">
                    {activities[0].description}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>{activities[0].date}</span>
                    <span>•</span>
                    <span>{activities[0].location}</span>
                  </div>
                </Link>
              </div>

              {/* Sidebar List Berita Lainnya */}
              <div className="lg:col-span-4 space-y-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-200 pb-4">Berita Terkait</h3>
                {activities.slice(1).map((item) => (
                  <Link key={item.id} to={`/aktivitas-berita/${item.id}`} className="group flex gap-6 items-start">
                    <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="serif-heading text-lg font-bold leading-tight group-hover:text-blue-900 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Galeri Kegiatan Section */}
            <div className="mt-32">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-0.5 w-12 bg-black"></div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Galeri Kegiatan</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activities.map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-8 text-center">
                      <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Kegiatan</p>
                      <p className="text-white text-xs font-bold uppercase tracking-widest leading-relaxed">
                        {item.title}
                      </p>
                      <div className="mt-4 w-8 h-px bg-white/30"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="py-32 text-center">
            <p className="text-gray-400 font-serif italic text-xl">Belum ada berita saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
