import React, { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { employeeFetchMyNews } from '../../services/api';

const EmployeeDashboard = () => {
  const [user, setUser] = useState({ name: 'Employee' });
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('employee_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    employeeFetchMyNews()
      .then(news => {
        const counts = news.reduce((acc, item) => {
          if (item.status === 'pending') acc.pending++;
          else if (item.status === 'approved') acc.approved++;
          else if (item.status === 'rejected') acc.rejected++;
          return acc;
        }, { pending: 0, approved: 0, rejected: 0 });
        setStats(counts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: 'Pending Approval', value: stats.pending, icon: FaClock, color: 'bg-orange-500' },
    { title: 'Approved', value: stats.approved, icon: FaCheckCircle, color: 'bg-green-500' },
    { title: 'Rejected', value: stats.rejected, icon: FaTimesCircle, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1e293b] mb-1">Welcome, {user.name}</h1>
      <p className="text-gray-500 mb-8">Here is a quick overview of your news submissions.</p>

      {loading ? (
        <div className="text-gray-400 text-center py-20">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.color} text-white flex items-center justify-center text-xl shrink-0`}>
                  <Icon />
                </div>
                <div>
                  <span className="block text-3xl font-bold text-gray-800 leading-tight">{s.value}</span>
                  <span className="text-sm font-semibold text-gray-400">{s.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
