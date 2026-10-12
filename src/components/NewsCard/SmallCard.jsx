import { Link } from 'react-router-dom';

const SmallCard = ({ article }) => {
  if (!article) return null;

  return (
    <div className="flex bg-white rounded overflow-hidden shadow-sm group h-24">
      <div className="w-1/3 flex-shrink-0 relative overflow-hidden">
        <Link to={`/article/${article.slug}`}>
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="w-2/3 p-3 flex flex-col justify-center">
        <h3 className="font-bold text-sm leading-snug group-hover:text-brand-red transition-colors line-clamp-2 mb-1">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h3>
        <span className="text-brand-red text-[10px] font-bold uppercase">{article.category}</span>
      </div>
    </div>
  );
};

export default SmallCard;
