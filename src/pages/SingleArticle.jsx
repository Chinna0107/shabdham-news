import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchArticle, fetchAds } from '../services/api';
import Sidebar from '../components/Sidebar/Sidebar';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLink, FaFont, FaPlus, FaMinus } from 'react-icons/fa';

const SingleArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [textSize, setTextSize] = useState(18);
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(false);
      try {
        const [articleData, adsData] = await Promise.all([
          fetchArticle(slug),
          fetchAds().catch(() => [])
        ]);
        setArticle(articleData);
        
        const articleAd = adsData.find(a => a.position === 'article');
        if (articleAd) setAd(articleAd);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error || !article) return <div className="flex justify-center items-center h-screen">Article not found.</div>;

  const categoryName = article.category || 'వార్తలు';
  const categorySlug = article.category_slug || categoryName.toLowerCase();

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = article.title;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank');
    
    if (platform === 'whatsapp') {
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
          
          const shareData = { title: text, text: text, url: url };
          if (filesArray.length > 0 && navigator.canShare && navigator.canShare({ files: filesArray })) {
            shareData.files = filesArray;
          }
          
          await navigator.share(shareData);
        } catch (_) {}
        return;
      }
      window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank');
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getISTTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setHours(d.getHours() + 5);
    d.setMinutes(d.getMinutes() + 30);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <>
      <Helmet>
        <title>{article.title} - Shabdham TV</title>
        <meta name="description" content={article.excerpt || ''} />
      </Helmet>

      <div className="w-full px-4 lg:px-8 xl:px-12 pt-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-brand-red">Home</Link>
          <span>/</span>
          <Link to={`/category/${categorySlug}`} className="hover:text-brand-red">{categoryName}</Link>
          <span>/</span>
          <span className="text-gray-800 line-clamp-1">{article.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded shadow-sm">
            <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 uppercase rounded mb-4 inline-block">
              {categoryName}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">{article.title}</h1>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-gray-100 py-4 mb-6 gap-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="font-semibold text-brand-dark">By {article.author || 'అడ్మిన్'}</span>
                  <span>{getISTTime(article.created_at)}</span>
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {Math.ceil((article.content?.length || 1000) / 1000)} Min Read
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* A11y Text Size */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                  <FaFont className="text-gray-400" size={12} />
                  <button onClick={() => setTextSize(s => Math.max(14, s - 2))} className="text-gray-600 hover:text-black p-1" aria-label="Decrease text size"><FaMinus size={10} /></button>
                  <span className="text-xs font-bold w-4 text-center">{textSize}</span>
                  <button onClick={() => setTextSize(s => Math.min(26, s + 2))} className="text-gray-600 hover:text-black p-1" aria-label="Increase text size"><FaPlus size={10} /></button>
                </div>

                {/* Social Share */}
              <div className="flex space-x-3">
                <button onClick={() => handleShare('facebook')} className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-80">
                  <FaFacebookF size={14} />
                </button>
                <button onClick={() => handleShare('twitter')} className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-80">
                  <FaTwitter size={14} />
                </button>
                <button onClick={() => handleShare('whatsapp')} className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-80">
                  <FaWhatsapp size={14} />
                </button>
                <button onClick={() => handleShare('copy')} className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center hover:opacity-80">
                  <FaLink size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
              <img src={article.image} alt={article.title} className="w-full rounded object-cover max-h-[500px]" />
            </div>

            <div 
              className="prose max-w-none text-gray-700 leading-relaxed mb-8 transition-all"
              style={{ fontSize: `${textSize}px` }}
            >
              {(() => {
                const paragraphs = article.content ? article.content.split('\n').filter(p => p.trim()) : [];
                return paragraphs.map((paragraph, idx) => {
                  const showAdIndex = Math.min(1, paragraphs.length - 1);
                  return (
                    <div key={idx}>
                      <p>{paragraph}</p>
                      
                      {/* Insert Ad after the 2nd paragraph (or last if shorter) */}
                      {idx === showAdIndex && ad && (
                        <div className="my-8 flex justify-center w-full">
                          <div className="w-[300px] h-[250px] relative bg-gray-100 flex items-center justify-center border border-gray-200">
                            <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                              <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                            </a>
                            <span className="absolute top-0 right-0 bg-black/40 text-white text-[9px] px-1 uppercase">Ad</span>
                          </div>
                        </div>
                      )}
                      {/* Fallback placeholder if no ad is found in DB */}
                      {idx === showAdIndex && !ad && (
                        <div className="my-8 flex justify-center w-full">
                          <div className="bg-gray-100 w-[300px] h-[250px] flex items-center justify-center text-gray-400 border border-gray-200 text-sm">
                            Advertisement (300x250)
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
            
            {/* Author Bio Box */}
            {article.author && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-6 mb-8 flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{article.author}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Senior Correspondent at Shabdham TV. Covering local and regional news, politics, and social issues with a focus on ground-level realities.
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex items-center space-x-2 mt-8 pt-6 border-t border-gray-100">
              <span className="font-bold text-sm">Tags:</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded cursor-pointer hover:bg-gray-200">{categoryName}</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded cursor-pointer hover:bg-gray-200">Telugu News</span>
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleArticle;

