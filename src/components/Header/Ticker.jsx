import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBreakingNews } from '../../services/api';

const Ticker = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadNews = () => {
      fetchBreakingNews()
        .then(data => {
          if (Array.isArray(data)) {
            setItems(data);
          }
        })
        .catch(() => {});
    };

    loadNews();
    const interval = setInterval(loadNews, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!items.length) return null;

  // Ensure enough items so continuous scrolling is seamless across wide screens
  let repeated = items;
  while (repeated.length < 5) {
    repeated = [...repeated, ...items];
  }
  const displayItems = [...repeated, ...repeated];

  // Slower, comfortable reading pace: ~8 seconds per item in sequence (min 35s)
  const duration = Math.max(repeated.length * 8, 35);

  return (
    <div className="marquee-container bg-[#cc0000] text-white overflow-hidden whitespace-nowrap py-1.5 shadow-md w-full select-none">
      <div className="w-full px-4 lg:px-8 xl:px-12 flex items-center h-8 relative">
        {/* Left Badge */}
        <div className="bg-white text-[#cc0000] font-black px-3 py-1 text-[13px] rounded uppercase tracking-wider shrink-0 mr-4 z-20 shadow-sm relative flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#cc0000] animate-pulse"></span>
          <span>BREAKING</span>
        </div>

        {/* Smooth Gradient Masks */}
        <div className="absolute left-[135px] lg:left-[150px] top-0 bottom-0 w-8 bg-gradient-to-r from-[#cc0000] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#cc0000] to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Content Track */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div 
            className="marquee-track h-full items-center font-medium text-[15.5px] tracking-wide"
            style={{ '--marquee-duration': `${duration}s` }}
          >
            {displayItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="inline-flex items-center mx-5 group/item">
                <span className="inline-block w-2 h-2 rounded-full bg-white/70 mr-3 shrink-0 shadow-sm"></span>
                {item.category && (
                  <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded mr-2 uppercase tracking-wider">
                    {item.category}
                  </span>
                )}
                {item.article_slug ? (
                  <Link 
                    to={`/article/${item.article_slug}`} 
                    className="hover:text-yellow-200 hover:underline transition-colors cursor-pointer text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
                    {item.title}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticker;

