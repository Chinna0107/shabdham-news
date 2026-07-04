import { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaDownload, FaWhatsapp, FaCalendarAlt, FaSearch, FaTimes, 
  FaHome, FaSearchPlus, FaSearchMinus, FaCut, FaChevronLeft, FaChevronRight, FaShareAlt 
} from 'react-icons/fa';
import { fetchEpapers, fetchEpaperByDate } from '../services/api';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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
  
  // PDF Viewer State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  
  // Clipping Tool State
  const [isClippingMode, setIsClippingMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [clipStart, setClipStart] = useState(null);
  const [clipEnd, setClipEnd] = useState(null);
  const [clippedImage, setClippedImage] = useState(null);
  
  // HD Reading View State
  const [zoomedReadingOpen, setZoomedReadingOpen] = useState(false);
  const [zoomTargetPos, setZoomTargetPos] = useState({ x: 0, y: 0 });
  const [hdImageSrc, setHdImageSrc] = useState(null);
  const transformComponentRef = useRef(null);
  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const containerRef = useRef(null);

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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDateSearch = async () => {
    setSearching(true);
    try {
      const edition = await fetchEpaperByDate(selectedDate);
      setTodayEdition(edition);
    } catch (err) {
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

  // PDF Navigation
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setScale(1.0);
  };

  const changePage = (offset) => {
    setPageNumber(prev => Math.min(Math.max(1, prev + offset), numPages));
    // Optional: reset scale and clipping when changing pages
    setIsClippingMode(false);
    setClipStart(null);
    setClipEnd(null);
  };

  const changeScale = (delta) => {
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 3.0));
  };

  const getClientPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  // Clipping Logic
  const handlePointerDown = (e) => {
    if (!isClippingMode || !containerRef.current) return;
    
    try {
      if (e.pointerId && e.target.setPointerCapture) {
        e.target.setPointerCapture(e.pointerId);
      }
    } catch (err) {
      console.warn('Pointer capture failed:', err);
    }
    
    const { clientX, clientY } = getClientPos(e);
    const rect = containerRef.current.getBoundingClientRect();
    setIsDragging(true);
    setClipStart({ x: clientX - rect.left, y: clientY - rect.top });
    setClipEnd({ x: clientX - rect.left, y: clientY - rect.top });
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !isClippingMode || !containerRef.current) return;
    
    const { clientX, clientY } = getClientPos(e);
    const rect = containerRef.current.getBoundingClientRect();
    setClipEnd({ x: clientX - rect.left, y: clientY - rect.top });
  };

  const handlePointerUp = (e) => {
    if (!isClippingMode || !containerRef.current) return;
    
    try {
      if (e.pointerId && e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
        e.target.releasePointerCapture(e.pointerId);
      }
    } catch (err) {
      console.warn('Pointer release failed:', err);
    }
    
    if (!isDragging) return;
    setIsDragging(false);
    
    // Process Clip
    if (clipStart && clipEnd) {
      const x1 = Math.min(clipStart.x, clipEnd.x);
      const y1 = Math.min(clipStart.y, clipEnd.y);
      const x2 = Math.max(clipStart.x, clipEnd.x);
      const y2 = Math.max(clipStart.y, clipEnd.y);
      const width = x2 - x1;
      const height = y2 - y1;

      if (width > 20 && height > 20) { // Ignore tiny accidental clicks
        captureClip(x1, y1, width, height);
        setIsClippingMode(false); // Turn off mode after a successful clip
      }
    }
    
    // Reset selection box but keep modal open
    setClipStart(null);
    setClipEnd(null);
  };

  const captureClip = (x, y, width, height) => {
    // Find the canvas rendered by react-pdf inside our container
    const pdfCanvas = containerRef.current.querySelector('.react-pdf__Page__canvas');
    if (!pdfCanvas) return;

    // The container might be scaled or have different dimensions than the actual canvas resolution
    // We need to map the visual coordinates (x, y, width, height) to the canvas's internal coordinates.
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = pdfCanvas.width / rect.width;
    const scaleY = pdfCanvas.height / rect.height;

    const sx = x * scaleX;
    const sy = y * scaleY;
    const sWidth = width * scaleX;
    const sHeight = height * scaleY;

    // Create offscreen canvas to hold the clipped image
    const offCanvas = document.createElement('canvas');
    offCanvas.width = sWidth;
    offCanvas.height = sHeight;
    const ctx = offCanvas.getContext('2d');
    
    ctx.drawImage(pdfCanvas, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
    
    const dataUrl = offCanvas.toDataURL('image/jpeg', 1.0);
    setClippedImage(dataUrl);
  };

  const downloadClippedImage = () => {
    if (!clippedImage) return;
    const link = document.createElement('a');
    link.href = clippedImage;
    link.download = `clip-page-${pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareClippedImage = async () => {
    if (!clippedImage) return;
    try {
      // Convert base64 to Blob
      const res = await fetch(clippedImage);
      const blob = await res.blob();
      const file = new File([blob], `clip-page-${pageNumber}.jpg`, { type: 'image/jpeg' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'News Clip',
          text: 'Check out this news clip from Shabdham TV!',
          files: [file]
        });
      } else {
        // Fallback: download it instead
        alert("Native sharing is not supported on this browser. Downloading the image instead.");
        downloadClippedImage();
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const closeViewer = () => {
    setIsPdfModalOpen(false);
    setScale(1.0);
    setPageNumber(1);
    setIsClippingMode(false);
    setClippedImage(null);
  };

  const memoizedPage = useMemo(() => (
    <Page 
      pageNumber={pageNumber} 
      scale={scale}
      width={windowWidth < 768 ? windowWidth - 32 : Math.min(windowWidth - 64, 1000)}
      renderTextLayer={false} 
      renderAnnotationLayer={false}
      loading={<div className="w-[300px] h-[400px] flex items-center justify-center text-gray-400">లోడ్ అవుతోంది...</div>}
    />
  ), [pageNumber, scale, windowWidth]);

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
                        చదవండి
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
              గత సంచికలు
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

      {/* PDF Viewer Fullscreen Modal */}
      {isPdfModalOpen && todayEdition?.pdf_url && (
        <div className="fixed inset-0 z-[100] bg-[#e5e5e5] flex flex-col overflow-hidden font-sans">
          
          {/* Top Header */}
          <div className="h-[60px] bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-2 md:px-4 shrink-0 relative z-20">
            {/* Left: Home & Title */}
            <div className="flex items-center space-x-3 w-1/3 truncate">
              <button 
                onClick={closeViewer} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shrink-0"
                title="Home / Close"
              >
                <FaHome size={18} />
              </button>
              <div className="hidden sm:block truncate">
                <span className="font-bold text-[#1e293b] text-sm lg:text-base block truncate">{todayEdition.title}</span>
                <span className="text-xs text-gray-500">{formatShortDate(todayEdition.published_date)}</span>
              </div>
            </div>

            {/* Center: Zoom & Clip */}
            <div className="flex items-center justify-center space-x-2 md:space-x-4 w-1/3">
              <button 
                onClick={() => changeScale(-0.25)} 
                disabled={scale <= 0.5}
                className="p-3 md:p-2 text-gray-600 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                title="Zoom Out"
              >
                <FaSearchMinus size={18} className="pointer-events-none" />
              </button>
              
              <span className="text-xs font-bold text-gray-500 w-[40px] text-center">{Math.round(scale * 100)}%</span>
              
              <button 
                onClick={() => changeScale(0.25)} 
                disabled={scale >= 3.0}
                className="p-3 md:p-2 text-gray-600 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                title="Zoom In"
              >
                <FaSearchPlus size={18} className="pointer-events-none" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-1 md:mx-2"></div>
              
              <button 
                onClick={() => setIsClippingMode(!isClippingMode)}
                className={`p-3 md:p-2 rounded-lg transition-all ${isClippingMode ? 'bg-brand-red text-white shadow-inner' : 'text-gray-600 hover:text-brand-red hover:bg-red-50'}`}
                title="Screenshot Clip Tool"
              >
                <FaCut size={18} className="pointer-events-none" />
              </button>
            </div>

            {/* Right: Share, Download */}
            <div className="flex items-center justify-end space-x-2 w-1/3">
              <button 
                onClick={() => {
                  const url = todayEdition.pdf_url;
                  if (navigator.share) {
                    navigator.share({ title: todayEdition.title, url: url });
                  } else {
                    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
                  }
                }}
                className="hidden sm:flex p-2 text-gray-600 hover:text-[#25D366] hover:bg-green-50 rounded-lg transition-colors"
                title="Share Full Edition"
              >
                <FaShareAlt size={18} />
              </button>
              <a 
                href={todayEdition.pdf_url} 
                download
                target="_blank"
                rel="noreferrer"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Download PDF"
              >
                <FaDownload size={18} />
              </a>
            </div>
          </div>

          {/* Main Content: Document Viewer */}
          <div className="flex-1 overflow-auto relative bg-[#e5e5e5] p-4 flex justify-center items-start">
            <Document
              file={todayEdition.pdf_url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="text-gray-500 font-bold mt-20">లోడ్ అవుతోంది...</div>}
              error={<div className="text-red-500 font-bold mt-20">లోడ్ చేయడంలో విఫలమైంది.</div>}
            >
              <div 
                ref={containerRef}
                className={`relative shadow-2xl transition-transform duration-200 origin-top bg-white ${isClippingMode ? 'cursor-crosshair' : 'cursor-zoom-in'}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                onTouchCancel={handlePointerUp}
                onClick={(e) => {
                  if (isClippingMode || !containerRef.current) return;
                  const rect = containerRef.current.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const clickY = e.clientY - rect.top;
                  
                  setZoomTargetPos({
                    x: clickX / rect.width,
                    y: clickY / rect.height
                  });
                  
                  const pdfCanvas = containerRef.current.querySelector('.react-pdf__Page__canvas');
                  if (pdfCanvas) {
                    setHdImageSrc(pdfCanvas.toDataURL('image/jpeg', 0.9));
                  }
                  
                  setZoomedReadingOpen(true);
                }}
                style={{ touchAction: isClippingMode ? 'none' : 'auto' }} // Prevent scrolling while clipping on mobile
              >
                {memoizedPage}
                
                {/* Visual Clipping Box */}
                {isClippingMode && isDragging && clipStart && clipEnd && (
                  <div 
                    className="absolute border-2 border-brand-red bg-red-500/20 z-50 pointer-events-none"
                    style={{
                      left: Math.min(clipStart.x, clipEnd.x),
                      top: Math.min(clipStart.y, clipEnd.y),
                      width: Math.abs(clipEnd.x - clipStart.x),
                      height: Math.abs(clipEnd.y - clipStart.y)
                    }}
                  />
                )}
                
                {/* Clipping mode overlay instruction */}
                {isClippingMode && !isDragging && (
                  <div className="absolute inset-0 bg-black/5 z-40 pointer-events-none flex items-center justify-center">
                    <div className="bg-black/70 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl animate-pulse">
                      Drag to cut a clip
                    </div>
                  </div>
                )}
              </div>
            </Document>
          </div>

          {/* Bottom Navigation */}
          <div className="h-[70px] bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex items-center justify-center px-4 shrink-0 relative z-20">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:hover:bg-gray-100 px-5 py-3 rounded-xl font-bold transition-colors"
              >
                <FaChevronLeft className="mr-2" /> Previous
              </button>
              
              <div className="flex flex-col items-center justify-center min-w-[80px]">
                <span className="text-sm font-bold text-[#1e293b]">Page {pageNumber}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">of {numPages || '--'}</span>
              </div>
              
              <button 
                onClick={() => changePage(1)}
                disabled={pageNumber >= (numPages || 1)}
                className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:hover:bg-gray-100 px-5 py-3 rounded-xl font-bold transition-colors"
              >
                Next <FaChevronRight className="ml-2" />
              </button>
            </div>
          </div>
          
        </div>
      )}

      {/* Clipped Image Modal */}
      {clippedImage && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-[#1e293b] flex items-center"><FaCut className="mr-2 text-brand-red" /> News Clip</h3>
              <button onClick={() => setClippedImage(null)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 flex justify-center items-center overflow-auto max-h-[60vh]">
              <img src={clippedImage} alt="News Clip" className="max-w-full h-auto shadow-md border border-gray-200" />
            </div>
            
            <div className="p-4 bg-white flex flex-col sm:flex-row gap-3">
              <button 
                onClick={shareClippedImage}
                className="flex-1 flex items-center justify-center bg-[#25D366] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#1da851] transition-colors"
              >
                <FaShareAlt className="mr-2" /> Share Clip
              </button>
              <button 
                onClick={downloadClippedImage}
                className="flex-1 flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <FaDownload className="mr-2" /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HD Reading View Modal */}
      {zoomedReadingOpen && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl h-[85vh] md:h-[80vh] overflow-hidden flex flex-col shadow-2xl relative">
            {/* Header */}
            <div className="h-[60px] bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 shrink-0 relative z-20">
              <h3 className="font-bold text-lg flex items-center text-gray-800"><FaSearchPlus className="mr-2 text-brand-red" /> Reading View</h3>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={async () => {
                    if (navigator.share && hdImageSrc) {
                      const res = await fetch(hdImageSrc);
                      const blob = await res.blob();
                      const file = new File([blob], `screenshot.jpg`, { type: 'image/jpeg' });
                      if (navigator.canShare({ files: [file] })) {
                        navigator.share({ title: 'News Screenshot', files: [file] });
                      }
                    }
                  }}
                  className="text-gray-500 hover:text-[#25D366] transition-colors p-2 rounded-full hover:bg-gray-100"
                  title="Share Screenshot"
                >
                  <FaShareAlt size={18} />
                </button>
                <a 
                  href={hdImageSrc}
                  download="screenshot.jpg"
                  className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                  title="Download Screenshot"
                >
                  <FaDownload size={18} />
                </a>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button onClick={() => setZoomedReadingOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100">
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            {/* HD Document Container */}
            <div className="flex-1 overflow-hidden relative bg-gray-100 w-full h-full">
              <TransformWrapper
                ref={transformComponentRef}
                initialScale={1}
                minScale={0.5}
                maxScale={5}
                limitToBounds={false}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
                panning={{ disabled: false, velocityDisabled: false }}
                pinch={{ disabled: false }}
                doubleClick={{ disabled: true }}
                style={{ width: '100%', height: '100%' }}
              >
                <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {hdImageSrc ? (
                    <img 
                      src={hdImageSrc}
                      alt="HD Page Snapshot"
                      className="shadow-md"
                      style={{ maxWidth: '100%', height: 'auto' }}
                      onLoad={(e) => {
                        if (transformComponentRef.current) {
                          const { setTransform, instance } = transformComponentRef.current;
                          const wrapper = instance.wrapperComponent;
                          const imgEl = e.target;
                          
                          if (imgEl && wrapper) {
                            const containerW = wrapper.clientWidth;
                            const containerH = wrapper.clientHeight;
                            const scale = 2.0; // Zoom in to 2x for reading
                            const targetX = -((imgEl.clientWidth * scale * zoomTargetPos.x) - (containerW / 2));
                            const targetY = -((imgEl.clientHeight * scale * zoomTargetPos.y) - (containerH / 2));
                            
                            setTransform(targetX, targetY, scale, 0);
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 font-bold">Loading...</div>
                  )}
                </TransformComponent>
              </TransformWrapper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Epaper;
