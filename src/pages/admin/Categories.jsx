import React, { useState, useEffect } from 'react';
import { fetchCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../services/api';

const emptyForm = { name: '', slug: '', parent_id: '', sort_order: 0, show_in_header: false };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminDeleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parent_id: cat.parent_id || '',
      sort_order: cat.sort_order || 0,
      show_in_header: cat.show_in_header || false,
    });
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) { setError('Name and Slug are required'); return; }
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...formData,
        parent_id: formData.parent_id ? Number(formData.parent_id) : null,
        sort_order: Number(formData.sort_order),
      };
      if (editingId) {
        const updated = await adminUpdateCategory(editingId, payload);
        setCategories(categories.map(c => c.id === editingId ? { ...c, ...updated, parent_name: categories.find(p => p.id === updated.parent_id)?.name || null } : c));
        setEditingId(null);
      } else {
        await load(); // reload to get parent_name joined
        const created = await adminCreateCategory(payload);
        setCategories(prev => [...prev, { ...created, parent_name: categories.find(p => p.id === created.parent_id)?.name || null }]);
      }
      setFormData(emptyForm);
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const mainCategories = categories.filter(c => !c.parent_id);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">Category Management</h1>
          <p className="text-gray-500">Create, rename and remove categories.</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-xl font-bold text-[#1e293b] mb-1">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Configure main categories or sub-categories</p>
        {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex items-end gap-6 flex-wrap">
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Category Name (Telugu)</label>
            <input
              type="text"
              placeholder="e.g. క్రీడలు"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20"
            />
          </div>

          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Slug (English)</label>
            <input
              type="text"
              placeholder="e.g. sports"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20"
            />
          </div>

          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Parent (Optional)</label>
            <select
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
              className="bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20 font-bold text-gray-700"
            >
              <option value="">Main Category (None)</option>
              {mainCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-[120px]">
            <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Sort Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
              className="bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20 font-bold"
            />
          </div>

          <div className="flex flex-col items-center justify-center h-[72px] px-4">
            <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Show in Header</label>
            <div
              onClick={() => setFormData({ ...formData, show_in_header: !formData.show_in_header })}
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.show_in_header ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${formData.show_in_header ? 'left-[22px]' : 'left-0.5'}`} />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-[#c8102e] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#a00d25] transition-colors h-[48px] disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Category'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors h-[48px]">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-8 font-bold text-xs text-gray-400 uppercase tracking-widest">Category Name</th>
                <th className="py-4 px-6 font-bold text-xs text-gray-400 uppercase tracking-widest">Slug</th>
                <th className="py-4 px-6 font-bold text-xs text-gray-400 uppercase tracking-widest">Type</th>
                <th className="py-4 px-6 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Order</th>
                <th className="py-4 px-6 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Header</th>
                <th className="py-4 px-8 font-bold text-xs text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-6 text-gray-500">No categories found.</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-8">
                      <div className={`font-bold ${cat.parent_id ? 'text-gray-600 pl-6' : 'text-xl text-[#1e293b]'}`}>
                        {cat.parent_id && <span className="text-gray-300 mr-2">└</span>}
                        {cat.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-400 font-medium">{cat.slug}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${cat.parent_id ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-[#c8102e]'}`}>
                        {cat.parent_id ? `Sub of ${cat.parent_name || '—'}` : 'Main Category'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-gray-600">{cat.sort_order}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${cat.show_in_header ? 'text-green-500' : 'text-gray-400'}`}>
                        {cat.show_in_header ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right space-x-2">
                      <button onClick={() => startEdit(cat)} className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(cat.id)} className="px-3 py-1 bg-red-50 text-[#c8102e] rounded text-xs font-bold hover:bg-red-100 transition-colors">Delete</button>
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

export default Categories;
