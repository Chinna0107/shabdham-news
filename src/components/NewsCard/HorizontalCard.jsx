import { Link } from 'react-router-dom';

const HorizontalCard = ({ article }) => {
  if (!article) return null;

  return (
    <div className="flex flex-col md:flex-row bg-white rounded overflow-hidden shadow-sm group">
      <div className="md:w-2/5 relative overflow-hidden h-48 md:h-auto">
        <Link to={`/article/${article.slug}`}>
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="md:w-3/5 p-4 md:p-6 flex flex-col justify-center">
        <span className="text-brand-red text-xs font-bold uppercase mb-2 block">{article.category}</span>
        <h3 className="font-bold text-xl mb-3 leading-snug group-hover:text-brand-red transition-colors">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="text-gray-400 text-xs flex items-center space-x-4">
          <span>{article.author}</span>
          <span>{new Date(article.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;
