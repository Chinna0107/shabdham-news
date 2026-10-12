import { Link } from 'react-router-dom';

const LargeCard = ({ article }) => {
  if (!article) return null;

  return (
    <div className="relative group overflow-hidden rounded shadow-sm bg-white cursor-pointer h-[400px]">
      <Link to={`/article/${article.slug}`}>
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <span className="inline-block bg-brand-red text-white text-xs font-bold px-2 py-1 mb-3 rounded">
            {article.category}
          </span>
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2 group-hover:text-brand-red transition-colors line-clamp-2">
            {article.title}
          </h2>
          <div className="text-gray-300 text-sm flex items-center space-x-4">
            <span>{article.author}</span>
            <span>{new Date(article.date).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default LargeCard;
