import { Link } from 'react-router-dom';

const MediumCard = ({ article }) => {
  if (!article) return null;

  return (
    <div className="bg-white rounded overflow-hidden shadow-sm group">
      <Link to={`/article/${article.slug}`} className="block relative overflow-hidden h-48">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
          {article.category}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
        <div className="text-gray-400 text-xs flex items-center justify-between">
          <span>{article.author}</span>
          <span>{new Date(article.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MediumCard;
