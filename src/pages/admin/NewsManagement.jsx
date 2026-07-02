import React, { useState, useEffect } from 'react';
import { adminFetchNews, adminCreateNews, adminUpdateNews, adminDeleteNews, fetchCategories } from '../../services/api';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import Modal from '../../components/Admin/Modal';
import CloudinaryUpload from '../../components/Admin/CloudinaryUpload';

const emptyForm = { title: '', slug: '', content: '', excerpt: '', image: '', author: '', category: '', sub_category: '', is_published: true, is_trending: false, created_at: '' };

const toSlug = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 80);

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // Derived: parent categories (no parent_id) and children grouped by parent
  const parentCategories = categories.filter(c => !c.parent_id);
  const getSubCategories = (parentId) => categories.filter(c => c.parent_id === parentId);

  const loadNews = async () => {
    try {
      const data = await adminFetchNews();
      setNews(data);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    fetchCategories()
      .then(setCategories)
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

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
      // Determine if the item's category is a sub-category or parent
      const itemCatName = item.category || '';
      const matchedCat = categories.find(c => c.name === itemCatName);
      let mainCat = '';
      let subCat = '';
      if (matchedCat) {
        if (matchedCat.parent_id) {
          // It's a sub-category — find the parent
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
        sub_category: subCat,
        is_published: item.is_published ?? true,
        is_trending: item.is_trending ?? false,
        created_at: item.created_at ? new Date(item.created_at).toISOString().slice(0, 16) : '',
      });
    } else {
      setEditingItem(null);
      setFormData({ ...emptyForm, category: parentCategories[0]?.name || '' });
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
      // Use sub_category if selected, otherwise use main category
      const effectiveCategory = formData.sub_category || formData.category;
      const payload = { ...formData, category: effectiveCategory };
      delete payload.sub_category;

      if (editingItem) {
        const updated = await adminUpdateNews(editingItem.id, payload);
        setNews(news.map(item => item.id === editingItem.id ? { ...item, ...updated, category: effectiveCategory } : item));
      } else {
        const created = await adminCreateNews(payload);
        setNews([{ ...created, category: effectiveCategory }, ...news]);
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
    (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.author || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">News Management</h1>
          <p className="text-gray-500">Review and manage all news articles.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="bg-[#c8102e] text-white px-5 py-2 rounded-lg shadow-lg shadow-red-900/20 font-bold hover:bg-[#a00d25] transition-colors whitespace-nowrap self-start md:self-auto"
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
                <th className="py-4 px-6 font-bold text-sm text-[#1e293b]">Author</th>
                <th className="py-4 px-6 font-bold text-sm text-[#1e293b]">Status</th>
                <th className="py-4 px-6 font-bold text-sm text-[#1e293b] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">No articles found.</td></tr>
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
                      <span className="font-bold text-sm text-[#1e293b]">{item.author || 'Admin'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded ${item.is_published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
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

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-mono"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value, sub_category: '' })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              required
            >
              <option value="">-- Select Category --</option>
              {parentCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {/* Sub-Category dropdown — only shows when the selected main category has children */}
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
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
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
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
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 resize-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Publish Date & Time (Optional)</label>
            <input
              type="datetime-local"
              value={formData.created_at}
              onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty to use current time.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Published</label>
              <div
                onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.is_published ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${formData.is_published ? 'left-[22px]' : 'left-0.5'}`} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider text-orange-500">Trending</label>
              <div
                onClick={() => setFormData({ ...formData, is_trending: !formData.is_trending })}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.is_trending ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${formData.is_trending ? 'left-[22px]' : 'left-0.5'}`} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#c8102e] text-white py-3 rounded-xl font-bold mt-2 hover:bg-[#a00d25] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Article'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default NewsManagement;
