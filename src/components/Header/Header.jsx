import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Ticker from './Ticker';
import { FaSearch, FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaTimes, FaBars } from 'react-icons/fa';
import logoImage from '../../assets/logo.jpeg';
// Use a simple X icon for Twitter/X
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Header = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const [isMobileSticky, setIsMobileSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setIsMobileSticky(window.scrollY > 100);
      } else {
        setIsMobileSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <header className="w-full flex flex-col font-sans bg-white shadow-sm relative">
      
      {/* Top Whatsapp Banner */}
      {showBanner && (
        <div className="bg-[#25D366] text-white py-1.5 px-4 flex flex-col md:flex-row justify-between items-center text-sm font-semibold relative z-50 gap-2 md:gap-0">
          <div className="flex items-center space-x-2 text-center md:text-left">
            <FaWhatsapp size={18} className="shrink-0" />
            <span className="italic text-[12px] md:text-sm">For latest news updates follow Shabdham Tv Whats App Channel!</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-white text-[#25D366] px-4 py-1 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors whitespace-nowrap">
              Follow Channel
            </button>
            <button onClick={() => setShowBanner(false)} className="text-white hover:text-gray-200 shrink-0">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <TopBar />
      
      {/* Logo and Search Section */}
      <div className={cn(
        "w-full px-4 lg:px-8 xl:px-12 py-3 md:py-4 flex justify-between items-center bg-white transition-all duration-300",
        isMobileSticky ? "fixed top-0 left-0 z-50 shadow-md animate-slideDown" : "relative"
      )}>
        
        {/* Mobile Hamburger (Left) */}
        <button 
          className="md:hidden text-gray-800 p-2 -ml-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FaBars size={22} />
        </button>

        {/* Logo and Tagline (Center on mobile, Left on desktop) */}
        <div className="flex flex-col items-center md:items-start absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <Link to="/" className="flex-shrink-0">
            <img 
              src={logoImage} 
              alt="Balagam TV Logo" 
              className="h-10 md:h-[60px] object-contain mb-0.5 md:mb-1"
            />
          </Link>
          <p className="text-brand-red font-bold text-[10px] md:text-[13px] tracking-wide whitespace-nowrap">నిజమే మా బలం.. ప్రజలే మా బలగం</p>
        </div>

        {/* Mobile Search Icon (Right) */}
        <button 
          className="md:hidden text-gray-800 p-2 -mr-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(true)} // Open menu for search on mobile
        >
          <FaSearch size={20} />
        </button>

        {/* Right Tools (Search & Social) - Desktop Only */}
        <div className="hidden md:flex flex-row items-center space-x-6">
          
          {/* Search Bar */}
          <div className="relative w-72">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch size={14} />
            </div>
            <input 
              type="text" 
              placeholder="వార్తల కోసం వెతకండి..." 
              className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-500 font-semibold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* Social Icons & Report Issue */}
          <div className="flex items-center space-x-4 text-gray-400">
            <a href="https://www.facebook.com/people/Shabdham-Chanel/61558708151658/" className="hover:text-[#1877F2] transition-colors"><FaFacebookF size={18} /></a>
            <a href="https://www.instagram.com/shabdham_peoples_voice/reels/" className="hover:text-black transition-colors"><XIcon /></a>
            <a href="#" className="hover:text-[#E4405F] transition-colors"><FaInstagram size={18} /></a>
            <a href="https://www.youtube.com/@SHABDHAM-on7qu/featured" className="hover:text-[#FF0000] transition-colors"><FaYoutube size={18} /></a>
            
            <button className="bg-brand-red text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider hover:bg-red-700 transition-colors ml-2 shadow-sm">
              Report Issue
            </button>
          </div>
          
        </div>
      </div>

      <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <Ticker />
    </header>
  );
};

export default Header;
