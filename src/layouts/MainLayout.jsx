import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-brand-gray pb-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
