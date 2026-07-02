import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import { fetchNews, fetchTrendingNews } from '../services/api';
import { FaHeart, FaShare, FaWhatsapp, FaArrowLeft, FaFire } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MobileBottomNav from '../components/MobileBottomNav';

const getISTTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setHours(d.getHours() + 5);
  d.setMinutes(d.getMinutes() + 30);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const Shorts = ({ type = 'news' }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});

  const isTrending = type === 'trending';
  const headerTitle = isTrending ? 'TRENDING NEWS' : 'LATEST NEWS';

  useEffect(() => {
    const fn = isTrending ? fetchTrendingNews : fetchNews;
    fn()
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type]);

  const handleShare = async (article) => {
    const url = `${window.location.origin}/article/${article.slug}`;
    const text = article.title;

    if (navigator.share) {
      try {
        let filesArray = [];
        if (article.image) {
          try {
            const response = await fetch(article.image, { mode: 'cors' });
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: blob.type });
            filesArray.push(file);
          } catch (e) {
            console.error('Failed to fetch image for sharing', e);
          }
        }
        
        const shareData = { title: text, text, url };
        if (filesArray.length > 0 && navigator.canShare && navigator.canShare({ files: filesArray })) {
          shareData.files = filesArray;
        }
        
        await navigator.share(shareData);
      } catch (_) {}
      return;
    }
    // Fallback: copy to clipboard
    navigator.clipboard?.writeText(`${text}\n${url}`);
    alert('Link copied to clipboard!');
  };

  const handleWhatsApp = async (article) => {
    const url = `${window.location.origin}/article/${article.slug}`;
    const text = article.title;

    if (navigator.share) {
      try {
        let filesArray = [];
        if (article.image) {
          try {
            const response = await fetch(article.image, { mode: 'cors' });
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: blob.type });
            filesArray.push(file);
          } catch (e) {
            console.error('Failed to fetch image for sharing', e);
          }
        }
        
        const shareData = { title: text, text, url };
        if (filesArray.length > 0 && navigator.canShare && navigator.canShare({ files: filesArray })) {
          shareData.files = filesArray;
        }
        
        await navigator.share(shareData);
      } catch (_) {}
      return;
    }
    
    const encodedText = encodeURIComponent(`${text}\n${url}`);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black text-white gap-4">
        <FaFire size={40} className="text-orange-400" />
        <p className="text-lg font-bold">
          {isTrending ? 'No trending news yet.' : 'No news available yet.'}
        </p>
        <Link to="/" className="text-sm text-gray-400 underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="bg-black h-[100dvh] w-full overflow-hidden relative">
      <Helmet>
        <title>{isTrending ? 'Trending' : 'Flip'} - Shabdham TV</title>
      </Helmet>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <Link to="/" className="text-white pointer-events-auto">
          <FaArrowLeft size={20} />
        </Link>
        <span className="text-white font-bold tracking-widest text-sm pointer-events-auto uppercase flex items-center gap-2">
          {isTrending && <FaFire className="text-orange-400" />} {headerTitle}
        </span>
        <div className="w-5" />
      </div>

      <Swiper
        direction="vertical"
        className="w-full h-full"
        loop={news.length > 1}
        modules={[Mousewheel, Keyboard]}
        mousewheel={true}
        keyboard={{ enabled: true }}
      >
        {news.map((article, index) => (
          <SwiperSlide key={article.id || index}>
            <div className="w-full h-full flex flex-col bg-white">
              {/* Image */}
              <div className="h-[42%] w-full shrink-0 relative">
                <img
                  src={article.image || 'https://placehold.co/800x400?text=No+Image'}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                {isTrending && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1">
                    <FaFire size={10} /> TRENDING
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-5 pb-20 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-block bg-[#c8102e] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm shadow-sm">
                      {article.category || 'న్యూస్'}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {getISTTime(article.created_at)}
                    </span>
                  </div>
                  <Link to={`/article/${article.slug}`}>
                    <h2 className="text-gray-900 text-xl sm:text-2xl font-bold leading-snug mb-3 hover:text-[#c8102e] transition-colors">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                    {article.excerpt || article.content || ''}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-around mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setLiked(l => ({ ...l, [article.id]: !l[article.id] }))}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${liked[article.id] ? 'bg-[#c8102e] border-[#c8102e] text-white' : 'bg-gray-50 border-gray-200 text-gray-500 group-hover:bg-[#c8102e] group-hover:text-white group-hover:border-[#c8102e]'}`}>
                      <FaHeart size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">లైక్</span>
                  </button>

                  <button
                    onClick={() => handleWhatsApp(article)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20b858] transition-colors shadow-md shadow-green-200">
                      <FaWhatsapp size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-[#25D366]">వాట్సాప్</span>
                  </button>

                  <button
                    onClick={() => handleShare(article)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-colors text-gray-500">
                      <FaShare size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-500">షేర్</span>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <MobileBottomNav />
    </div>
  );
};

export default Shorts;
