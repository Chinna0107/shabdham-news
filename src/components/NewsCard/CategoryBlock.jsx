import { Link } from 'react-router-dom';

const CategoryBlock = ({ title, titleColor, borderColor, articles }) => {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const listArticles = articles.slice(1, 5); // up to 4 items

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className={`flex justify-between items-end border-b-[3px] ${borderColor} pb-1 mb-4`}>
        <h2 className={`text-2xl md:text-xl font-bold ${titleColor} flex items-center`}>
          {title}
        </h2>
        <Link to={`/category/${title.toLowerCase()}`} className={`text-xs font-semibold ${titleColor} hover:underline mb-1`}>
          మరిన్ని
        </Link>
      </div>

      {/* Main Card (Matching Screenshot Design) */}
      <div className="mb-4 group bg-white border border-white/50 rounded-2xl overflow-hidden pb-3 premium-shadow hover:-translate-y-1 transition-transform duration-300">
        <Link to={`/article/${mainArticle.slug}`} className="block relative overflow-hidden mb-3">
          <img 
            src={mainArticle.image} 
            alt={mainArticle.title} 
            className="w-full h-[220px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="px-4">
          <h3 className="font-bold text-[17px] leading-relaxed group-hover:text-brand-red transition-colors mb-3">
            <Link to={`/article/${mainArticle.slug}`}>{mainArticle.title}</Link>
          </h3>
          <div className="border-t border-gray-100 pt-2 mt-2 flex justify-end">
            <button className="flex items-center text-gray-400 hover:text-brand-red text-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              షేర్
            </button>
          </div>
        </div>
      </div>

      {/* List Cards */}
      <div className="space-y-4">
        {listArticles.map((article, idx) => (
          <div key={`${article.id}-${idx}`} className="flex group bg-white p-2 rounded-xl premium-shadow hover:-translate-y-0.5 transition-transform duration-300">
            <div className="w-1/3 flex-shrink-0 relative overflow-hidden rounded-lg">
              <Link to={`/article/${article.slug}`}>
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-16 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            </div>
            <div className="w-2/3 pl-3 flex flex-col justify-center">
              <h4 className="font-semibold text-xs leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
                <Link to={`/article/${article.slug}`}>{article.title}</Link>
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBlock;
