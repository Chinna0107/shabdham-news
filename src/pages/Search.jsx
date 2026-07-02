import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchNews } from '../services/api';
import HorizontalCard from '../components/NewsCard/HorizontalCard';
import Sidebar from '../components/Sidebar/Sidebar';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [news, setNews] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  // Fetch all news once
  useEffect(() => {
    const getAllNews = async () => {
      try {
        const data = await fetchNews();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news for search:", error);
      }
    };
    getAllNews();
  }, []);

  // Debounce logic
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
      if (query !== searchParams.get('q')) {
        if (query) {
          setSearchParams({ q: query }, { replace: true });
        } else {
          setSearchParams({}, { replace: true });
        }
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [query, setSearchParams, searchParams]);

  // Search logic
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      return;
    }
    setLoading(true);
    const q = debouncedQuery.toLowerCase();
    const filtered = news.filter(article => 
      (article.title || '').toLowerCase().includes(q) || 
      (article.content || '').toLowerCase().includes(q) ||
      (article.excerpt || '').toLowerCase().includes(q)
    );
    setResults(filtered);
    setLoading(false);
  }, [debouncedQuery, news]);

  return (
    <>
      <Helmet>
        <title>Search - Shabdham TV</title>
      </Helmet>

      <div className="w-full px-4 lg:px-8 xl:px-12 pt-8">
        
        {/* Search Input Area */}
        <div className="bg-white p-6 rounded shadow-sm mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Search News</h1>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for articles, news, and more..." 
              className="w-full border-2 border-gray-200 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-brand-red transition-colors text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-red">
              <FaSearch size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Results Area */}
          <div className="lg:col-span-8">
            {debouncedQuery && (
              <div className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-brand-red inline-block pb-1">
                  Search Results for "{debouncedQuery}"
                </h2>
                <span className="text-gray-500 ml-3 text-sm">({results.length} found)</span>
              </div>
            )}

            {loading ? (
              <div className="py-10 text-center text-gray-500">Searching...</div>
            ) : results.length > 0 ? (
              <div className="flex flex-col space-y-6">
                {results.map(article => (
                  <HorizontalCard key={article.id} article={article} />
                ))}
              </div>
            ) : debouncedQuery ? (
              <div className="py-10 text-center text-gray-500 bg-white rounded shadow-sm">
                No results found. Try a different keyword.
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400">
                Enter a keyword above to start searching.
              </div>
            )}
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

export default Search;
