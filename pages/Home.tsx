
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { journals as initialJournals, activities as initialActivities } from '../data';
import { Journal, ActivityItem, Category } from '../types';
import { socketService } from '../src/services/socketService';

const getCategoryLabel = (cat: Category) => {
  switch (cat) {
    case Category.ESSAI: return 'Opini';
    case Category.DOKUMENTER: return 'Dokumenter';
    case Category.BUKU: return 'Buku';
    default: return 'Jurnal';
  }
};

const CeliosCard: React.FC<{ item: Journal }> = ({ item }) => (
  <div className="snap-start flex-shrink-0 w-[85vw] md:w-[320px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group bg-white flex flex-col h-full border border-white/5">
    <div className="bg-[#372B8F] py-14 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L100 0 L100 100 Z" fill="white" />
        </svg>
      </div>
      <div className="relative z-10 w-32 h-44 shadow-2xl rounded-sm overflow-hidden transform group-hover:scale-105 transition-transform duration-500 border border-white/20">
        <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
      </div>
    </div>
    
    <div className="p-7 flex flex-col flex-grow bg-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#372B8F] px-2 py-0.5 bg-brand-tint rounded">
          {getCategoryLabel(item.category)}
        </span>
        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
          {new Date(item.date_published).toLocaleDateString('id-ID', { year: 'numeric' })}
        </span>
      </div>
      
      <Link to={`/journals/${item.slug}`} className="block mb-4">
        <h3 className="text-xl font-bold leading-tight text-[#372B8F] group-hover:underline decoration-[#372B8F]/30 underline-offset-4">
          {item.title}
        </h3>
      </Link>
      
      <p className="text-neutral-600 text-sm line-clamp-3 leading-relaxed mb-6 flex-grow">
        {item.abstract}
      </p>
      
      <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
         <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate max-w-[150px]">
           {typeof item.authors[0] === 'string' ? item.authors[0] : item.authors[0].name}
         </span>
         <div className="text-[#372B8F]">
           <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
           </svg>
         </div>
      </div>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [journals, setJournals] = useState<Journal[]>(() => {
    const saved = localStorage.getItem('db_journals');
    return saved ? JSON.parse(saved) : initialJournals;
  });
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('db_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const unsubscribe = socketService.subscribe((state) => {
      setJournals(state.journals);
      setActivities(state.activities);
    });

    return () => unsubscribe();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 352; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const featuredData = journals.slice(0, 10);
  const galleryImages = activities.slice(0, 6).map(a => a.image);
  const newsItems = activities.slice(0, 4);

  return (
    <main className="bg-white font-sans text-gray-900 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 premium-gradient text-white">
        <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none mb-4 selection:bg-white selection:text-brand-primary">
            CORPUS 
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-white/30"></div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-white/60">
              Communication for a resilient, progressive and unified society
            </p>
            <div className="h-px w-8 bg-white/30"></div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CONTENT */}
      <section className="py-24 bg-[#241C5E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2B2270] transform skew-x-12 translate-x-1/2 opacity-20 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 flex justify-between items-end border-b border-white/10 pb-8">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 mb-3">Featured Research</h2>
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">Terbaru & Unggulan</p>
            </div>
            <Link to="/karya/riset" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all pb-1">
              <span>Lihat Semua Laporan</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="relative group/slider">
            <button onClick={() => scroll('left')} className={`absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#372B8F] hover:scale-110 active:scale-95 transition-all duration-300 ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100 hidden md:flex'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll('right')} className={`absolute -right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#372B8F] hover:scale-110 active:scale-95 transition-all duration-300 ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100 hidden md:flex'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div ref={scrollRef} onScroll={handleScroll} className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-12 no-scrollbar scroll-smooth">
              {featuredData.map((item) => <CeliosCard key={item.id} item={item} />)}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SNAPSHOT SECTION */}
      <section className="py-32 bg-white border-y border-brand-primary/5">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <h2 className="serif-heading text-4xl font-bold mb-8 text-brand-primary">A snapshot of our work</h2>
          <p className="text-lg text-neutral-600 leading-relaxed mb-12 font-medium">
            Corpus adalah lembaga riset independen yang mendedikasikan diri pada studi media, 
            kebijakan digital, dan transformasi komunikasi. Kami memproduksi data berkualitas 
            tinggi untuk mendorong debat publik yang lebih sehat.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/tentang-kami" className="px-10 py-4 border border-brand-primary text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all duration-300">
              Our reform philosophy
            </Link>
            <Link to="/karya/riset" className="px-10 py-4 bg-[#372B8F] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-hover transition-all duration-300 shadow-lg shadow-brand-primary/20">
              All publications
            </Link>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="flex flex-col items-center">
            <p className="text-7xl md:text-9xl font-black tracking-tighter mb-4 text-[#372B8F]">330+</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Publications</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-7xl md:text-9xl font-black tracking-tighter mb-4 text-[#372B8F]">300+</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Opini</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-7xl md:text-9xl font-black tracking-tighter mb-4 text-[#372B8F]">50+</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Trainings</p>
          </div>
        </div>
      </section>

      {/* 5. DESKS GRID */}
      <section className="py-24 bg-[#372B8F]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-white/50 text-[10px] font-black uppercase tracking-[0.4em] mb-16">Research Desks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Digital Economy & Policy", desc: "Menganalisis dampak ekonomi dari transformasi digital dan regulasi platform teknologi." },
              { title: "Climate & Green Energy", desc: "Fokus pada transisi energi berkeadilan dan strategi komunikasi krisis iklim." },
              { title: "Media Sustainability", desc: "Solusi keberlanjutan media massa di tengah disrupsi algoritma global." },
              { title: "Public Information Access", desc: "Memantau keterbukaan data publik dan transparansi kebijakan pemerintah." },
              { title: "Fiscal Justice", desc: "Studi keadilan pajak dalam ekonomi digital dan alokasi anggaran publik." },
              { title: "Human Rights in Digital Era", desc: "Perlindungan privasi, data pribadi, dan hak asasi manusia di ruang siber." },
              { title: "Information Literacy", desc: "Edukasi masyarakat dalam menghadapi misinformasi dan polarisasi digital." },
              { title: "Sustainable Investment", desc: "Tinjauan kritis terhadap arus investasi asing dan kedaulatan nasional." },
              { title: "AI Ethics & Governance", desc: "Membangun kerangka etis pemanfaatan AI untuk kepentingan publik." }
            ].map((desk, idx) => (
              <div key={idx} className="bg-white p-10 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border border-white/10">
                <h3 className="text-xl font-bold mb-6 group-hover:text-[#372B8F] transition-colors">{desk.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{desk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OP-EDS HIGHLIGHT */}
      <section className="py-32 bg-brand-tint border-y border-brand-primary/5 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="serif-heading text-5xl font-bold mb-8 italic text-[#372B8F]">Analisis dan Opini Terkini</h2>
          <p className="text-neutral-500 text-lg mb-12 leading-relaxed">
            Menghubungkan teori akademik dengan diskursus publik melalui opini yang diterbitkan di berbagai media ternama.
          </p>
          <Link to="/artikel/opini" className="inline-block px-12 py-5 bg-[#372B8F] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-hover transition-all shadow-xl shadow-brand-primary/20">
            See our op-eds here
          </Link>
        </div>
      </section>

      {/* 7. ACTIVITY SECTION */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/2">
            <div className="mb-8 border-b border-neutral-100 pb-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#372B8F]">Gallery</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="aspect-square bg-neutral-100 overflow-hidden rounded-xl group relative">
                  <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                  <div className="absolute inset-0 bg-[#372B8F]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/aktivitas-berita" className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-[#372B8F] pb-1 hover:text-neutral-400 hover:border-neutral-200 transition-all">
                View all gallery
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="mb-8 border-b border-neutral-100 pb-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#372B8F]">News Updates</h2>
            </div>
            <div className="space-y-6">
              {newsItems.map((item) => (
                <Link key={item.id} to={`/aktivitas-berita/${item.id}`} className="group block bg-white border border-neutral-100 p-6 rounded-2xl hover:border-[#372B8F] transition-all hover:shadow-lg hover:shadow-[#372B8F]/5">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.date}</p>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-brand-tint text-[#372B8F] rounded-full">Update</span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight group-hover:text-[#372B8F] transition-colors mb-3">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-right">
              <Link to="/aktivitas-berita" className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-[#372B8F] pb-1 hover:text-neutral-400 hover:border-neutral-200 transition-all">
                View all news
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. THREE CTA BLOCKS */}
      <section className="py-24 premium-gradient text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4">Subscribe</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-[250px]">Dapatkan pembaruan riset mingguan langsung di email Anda.</p>
            <Link to="/tentang-kami#contact" className="px-10 py-4 border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-primary transition-all">Join Mailing List</Link>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Support Campaigns</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-[250px]">Bantu kami menjaga independensi riset dan akses informasi publik.</p>
            <Link to="/tentang-kami#contact" className="px-10 py-4 border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-primary transition-all">Donate Now</Link>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Join Our Events</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-[250px]">Daftar webinar dan rilis laporan riset eksklusif kami.</p>
            <Link to="/aktivitas-berita" className="px-10 py-4 border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-primary transition-all">View Schedule</Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;
