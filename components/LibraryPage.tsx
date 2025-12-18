import React, { useState, useMemo } from 'react';
import { Article } from '../types';
import { MAIN_CATEGORIES, FEATURE_ARTICLES, PERIOD_DETAILS, ADDITIONAL_LIBRARY_ARTICLES } from '../constants';
import { Card } from './Card';
import { Search, Filter, BookOpen } from 'lucide-react';

interface LibraryPageProps {
  onReadMore: (article: Article) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onReadMore }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Consolidate all articles
  const allArticles = useMemo(() => {
    return [
      ...MAIN_CATEGORIES,
      ...FEATURE_ARTICLES,
      ...PERIOD_DETAILS,
      ...ADDITIONAL_LIBRARY_ARTICLES
    ].reduce((acc, current) => {
        // Remove duplicates if any (by id)
        const x = acc.find(item => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, [] as Article[]);
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(allArticles.map(a => a.category));
    return ['All', ...Array.from(cats)];
  }, [allArticles]);

  // Filter logic
  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            article.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [allArticles, searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      {/* Header Section */}
      <div className="bg-pink-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-pink-800/50 backdrop-blur-sm px-4 py-1 rounded-full text-pink-200 text-xs font-bold uppercase tracking-widest mb-4 border border-pink-700">
             <BookOpen size={14} />
             <span>Health Library</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Knowledge is Power</h1>
          <p className="text-pink-100 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Explore our curated collection of insights on your body, mind, and cycle.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-6 items-center border border-gray-100">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder-gray-400 text-gray-700"
            />
          </div>

          {/* Categories */}
          <div className="flex-1 w-full overflow-x-auto custom-scrollbar pb-2 md:pb-0">
             <div className="flex gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all
                      ${activeCategory === cat 
                        ? 'bg-pink-600 text-white shadow-md' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-pink-50 hover:text-pink-600'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-serif text-gray-800">
             {activeCategory === 'All' ? 'All Articles' : `${activeCategory} Articles`}
           </h2>
           <span className="text-sm text-gray-500 font-medium">{filteredArticles.length} results</span>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredArticles.map((article, idx) => (
              <div key={article.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                <Card article={article} onReadMore={onReadMore} variant="square" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-60">
            <Filter size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-serif text-gray-600">No articles found matching your search.</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              className="mt-4 text-pink-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};