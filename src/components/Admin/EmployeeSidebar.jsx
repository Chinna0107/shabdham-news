import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  FaThLarge, 
  FaRegNewspaper, 
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import logo from "../Admin/logo.jpeg";

const navItems = [
  { name: 'Dashboard', path: '/employee/dashboard', icon: FaThLarge },
  { name: 'My News', path: '/employee/news', icon: FaRegNewspaper },
  { name: 'Profile', path: '/employee/profile', icon: FaUser },
];

const EmployeeSidebar = ({ onClose }) => {
  const [user, setUser] = useState({ name: 'Employee', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('employee_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('employee_token');
    localStorage.removeItem('employee_user');
    navigate('/employee-login');
  };

  return (
    <div className="w-[260px] h-full bg-[#1e293b] text-gray-300 flex flex-col">
      {/* Logo Area */}
      <div className="p-6 pb-8 flex items-center justify-between border-b border-gray-700/50">
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-10 bg-white p-1 rounded object-contain mr-3"
          />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-widest leading-tight">Shabdham TV</span>
            <span className="text-[10px] text-blue-400 font-semibold tracking-[0.2em]">EMPLOYEE PORTAL</span>
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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
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
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mr-3 shrink-0">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-white font-bold text-sm truncate">{user.name}</span>
            <span className="text-xs text-gray-400 truncate">{user.email}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <FaSignOutAlt className="mr-2" size={14} /> Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
