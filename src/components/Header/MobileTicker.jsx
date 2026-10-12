import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBreakingNews } from '../../services/api';

const MobileTicker = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchBreakingNews();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch breaking news for ticker', error);
      } finally {
        setIsLoading(false);
      }
    };

    getNews();
    const interval = setInterval(getNews, 60000); // 60 seconds auto-refresh
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[44px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-[60] overflow-hidden flex items-center md:hidden">
        <div className="bg-red-600 px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.1)]">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
          <span className="text-white text-[13px] font-bold uppercase tracking-wider">Breaking</span>
        </div>
        <div className="flex-1 flex gap-4 px-4 overflow-hidden animate-pulse">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 shrink-0"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48 shrink-0"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 shrink-0"></div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="w-full h-[44px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-[60] flex items-center md:hidden">
        <div className="bg-red-600 px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
          <span className="text-white text-[13px] font-bold uppercase tracking-wider">Breaking</span>
        </div>
        <span className="text-[16px] text-gray-500 font-semibold px-4">No Breaking News Available</span>
      </div>
    );
  }

  // Ensure enough items for seamless scrolling without awkward gaps
  let repeated = items;
  while (repeated.length < 4) {
    repeated = [...repeated, ...items];
  }
  const duplicatedItems = [...repeated, ...repeated];

  // Slower, smooth reading speed (~25-30s for continuous flow)
  const duration = Math.max(repeated.length * 7.5, 26);

  return (
    <div className="marquee-container w-full h-[44px] bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-[60] overflow-hidden flex items-center md:hidden select-none">
      {/* Left Badge (Fixed) */}
      <div className="bg-red-600 px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-20 h-full shadow-[5px_0_15px_-3px_rgba(255,255,255,1)]">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
        <span className="text-white text-[12.5px] font-bold uppercase tracking-wider">Breaking</span>
      </div>
      
      {/* Fade masks for smooth entry and exit */}
      <div className="absolute left-[85px] top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>

      {/* Scrolling Content Track */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div 
          className="marquee-track h-full items-center pl-4 pr-0"
          style={{ '--marquee-duration': `${duration}s` }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-3 shrink-0 pr-8">
              {item.category && (
                <span className="bg-red-50 text-[#cc0000] border border-red-100 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
                  {item.category}
                </span>
              )}
              {item.article_slug ? (
                <Link to={`/article/${item.article_slug}`} className="text-[15.5px] font-medium text-gray-900 dark:text-gray-100 active:text-red-600 hover:text-red-600 transition-colors">
                  {item.title}
                </Link>
              ) : (
                <span className="text-[15.5px] font-medium text-gray-900 dark:text-gray-100">
                  {item.title}
                </span>
              )}
              <span className="text-red-500/60 text-[13px] ml-4 font-bold select-none">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTicker;
