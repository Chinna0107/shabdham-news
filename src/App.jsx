import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import { FaWhatsapp } from 'react-icons/fa';

// Pages
import Home from './pages/Home';
import Category from './pages/Category';
import SingleArticle from './pages/SingleArticle';
import Search from './pages/Search';
import Epaper from './pages/Epaper';
import Shorts from './pages/Shorts';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import NewsManagement from './pages/admin/NewsManagement';
import BreakingNews from './pages/admin/BreakingNews';
import Categories from './pages/admin/Categories';
import Employees from './pages/admin/Employees';
import EmployeeNewsRequests from './pages/admin/EmployeeNewsRequests';
import CmsPages from './pages/admin/CmsPages';
import EPaperAdmin from './pages/admin/EPaperAdmin';
import AdsManagement from './pages/admin/AdsManagement';
import AdminProfile from './pages/admin/AdminProfile';
import { About, Contact, Privacy, Advertise, Terms } from './pages/StaticPages';

// Employee Portal Pages
import EmployeeLogin from './pages/employee/EmployeeLogin';
import EmployeeLayout from './layouts/EmployeeLayout';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeNewsManagement from './pages/employee/EmployeeNewsManagement';
import EmployeeProfile from './pages/employee/EmployeeProfile';

import ProtectedRoute from './components/ProtectedRoute';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-clip w-full relative">
      <Header />
      <main className="flex-grow pb-[70px] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      
      {/* Floating WhatsApp Button (Mobile Only) */}
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed bottom-[80px] right-4 bg-[#25D366] text-white p-3 rounded-full shadow-lg z-40 hover:bg-[#20b858] transition-colors flex items-center justify-center"
      >
        <FaWhatsapp size={26} />
      </a>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="category/:categoryName" element={<Category />} />
        <Route path="category/:categoryName/:subCategory" element={<Category />} />
        <Route path="article/:slug" element={<SingleArticle />} />
        <Route path="search" element={<Search />} />
        <Route path="epaper" element={<Epaper />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="advertise" element={<Advertise />} />
        <Route path="terms" element={<Terms />} />
        {/* Handle unknown routes */}
        <Route path="*" element={<div className="flex justify-center items-center h-screen text-2xl font-bold">404 - Page Not Found</div>} />
      </Route>
      {/* Full screen routes without header/footer */}
      <Route path="/flip" element={<Shorts type="news" />} />
      <Route path="/trending" element={<Shorts type="trending" />} />
      <Route path="/shorts" element={<Shorts type="news" />} /> {/* Keep for backwards compatibility */}
      
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/employee-login" element={<EmployeeLogin />} />
      
      {/* Admin Panel Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="employee-news" element={<EmployeeNewsRequests />} />
          <Route path="breaking-news" element={<BreakingNews />} />
          <Route path="categories" element={<Categories />} />
          <Route path="employees" element={<Employees />} />
          <Route path="cms-pages" element={<CmsPages />} />
          <Route path="epaper" element={<EPaperAdmin />} />
          <Route path="ads" element={<AdsManagement />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>

      {/* Employee Portal Routes (Protected) */}
      <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="news" element={<EmployeeNewsManagement />} />
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
