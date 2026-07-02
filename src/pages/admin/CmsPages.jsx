import React, { useState } from 'react';
import { FaSave, FaBold, FaItalic, FaUnderline, FaStrikethrough, FaListUl, FaListOl, FaLink, FaImage, FaRemoveFormat } from 'react-icons/fa';

const CmsPages = () => {
  const [activeTab, setActiveTab] = useState('pages');
  const [content, setContent] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center z-[100] animate-slideDown">
          <span className="mr-2">✓</span> Changes saved successfully!
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">CMS & Settings</h1>
          <p className="text-gray-500">Update static pages and site configurations.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#c8102e] text-white px-6 py-2.5 rounded-xl shadow-lg shadow-red-900/20 font-bold hover:bg-[#a00d25] transition-colors flex items-center whitespace-nowrap self-start md:self-auto"
        >
          <FaSave className="mr-2" /> Save Changes
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('pages')}
          className={`px-8 py-2.5 font-bold rounded-xl transition-colors ${activeTab === 'pages' ? 'bg-white text-[#1e293b] shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-gray-200/50'}`}
        >
          Pages
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-8 py-2.5 font-bold rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-white text-[#1e293b] shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-gray-200/50'}`}
        >
          Settings
        </button>
      </div>

      {activeTab === 'pages' ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
          <h2 className="text-xl font-bold text-[#1e293b] mb-6">About Content</h2>
          
          <div className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[400px]">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center gap-4 flex-wrap">
              <select className="bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none">
                <option>Normal</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
              </select>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <button className="hover:text-black transition-colors"><FaBold /></button>
                <button className="hover:text-black transition-colors"><FaItalic /></button>
                <button className="hover:text-black transition-colors"><FaUnderline /></button>
                <button className="hover:text-black transition-colors"><FaStrikethrough /></button>
              </div>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <button className="hover:text-black transition-colors"><FaListUl /></button>
                <button className="hover:text-black transition-colors"><FaListOl /></button>
              </div>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <button className="hover:text-black transition-colors"><FaLink /></button>
                <button className="hover:text-black transition-colors"><FaImage /></button>
                <button className="hover:text-black transition-colors"><FaRemoveFormat /></button>
              </div>
            </div>
            
            {/* Editor Area */}
            <div className="flex-1 p-6">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full resize-none border-none focus:outline-none text-gray-700 text-lg"
                placeholder="Start writing page content..."
              ></textarea>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
          <h2 className="text-xl font-bold text-[#1e293b] mb-6">Global Settings</h2>
          
          <div className="flex flex-col space-y-6 max-w-2xl">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Site Title</label>
              <input 
                type="text" 
                defaultValue="SHABDHAM TV News" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Contact Email</label>
              <input 
                type="email" 
                defaultValue="shabdham@shabdham.com" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <h4 className="font-bold text-[#1e293b]">Maintenance Mode</h4>
                <p className="text-xs text-gray-500 mt-1">Temporarily disable public access to the site.</p>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsPages;
