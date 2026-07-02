import { useState, useEffect, useRef } from 'react';
import { fetchNews, fetchTrendingNews } from '../services/api';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ShareModal from '../components/ShareModal';
import MobileBottomNav from '../components/MobileBottomNav';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import {
  FaArrowLeft, FaFire, FaHeart, FaRegHeart,
  FaBookmark, FaRegBookmark, FaShareAlt, FaClock, FaWhatsapp
} from 'react-icons/fa';

const toIST = (raw) => {
  if (!raw) return '';
  return new Date(raw).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

function NewsCard({ article, isTrending, liked, bookmarked, onLike, onBookmark, onShare }) {
  const [loaded, setLoaded] = useState(false);
  if (!article) return null;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: '#0f172a', overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        flex: '0 0 54%',
        position: 'relative',
        background: '#1e293b',
        overflow: 'hidden',
      }}>
        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg,#1e293b 25%,#2d3f55 50%,#1e293b 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        )}
        <img
          src={article.image || 'https://placehold.co/800x480/1e293b/2d3f55?text='}
          alt={article.title}
          draggable={false}
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 90,
          background: 'linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to top,#0f172a,transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 14, left: 14,
          display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <span style={{
            background: '#b00020', color: '#fff',
            fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
            padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase',
          }}>
            {article.category || 'వార్తలు'}
          </span>
          {isTrending && (
            <span style={{
              background: 'linear-gradient(135deg,#f97316,#ef4444)',
              color: '#fff', fontSize: 10, fontWeight: 900,
              padding: '3px 9px', borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <FaFire size={8} /> TRENDING
            </span>
          )}
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        padding: '14px 18px 0',
        background: '#0f172a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <FaClock size={10} color="#475569" />
          <span style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>
            {toIST(article.created_at)}
          </span>
        </div>

        <Link to={`/article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{
            fontSize: 19, fontWeight: 800, color: '#f1f5f9',
            lineHeight: 1.35, marginBottom: 10,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          }}>
            {article.title}
          </h2>
        </Link>

        <p style={{
          fontSize: 13, color: '#94a3b8', lineHeight: 1.6,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 5, WebkitBoxOrient: 'vertical',
          marginBottom: 8
        }}>
          {article.excerpt || (article.content ? article.content.replace(/<[^>]*>?/gm, '') : '')}
        </p>
        
        <Link 
          to={`/article/${article.slug}`} 
          style={{
            color: '#b00020', fontSize: 13, fontWeight: 700, 
            textDecoration: 'none', display: 'inline-block',
            marginTop: 'auto', paddingBottom: 10
          }}
        >
          మరింత చదవండి &rarr;
        </Link>
      </div>

      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px 12px',
        background: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }} />
    </div>
  );
}

function InteractiveCard({ article, prevCard, nextCard, onPaginate, isTrending, liked, bookmarked, onLike, onBookmark, onShare, handleWheel }) {
  const y = useMotionValue(0);
  const controls = useAnimation();

  // Advanced Page Curl / Fold Effect
  // If dragging up (y < 0), the origin is top-left, simulating pulling from the bottom-right corner.
  // If dragging down (y > 0), the origin is bottom-left, simulating pulling from the top-right corner.
  const transformOrigin = useTransform(y, v => v < 0 ? "top left" : "bottom left");
  
  // rotateX: Folds the page vertically (bottom up, or top down)
  const rotateX = useTransform(y, [-500, 0, 500], [75, 0, -75]);
  
  // rotateY: Curls the right edge inward
  const rotateY = useTransform(y, [-500, 0, 500], [25, 0, -25]);
  
  // rotateZ: Tilts the page slightly to emphasize the corner being pulled
  const rotateZ = useTransform(y, [-500, 0, 500], [-10, 0, 10]);
  
  // Scale down slightly while folding to simulate distance
  const scale = useTransform(y, [-500, 0, 500], [0.85, 1, 0.85]);
  
  // Reveal background cards while dragging
  const nextOpacity = useTransform(y, [-100, 0], [1, 0]);
  const prevOpacity = useTransform(y, [0, 100], [0, 1]);
  const nextScale = useTransform(y, [-300, 0], [1, 0.9]);
  const prevScale = useTransform(y, [0, 300], [0.9, 1]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const handleDragEnd = async (e, { offset, velocity }) => {
    const swipe = swipePower(offset.y, velocity.y);
    if ((swipe < -swipeConfidenceThreshold || offset.y < -120) && nextCard) {
      await controls.start({ y: -800, opacity: 0, transition: { duration: 0.3 } });
      onPaginate(1);
    } else if ((swipe > swipeConfidenceThreshold || offset.y > 120) && prevCard) {
      await controls.start({ y: 800, opacity: 0, transition: { duration: 0.3 } });
      onPaginate(-1);
    } else {
      controls.start({ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    }
  };

  return (
    <div onWheel={handleWheel} style={{ position: 'absolute', inset: 0 }}>
      {/* Background PREV Card */}
      {prevCard && (
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: prevOpacity, scale: prevScale }}>
          <NewsCard article={prevCard} isTrending={isTrending} />
        </motion.div>
      )}

      {/* Background NEXT Card */}
      {nextCard && (
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: nextOpacity, scale: nextScale }}>
          <NewsCard article={nextCard} isTrending={isTrending} />
        </motion.div>
      )}

      {/* Foreground Interactive Card */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={1} // 1 = Free dragging 1:1 with finger
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          cursor: 'grab',
          zIndex: 2,
          y,
          rotateX,
          rotateY,
          rotateZ,
          scale,
          transformOrigin,
          perspective: 1500,
          boxShadow: useTransform(y, [-500, 0, 500], 
            ["20px 50px 30px rgba(0,0,0,0.5)", "0px 0px 0px rgba(0,0,0,0)", "20px -50px 30px rgba(0,0,0,0.5)"]
          )
        }}
        whileTap={{ cursor: 'grabbing' }}
        animate={controls}
        onDragEnd={handleDragEnd}
      >
        <NewsCard
          article={article}
          isTrending={isTrending}
          liked={liked}
          bookmarked={bookmarked}
          onLike={onLike}
          onBookmark={onBookmark}
          onShare={onShare}
        />
      </motion.div>
    </div>
  );
}

export default function Shorts({ type = 'news' }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [shareModal, setShareModal] = useState({ open: false, article: null });

  const isTrending = type === 'trending';

  useEffect(() => {
    setLoading(true);
    setNews([]);
    setActiveIdx(0);
    const fn = isTrending ? fetchTrendingNews : fetchNews;
    fn().then(setNews).catch(console.error).finally(() => setLoading(false));
  }, [type]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const paginate = (newDirection) => {
    if (activeIdx + newDirection >= 0 && activeIdx + newDirection < news.length) {
      setActiveIdx(activeIdx + newDirection);
    }
  };

  const wheelTimeout = useRef(null);
  const handleWheel = (e) => {
    if (wheelTimeout.current) return;
    if (e.deltaY > 50) {
      paginate(1);
      wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null }, 800);
    } else if (e.deltaY < -50) {
      paginate(-1);
      wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null }, 800);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isTrending ? 'Trending' : 'Latest News'} — Shabdham TV</title>
      </Helmet>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {loading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0f172a', gap: 14,
        }}>
          <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '3px solid #1e293b', borderTopColor: '#b00020',
            animation: 'spin 0.75s linear infinite',
          }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>లోడ్ అవుతోంది...</p>
        </div>
      )}

      {!loading && !news.length && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0f172a', color: '#fff', gap: 16,
        }}>
          <FaFire size={44} color="#f97316" />
          <p style={{ fontSize: 18, fontWeight: 700 }}>
            {isTrending ? 'ట్రెండింగ్ వార్తలు లేవు.' : 'వార్తలు అందుబాటులో లేవు.'}
          </p>
          <Link to="/" style={{ color: '#b00020', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            ← హోమ్కి వెళ్ళు
          </Link>
        </div>
      )}

      {!!news.length && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            background: '#000',
            touchAction: 'none',
            perspective: 1200,
          }}
        >
          {/* A unique key forces the InteractiveCard to unmount and remount when activeIdx changes, 
              giving the new card a fresh useMotionValue(0) */}
          <InteractiveCard
            key={activeIdx}
            article={news[activeIdx]}
            prevCard={activeIdx > 0 ? news[activeIdx - 1] : null}
            nextCard={activeIdx < news.length - 1 ? news[activeIdx + 1] : null}
            onPaginate={paginate}
            isTrending={isTrending}
            liked={!!liked[news[activeIdx]?.id]}
            bookmarked={!!saved[news[activeIdx]?.id]}
            onLike={() => setLiked(p => ({ ...p, [news[activeIdx].id]: !p[news[activeIdx].id] }))}
            onBookmark={() => setSaved(p => ({ ...p, [news[activeIdx].id]: !p[news[activeIdx].id] }))}
            onShare={() => setShareModal({ open: true, article: news[activeIdx] })}
            handleWheel={handleWheel}
          />
        </div>
      )}

      {/* ── Top header (floats above the scroll container) ── */}
      {!!news.length && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)',
          pointerEvents: 'none',
        }}>
          <Link to="/" style={{ color: '#fff', pointerEvents: 'auto', lineHeight: 1, padding: 4 }}>
            <FaArrowLeft size={18} />
          </Link>
          <span style={{
            color: '#fff', fontWeight: 800, fontSize: 12,
            letterSpacing: 2.5, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {isTrending && <FaFire style={{ color: '#f97316' }} size={12} />}
            {isTrending ? 'TRENDING' : 'LATEST NEWS'}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700 }}>
            {activeIdx + 1} / {news.length}
          </span>
        </div>
      )}

      {/* ── Side progress dots ── */}
      {!!news.length && (
        <div style={{
          position: 'fixed', right: 10, top: '50%',
          transform: 'translateY(-50%)', zIndex: 60,
          display: 'flex', flexDirection: 'column', gap: 5,
          pointerEvents: 'none',
        }}>
          {news
            .slice(Math.max(0, activeIdx - 3), Math.min(news.length, activeIdx + 4))
            .map((_, i) => {
              const ri = Math.max(0, activeIdx - 3) + i;
              return (
                <div key={ri} style={{
                  width: ri === activeIdx ? 7 : 4,
                  height: ri === activeIdx ? 7 : 4,
                  borderRadius: '50%',
                  background: ri === activeIdx ? '#b00020' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }} />
              );
            })}
        </div>
      )}

      {/* Floating WhatsApp Button (Mobile Only) */}
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed bottom-[80px] right-4 bg-[#25D366] text-white p-3 rounded-full shadow-lg z-40 hover:bg-[#20b858] transition-colors flex items-center justify-center"
      >
        <FaWhatsapp size={26} />
      </a>

      {/* ── Bottom nav ── */}
      <MobileBottomNav
        onWhatsAppClick={() => {
          const a = news[activeIdx];
          if (a) setShareModal({ open: true, article: a });
        }}
      />

      {/* ── Share modal ── */}
      <ShareModal
        isOpen={shareModal.open}
        onClose={() => setShareModal({ open: false, article: null })}
        url={news[activeIdx]
          ? `${window.location.origin}/article/${news[activeIdx].slug}`
          : ''}
        title={news[activeIdx]?.title || ''}
      />
    </>
  );
}
