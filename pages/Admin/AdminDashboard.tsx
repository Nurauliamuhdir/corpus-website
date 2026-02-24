
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { journals as initialJournals, activities as initialActivities } from '../../data';
import { Journal, ActivityItem, Category, ContentStatus, SiteSettings, TeamMember } from '../../types';
import { socketService } from '../../src/services/socketService';

// --- SHARED COMPONENTS ---

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="serif-heading text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-8 max-h-[75vh] overflow-y-auto bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

const FileInput = ({ label, value, onChange, compact = false }: { label?: string, value: string, onChange: (val: string) => void, compact?: boolean }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <div className="relative group w-full">
          <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div className="w-full py-1.5 px-3 bg-gray-100 text-gray-500 border border-dashed border-gray-300 rounded-lg text-[9px] font-bold uppercase text-center group-hover:bg-gray-200 transition-colors">
            Ganti Foto
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>}
      <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-20 h-20 bg-white rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-300">
          {value ? <img src={value} className="w-full h-full object-cover" alt="Preview" /> : <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        </div>
        <div className="flex-grow space-y-2">
          <input 
            type="text" 
            placeholder="Tempel URL Gambar..." 
            className="w-full px-4 py-2 bg-white rounded-lg text-xs outline-none border border-gray-100 focus:border-black"
            value={value.startsWith('data:') ? 'File Terunggah' : value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="relative group">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="w-full py-2 px-4 bg-black text-white rounded-lg text-[10px] font-bold uppercase text-center group-hover:bg-gray-800 transition-colors">
              Pilih Dari Komputer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [journals, setJournals] = useState<Journal[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  
  const [editingJournal, setEditingJournal] = useState<Partial<Journal> & { authorsRaw?: string, key_findings_raw?: string, references_raw?: string }>({});
  const [editingActivity, setEditingActivity] = useState<Partial<ActivityItem>>({});

  const sidebarLinks = [
    { name: 'Ringkasan', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Kelola Karya', path: '/admin/karya', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Kelola Artikel', path: '/admin/artikel', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l5 5v9a2 2 0 01-2 2z' },
    { name: 'Aktivitas & Berita', path: '/admin/aktivitas', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Tentang Kami', path: '/admin/settings', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  useEffect(() => {
    const unsubscribe = socketService.subscribe((state) => {
      setJournals(state.journals);
      setActivities(state.activities);
      setSettings(state.settings);
    });

    return () => unsubscribe();
  }, []);

  const persistData = (newJournals: Journal[], newActivities: ActivityItem[], newSettings: SiteSettings | null) => {
    const update: any = {};
    if (newJournals) update.journals = newJournals;
    if (newActivities) update.activities = newActivities;
    if (newSettings) update.settings = newSettings;

    socketService.updateState(update);
    
    // Local fallback
    if (newJournals) localStorage.setItem('db_journals', JSON.stringify(newJournals));
    if (newActivities) localStorage.setItem('db_activities', JSON.stringify(newActivities));
    if (newSettings) {
      localStorage.setItem('db_settings', JSON.stringify(newSettings));
      localStorage.setItem('site_logo', newSettings.logoUrl);
    }
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAuthors = editingJournal.authorsRaw ? editingJournal.authorsRaw.split(',').map(a => a.trim()).filter(a => a !== '') : (editingJournal.authors || []);
    const finalKeyFindings = editingJournal.key_findings_raw ? editingJournal.key_findings_raw.split('\n').map(k => k.trim()).filter(k => k !== '') : (editingJournal.key_findings || []);
    const finalReferences = editingJournal.references_raw ? editingJournal.references_raw.split('\n').map(r => r.trim()).filter(r => r !== '') : (editingJournal.references || []);
    
    let updatedJournals;
    const journalData = { 
      ...editingJournal, 
      authors: finalAuthors,
      key_findings: finalKeyFindings,
      references: finalReferences
    };
    delete (journalData as any).authorsRaw;
    delete (journalData as any).key_findings_raw;
    delete (journalData as any).references_raw;

    if (editingJournal.id && journals.find(j => j.id === editingJournal.id)) {
      updatedJournals = journals.map(j => j.id === editingJournal.id ? { ...j, ...journalData } as Journal : j);
    } else {
      updatedJournals = [{ ...journalData, id: Date.now().toString(), status: ContentStatus.PUBLISHED, date_published: new Date().toISOString() } as Journal, ...journals];
    }
    persistData(updatedJournals, activities, settings);
    setIsJournalModalOpen(false);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedActivities;
    const activityData = {
      ...editingActivity,
      author: editingActivity.author || 'Redaksi Corpus',
      image_caption: editingActivity.image_caption || 'Dokumentasi Corpus.'
    };
    if (editingActivity.id && activities.find(a => a.id === editingActivity.id)) {
      updatedActivities = activities.map(a => a.id === editingActivity.id ? { ...a, ...activityData } as ActivityItem : a);
    } else {
      updatedActivities = [{ ...activityData, id: Date.now().toString() } as ActivityItem, ...activities];
    }
    persistData(journals, updatedActivities, settings);
    setIsActivityModalOpen(false);
  };

  const addTeamMember = () => {
    if (!settings) return;
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: 'Anggota Baru',
      role: 'Posisi/Jabatan',
      image: 'https://i.pravatar.cc/300?u=' + Date.now()
    };
    persistData(journals, activities, { ...settings, team: [...settings.team, newMember] });
  };

  const updateTeamMemberImage = (memberId: string, newImage: string) => {
    if (!settings) return;
    const updatedTeam = settings.team.map(m => m.id === memberId ? { ...m, image: newImage } : m);
    persistData(journals, activities, { ...settings, team: updatedTeam });
  };

  const deleteJournal = (id: string) => { if (confirm('Hapus karya ini?')) persistData(journals.filter(j => j.id !== id), activities, settings); };
  const deleteActivity = (id: string) => { if (confirm('Hapus aktivitas ini?')) persistData(journals, activities.filter(a => a.id !== id), settings); };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-40">
        <div className="p-8 border-b border-gray-50 flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center"><span className="text-white font-serif font-bold">C</span></div>
            <span className="font-serif font-bold text-lg tracking-tight">AdminPanel</span>
          </Link>
          <button onClick={() => navigate('/')} className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg group">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Lihat Website
          </button>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          {sidebarLinks.map(link => (
            <Link key={link.path} to={link.path} className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-semibold transition-all ${location.pathname === link.path ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} /></svg>
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-10 border-t border-gray-50">
          <button onClick={() => navigate('/login')} className="text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">Log Out Akun</button>
        </div>
      </aside>

      <main className="ml-72 flex-grow p-16 overflow-y-auto">
        <Routes>
          <Route 
            index 
            element={
              <div className="space-y-8">
                <h1 className="serif-heading text-4xl font-bold">Ringkasan Sistem.</h1>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Karya</p>
                    <p className="text-4xl font-serif font-bold">{journals.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Berita</p>
                    <p className="text-4xl font-serif font-bold">{activities.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tim</p>
                    <p className="text-4xl font-serif font-bold">{settings?.team.length || 0}</p>
                  </div>
                </div>
              </div>
            } 
          />
          <Route 
            path="karya" 
            element={
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="serif-heading text-3xl font-bold">Kelola Karya (Dokumenter & Riset)</h1>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { 
                        setEditingJournal({ category: Category.DOKUMENTER, year: 2024, authorsRaw: '', pdf_url: '', video_url: '', hide_pdf_preview: false }); 
                        setIsJournalModalOpen(true); 
                      }} 
                      className="px-6 py-3 bg-red-600 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-red-700 transition-all"
                    >
                      + Dokumenter
                    </button>
                    <button 
                      onClick={() => { 
                        setEditingJournal({ category: Category.RESEARCH_ORIGINAL, year: 2024, authorsRaw: '', pdf_url: '', video_url: '', hide_pdf_preview: false }); 
                        setIsJournalModalOpen(true); 
                      }} 
                      className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-emerald-700 transition-all"
                    >
                      + Riset
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Judul</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {journals.filter(j => j.category === Category.DOKUMENTER || j.category === Category.RESEARCH_ORIGINAL).map(j => (
                        <tr key={j.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-medium text-sm text-gray-900">{j.title}</td>
                          <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{j.category}</td>
                          <td className="px-6 py-4 text-right space-x-4">
                            <button 
                              onClick={() => { 
                                setEditingJournal({ 
                                  ...j, 
                                  authorsRaw: (j.authors as any[]).map(a => typeof a === 'string' ? a : a.name).join(', '),
                                  key_findings_raw: j.key_findings?.join('\n') || '',
                                  references_raw: j.references?.join('\n') || ''
                                }); 
                                setIsJournalModalOpen(true); 
                              }} 
                              className="text-gray-300 hover:text-black font-bold text-[10px] uppercase"
                            >
                              Edit
                            </button>
                            <button onClick={() => deleteJournal(j.id)} className="text-red-300 hover:text-red-600 font-bold text-[10px] uppercase">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            } 
          />
          <Route 
            path="artikel" 
            element={
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="serif-heading text-3xl font-bold">Kelola Artikel (Ilmiah Populer & Opini)</h1>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { 
                        setEditingJournal({ category: Category.ARTIKEL_POPULER, year: 2024, authorsRaw: '', pdf_url: '', video_url: '', hide_pdf_preview: false }); 
                        setIsJournalModalOpen(true); 
                      }} 
                      className="px-6 py-3 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-blue-700 transition-all"
                    >
                      + Artikel Ilmiah
                    </button>
                    <button 
                      onClick={() => { 
                        setEditingJournal({ category: Category.ESSAI, year: 2024, authorsRaw: '', pdf_url: '', video_url: '', hide_pdf_preview: false }); 
                        setIsJournalModalOpen(true); 
                      }} 
                      className="px-6 py-3 bg-orange-600 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-orange-700 transition-all"
                    >
                      + Opini (Essai)
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Judul</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {journals.filter(j => j.category === Category.ARTIKEL_POPULER || j.category === Category.ESSAI).map(j => (
                        <tr key={j.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-medium text-sm text-gray-900">{j.title}</td>
                          <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{j.category === Category.ESSAI ? 'Opini' : j.category}</td>
                          <td className="px-6 py-4 text-right space-x-4">
                            <button 
                              onClick={() => { 
                                setEditingJournal({ 
                                  ...j, 
                                  authorsRaw: (j.authors as any[]).map(a => typeof a === 'string' ? a : a.name).join(', '),
                                  key_findings_raw: j.key_findings?.join('\n') || '',
                                  references_raw: j.references?.join('\n') || ''
                                }); 
                                setIsJournalModalOpen(true); 
                              }} 
                              className="text-gray-300 hover:text-black font-bold text-[10px] uppercase"
                            >
                              Edit
                            </button>
                            <button onClick={() => deleteJournal(j.id)} className="text-red-300 hover:text-red-600 font-bold text-[10px] uppercase">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            } 
          />
          <Route 
            path="aktivitas" 
            element={
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="serif-heading text-3xl font-bold">Kelola Aktivitas (Berita & Galeri)</h1>
                  <button 
                    onClick={() => { 
                      setEditingActivity({ content: '' }); 
                      setIsActivityModalOpen(true); 
                    }} 
                    className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase rounded-xl hover:bg-gray-800 transition-all"
                  >
                    + Tambah Berita/Galeri
                  </button>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Judul Berita</th>
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {activities.map(a => (
                        <tr key={a.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-medium text-sm text-gray-900">{a.title}</td>
                          <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{a.date}</td>
                          <td className="px-6 py-4 text-right space-x-4">
                            <button 
                              onClick={() => { 
                                setEditingActivity(a); 
                                setIsActivityModalOpen(true); 
                              }} 
                              className="text-gray-300 hover:text-black font-bold text-[10px] uppercase"
                            >
                              Edit
                            </button>
                            <button onClick={() => deleteActivity(a.id)} className="text-red-300 hover:text-red-600 font-bold text-[10px] uppercase">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            } 
          />
          <Route 
            path="settings" 
            element={
              <div className="space-y-12 pb-24">
                <h1 className="serif-heading text-3xl font-bold">Pengaturan Tentang Kami</h1>
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                  <h2 className="text-lg font-bold border-b border-gray-50 pb-4">Identitas Platform</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Situs</label>
                      <input 
                        className="w-full mt-2 px-5 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" 
                        value={settings?.siteName || ''} 
                        onChange={e => persistData(journals, activities, settings ? {...settings, siteName: e.target.value} : null)} 
                      />
                    </div>
                    <FileInput 
                      label="Logo Website" 
                      value={settings?.logoUrl || ''} 
                      onChange={val => persistData(journals, activities, settings ? {...settings, logoUrl: val} : null)} 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Kontak</label>
                      <input 
                        className="w-full mt-2 px-5 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" 
                        value={settings?.contactEmail || ''} 
                        onChange={e => persistData(journals, activities, settings ? {...settings, contactEmail: e.target.value} : null)} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Kantor</label>
                      <input 
                        className="w-full mt-2 px-5 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" 
                        value={settings?.contactAddress || ''} 
                        onChange={e => persistData(journals, activities, settings ? {...settings, contactAddress: e.target.value} : null)} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visi & Misi</label>
                    <textarea 
                      className="w-full mt-2 px-5 py-3 bg-gray-50 rounded-xl outline-none min-h-[100px] border border-transparent focus:border-black" 
                      value={settings?.visionStatement || ''} 
                      onChange={e => persistData(journals, activities, settings ? {...settings, visionStatement: e.target.value} : null)} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tentang Kami (About Text)</label>
                    <textarea 
                      className="w-full mt-2 px-5 py-3 bg-gray-50 rounded-xl outline-none min-h-[100px] border border-transparent focus:border-black" 
                      value={settings?.aboutText || ''} 
                      onChange={e => persistData(journals, activities, settings ? {...settings, aboutText: e.target.value} : null)} 
                    />
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                    <h2 className="text-lg font-bold">Manajemen Profil Tim</h2>
                    <button onClick={addTeamMember} className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase rounded-lg hover:bg-gray-800 transition-colors">+ Tambah Anggota</button>
                  </div>
                  <div className="space-y-6">
                    {settings?.team.map(member => (
                      <div key={member.id} className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition-all group">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-20 h-20 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all flex-shrink-0 border border-white shadow-sm">
                            <img src={member.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <FileInput compact value={member.image} onChange={(val) => updateTeamMemberImage(member.id, val)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow w-full">
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-gray-400 uppercase">Nama Lengkap</label>
                            <input 
                              className="w-full bg-white px-3 py-2 rounded-lg text-sm font-bold outline-none border border-gray-100 focus:border-black" 
                              value={member.name} 
                              onChange={e => persistData(journals, activities, settings ? {...settings, team: settings.team.map(m => m.id === member.id ? {...m, name: e.target.value} : m) } : null)} 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-gray-400 uppercase">Jabatan</label>
                            <input 
                              className="w-full bg-white px-3 py-2 rounded-lg text-xs outline-none border border-gray-100 focus:border-black" 
                              value={member.role} 
                              onChange={e => persistData(journals, activities, settings ? {...settings, team: settings.team.map(m => m.id === member.id ? {...m, role: e.target.value} : m) } : null)} 
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => persistData(journals, activities, settings ? {...settings, team: settings.team.filter(m => m.id !== member.id)} : null)} 
                          className="p-3 text-red-300 hover:text-red-500 transition-colors md:self-center"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {settings?.team.length === 0 && <p className="text-center py-10 text-gray-400 text-sm italic">Belum ada anggota tim.</p>}
                  </div>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>

      <Modal isOpen={isJournalModalOpen} onClose={() => setIsJournalModalOpen(false)} title={editingJournal.id ? "Edit Karya" : "Tambah Karya Baru"}>
        <form onSubmit={handleSaveJournal} className="space-y-6 pb-4">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Judul Karya</label>
              <input required className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" value={editingJournal.title || ''} onChange={e => setEditingJournal({...editingJournal, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori</label>
                <select className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" value={editingJournal.category || Category.JURNAL} onChange={e => setEditingJournal({...editingJournal, category: e.target.value as Category})}>
                  {Array.from(new Set(Object.values(Category))).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tahun</label>
                <input type="number" className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" value={editingJournal.year || 2024} onChange={e => setEditingJournal({...editingJournal, year: parseInt(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Penulis (Pisahkan dengan koma)</label>
              <input className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" value={editingJournal.authorsRaw || ''} onChange={e => setEditingJournal({...editingJournal, authorsRaw: e.target.value})} placeholder="Contoh: Dr. Ahmad, Maria Ulfa" />
            </div>

            {/* DYNAMIC FIELDS BASED ON CATEGORY */}
            {(editingJournal.category === Category.JURNAL || editingJournal.category === Category.ARTIKEL_POPULER) && (
              <div className="space-y-4 p-6 bg-blue-50/30 rounded-2xl border border-blue-100">
                <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Informasi Jurnal / Artikel</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Jurnal</label>
                    <input className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none border border-transparent focus:border-black text-xs" value={editingJournal.journal_name || ''} onChange={e => setEditingJournal({...editingJournal, journal_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DOI</label>
                    <input className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none border border-transparent focus:border-black text-xs" value={editingJournal.doi || ''} onChange={e => setEditingJournal({...editingJournal, doi: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume</label>
                    <input className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none border border-transparent focus:border-black text-xs" value={editingJournal.volume || ''} onChange={e => setEditingJournal({...editingJournal, volume: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issue / No</label>
                    <input className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none border border-transparent focus:border-black text-xs" value={editingJournal.issue || ''} onChange={e => setEditingJournal({...editingJournal, issue: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL Source / PDF</label>
                  <input className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none border border-transparent focus:border-black text-xs" value={editingJournal.pdf_url || ''} onChange={e => setEditingJournal({...editingJournal, pdf_url: e.target.value})} placeholder="https://..." />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="hide_pdf" checked={editingJournal.hide_pdf_preview || false} onChange={e => setEditingJournal({...editingJournal, hide_pdf_preview: e.target.checked})} />
                  <label htmlFor="hide_pdf" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer">Sembunyikan Preview PDF (Hanya Tombol Source)</label>
                </div>
              </div>
            )}

            {editingJournal.category === Category.DOKUMENTER && (
              <div className="space-y-4 p-6 bg-red-50/30 rounded-2xl border border-red-100">
                <h4 className="text-[10px] font-black uppercase text-red-400 tracking-widest">Informasi Dokumenter</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL Video Embed (YouTube/Vimeo)</label>
                  <input className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none border border-transparent focus:border-black text-xs" value={editingJournal.video_url || ''} onChange={e => setEditingJournal({...editingJournal, video_url: e.target.value})} placeholder="https://www.youtube.com/embed/..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL Video Full (External)</label>
                  <input className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none border border-transparent focus:border-black text-xs" value={editingJournal.full_url || ''} onChange={e => setEditingJournal({...editingJournal, full_url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Poin Utama Investigasi (Pisahkan dengan baris baru)</label>
                  <textarea className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none min-h-[100px] border border-transparent focus:border-black text-xs" value={editingJournal.key_findings_raw || ''} onChange={e => setEditingJournal({...editingJournal, key_findings_raw: e.target.value})} placeholder="Poin 1&#10;Poin 2&#10;Poin 3" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Konten Editorial Lengkap</label>
                  <textarea className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none min-h-[150px] border border-transparent focus:border-black text-xs" value={editingJournal.full_content || ''} onChange={e => setEditingJournal({...editingJournal, full_content: e.target.value})} />
                </div>
              </div>
            )}

            {editingJournal.category === Category.RESEARCH_ORIGINAL && (
              <div className="space-y-4 p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Informasi Riset Original</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Latar Belakang Riset</label>
                  <textarea className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none min-h-[100px] border border-transparent focus:border-black text-xs" value={editingJournal.background_story || ''} onChange={e => setEditingJournal({...editingJournal, background_story: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Temuan Utama (Pisahkan dengan baris baru)</label>
                  <textarea className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none min-h-[100px] border border-transparent focus:border-black text-xs" value={editingJournal.key_findings_raw || ''} onChange={e => setEditingJournal({...editingJournal, key_findings_raw: e.target.value})} placeholder="Temuan 1&#10;Temuan 2" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Konten Riset Lengkap</label>
                  <textarea className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none min-h-[150px] border border-transparent focus:border-black text-xs" value={editingJournal.full_content || ''} onChange={e => setEditingJournal({...editingJournal, full_content: e.target.value})} />
                </div>
              </div>
            )}

            {(editingJournal.category === Category.NEWS || editingJournal.category === Category.ESSAI) && (
              <div className="space-y-4 p-6 bg-orange-50/30 rounded-2xl border border-orange-100">
                <h4 className="text-[10px] font-black uppercase text-orange-400 tracking-widest">Konten {editingJournal.category}</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Isi Konten Lengkap</label>
                  <textarea className="w-full mt-1 px-4 py-3 bg-white rounded-xl outline-none min-h-[200px] border border-transparent focus:border-black text-xs" value={editingJournal.full_content || ''} onChange={e => setEditingJournal({...editingJournal, full_content: e.target.value})} />
                </div>
              </div>
            )}

            <FileInput label="Gambar Sampul Karya" value={editingJournal.cover_image || ''} onChange={val => setEditingJournal({...editingJournal, cover_image: val})} />
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Abstrak / Sinopsis</label>
              <textarea className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none min-h-[120px] border border-transparent focus:border-black" value={editingJournal.abstract || ''} onChange={e => setEditingJournal({...editingJournal, abstract: e.target.value})} />
            </div>

            {/* COMMON RICH CONTENT FOR ACADEMIC LAYOUTS */}
            {(editingJournal.category === Category.JURNAL || editingJournal.category === Category.ARTIKEL_POPULER || editingJournal.category === Category.RESEARCH_ORIGINAL) && (
              <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-300">Struktur Konten Akademik</h3>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pendahuluan (HTML)</label>
                  <textarea 
                    className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none min-h-[100px] border border-transparent focus:border-black text-xs font-mono" 
                    value={editingJournal.content?.introduction || ''} 
                    onChange={e => setEditingJournal({...editingJournal, content: { ...editingJournal.content, introduction: e.target.value, sections: editingJournal.content?.sections || [] } as any})} 
                  />
                </div>

                {/* Sections Management */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bagian Konten (Sections)</label>
                    <button 
                      type="button"
                      onClick={() => {
                        const newSection = { id: Date.now().toString(), title: 'Bagian Baru', content: '' };
                        const currentSections = editingJournal.content?.sections || [];
                        setEditingJournal({
                          ...editingJournal,
                          content: {
                            ...(editingJournal.content || {}),
                            sections: [...currentSections, newSection]
                          } as any
                        });
                      }}
                      className="text-[9px] font-bold text-black border border-black px-2 py-1 rounded hover:bg-black hover:text-white transition-all"
                    >
                      + Tambah Bagian
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(editingJournal.content?.sections || []).map((section, idx) => (
                      <div key={section.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                        <div className="flex justify-between items-center">
                          <input 
                            className="bg-transparent font-bold text-sm outline-none border-b border-transparent focus:border-black w-full"
                            value={section.title}
                            onChange={e => {
                              const newSections = [...(editingJournal.content?.sections || [])];
                              newSections[idx] = { ...section, title: e.target.value };
                              setEditingJournal({ ...editingJournal, content: { ...editingJournal.content, sections: newSections } as any });
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newSections = (editingJournal.content?.sections || []).filter((_, i) => i !== idx);
                              setEditingJournal({ ...editingJournal, content: { ...editingJournal.content, sections: newSections } as any });
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                        <textarea 
                          className="w-full px-3 py-2 bg-white rounded-lg outline-none border border-gray-100 focus:border-black text-xs font-mono min-h-[80px]"
                          placeholder="Isi konten bagian (HTML)..."
                          value={section.content}
                          onChange={e => {
                            const newSections = [...(editingJournal.content?.sections || [])];
                            newSections[idx] = { ...section, content: e.target.value };
                            setEditingJournal({ ...editingJournal, content: { ...editingJournal.content, sections: newSections } as any });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kesimpulan (HTML)</label>
                  <textarea 
                    className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none min-h-[100px] border border-transparent focus:border-black text-xs font-mono" 
                    value={editingJournal.content?.conclusion || ''} 
                    onChange={e => setEditingJournal({...editingJournal, content: { ...editingJournal.content, conclusion: e.target.value, sections: editingJournal.content?.sections || [] } as any})} 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Referensi (Pisahkan dengan baris baru)</label>
                  <textarea 
                    className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none min-h-[100px] border border-transparent focus:border-black text-xs font-mono" 
                    value={editingJournal.references_raw || ''} 
                    onChange={e => setEditingJournal({...editingJournal, references_raw: e.target.value})} 
                    placeholder="[1] Reference 1&#10;[2] Reference 2"
                  />
                </div>
              </div>
            )}
          </div>
          <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl hover:bg-gray-800 transition-all mt-4">Simpan Karya</button>
        </form>
      </Modal>

      <Modal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} title={editingActivity.id ? "Edit Berita" : "Tambah Berita Baru"}>
        <form onSubmit={handleSaveActivity} className="space-y-6 pb-4">
          <div className="space-y-4">
            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Judul Berita Utama</label><input required className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" value={editingActivity.title || ''} onChange={e => setEditingActivity({...editingActivity, title: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tanggal</label><input className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" value={editingActivity.date || ''} onChange={e => setEditingActivity({...editingActivity, date: e.target.value})} /></div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lokasi</label><input className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" value={editingActivity.location || ''} onChange={e => setEditingActivity({...editingActivity, location: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Penulis / Reporter</label><input className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" value={editingActivity.author || ''} onChange={e => setEditingActivity({...editingActivity, author: e.target.value})} placeholder="Redaksi Corpus" /></div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Caption Foto</label><input className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-black" value={editingActivity.image_caption || ''} onChange={e => setEditingActivity({...editingActivity, image_caption: e.target.value})} placeholder="Dokumentasi Corpus." /></div>
            </div>
            <FileInput label="Foto Berita / Dokumentasi" value={editingActivity.image || ''} onChange={val => setEditingActivity({...editingActivity, image: val})} />
            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ringkasan / Cuplikan</label><textarea className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none min-h-[80px] border border-transparent focus:border-black" value={editingActivity.description || ''} onChange={e => setEditingActivity({...editingActivity, description: e.target.value})} /></div>
            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Konten Berita Lengkap</label><textarea className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none min-h-[250px] border border-transparent focus:border-black" placeholder="Tulis artikel lengkap di sini..." value={editingActivity.content || ''} onChange={e => setEditingActivity({...editingActivity, content: e.target.value})} /></div>
          </div>
          <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl hover:bg-gray-800 transition-all mt-4">Simpan Berita</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
