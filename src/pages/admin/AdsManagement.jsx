import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Modal from '../../components/Admin/Modal';
import CloudinaryUpload from '../../components/Admin/CloudinaryUpload';
import { adminFetchAds, adminCreateAd, adminUpdateAd, adminDeleteAd } from '../../services/api';

const emptyForm = { title: '', image_url: '', link_url: '', position: 'sidebar', is_active: true };

const AdsManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');

  const loadAds = async () => {
    try {
      const data = await adminFetchAds();
      setAds(data);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAds(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    try {
      await adminDeleteAd(id);
      setAds(ads.filter(ad => ad.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const openModal = (item = null) => {
    setError('');
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        image_url: item.image_url || '',
        link_url: item.link_url || '',
        position: item.position || 'sidebar',
        is_active: item.is_active ?? true,
      });
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
      if (editingItem) {
        const updated = await adminUpdateAd(editingItem.id, formData);
        setAds(ads.map(ad => ad.id === editingItem.id ? { ...ad, ...updated } : ad));
      } else {
        const created = await adminCreateAd(formData);
        setAds([created, ...ads]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed. Check all fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">Ads Management</h1>
          <p className="text-gray-500">Manage 300x250 advertisements displayed across the site.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#c8102e] text-white px-5 py-2.5 rounded-xl shadow-lg shadow-red-900/20 font-bold hover:bg-[#a00d25] transition-colors flex items-center whitespace-nowrap self-start md:self-auto"
        >
          <FaPlus className="mr-2" /> Add Ad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500 text-center py-8 col-span-3">Loading...</p>
        ) : ads.length === 0 ? (
          <p className="text-gray-500 p-8 col-span-3 text-center bg-white rounded-3xl border border-gray-100">No advertisements found. Add one above.</p>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="bg-gray-100 flex items-center justify-center p-4 border-b border-gray-100 relative">
                <img 
                  src={ad.image_url || 'https://placehold.co/300x250?text=No+Image'} 
                  alt={ad.title} 
                  className="w-[300px] h-[250px] object-cover shadow-sm bg-white"
                />
                {!ad.is_active && (
                  <div className="absolute top-2 right-2 bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded">
                    INACTIVE
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-[#1e293b] mb-1">{ad.title}</h3>
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Position: {ad.position}</p>
                {ad.link_url ? (
                  <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mb-4 truncate block">
                    {ad.link_url}
                  </a>
                ) : (
                  <p className="text-sm text-gray-400 mb-4 italic">No link URL</p>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <button onClick={() => openModal(ad)} className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center transition-colors">
                    <FaEdit className="mr-1.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(ad.id)} className="text-brand-red hover:text-red-800 font-bold text-sm flex items-center transition-colors">
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
        title={editingItem ? 'Edit Advertisement' : 'New Advertisement'}
      >
        <form onSubmit={handleSave} className="flex flex-col space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold">{error}</div>}
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Internal Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Summer Sale Banner"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              required 
            />
          </div>

          <CloudinaryUpload
            label="Ad Image (300x250 Recommended)"
            value={formData.image_url}
            onChange={(url) => setFormData({...formData, image_url: url})}
          />

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Destination URL</label>
            <input 
              type="url" 
              value={formData.link_url} 
              onChange={(e) => setFormData({...formData, link_url: e.target.value})}
              placeholder="https://example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
            >
              <option value="sidebar">Sidebar</option>
              <option value="header">Header</option>
              <option value="article">Inside Article</option>
            </select>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active</label>
            <div 
              onClick={() => setFormData({...formData, is_active: !formData.is_active})}
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${formData.is_active ? 'left-[22px]' : 'left-0.5'}`} />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={saving || !formData.image_url}
            className="w-full bg-[#c8102e] text-white py-3 rounded-xl font-bold mt-4 hover:bg-[#a00d25] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Advertisement'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdsManagement;
