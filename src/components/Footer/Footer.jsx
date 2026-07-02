import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.jpeg';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-12 pb-6 border-t-4 border-brand-red">
      <div className="w-full px-4 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <img
              src={logoImage}
              alt="Balagam TV Logo"
              className="h-12 mb-4 bg-white p-1 rounded"
            />
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              SHABDHAM TV is a leading Telugu news portal providing the latest updates on politics, movies, sports, and local news with accuracy and speed.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/people/Shabdham-Chanel/61558708151658/" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red transition-colors">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red transition-colors">
                <FaTwitter size={14} />
              </a>
              <a href="https://www.instagram.com/shabdham_peoples_voice/reels/" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red transition-colors">
                <FaInstagram size={14} />
              </a>
              <a href="https://www.youtube.com/@SHABDHAM-on7qu/featured" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red transition-colors">
                <FaYoutube size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-brand-red">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-brand-red transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-red transition-colors">Terms of Service</Link></li>
              <li><Link to="/advertise" className="hover:text-brand-red transition-colors">Advertise with Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-brand-red">
              Contact Us
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-brand-red flex-shrink-0" />
                <span>123 News Avenue, Film Nagar, Hyderabad, Telangana 500033</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-brand-red flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-brand-red flex-shrink-0" />
                <span>info@shabdhamtv.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Shabdham TV. All Rights Reserved. Designed by <span className="text-brand-red font-semibold"><a href="https://codtechitsolutions.com" target="_blank" rel="noopener noreferrer">CODTECH IT SOLUTIONS</a></span>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
