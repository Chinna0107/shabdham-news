import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchNews } from '../services/api';
import { Link } from 'react-router-dom';
import CategoryBlock from '../components/NewsCard/CategoryBlock';
import { FaWhatsapp } from 'react-icons/fa';

const CATEGORY_BLOCKS = [
  { title: 'తాజా వార్తలు', slug: null, titleColor: 'text-brand-red', borderColor: 'border-brand-red' },
  { title: 'తెలంగాణ', slug: 'telangana', titleColor: 'text-[#1a237e]', borderColor: 'border-[#1a237e]' },
  { title: 'జాతీయం', slug: 'national', titleColor: 'text-yellow-500', borderColor: 'border-yellow-500' },
  { title: 'అంతర్జాతీయం', slug: 'international', titleColor: 'text-[#1a237e]', borderColor: 'border-[#1a237e]' },
  { title: 'ఆంధ్రప్రదేశ్', slug: 'andhra', titleColor: 'text-blue-800', borderColor: 'border-blue-800' },
  { title: 'రాజకీయం', slug: 'politics', titleColor: 'text-brand-red', borderColor: 'border-brand-red' },
  { title: 'వినోదం', slug: 'entertainment', titleColor: 'text-blue-500', borderColor: 'border-blue-500' },
  { title: 'క్రీడలు', slug: 'sports', titleColor: 'text-green-600', borderColor: 'border-green-600' },
  { title: 'క్రైమ్', slug: 'crime', titleColor: 'text-brand-red', borderColor: 'border-brand-red' },
];

const Home = () => {
  const [allNews, setAllNews] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch latest news (no category filter) for hero + highlights
        const latestNews = await fetchNews();
        setAllNews(latestNews);

        // Fetch per-category news in parallel
        const categoryFetches = CATEGORY_BLOCKS
          .filter(block => block.slug) // skip the "latest" block
          .map(block =>
            fetchNews(block.slug)
              .then(data => ({ slug: block.slug, data }))
              .catch(() => ({ slug: block.slug, data: [] }))
          );

        const results = await Promise.all(categoryFetches);
        const catMap = {};
        results.forEach(({ slug, data }) => {
          catMap[slug] = data.slice(0, 5);
        });
        setCategoryData(catMap);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-500">లోడ్ అవుతోంది...</div>;
  }

  if (!allNews.length) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3 text-gray-400">
        <p className="text-lg font-semibold">వార్తలు అందుబాటులో లేవు.</p>
        <p className="text-sm">Admin panel నుండి వార్తలు జోడించండి.</p>
      </div>
    );
  }

  const heroNews = allNews[0];
  const subHeroNews = allNews.slice(1, 3);
  const latestBlock = allNews.slice(0, 5);

  // Helper to get category articles, falling back to latest if category has no data
  const getCategoryArticles = (slug) => {
    if (!slug) return latestBlock;
    const data = categoryData[slug];
    return data && data.length > 0 ? data : [];
  };

  return (
    <>
      <Helmet>
        <title>Shabdham TV - Telugu News Portal</title>
      </Helmet>

      <div className="w-full px-4 lg:px-8 xl:px-12 pt-6 bg-brand-gray min-h-screen">

        {/* HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-8 relative group overflow-hidden rounded-2xl cursor-pointer premium-shadow min-h-[300px] sm:min-h-[400px] lg:h-[450px]">
            <Link to={`/article/${heroNews.slug}`} className="block w-full h-full">
              <img
                src={heroNews.image || 'https://placehold.co/800x450?text=No+Image'}
                alt={heroNews.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-sm shadow">
                  {heroNews.category || 'వార్తలు'}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full z-10">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2 group-hover:text-gray-200 transition-colors">
                  {heroNews.title}
                </h1>
                <div className="text-gray-300 text-sm mt-3 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-brand-red mr-2" />
                  {heroNews.author || 'అడ్మిన్'}
                </div>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            {subHeroNews.length > 0 ? subHeroNews.map((article, idx) => (
              <div key={idx} className="group cursor-pointer bg-white rounded-2xl premium-shadow overflow-hidden flex flex-col flex-1 min-h-[200px] hover:-translate-y-1 transition-transform duration-300">
                <Link to={`/article/${article.slug}`} className="h-full flex flex-col">
                  <div className="relative h-[130px] overflow-hidden shrink-0">
                    <img
                      src={article.image || 'https://placehold.co/400x130?text=No+Image'}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex-grow flex items-center">
                    <h2 className="text-gray-800 text-[15px] font-bold leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                  </div>
                </Link>
              </div>
            )) : (
              <div className="bg-white rounded-2xl p-6 text-gray-400 text-sm flex items-center justify-center flex-1">మరిన్ని వార్తలు లేవు</div>
            )}
          </div>
        </div>

        {/* 3 COLUMNS: Latest + Telangana + Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-4">
            <CategoryBlock title="తాజా వార్తలు" titleColor="text-brand-red" borderColor="border-brand-red" articles={latestBlock} />
          </div>
          <div className="lg:col-span-4">
            {getCategoryArticles('telangana').length > 0 ? (
              <CategoryBlock title="తెలంగాణ" titleColor="text-[#1a237e]" borderColor="border-[#1a237e]" articles={getCategoryArticles('telangana')} />
            ) : (
              <CategoryBlock title="తెలంగాణ" titleColor="text-[#1a237e]" borderColor="border-[#1a237e]" articles={latestBlock} />
            )}
          </div>
          <div className="lg:col-span-4 md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm h-full flex flex-col">
              <h3 className="text-lg font-bold text-brand-red border-b border-gray-200 pb-2 mb-4 flex items-center shrink-0">
                <span className="w-1 h-5 bg-brand-red mr-2 inline-block" />
                హైలైట్స్
              </h3>
              <div className="space-y-4 flex-grow">
                {allNews.slice(0, 5).map((item, num) => (
                  <Link key={num} to={`/article/${item.slug}`} className="flex items-start group">
                    <span className="text-4xl font-bold text-gray-200 mr-4 leading-none shrink-0">{num + 1}</span>
                    <p className="text-[15px] font-semibold text-gray-800 line-clamp-2 group-hover:text-brand-red cursor-pointer mt-1">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-8 bg-[#1e293b] rounded-2xl p-6 text-center text-white flex flex-col items-center shadow-lg shrink-0">
                <p className="text-[14px] font-bold mb-2 tracking-wide">SHABDHAM TV</p>
                <p className="text-[12px] text-gray-300 mb-5 leading-relaxed px-2">
                  తాజా వార్తలు, ఎప్పటికప్పుడు బ్రేకింగ్ న్యూస్ కోసం మా వాట్సాప్ గ్రూప్ లో జాయిన్ అవ్వండి.
                </p>
                <button className="bg-white text-[#1e293b] text-sm font-bold py-2.5 px-6 rounded-full w-full flex justify-center items-center hover:bg-gray-100 transition-colors shadow-sm">
                  <FaWhatsapp className="text-[#25D366] mr-2" size={20} /> వాట్సాప్ గ్రూప్లో చేరండి
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MORE ROWS — per-category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {getCategoryArticles('national').length > 0 && (
            <CategoryBlock title="జాతీయం" titleColor="text-yellow-500" borderColor="border-yellow-500" articles={getCategoryArticles('national')} />
          )}
          {getCategoryArticles('international').length > 0 && (
            <CategoryBlock title="అంతర్జాతీయం" titleColor="text-[#1a237e]" borderColor="border-[#1a237e]" articles={getCategoryArticles('international')} />
          )}
          {getCategoryArticles('andhra').length > 0 && (
            <CategoryBlock title="ఆంధ్రప్రదేశ్" titleColor="text-blue-800" borderColor="border-blue-800" articles={getCategoryArticles('andhra')} />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {getCategoryArticles('politics').length > 0 && (
            <CategoryBlock title="రాజకీయం" titleColor="text-brand-red" borderColor="border-brand-red" articles={getCategoryArticles('politics')} />
          )}
          {getCategoryArticles('entertainment').length > 0 && (
            <CategoryBlock title="వినోదం" titleColor="text-blue-500" borderColor="border-blue-500" articles={getCategoryArticles('entertainment')} />
          )}
          {getCategoryArticles('sports').length > 0 && (
            <CategoryBlock title="క్రీడలు" titleColor="text-green-600" borderColor="border-green-600" articles={getCategoryArticles('sports')} />
          )}
        </div>

        {getCategoryArticles('crime').length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-10 border-t border-brand-red pt-8">
            <CategoryBlock title="క్రైమ్" titleColor="text-brand-red" borderColor="border-brand-red" articles={getCategoryArticles('crime')} />
          </div>
        )}

      </div>
    </>
  );
};

export default Home;
