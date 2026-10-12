import React, { useState, useEffect } from 'react';
import { FaFire, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { adminFetchNews, adminUpdateNews } from '../../services/api';

const TrendingNews = () => {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    adminFetchNews()
      .then(setAllNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleTrending = async (item) => {
    setSaving(item.id);
    try {
      await adminUpdateNews(item.id, {
        title: item.title,
        slug: item.slug,
        content: item.content,
        excerpt: item.excerpt,
        image: item.image,
        author: item.author,
        category: item.category,
        is_published: item.is_published,
        is_trending: !item.is_trending,
      });
      setAllNews(prev => prev.map(n => n.id === item.id ? { ...n, is_trending: !n.is_trending } : n));
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setSaving(null);
    }
  };

  const trending = allNews.filter(n => n.is_trending);
  const filtered = allNews.filter(n =>
    !n.is_trending &&
    (n.title?.toLowerCase().includes(search.toLowerCase()) ||
     n.category?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">Trending News</h1>
          <p className="text-gray-500">Mark articles as trending to show them at <span className="font-bold text-[#c8102e]">/trending</span></p>
        </div>
      </div>

      {/* Currently Trending */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-[#1e293b] mb-4 flex items-center gap-2">
          <FaFire className="text-orange-500" /> Currently Trending ({trending.length})
        </h2>
        {trending.length === 0 ? (
          <p className="text-gray-400 text-sm">No trending articles yet. Mark some below.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {trending.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-orange-50 border border-orange-100">
                <img src={item.image || 'https://placehold.co/48x48?text=No'} alt={item.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#1e293b] truncate">{item.title}</p>
                  <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded">{item.category || '—'}</span>
                </div>
                <button
                  onClick={() => toggleTrending(item)}
                  disabled={saving === item.id}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50"
                  title="Remove from trending"
                >
                  <FaTrashAlt size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Articles — add to trending */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <h2 className="text-lg font-bold text-[#1e293b] flex-1">All Articles</h2>
          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-6 font-bold text-sm text-[#1e293b]">Article</th>
                <th className="py-3 px-6 font-bold text-sm text-[#1e293b]">Category</th>
                <th className="py-3 px-6 font-bold text-sm text-[#1e293b] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="3" className="py-8 text-center text-gray-400">No articles found.</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors group">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <img src={item.image || 'https://placehold.co/40x40?text=No'} alt={item.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <span className="font-bold text-sm text-[#1e293b] truncate max-w-[300px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">{item.category || '—'}</span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => toggleTrending(item)}
                        disabled={saving === item.id}
                        className="flex items-center gap-1.5 ml-auto bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors disabled:opacity-50"
                      >
                        <FaFire size={12} /> {saving === item.id ? '...' : 'Mark Trending'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrendingNews;
