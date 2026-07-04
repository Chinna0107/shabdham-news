import React, { useState, useEffect } from 'react';
import { employeeFetchMyNews, adminCreateNews, adminUpdateNews, adminDeleteNews, fetchCategories } from '../../services/api';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import Modal from '../../components/Admin/Modal';
import CloudinaryUpload from '../../components/Admin/CloudinaryUpload';

const emptyForm = { title: '', slug: '', content: '', excerpt: '', image: '', author: '', category: '', sub_category: '' };

const toSlug = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 80);

const EmployeeNewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const loadData = async () => {
    try {
      const [newsData, catsData] = await Promise.all([
        employeeFetchMyNews(),
        fetchCategories()
      ]);
      setNews(newsData);
      setCategories(catsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const allowedCategoryIds = user?.allowed_categories || [];
  const parentCategories = categories.filter(c => !c.parent_id && allowedCategoryIds.includes(c.id));
  const getSubCategories = (parentId) => categories.filter(c => c.parent_id === parentId);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await adminDeleteNews(id);
      setNews(news.filter(item => item.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const openModal = (item = null) => {
    setError('');
    if (item) {
      setEditingItem(item);
      const itemCatName = item.category || '';
      const matchedCat = categories.find(c => c.name === itemCatName);
      let mainCat = '';
      let subCat = '';
      if (matchedCat) {
        if (matchedCat.parent_id) {
          const parent = categories.find(c => c.id === matchedCat.parent_id);
          mainCat = parent ? parent.name : itemCatName;
          subCat = itemCatName;
        } else {
          mainCat = itemCatName;
          subCat = '';
        }
      } else {
        mainCat = itemCatName;
      }
      setFormData({
        title: item.title || '',
        slug: item.slug || '',
        content: item.content || '',
        excerpt: item.excerpt || '',
        image: item.image || '',
        author: item.author || '',
        category: mainCat,
        sub_category: subCat
      });
    } else {
      setEditingItem(null);
      setFormData({ ...emptyForm, category: parentCategories[0]?.name || '', author: user?.name || '' });
    }
    setIsModalOpen(true);
  };

  const handleTitleChange = (val) => {
    setFormData(f => ({ ...f, title: val, slug: editingItem ? f.slug : toSlug(val) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const effectiveCategory = formData.sub_category || formData.category;
      const payload = { 
        ...formData, 
        category: effectiveCategory,
        is_published: true, // Will be overridden to pending on backend anyway
        is_trending: false
      };
      delete payload.sub_category;

      if (editingItem) {
        const updated = await adminUpdateNews(editingItem.id, payload);
        setNews(news.map(item => item.id === editingItem.id ? { ...item, ...updated, category: effectiveCategory } : item));
      } else {
        const created = await adminCreateNews(payload);
        setNews([{ ...created, category: effectiveCategory, status: 'pending' }, ...news]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed. Check all fields.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = news.filter(item =>
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">My News Submissions</h1>
          <p className="text-gray-500">Create new articles and track their approval status.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search my articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-lg shadow-blue-900/20 font-bold hover:bg-blue-700 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            + New Article
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 font-bold text-sm text-[#1e293b]">Article</th>
                <th className="py-4 px-6 font-bold text-sm text-[#1e293b]">Category</th>
                <th className="py-4 px-6 font-bold text-sm text-[#1e293b]">Status</th>
                <th className="py-4 px-6 font-bold text-sm text-[#1e293b] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="py-8 text-center text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-gray-500">No articles submitted yet.</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img
                          src={item.image || 'https://placehold.co/56x56?text=No+Img'}
                          alt={item.title}
                          className="w-14 h-14 rounded-lg object-cover mr-4 shadow-sm"
                        />
                        <div className="flex flex-col max-w-[400px]">
                          <span className="font-bold text-[15px] text-[#1e293b] leading-tight mb-1 truncate">{item.title}</span>
                          <span className="text-[11px] text-gray-400 font-semibold">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        {item.category || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded 
                          ${item.status === 'approved' ? 'bg-green-50 text-green-600' : 
                            item.status === 'rejected' ? 'bg-red-50 text-red-600' : 
                            'bg-orange-50 text-orange-600'}`}>
                          {item.status || 'pending'}
                        </span>
                        {item.status === 'rejected' && item.rejection_reason && (
                          <span className="text-[10px] text-red-500 max-w-[200px] break-words" title={item.rejection_reason}>
                            <span className="font-bold">Reason:</span> {item.rejection_reason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(item)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Article' : 'New Article'}>
        <form onSubmit={handleSave} className="flex flex-col space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold">{error}</div>}

          {parentCategories.length === 0 && (
            <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-sm font-bold mb-4">
              You haven't been assigned any categories. Please contact your admin.
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value, sub_category: '' })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
              required
            >
              <option value="">-- Select Category --</option>
              {parentCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {(() => {
            const selectedParent = parentCategories.find(c => c.name === formData.category);
            const subs = selectedParent ? getSubCategories(selectedParent.id) : [];
            if (subs.length === 0) return null;
            return (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Sub Category</label>
                <select
                  value={formData.sub_category}
                  onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                >
                  <option value="">-- All {formData.category} (no sub-category) --</option>
                  {subs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            );
          })()}

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
            />
          </div>

          <CloudinaryUpload
            label="Article Image"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || parentCategories.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Submitting...' : editingItem ? 'Save Edits' : 'Submit for Review'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeNewsManagement;
