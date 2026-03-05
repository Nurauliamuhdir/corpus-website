
import React from 'react';
import { Link } from 'react-router-dom';
import { Journal } from '../types';

interface Props {
  documentary: Journal;
}

const DocumentaryCard: React.FC<Props> = ({ documentary }) => {
  const formattedDate = new Date(documentary.date_published).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Thumbnail Video with 16:9 Aspect Ratio */}
      <Link to={`/journals/${documentary.slug}`} className="block relative aspect-video overflow-hidden">
        <img 
          src={documentary.cover_image} 
          alt={documentary.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        {/* Play Button Overlay (Lime Green) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <div className="w-16 h-16 bg-brand-lime text-brand-celios rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-brand-celios/90 text-[9px] font-black uppercase tracking-widest text-white rounded-md shadow-lg">
            {documentary.category}
          </span>
        </div>
      </Link>
      
      {/* Content Info */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formattedDate}</span>
        </div>
        
        <Link to={`/journals/${documentary.slug}`} className="block mb-3">
          <h3 className="text-lg font-bold leading-tight text-gray-900 group-hover:text-brand-celios transition-colors line-clamp-2">
            {documentary.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 flex-grow">
          {documentary.abstract}
        </p>
        
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[150px]">
             By {typeof documentary.authors[0] === 'string' ? documentary.authors[0] : documentary.authors[0].name}
           </span>
           <Link to={`/journals/${documentary.slug}`} className="text-brand-lime hover:text-brand-celios transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentaryCard;
