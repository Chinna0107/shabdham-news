import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBreakingNews } from '../../services/api';

const MobileTicker = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

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
          <span className="text-white text-[11px] font-bold uppercase tracking-wider">Breaking</span>
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
          <span className="text-white text-[11px] font-bold uppercase tracking-wider">Breaking</span>
        </div>
        <span className="text-[13px] text-gray-500 font-semibold px-4">No Breaking News Available</span>
      </div>
    );
  }

  // Duplicate items for seamless infinite scroll
  // The first set and second set will flow seamlessly
  const duplicatedItems = [...items, ...items];

  // Calculate duration based on item count for consistent speed (approx 8s per item)
  const duration = Math.max(items.length * 8, 20);

  return (
    <div 
      className="w-full h-[44px] bg-white dark:bg-gray-900 border-b border-gray-100 shadow-sm sticky top-0 z-[60] overflow-hidden flex items-center md:hidden"
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left Badge (Fixed) */}
      <div className="bg-red-600 px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-10 h-full shadow-[5px_0_15px_-3px_rgba(255,255,255,1)]">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
        <span className="text-white text-[11px] font-bold uppercase tracking-wider">Breaking</span>
      </div>
      
      {/* Fade mask for smooth entry behind the badge */}
      <div className="absolute left-[85px] top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>

      {/* Scrolling Content */}
      <div className="flex-1 overflow-hidden relative h-full">
        <div 
          className="flex whitespace-nowrap h-full items-center pl-4 pr-0 will-change-transform"
          style={{
            animation: `seamlessMarquee ${duration}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-3 shrink-0 pr-6">
              <span className="bg-gray-100 text-[#cc0000] px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
                {item.category || 'NEWS'}
              </span>
              {item.article_slug ? (
                <Link to={`/article/${item.article_slug}`} className="text-[14px] md:text-[15px] font-semibold text-gray-800 hover:text-red-600 transition-colors">
                  {item.title}
                </Link>
              ) : (
                <span className="text-[14px] md:text-[15px] font-semibold text-gray-800">
                  {item.title}
                </span>
              )}
              <span className="text-red-600/50 text-[12px] ml-3 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTicker;
