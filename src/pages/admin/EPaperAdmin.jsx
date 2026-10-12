import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Modal from '../../components/Admin/Modal';
import CloudinaryUpload from '../../components/Admin/CloudinaryUpload';
import {
  adminFetchEpapers,
  adminCreateEpaper,
  adminUpdateEpaper,
  adminDeleteEpaper,
} from '../../services/api';

const emptyForm = { title: 'Main Edition', published_date: '', cover_image: '', pdf_url: '', pages: 1 };

const EPaperAdmin = () => {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEd, setEditingEd] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await adminFetchEpapers();
      setEditions(data);
    } catch (err) {
      console.error('Error fetching epapers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this edition?")) return;
    try {
      await adminDeleteEpaper(id);
      setEditions(editions.filter(ed => ed.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const openModal = (ed = null) => {
    setError('');
    if (ed) {
      setEditingEd(ed);
      setFormData({
        title: ed.title || 'Main Edition',
        published_date: ed.published_date ? ed.published_date.split('T')[0] : '',
        cover_image: ed.cover_image || '',
        pdf_url: ed.pdf_url || '',
        pages: ed.pages || 1,
      });
    } else {
      setEditingEd(null);
      setFormData({
        ...emptyForm,
        published_date: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editingEd) {
        const updated = await adminUpdateEpaper(editingEd.id, {
          ...formData,
          is_active: editingEd.is_active ?? true,
        });
        setEditions(editions.map(ed => ed.id === editingEd.id ? { ...ed, ...updated } : ed));
      } else {
        const created = await adminCreateEpaper({
          ...formData,
          is_active: true,
        });
        setEditions([created, ...editions]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">E-Paper Management</h1>
          <p className="text-gray-500">Manage newspaper editions with cover images and PDFs.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#c8102e] text-white px-5 py-2.5 rounded-xl shadow-lg shadow-red-900/20 font-bold hover:bg-[#a00d25] transition-colors flex items-center whitespace-nowrap self-start md:self-auto"
        >
          <FaPlus className="mr-2" /> Add Edition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-400 text-center py-8 col-span-3">Loading...</p>
        ) : editions.length === 0 ? (
          <p className="text-gray-500 p-8 col-span-3 text-center bg-white rounded-3xl border border-gray-100">No editions found. Add one above.</p>
        ) : (
          editions.map((edition) => (
            <div key={edition.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-64 overflow-hidden relative border-b border-gray-100 bg-gray-50">
                <img 
                  src={edition.cover_image || 'https://placehold.co/800x600?text=No+Cover'} 
                  alt={edition.title} 
                  className="w-full h-full object-cover"
                />
                {!edition.is_active && (
                  <div className="absolute top-3 right-3 bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded">
                    INACTIVE
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-[#1e293b] mb-2">{edition.title}</h3>
                <p className="text-sm font-semibold text-gray-500 mb-1">{formatDate(edition.published_date)}</p>
                <p className="text-xs text-gray-400 mb-2">{edition.pages} page{edition.pages !== 1 ? 's' : ''}</p>
                {edition.pdf_url && (
                  <a href={edition.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-bold hover:underline mb-4">
                    📄 View PDF
                  </a>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <button onClick={() => openModal(edition)} className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center transition-colors">
                    <FaEdit className="mr-1.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(edition.id)} className="text-brand-red hover:text-red-800 font-bold text-sm flex items-center transition-colors">
                    <FaTrashAlt className="mr-1.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingEd ? 'Edit Edition' : 'New Edition'}
      >
        <form onSubmit={handleSave} className="flex flex-col space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold">{error}</div>}
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Edition Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Published Date</label>
            <input 
              type="date" 
              value={formData.published_date} 
              onChange={(e) => setFormData({...formData, published_date: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Number of Pages</label>
            <input 
              type="number" 
              value={formData.pages} 
              onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value) || 1})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              min="1"
            />
          </div>

          <CloudinaryUpload
            label="Cover Image"
            value={formData.cover_image}
            onChange={(url) => setFormData({...formData, cover_image: url})}
          />

          <CloudinaryUpload
            label="PDF File"
            value={formData.pdf_url}
            onChange={(url) => setFormData({...formData, pdf_url: url})}
            accept="pdf"
          />
          
          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-[#c8102e] text-white py-3 rounded-xl font-bold mt-4 hover:bg-[#a00d25] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingEd ? 'Save Changes' : 'Add Edition'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default EPaperAdmin;
