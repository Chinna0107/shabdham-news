import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBreakingNews } from '../../services/api';

const Ticker = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchBreakingNews()
      .then(data => setItems(data))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <div className="bg-[#cc0000] text-white overflow-hidden whitespace-nowrap py-1.5 shadow-md w-full">
      <div className="w-full px-4 lg:px-8 xl:px-12 flex items-center h-8 relative">
        <div className="bg-white text-[#cc0000] font-black px-3 py-1 text-[11px] rounded uppercase tracking-wider shrink-0 mr-4 z-10 shadow-sm relative flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#cc0000] animate-pulse"></span>
          <span>BREAKING</span>
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="animate-[ticker_30s_linear_infinite] inline-block font-semibold text-[14px]">
            {items.map((item) => (
              <span key={item.id} className="mx-4">
                {item.article_slug ? (
                  <Link to={`/article/${item.article_slug}`} className="hover:underline">
                    • {item.title}
                  </Link>
                ) : (
                  <>• {item.title}</>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticker;
