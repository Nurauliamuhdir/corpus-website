
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { journals as initialJournals } from '../data';
import { Category, FilterOptions, Journal } from '../types';
import { socketService } from '../src/services/socketService';
import JournalCard from '../components/JournalCard';
import DocumentaryCard from '../components/DocumentaryCard';

interface ListingProps {
  title?: string;
  forcedCategory?: Category;
}

const JournalListing: React.FC<ListingProps> = ({ title = "Arsip Jurnal", forcedCategory }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [journals, setJournals] = useState<Journal[]>(() => {
    const saved = localStorage.getItem('db_journals');
    return saved ? JSON.parse(saved) : initialJournals;
  });

  const initialCategory = (forcedCategory || (queryParams.get('category') as Category || 'Semua')) as Category | 'Semua';
  const initialSearch = queryParams.get('search') || '';

  const [filters, setFilters] = useState<FilterOptions>({
    category: initialCategory,
    year: 'Semua',
    search: initialSearch,
  });

  useEffect(() => {
    const unsubscribe = socketService.subscribe((state) => {
      setJournals(state.journals);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: (forcedCategory || (queryParams.get('category') as Category || 'Semua')) as Category | 'Semua',
      search: queryParams.get('search') || ''
    }));
  }, [forcedCategory, location.search]);

  const categories = useMemo(() => ['Semua', ...Array.from(new Set(Object.values(Category)))], [journals]);
  const years = ['Semua', ...Array.from(new Set(journals.map(j => j.year)))].sort((a, b) => 
    (typeof b === 'number' && typeof a === 'number') ? b - a : 0
  );

  const filteredJournals = useMemo(() => {
    return journals.filter(j => {
      const matchSearch = j.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          j.authors.some(a => (typeof a === 'string' ? a : a.name).toLowerCase().includes(filters.search.toLowerCase()));
      const matchCategory = filters.category === 'Semua' || j.category === filters.category;
      const matchYear = filters.year === 'Semua' || j.year === filters.year;
      
      return matchSearch && matchCategory && matchYear;
    }).sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());
  }, [filters, journals]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="serif-heading text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-500">Temukan publikasi akademik kami berdasarkan kategori, tahun, atau kata kunci.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-12 items-end">
        <div className="w-full lg:w-1/3">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cari</label>
          <input 
            type="text"
            placeholder="Ketik judul atau penulis..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        
        {!forcedCategory && (
          <div className="w-full lg:w-1/4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kategori</label>
            <select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as Category | 'Semua' }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black appearance-none bg-white"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        <div className="w-full lg:w-1/4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tahun</label>
          <select 
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value === 'Semua' ? 'Semua' : parseInt(e.target.value) }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black appearance-none bg-white"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex-grow flex justify-end">
          <button 
            onClick={() => setFilters({ category: (forcedCategory || 'Semua') as Category | 'Semua', year: 'Semua', search: '' })}
            className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {filteredJournals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJournals.map(journal => (
            journal.category === Category.DOKUMENTER ? (
              <DocumentaryCard key={journal.id} documentary={journal} />
            ) : (
              <JournalCard key={journal.id} journal={journal} />
            )
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">Tidak ada hasil ditemukan</h3>
        </div>
      )}
    </div>
  );
};

export default JournalListing;
