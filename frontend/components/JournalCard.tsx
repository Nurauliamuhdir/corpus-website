
import React from 'react';
import { Link } from 'react-router-dom';
import { Journal } from '../types';

interface Props {
  journal: Journal;
}

const JournalCard: React.FC<Props> = ({ journal }) => {
  return (
    <Link 
      to={`/journals/${journal.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-brand-primary/5 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 transform hover:-translate-y-1"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img 
          src={journal.cover_image} 
          alt={journal.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-brand-primary/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-white rounded-full shadow-lg">
            {journal.category}
          </span>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
          <span>{journal.year}</span>
          <span className="text-brand-primary/20">•</span>
          <span className="truncate">{typeof journal.authors[0] === 'string' ? journal.authors[0] : journal.authors[0].name}</span>
        </div>
        <h3 className="serif-heading text-xl font-bold leading-snug text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2 mb-4">
          {journal.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
          {journal.abstract}
        </p>
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-primary">
          Read Full Report
          <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default JournalCard;
