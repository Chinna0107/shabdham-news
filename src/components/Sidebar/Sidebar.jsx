import { useState, useEffect } from 'react';
import { fetchTrendingNews, fetchAds } from '../../services/api';
import SmallCard from '../NewsCard/SmallCard';

const Sidebar = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [newsData, adsData] = await Promise.all([
          fetchTrendingNews(),
          fetchAds().catch(() => []) // fail gracefully
        ]);
        setTrendingNews(newsData.slice(0, 4));
        
        // Find sidebar ad
        const sidebarAd = adsData.find(a => a.position === 'sidebar');
        if (sidebarAd) setAd(sidebarAd);
      } catch (error) {
        console.error("Failed to load sidebar data", error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Social Follow */}
      <div className="bg-white p-4 shadow-sm rounded">
        <h3 className="font-bold text-lg mb-4 border-l-4 border-brand-red pl-2">Follow Us</h3>
        <div className="grid grid-cols-2 gap-2">
          <a href="#" className="flex items-center justify-center space-x-2 bg-[#3b5998] text-white py-2 rounded text-sm hover:opacity-90 transition-opacity">
            <span>Facebook</span>
          </a>
          <a href="#" className="flex items-center justify-center space-x-2 bg-[#1da1f2] text-white py-2 rounded text-sm hover:opacity-90 transition-opacity">
            <span>Twitter</span>
          </a>
          <a href="https://www.instagram.com/shabdham_peoples_voice/reels/" className="flex items-center justify-center space-x-2 bg-[#c32aa3] text-white py-2 rounded text-sm hover:opacity-90 transition-opacity">
            <span>Instagram</span>
          </a>
          <a href="https://www.youtube.com/@SHABDHAM-on7qu/featured" className="flex items-center justify-center space-x-2 bg-[#ff0000] text-white py-2 rounded text-sm hover:opacity-90 transition-opacity">
            <span>YouTube</span>
          </a>
        </div>
      </div>

      {/* Ad Widget */}
      {ad ? (
        <div className="w-full h-[250px] relative bg-gray-100 flex items-center justify-center border border-gray-200">
          <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
          </a>
          <span className="absolute top-0 right-0 bg-black/40 text-white text-[9px] px-1 uppercase">Ad</span>
        </div>
      ) : (
        <div className="bg-gray-200 w-full h-[250px] flex items-center justify-center text-gray-400 border border-gray-300 text-sm">
          Advertisement (300x250)
        </div>
      )}

      {/* Trending News */}
      <div className="bg-white p-4 shadow-sm rounded">
        <h3 className="font-bold text-lg mb-4 border-l-4 border-brand-red pl-2">Trending Now</h3>
        <div className="space-y-4">
          {trendingNews.map(article => (
            <SmallCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
