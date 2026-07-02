import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  FaThLarge, 
  FaRegNewspaper, 
  FaBolt, 
  FaMapMarkerAlt, 
  FaUserFriends, 
  FaCog, 
  FaRegFileAlt,
  FaSignOutAlt,
  FaBullhorn
} from 'react-icons/fa';
import logo from "../Admin/logo.jpeg"

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: FaThLarge },
  { name: 'News Management', path: '/admin/news', icon: FaRegNewspaper },
  { name: 'Breaking News', path: '/admin/breaking-news', icon: FaBolt },
  { name: 'Categories', path: '/admin/categories', icon: FaMapMarkerAlt },
  { name: 'Employees', path: '/admin/employees', icon: FaUserFriends },
  { name: 'CMS Pages', path: '/admin/cms-pages', icon: FaCog },
  { name: 'E-Paper', path: '/admin/epaper', icon: FaRegFileAlt },
  { name: 'Ads', path: '/admin/ads', icon: FaBullhorn },
];

const AdminSidebar = ({ onClose }) => {
  return (
    <div className="w-[260px] h-full bg-[#1e293b] text-gray-300 flex flex-col">
      {/* Logo Area */}
      <div className="p-6 pb-8 flex items-center justify-between border-b border-gray-700/50">
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Balagam TV" 
            className="h-10 bg-white p-1 rounded object-contain mr-3"
          />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-widest leading-tight">Shabdham TV</span>
            <span className="text-[10px] text-gray-400 font-semibold tracking-[0.2em]">ADMIN PANEL</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#c8102e] text-white shadow-lg shadow-red-900/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="mr-3 shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="bg-slate-800/50 rounded-xl p-3 flex items-center mb-4 cursor-pointer hover:bg-slate-800 transition-colors border border-slate-700">
          <div className="w-10 h-10 rounded-full bg-[#f15a24] text-white flex items-center justify-center font-bold text-lg mr-3 shrink-0">
            S
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-white font-bold text-sm truncate">Super Admin</span>
            <span className="text-xs text-gray-400 truncate">admin@balagamtv.com</span>
          </div>
        </div>
        
        <Link 
          to="/"
          className="flex items-center justify-center px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <FaSignOutAlt className="mr-2" size={14} /> Logout
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
