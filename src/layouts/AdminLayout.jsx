import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import { FaBars } from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[40] lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-[50] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 lg:ml-[260px] flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white h-16 flex items-center px-4 justify-between border-b border-gray-200 shrink-0">
           <img src="/balagam_logo_final.png" alt="Balagam TV" className="h-8 object-contain" />
           <button onClick={() => setSidebarOpen(true)} className="text-[#1e293b] p-2 focus:outline-none">
             <FaBars size={24} />
           </button>
        </div>
        
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
