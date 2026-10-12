import React from 'react';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram, FaLink, FaTimes } from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose, url, title }) => {
  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleShare = (platform) => {
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedTitle} ${encodedUrl}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't have a direct web share link for content, usually you just copy link
        // Or if it's mobile, you can try intent:// but copy is safest
        copyToClipboard();
        alert('Instagram does not support direct web sharing. Link copied to clipboard!');
        break;
      case 'copy':
        copyToClipboard();
        break;
      default:
        break;
    }
    onClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(`${title}\n${url}`);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white w-full sm:w-96 rounded-t-2xl sm:rounded-2xl p-6 transform transition-transform animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Share this article</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
            <FaTimes />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <FaWhatsapp size={24} />
            </div>
            <span className="text-[11px] font-bold text-gray-600">WhatsApp</span>
          </button>
          
          <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-[#1877F2] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <FaFacebookF size={22} />
            </div>
            <span className="text-[11px] font-bold text-gray-600">Facebook</span>
          </button>

          <button onClick={() => handleShare('twitter')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <FaTwitter size={22} />
            </div>
            <span className="text-[11px] font-bold text-gray-600">Twitter</span>
          </button>

          <button onClick={() => handleShare('instagram')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <FaInstagram size={24} />
            </div>
            <span className="text-[11px] font-bold text-gray-600">Instagram</span>
          </button>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => handleShare('copy')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors"
          >
            <FaLink /> Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
