import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaThLarge, FaWhatsapp, FaChartLine, FaRegNewspaper, FaTimes, FaRegImage, FaRegPlayCircle } from 'react-icons/fa';

import { 
  FaMapMarkerAlt, FaMap, FaBullhorn, FaBolt, FaGavel, 
  FaTrophy, FaHeartbeat, FaClock, FaBookOpen, FaCity, 
  FaFlag, FaGlobe, FaBriefcase, FaMicrochip 
} from 'react-icons/fa';

const mobileCategories = [
  { name: 'తెలంగాణ', path: '/category/telangana', icon: FaMapMarkerAlt },
  { name: 'ఆంధ్రప్రదేశ్', path: '/category/andhra', icon: FaMap },
  { name: 'రాజకీయాలు', path: '/category/politics', icon: FaBullhorn },
  { name: 'బ్రేకింగ్ న్యూస్', path: '/category/breaking', icon: FaBolt },
  { name: 'క్రైమ్', path: '/category/crime', icon: FaGavel },
  { name: 'క్రీడలు', path: '/category/sports', icon: FaTrophy },
  { name: 'ఆరోగ్యం', path: '/category/health', icon: FaHeartbeat },
  { name: 'తాజా వార్తలు', path: '/category/latest', icon: FaClock },
  { name: 'స్టోరీలు', path: '/category/stories', icon: FaBookOpen },
  { name: 'రాష్ట్రీయం', path: '/category/state', icon: FaCity },
  { name: 'జాతీయం', path: '/category/national', icon: FaFlag },
  { name: 'అంతర్జాతీయం', path: '/category/international', icon: FaGlobe },
  { name: 'ఉద్యోగం', path: '/category/jobs', icon: FaBriefcase },
  { name: 'ఈ-పేపర్', path: '/epaper', icon: FaRegNewspaper },
  { name: 'టెక్నాలజీ', path: '/category/technology', icon: FaMicrochip },
];

const MobileBottomNav = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (path) => {
    setIsCategoriesOpen(false);
    navigate(path);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#111] text-gray-400 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-end px-2 pt-2 pb-1 relative h-[60px]">
        
        <Link to="/flip" className="flex flex-col items-center justify-center flex-1 hover:text-white transition-colors">
          <FaHome size={20} className="mb-1" />
          <span className="text-[10px] font-bold">వార్తలు</span>
        </Link>
        
        <button 
          onClick={() => setIsCategoriesOpen(true)}
          className="flex flex-col items-center justify-center flex-1 hover:text-white transition-colors"
        >
          <FaThLarge size={20} className="mb-1" />
          <span className="text-[10px] font-bold">విభాగాలు</span>
        </button>
        
        <div className="flex-1 flex flex-col items-center justify-center relative h-full">
          <a 
            href="#" 
            className="absolute -top-[28px] left-1/2 -translate-x-1/2 bg-[#25D366] text-white p-3.5 rounded-full border-[5px] border-[#111] shadow-lg hover:scale-105 transition-transform"
          >
            <FaWhatsapp size={24} />
          </a>
          <span className="text-[10px] font-bold text-[#25D366] absolute bottom-1">షేర్</span>
        </div>
        
        <Link to="/trending" className="flex flex-col items-center justify-center flex-1 hover:text-white transition-colors text-brand-red">
          <FaChartLine size={20} className="mb-1" />
          <span className="text-[10px] font-bold text-white">ట్రెండింగ్</span>
        </Link>
        
        <Link to="/epaper" className="flex flex-col items-center justify-center flex-1 hover:text-white transition-colors">
          <FaRegNewspaper size={20} className="mb-1" />
          <span className="text-[10px] font-bold">ఈ-పేపర్</span>
        </Link>

      </div>
    </div>

      {/* Categories Modal Overlay */}
      {isCategoriesOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-white flex flex-col animate-slideUp overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-900 tracking-wide">వార్తా విభాగాలు (Live)</h2>
            <button 
              onClick={() => setIsCategoriesOpen(false)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            >
              <FaTimes size={18} />
            </button>
          </div>
          
          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="grid grid-cols-3 gap-x-4 gap-y-6">
              {mobileCategories.map((cat, idx) => {
                const Icon = cat.icon || FaRegImage;
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleCategoryClick(cat.path)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="w-[72px] h-[72px] bg-gray-50 rounded-2xl flex items-center justify-center mb-2 shadow-sm group-hover:bg-indigo-50 transition-colors">
                      <Icon size={24} className="text-brand-red opacity-80" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 text-center leading-tight px-1">
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Bottom padding so we can scroll past the last items */}
            <div className="h-12"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomNav;
