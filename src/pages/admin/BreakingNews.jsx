import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Modal from '../../components/Admin/Modal';
import {
  adminFetchBreakingNews,
  adminCreateBreakingNews,
  adminUpdateBreakingNews,
  adminDeleteBreakingNews,
} from '../../services/api';

const emptyForm = { title: '', article_id: '' };

const BreakingNews = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await adminFetchBreakingNews();
      setItems(data);
    } catch (err) {
      console.error('Error fetching breaking news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ticker item?')) return;
    try {
      await adminDeleteBreakingNews(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const toggleActive = async (item) => {
    try {
      const updated = await adminUpdateBreakingNews(item.id, {
        title: item.title,
        article_id: item.article_id || null,
        is_active: !item.is_active,
      });
      setItems(items.map(i => i.id === item.id ? { ...i, is_active: updated.is_active } : i));
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const openModal = (item = null) => {
    setError('');
    if (item) {
      setEditingItem(item);
      setFormData({ title: item.title, article_id: item.article_id || '' });
    } else {
      setEditingItem(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        article_id: formData.article_id ? Number(formData.article_id) : null,
        is_active: editingItem ? editingItem.is_active : true,
      };
      if (editingItem) {
        const updated = await adminUpdateBreakingNews(editingItem.id, payload);
        setItems(items.map(i => i.id === editingItem.id ? { ...i, ...updated } : i));
      } else {
        const created = await adminCreateBreakingNews(payload);
        setItems([created, ...items]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row md:justify-between md:items-center items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">Breaking News</h1>
          <p className="text-gray-500">Manage the red scrolling ticker items.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#c8102e] text-white px-5 py-2.5 rounded-xl shadow-lg shadow-red-900/20 font-bold hover:bg-[#a00d25] transition-colors flex items-center whitespace-nowrap self-start md:self-auto"
        >
          <FaPlus className="mr-2" /> Add Item
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-center">No breaking news items found.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl shadow-sm border ${item.is_active ? 'border-gray-100' : 'border-red-100 bg-red-50/20'} p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between group cursor-pointer hover:shadow-md transition-all gap-4`}>
              <div className="flex items-center">
                <button
                  onClick={() => toggleActive(item)}
                  className={`w-3 h-3 rounded-full mr-5 shrink-0 transition-colors ${item.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}
                  title={item.is_active ? 'Click to deactivate' : 'Click to activate'}
                />
                <div className="flex flex-col">
                  <span className={`font-bold text-lg ${item.is_active ? 'text-[#1e293b]' : 'text-gray-500 line-through'}`}>
                    {item.title}
                  </span>
                  <span className="text-[11px] text-gray-400 font-bold flex items-center mt-1">
                    {item.article_id ? (
                      <><span className="text-brand-red mr-1.5">🔗</span> Linked to Article #{item.article_id}</>
                    ) : 'Text only (no link)'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-auto">
                <button onClick={() => openModal(item)} className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                  <FaEdit size={14} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                  <FaTrashAlt size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Ticker Item' : 'New Ticker Item'}>
        <form onSubmit={handleSave} className="flex flex-col space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold">{error}</div>}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Ticker Text (Telugu)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Link to Article ID (Optional)</label>
            <input
              type="number"
              value={formData.article_id}
              onChange={(e) => setFormData({ ...formData, article_id: e.target.value })}
              placeholder="e.g. 5"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
            />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-[#c8102e] text-white py-3 rounded-xl font-bold mt-4 hover:bg-[#a00d25] transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Item'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BreakingNews;
