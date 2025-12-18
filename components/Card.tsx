import React from 'react';
import { Article } from '../types';
import { ArrowRight } from 'lucide-react';

interface CardProps {
  article: Article;
  onReadMore: (article: Article) => void;
  variant?: 'circle' | 'square';
}

export const Card: React.FC<CardProps> = ({ article, onReadMore, variant = 'circle' }) => {
  return (
    <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => onReadMore(article)}>
      {/* Image Container */}
      <div className={`
        relative overflow-hidden mb-6 shadow-xl shadow-pink-100/50 transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-pink-200/70 group-hover:-translate-y-2
        ${variant === 'circle' ? 'rounded-full w-56 h-56 md:w-64 md:h-64 border-4 border-white' : 'rounded-3xl w-full h-64 border-4 border-white'}
      `}>
        <div className="absolute inset-0 bg-pink-900/10 group-hover:bg-transparent transition-colors z-10"></div>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      {/* Text Content */}
      <h3 className="text-2xl font-serif text-gray-800 mb-3 group-hover:text-brand-dark-pink transition-colors">
        {article.title}
      </h3>
      
      <p className="text-gray-500 font-light leading-relaxed mb-6 max-w-xs mx-auto text-sm line-clamp-3">
        {article.description}
      </p>

      <button 
        className="flex items-center gap-2 px-6 py-2 bg-white text-pink-700 rounded-full text-xs font-bold uppercase tracking-widest border border-pink-100 group-hover:bg-pink-50 transition-colors"
      >
        Read Article
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
