import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MobileBottomNav from './components/MobileBottomNav';

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
import CmsPages from './pages/admin/CmsPages';
import EPaperAdmin from './pages/admin/EPaperAdmin';
import AdsManagement from './pages/admin/AdsManagement';
import { About, Contact, Privacy, Advertise, Terms } from './pages/StaticPages';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-clip w-full relative">
      <Header />
      <main className="flex-grow pb-[70px] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
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
      
      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="news" element={<NewsManagement />} />
        <Route path="breaking-news" element={<BreakingNews />} />
        <Route path="categories" element={<Categories />} />
        <Route path="employees" element={<Employees />} />
        <Route path="cms-pages" element={<CmsPages />} />
        <Route path="epaper" element={<EPaperAdmin />} />
        <Route path="ads" element={<AdsManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
