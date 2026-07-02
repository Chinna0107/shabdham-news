import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaDownload, FaWhatsapp, FaCalendarAlt, FaSearch, FaTimes } from 'react-icons/fa';
import { fetchEpapers, fetchEpaperByDate } from '../services/api';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Epaper = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayEdition, setTodayEdition] = useState(null);
  const [pastEditions, setPastEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Load all editions on mount
  useEffect(() => {
    const loadEditions = async () => {
      try {
        const data = await fetchEpapers();
        if (data.length > 0) {
          setTodayEdition(data[0]); // Latest edition as "today's"
          setPastEditions(data.slice(1));
        }
      } catch (err) {
        console.error('Error loading epapers:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEditions();
  }, []);

  // Search by date
  const handleDateSearch = async () => {
    setSearching(true);
    try {
      const edition = await fetchEpaperByDate(selectedDate);
      setTodayEdition(edition);
    } catch (err) {
      // No edition for this date — show a message
      setTodayEdition(null);
    } finally {
      setSearching(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatShortDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        లోడ్ అవుతోంది...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>E-Paper Archive - Shabdham TV</title>
      </Helmet>

      <div className="w-full px-4 lg:px-8 xl:px-12 pt-8 pb-16 bg-gray-50 min-h-screen">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1a237e] flex items-center">
              <span className="w-1.5 h-8 bg-brand-red mr-3 inline-block"></span>
              ఈ-పేపర్ ఆర్కైవ్
            </h1>
            <p className="text-gray-500 mt-2 ml-4">Daily Digital Print Edition</p>
          </div>
          
          {/* Calendar Picker */}
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3 w-full md:w-auto">
            <FaCalendarAlt className="text-brand-red" size={20} />
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wide">Select Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="font-bold text-gray-800 outline-none cursor-pointer bg-transparent"
              />
            </div>
            <button 
              onClick={handleDateSearch}
              disabled={searching}
              className="ml-auto md:ml-4 bg-brand-red text-white p-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {searching ? '...' : <FaSearch />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Today's Edition - Main Display */}
          <div className="lg:col-span-8">
            {todayEdition ? (
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 relative group">
                <div className="absolute top-8 -left-2 bg-brand-red text-white font-bold px-4 py-1.5 rounded-r shadow-lg z-10 text-sm tracking-wide">
                  {formatShortDate(todayEdition.published_date) === formatShortDate(new Date().toISOString()) ? "TODAY'S EDITION" : formatShortDate(todayEdition.published_date)}
                </div>
                
                <div 
                  className="aspect-[3/4] w-full bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-100 mb-6 relative cursor-pointer"
                  onClick={() => setIsPdfModalOpen(true)}
                >
                  <img 
                    src={todayEdition.cover_image || 'https://placehold.co/800x1000?text=No+Cover'} 
                    alt={todayEdition.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  
                  {/* Hover overlay to read */}
                  {todayEdition.pdf_url && (
                    <div className="absolute inset-0 w-full h-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <span className="bg-white text-brand-red font-bold py-3 px-8 rounded-full shadow-2xl transform hover:scale-105 transition-transform text-lg pointer-events-none">
                        చదవండి (Read Now)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100 pt-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{todayEdition.title}</h3>
                    <p className="text-gray-500 font-semibold">{formatDate(todayEdition.published_date)}</p>
                    <p className="text-xs text-gray-400 mt-1">{todayEdition.pages} page{todayEdition.pages !== 1 ? 's' : ''}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {todayEdition.pdf_url && (
                      <button 
                        onClick={() => setIsPdfModalOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors shadow-sm"
                      >
                        చదవండి (Read Edition)
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        const url = todayEdition.pdf_url || window.location.href;
                        const text = encodeURIComponent(`${todayEdition.title} - ${formatDate(todayEdition.published_date)}\n${url}`);
                        window.open(`https://wa.me/?text=${text}`, '_blank');
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-2.5 px-5 rounded-lg transition-colors shadow-sm"
                    >
                      <FaWhatsapp className="mr-2" size={18} /> Share
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-md border border-gray-100 text-center">
                <p className="text-xl font-bold text-gray-400 mb-2">ఈ తేదీకి సంచిక అందుబాటులో లేదు</p>
                <p className="text-gray-400 text-sm">No edition available for the selected date.</p>
              </div>
            )}
          </div>

          {/* Past Editions Grid */}
          <div className="lg:col-span-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-[#1a237e] mr-2 inline-block"></span>
              గత సంచికలు (Past Editions)
            </h3>
            
            {pastEditions.length === 0 ? (
              <p className="text-gray-400 text-sm bg-white p-6 rounded-xl border border-gray-100 text-center">
                గత సంచికలు అందుబాటులో లేవు.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {pastEditions.slice(0, 6).map((edition) => (
                  <div 
                    key={edition.id} 
                    className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 group cursor-pointer hover:border-brand-red transition-colors"
                    onClick={() => {
                      setTodayEdition(edition);
                      setSelectedDate(edition.published_date.split('T')[0]);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="aspect-[3/4] w-full bg-gray-100 rounded overflow-hidden mb-2 relative">
                      <img 
                        src={edition.cover_image || 'https://placehold.co/400x500?text=No+Cover'} 
                        alt={edition.title} 
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <p className="text-center text-xs font-bold text-gray-700 group-hover:text-brand-red">
                      {formatShortDate(edition.published_date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* PDF Viewer Modal */}
      {isPdfModalOpen && todayEdition?.pdf_url && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white bg-black/50 border-b border-white/10 shrink-0">
            <h3 className="font-bold text-lg md:text-xl truncate pr-4">{todayEdition.title}</h3>
            <button 
              onClick={() => setIsPdfModalOpen(false)} 
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <div className="flex-1 w-full bg-[#525659] flex justify-center overflow-y-auto pt-4 pb-12">
            <Document
              file={todayEdition.pdf_url}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex flex-col items-center gap-6"
              loading={<div className="text-white text-lg mt-10">PDF లోడ్ అవుతోంది...</div>}
              error={<div className="text-red-400 text-lg mt-10">PDF లోడ్ చేయడంలో లోపం.</div>}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="shadow-2xl">
                  <Page 
                    pageNumber={index + 1} 
                    renderTextLayer={false} 
                    renderAnnotationLayer={false}
                    width={Math.min(window.innerWidth - 32, 900)}
                  />
                </div>
              ))}
            </Document>
          </div>
        </div>
      )}
    </>
  );
};

export default Epaper;
