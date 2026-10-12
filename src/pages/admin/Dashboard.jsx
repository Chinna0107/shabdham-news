import React, { useState, useEffect } from 'react';
import { FaRegNewspaper, FaBolt, FaThLarge, FaFire, FaUserTie, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { adminFetchStats } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetchStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { title: 'Total Articles', value: stats.total, icon: FaRegNewspaper, color: 'bg-blue-500' },
    { title: 'Published', value: stats.published, icon: FaChartLine, color: 'bg-green-500' },
    { title: 'Drafts', value: stats.drafts, icon: FaThLarge, color: 'bg-orange-500' },
    { title: 'Active Breaking', value: stats.activeBreaking, icon: FaBolt, color: 'bg-red-500' },
    { title: 'Categories', value: stats.categories, icon: FaThLarge, color: 'bg-purple-500' },
    { title: 'Trending', value: stats.total > 0 ? '—' : 0, icon: FaFire, color: 'bg-yellow-500' },
  ] : [];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Super Admin.</p>
        </div>
        <Link
          to="/admin/news"
          className="bg-[#c8102e] text-white px-5 py-2 rounded-lg shadow-lg shadow-red-900/20 font-bold hover:bg-[#a00d25] transition-colors whitespace-nowrap self-start md:self-auto"
        >
          + New Article
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-20">Loading...</div>
      ) : !stats ? (
        <div className="text-red-500 text-center py-20 font-bold">Failed to load dashboard data. Please try logging out and logging back in.</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {statCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                  <div className={`w-10 h-10 rounded-xl ${s.color} text-white flex items-center justify-center text-lg shrink-0`}>
                    <Icon />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{s.value}</span>
                  <span className="text-xs font-semibold text-gray-400">{s.title}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Articles */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center">
                <FaChartLine className="mr-2 text-[#c8102e]" /> Recent Articles
              </h2>
              {stats.recentNews.length === 0 ? (
                <p className="text-gray-400 text-sm">No articles yet. <Link to="/admin/news" className="text-[#c8102e] font-bold">Add one →</Link></p>
              ) : (
                <div className="flex flex-col gap-4">
                  {stats.recentNews.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <img
                        src={item.image || 'https://placehold.co/56x56?text=No+Img'}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[#1e293b] truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{item.category || '—'}</span>
                          <span className="text-[11px] text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Link to={`/admin/news`} className="text-xs font-bold text-[#c8102e] hover:underline shrink-0">Edit</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Authors */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center">
                <FaUserTie className="mr-2 text-[#c8102e]" /> Top Authors
              </h2>
              {stats.topAuthors.length === 0 ? (
                <p className="text-gray-400 text-sm">No authors yet.</p>
              ) : (
                <div className="flex flex-col gap-5">
                  {stats.topAuthors.map((a, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-[#c8102e] text-white flex items-center justify-center font-bold text-sm mr-3 shrink-0">
                          {a.author?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <span className="font-bold text-sm text-[#1e293b]">{a.author}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-sm text-[#1e293b]">{a.posts}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Posts</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
