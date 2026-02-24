
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { socketService } from '../src/services/socketService';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Corpus',
    logoUrl: 'https://picsum.photos/seed/corpus/200/200'
  });

  useEffect(() => {
    const unsubscribe = socketService.subscribe((state) => {
      setSettings({
        siteName: state.settings.siteName,
        logoUrl: state.settings.logoUrl
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const isActive = (path: string) => location.pathname === path;

  const karyaLinks = [
    { name: 'Dokumenter', path: '/karya/dokumenter' },
    { name: 'Riset', path: '/karya/riset' },
  ];

  const artikelLinks = [
    { name: 'Artikel Ilmiah Populer', path: '/artikel/ilmiah' },
    { name: 'Opini', path: '/artikel/opini' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-primary/10 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20 overflow-hidden">
                <img src={settings.logoUrl} alt={settings.siteName} className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-brand-primary">{settings.siteName}</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:space-x-8 items-center h-full">
            <Link to="/" className={`text-[10px] font-black uppercase tracking-widest ${isActive('/') ? 'text-brand-primary border-b-2 border-brand-primary py-8' : 'text-gray-400 hover:text-brand-primary'}`}>Beranda</Link>
            
            {/* Karya Dropdown */}
            <div className="relative h-full flex items-center" onMouseEnter={() => setOpenDropdown('karya')} onMouseLeave={() => setOpenDropdown(null)}>
              <button className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${openDropdown === 'karya' || location.pathname.startsWith('/karya') ? 'text-brand-primary' : 'text-gray-400'}`}>
                Karya <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openDropdown === 'karya' && (
                <div className="absolute top-20 left-0 w-48 bg-white border border-brand-primary/10 shadow-2xl py-6 rounded-b-2xl animate-in fade-in slide-in-from-top-2">
                  {karyaLinks.map(link => (
                    <Link key={link.path} to={link.path} className="block px-8 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-primary hover:bg-brand-tint">{link.name}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/aktivitas-berita" className={`text-[10px] font-black uppercase tracking-widest ${location.pathname.startsWith('/aktivitas-berita') ? 'text-brand-primary border-b-2 border-brand-primary py-8' : 'text-gray-400 hover:text-brand-primary'}`}>Aktivitas & Berita</Link>

            {/* Artikel Dropdown */}
            <div className="relative h-full flex items-center" onMouseEnter={() => setOpenDropdown('artikel')} onMouseLeave={() => setOpenDropdown(null)}>
              <button className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${openDropdown === 'artikel' || location.pathname.startsWith('/artikel') ? 'text-brand-primary' : 'text-gray-400'}`}>
                Artikel <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openDropdown === 'artikel' && (
                <div className="absolute top-20 left-0 w-56 bg-white border border-brand-primary/10 shadow-2xl py-6 rounded-b-2xl animate-in fade-in slide-in-from-top-2">
                  {artikelLinks.map(link => (
                    <Link key={link.path} to={link.path} className="block px-8 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-primary hover:bg-brand-tint">{link.name}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/tentang-kami" className={`text-[10px] font-black uppercase tracking-widest ${isActive('/tentang-kami') ? 'text-brand-primary border-b-2 border-brand-primary py-8' : 'text-gray-400 hover:text-brand-primary'}`}>Tentang Kami</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-brand-primary p-2 focus:outline-none">
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[100vh] border-b border-brand-primary/10' : 'max-h-0'}`}>
        <div className="px-6 pt-2 pb-10 bg-white space-y-2">
          <Link to="/" className="block py-4 text-[10px] font-black uppercase tracking-widest text-brand-primary">Beranda</Link>
          <div className="py-2 border-l-2 border-brand-primary/10 ml-2">
            <p className="px-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Karya</p>
            {karyaLinks.map(link => (
              <Link key={link.path} to={link.path} className="block px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{link.name}</Link>
            ))}
          </div>
          <Link to="/aktivitas-berita" className="block py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Aktivitas & Berita</Link>
          <div className="py-2 border-l-2 border-brand-primary/10 ml-2">
            <p className="px-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Artikel</p>
            {artikelLinks.map(link => (
              <Link key={link.path} to={link.path} className="block px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{link.name}</Link>
            ))}
          </div>
          <Link to="/tentang-kami" className="block py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Tentang Kami</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
