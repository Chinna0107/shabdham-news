import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchNews, fetchCategories } from '../services/api';
import { FaShareAlt, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CategoryGridCard = ({ article }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group flex flex-row md:flex-col h-[100px] sm:h-[120px] md:h-auto">
      <Link to={`/article/${article.slug}`} className="relative w-1/3 md:w-auto md:h-[220px] overflow-hidden block md:m-2 md:rounded-t-xl shrink-0">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-3 md:p-4 flex flex-col flex-grow overflow-hidden justify-center md:justify-start">
        <h3 className="font-bold text-[14px] md:text-[16px] leading-snug group-hover:text-[#cc0000] transition-colors line-clamp-1 md:line-clamp-2 mb-1 md:mb-6 md:mt-1">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h3>
        
        {/* Excerpt/Description (visible on mobile as one line) */}
        <p className="text-gray-500 text-[12px] line-clamp-1 md:hidden">
          {article.excerpt || article.title}
        </p>
        
        <div className="mt-auto hidden md:block">
          <div className="w-full h-[1px] bg-gray-200 mb-3"></div>
          <div className="flex justify-end items-center text-gray-500 text-sm font-semibold">
            <button className="flex items-center hover:text-[#cc0000] transition-colors">
              <FaShareAlt className="mr-1.5" size={12} />
              షేర్
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Category = () => {
  const { categoryName, subCategory } = useParams();
  const location = useLocation();
  const [news, setNews] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  let displayCategory = '';
  if (subCategory) {
    displayCategory = decodeURIComponent(subCategory);
  } else if (categoryName) {
    const map = {
      telangana: 'తెలంగాణ',
      andhra: 'ఆంధ్రప్రదేశ్',
      national: 'జాతీయం',
      politics: 'రాజకీయాలు',
      crime: 'క్రైమ్',
      cinema: 'సినిమా',
      sports: 'క్రీడలు',
      health: 'ఆరోగ్యం',
      latest: 'తాజా వార్తలు',
      stories: 'స్టోరీలు',
      state: 'రాష్ట్రీయం',
      international: 'అంతర్జాతీయం'
    };
    displayCategory = map[categoryName.toLowerCase()] || categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  }

  useEffect(() => {
    const getCategoryNews = async () => {
      setLoading(true);
      try {
        const categorySlug = subCategory || categoryName;
        const [newsData, catsData] = await Promise.all([
          fetchNews(categorySlug),
          fetchCategories().catch(() => [])
        ]);
        setNews(newsData);
        
        const parentCat = catsData.find(c => c.slug === categoryName || c.name === categoryName);
        if (parentCat) {
          const subs = catsData.filter(c => c.parent_id === parentCat.id);
          setSubcategories(subs);
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.error("Error fetching category news:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategoryNews();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>{displayCategory} News - Shabdham TV</title>
      </Helmet>

      <div className="bg-white min-h-screen pb-12 relative">
        <div className="w-full px-4 lg:px-8 xl:px-12 pt-8">
          
          {/* Category Header */}
          <div className="mb-6 border-b-2 border-[#cc0000]">
            <h1 className="text-3xl font-bold text-[#cc0000] inline-block mb-2">{displayCategory}</h1>
          </div>

          {/* Subcategories Navigation */}
          {subcategories.length > 0 && (
            <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar">
              <div className="flex gap-3">
                <Link 
                  to={`/category/${categoryName}`}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold border transition-colors ${!subCategory ? 'bg-[#cc0000] text-white border-[#cc0000]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                >
                  అన్ని
                </Link>
                {subcategories.map(sub => (
                  <Link 
                    key={sub.id}
                    to={`/category/${categoryName}/${sub.slug}`}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold border transition-colors ${subCategory === sub.slug ? 'bg-[#cc0000] text-white border-[#cc0000]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20 text-gray-500">Loading...</div>
          ) : news.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-20 gap-3 text-gray-400">
              <p className="text-lg font-semibold">ఈ విభాగంలో వార్తలు అందుబాటులో లేవు.</p>
              <p className="text-sm">త్వరలో వార్తలు అందుబాటులోకి వస్తాయి.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article) => (
                <CategoryGridCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Back to Top Button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#cc0000] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-800 transition-colors z-50"
        >
          <FaArrowUp />
        </button>
      </div>
    </>
  );
};

export default Category;
