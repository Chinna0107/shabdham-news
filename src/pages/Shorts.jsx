import { useState, useEffect, useRef } from 'react';
import { fetchNews, fetchTrendingNews } from '../services/api';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ShareModal from '../components/ShareModal';
import MobileBottomNav from '../components/MobileBottomNav';
import {
  FaArrowLeft, FaFire, FaHeart, FaRegHeart,
  FaBookmark, FaRegBookmark, FaShareAlt, FaClock,
} from 'react-icons/fa';

/* ─────────────────────────────────────────────────────────────
   Time helper
───────────────────────────────────────────────────────────── */
const toIST = (raw) => {
  if (!raw) return '';
  return new Date(raw).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

/* ─────────────────────────────────────────────────────────────
   Single news card — fills exactly 100vh
───────────────────────────────────────────────────────────── */
function NewsCard({ article, isTrending, liked, bookmarked, onLike, onBookmark, onShare }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: '#0f172a', overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Hero image — top 54% ── */}
      <div style={{
        flex: '0 0 54%',
        position: 'relative',
        background: '#1e293b',
        overflow: 'hidden',
      }}>
        {/* shimmer skeleton */}
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

        {/* top scrim */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 90,
          background: 'linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)',
          pointerEvents: 'none',
        }} />

        {/* bottom blend into card */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to top,#0f172a,transparent)',
          pointerEvents: 'none',
        }} />

        {/* badges */}
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

      {/* ── Text content ── */}
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
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {article.excerpt || article.content || ''}
        </p>
      </div>

      {/* ── Action bar ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px 12px',
        background: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link
          to={`/article/${article.slug}`}
          style={{
            background: '#b00020', color: '#fff',
            padding: '8px 18px', borderRadius: 22,
            fontSize: 12, fontWeight: 800,
            textDecoration: 'none', letterSpacing: 0.3,
            boxShadow: '0 3px 12px rgba(176,0,32,0.4)',
          }}
        >
          మరింత చదవండి →
        </Link>

        <div style={{ display: 'flex', gap: 2 }}>
          {[
            {
              icon: liked
                ? <FaHeart color="#ef4444" size={17} />
                : <FaRegHeart color="#64748b" size={17} />,
              label: 'Like', action: onLike,
            },
            {
              icon: bookmarked
                ? <FaBookmark color="#f59e0b" size={15} />
                : <FaRegBookmark color="#64748b" size={15} />,
              label: 'Save', action: onBookmark,
            },
            {
              icon: <FaShareAlt color="#64748b" size={15} />,
              label: 'Share', action: onShare,
            },
          ].map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none', borderRadius: 12,
                width: 42, height: 42,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', gap: 2,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {icon}
              <span style={{ fontSize: 8, color: '#475569', fontWeight: 700 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Shorts — CSS Scroll Snap pager

   HOW IT WORKS:
   • A single fixed div with overflowY:'scroll' + scrollSnapType:'y mandatory'
   • Each slide has scrollSnapAlign:'start' + scrollSnapStop:'always'
   • The BROWSER handles all touch tracking, velocity, and snapping natively
   • This is identical to what Way2News / TikTok do on the web
   • A scroll listener + Math.round(scrollTop / vh) tracks the active index
───────────────────────────────────────────────────────────── */
export default function Shorts({ type = 'news' }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [shareModal, setShareModal] = useState({ open: false, article: null });

  const scrollRef = useRef(null);   // the snap container
  const rafRef = useRef(null);   // requestAnimationFrame id
  const isTrending = type === 'trending';

  /* ── fetch ── */
  useEffect(() => {
    setLoading(true);
    setNews([]);
    setActiveIdx(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    const fn = isTrending ? fetchTrendingNews : fetchNews;
    fn().then(setNews).catch(console.error).finally(() => setLoading(false));
  }, [type]);

  /* ── track which slide is visible via scroll events ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !news.length) return;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const idx = Math.round(el.scrollTop / vh);
        setActiveIdx(Math.max(0, Math.min(news.length - 1, idx)));
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [news.length]);

  /* ── Disable body scroll while on this page ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <>
      <Helmet>
        <title>{isTrending ? 'Trending' : 'Latest News'} — Shabdham TV</title>
      </Helmet>

      {/* Keyframe for shimmer skeleton */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ── Loading ── */}
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
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>
            లోడ్ అవుతోంది...
          </p>
        </div>
      )}

      {/* ── Empty ── */}
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

      {/* ── Snap scroll container ── */}
      {!!news.length && (
        <div
          ref={scrollRef}
          style={{
            position: 'fixed',
            inset: 0,
            overflowY: 'scroll',
            /* CSS Scroll Snap — this is what makes each card snap to full-screen */
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',   // smooth on older iOS
            /* hide the scrollbar */
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            .snap-scroll-hide::-webkit-scrollbar { display: none; }
          `}</style>

          {news.map((article, i) => (
            <div
              key={article.id || i}
              style={{
                /* Each slide occupies exactly one full screen */
                height: '100vh',
                /* Snap this element to the top of the scroll container */
                scrollSnapAlign: 'start',
                /* Prevent the browser skipping to next slide on fast swipe */
                scrollSnapStop: 'always',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <NewsCard
                article={article}
                isTrending={isTrending}
                liked={!!liked[article.id]}
                bookmarked={!!saved[article.id]}
                onLike={() => setLiked(p => ({ ...p, [article.id]: !p[article.id] }))}
                onBookmark={() => setSaved(p => ({ ...p, [article.id]: !p[article.id] }))}
                onShare={() => setShareModal({ open: true, article })}
              />
            </div>
          ))}
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
        url={shareModal.article
          ? `${window.location.origin}/article/${shareModal.article.slug}`
          : ''}
        title={shareModal.article?.title || ''}
      />
    </>
  );
}
