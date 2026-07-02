import { useState, useEffect, useRef } from 'react';
import { fetchNews, fetchTrendingNews } from '../services/api';
import { FaArrowLeft, FaFire } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ShareModal from '../components/ShareModal';
import MobileBottomNav from '../components/MobileBottomNav';

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
const getISTTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setHours(d.getHours() + 5);
  d.setMinutes(d.getMinutes() + 30);
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

/* ─────────────────────────────────────────────────────────────
   CardContent — fills exactly one 100dvh slot
───────────────────────────────────────────────────────────── */
const CardContent = ({ article, isTrending }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    overflow: 'hidden',
    userSelect: 'none',
  }}>
    {/* ── TOP: image (55%) ── */}
    <div style={{
      position: 'relative',
      flex: '0 0 52%',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <img
        src={article.image || 'https://placehold.co/800x500?text=No+Image'}
        alt={article.title}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
      {/* bottom fade */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.18))',
        pointerEvents: 'none',
      }} />
      {/* badges */}
      <div style={{
        position: 'absolute', top: 56, left: 12,
        display: 'flex', gap: 6, alignItems: 'center',
      }}>
        <span style={{
          background: '#b00020', color: '#fff',
          fontSize: 11, fontWeight: 800,
          padding: '4px 10px', borderRadius: 20,
        }}>
          {article.category || 'న్యూస్'}
        </span>
        {isTrending && (
          <span style={{
            background: '#f97316', color: '#fff',
            fontSize: 10, fontWeight: 900,
            padding: '3px 8px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <FaFire size={9} /> TRENDING
          </span>
        )}
      </div>
    </div>

    {/* ── BOTTOM: text (48%) — NOT scrollable; we clamp text instead ── */}
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '14px 18px 78px',
      overflow: 'hidden',          /* no internal scroll — pager owns all touches */
      background: '#fff',
    }}>
      <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, fontWeight: 500 }}>
        {getISTTime(article.created_at)}
      </p>
      <Link
        to={`/article/${article.slug}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <h2 style={{
          fontSize: 19, fontWeight: 800,
          color: '#0f172a', lineHeight: 1.35, marginBottom: 10,
        }}>
          {article.title}
        </h2>
      </Link>
      <p style={{
        fontSize: 14, color: '#4b5563', lineHeight: 1.65,
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 5, WebkitBoxOrient: 'vertical',
      }}>
        {article.excerpt || article.content || ''}
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */
const SNAP_THRESHOLD = 0.22;  // fraction of vh
const SNAP_VELOCITY  = 0.3;   // px / ms
const ANIM_MS        = 300;

/* ─────────────────────────────────────────────────────────────
   Shorts — native vertical pager
───────────────────────────────────────────────────────────── */
const Shorts = ({ type = 'news' }) => {
  const [news, setNews]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [index, setIndex]       = useState(0);
  const [shareModal, setShareModal] = useState({ open: false, article: null });

  const isTrending = type === 'trending';

  /* ── refs (no stale-closure issues inside native listeners) ── */
  const containerRef = useRef(null);
  const trackRef     = useRef(null);
  const indexRef     = useRef(0);
  const newsRef      = useRef([]);
  const animRef      = useRef(false);
  const startRef     = useRef({ y: 0, t: 0 });
  const dragRef      = useRef(0);

  useEffect(() => { indexRef.current = index; }, [index]);
  useEffect(() => { newsRef.current  = news;  }, [news]);

  /* ── fetch ── */
  useEffect(() => {
    setLoading(true);
    setIndex(0);
    indexRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform  = 'translateY(0px)';
    }
    const fn = isTrending ? fetchTrendingNews : fetchNews;
    fn().then(setNews).catch(console.error).finally(() => setLoading(false));
  }, [type]);

  /* ── snap animation ── */
  const snapTo = (newIdx) => {
    const track = trackRef.current;
    if (!track || animRef.current) return;

    const total   = newsRef.current.length;
    const clamped = Math.max(0, Math.min(total - 1, newIdx));
    const vh      = window.innerHeight;

    animRef.current = true;
    track.style.transition = `transform ${ANIM_MS}ms cubic-bezier(0.25,0.46,0.45,0.94)`;
    track.style.transform  = `translateY(${-clamped * vh}px)`;

    setTimeout(() => {
      animRef.current = false;
      track.style.transition = 'none';
      setIndex(clamped);
      indexRef.current = clamped;
    }, ANIM_MS);
  };

  /* ── native touch listeners (must be passive:false to call preventDefault) ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e) => {
      if (animRef.current) return;
      const t = e.touches[0];
      startRef.current = { y: t.clientY, t: Date.now() };
      dragRef.current  = 0;
      if (trackRef.current) trackRef.current.style.transition = 'none';
    };

    const onMove = (e) => {
      if (animRef.current) return;
      e.preventDefault(); // ← stop browser scroll; requires passive:false

      const deltaY = e.touches[0].clientY - startRef.current.y;
      const idx    = indexRef.current;
      const total  = newsRef.current.length;
      const vh     = window.innerHeight;

      // rubber-band at edges
      let delta = deltaY;
      if ((idx === 0 && deltaY > 0) || (idx === total - 1 && deltaY < 0)) {
        delta = deltaY * 0.15;
      }

      dragRef.current = delta;
      if (trackRef.current) {
        trackRef.current.style.transform =
          `translateY(${-idx * vh + delta}px)`;
      }
    };

    const onEnd = () => {
      if (animRef.current) return;
      const elapsed  = Date.now() - startRef.current.t;
      const delta    = dragRef.current;
      const vh       = window.innerHeight;
      const velocity = Math.abs(delta) / Math.max(elapsed, 1);
      const idx      = indexRef.current;

      let next = idx;
      if (delta < -vh * SNAP_THRESHOLD || (delta < -5 && velocity > SNAP_VELOCITY)) {
        next = idx + 1;
      } else if (delta > vh * SNAP_THRESHOLD || (delta > 5 && velocity > SNAP_VELOCITY)) {
        next = idx - 1;
      }

      snapTo(next);
    };

    // capture:true → we intercept BEFORE any child (e.g. inner div) sees the event
    // passive:false on touchmove → lets us call e.preventDefault() to block browser scroll
    el.addEventListener('touchstart', onStart, { passive: true,  capture: true });
    el.addEventListener('touchmove',  onMove,  { passive: false, capture: true });
    el.addEventListener('touchend',   onEnd,   { passive: true,  capture: true });

    return () => {
      el.removeEventListener('touchstart', onStart, { capture: true });
      el.removeEventListener('touchmove',  onMove,  { capture: true });
      el.removeEventListener('touchend',   onEnd,   { capture: true });
    };
  }, []); // runs once — handlers read refs, not state

  /* ── mouse-wheel (desktop) ── */
  useEffect(() => {
    let timer = null;
    const onWheel = (e) => {
      e.preventDefault();
      if (animRef.current) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const idx = indexRef.current;
        if (e.deltaY > 0) snapTo(idx + 1);
        else              snapTo(idx - 1);
      }, 50);
    };
    const el = containerRef.current;
    if (el) el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      if (el) el.removeEventListener('wheel', onWheel);
      clearTimeout(timer);
    };
  }, []);

  /* ── keyboard ── */
  useEffect(() => {
    const onKey = (e) => {
      if (animRef.current) return;
      const idx = indexRef.current;
      if (e.key === 'ArrowDown') { e.preventDefault(); snapTo(idx + 1); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); snapTo(idx - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ── loading / empty states ── */
  if (loading) return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#000', color: '#fff', fontSize: 18, fontWeight: 600,
    }}>
      లోడ్ అవుతోంది...
    </div>
  );

  if (!news.length) return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#000', color: '#fff', gap: 16,
    }}>
      <FaFire size={40} color="#fb923c" />
      <p style={{ fontSize: 18, fontWeight: 700 }}>
        {isTrending ? 'ట్రెండింగ్ వార్తలు లేవు.' : 'వార్తలు అందుబాటులో లేవు.'}
      </p>
      <Link to="/" style={{ color: '#9ca3af', fontSize: 14 }}>← హోమ్కి వెళ్ళు</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{isTrending ? 'Trending' : 'Flip'} - Shabdham TV</title>
      </Helmet>

      {/* ── Full-screen pager container ── */}
      <div
        ref={containerRef}
        className="shorts-container"
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          background: '#000',
          /* touch-action set in CSS below so passive:false works reliably */
        }}
      >
        {/* ── Sliding track: all cards stacked vertically ── */}
        <div
          ref={trackRef}
          style={{
            width: '100%',
            height: `${news.length * 100}dvh`,
            transform: 'translateY(0px)',
            willChange: 'transform',
          }}
        >
          {news.map((article, i) => (
            <div
              key={article.id || i}
              style={{
                width: '100%',
                height: '100dvh',
                overflow: 'hidden',
                /* hide cards far from the active one to save memory */
                contentVisibility: Math.abs(i - index) > 2 ? 'hidden' : 'visible',
              }}
            >
              <CardContent article={article} isTrending={isTrending} />
            </div>
          ))}
        </div>

        {/* ── Top header overlay ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}>
          <Link to="/" style={{ color: '#fff', pointerEvents: 'auto', lineHeight: 1 }}>
            <FaArrowLeft size={20} />
          </Link>
          <span style={{
            color: '#fff', fontWeight: 800, fontSize: 13,
            letterSpacing: 2, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {isTrending && <FaFire style={{ color: '#fb923c' }} />}
            {isTrending ? 'TRENDING NEWS' : 'LATEST NEWS'}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>
            {index + 1} / {news.length}
          </span>
        </div>

        {/* ── Side progress dots ── */}
        <div style={{
          position: 'absolute', right: 10, top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {news
            .slice(Math.max(0, index - 3), Math.min(news.length, index + 4))
            .map((_, i) => {
              const ri = Math.max(0, index - 3) + i;
              return (
                <div key={ri} style={{
                  width:  ri === index ? 7 : 4,
                  height: ri === index ? 7 : 4,
                  borderRadius: '50%',
                  background: ri === index ? '#b00020' : 'rgba(255,255,255,0.38)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }} />
              );
            })}
        </div>

        {/* ── "Read more" pill above the bottom nav ── */}
        <div style={{
          position: 'absolute',
          bottom: 68,   /* sits just above the 60px bottom nav */
          left: 0, right: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 20px',
          pointerEvents: 'none',
        }}>
          <Link
            to={news[index] ? `/article/${news[index].slug}` : '#'}
            style={{
              pointerEvents: 'auto',
              background: '#b00020',
              color: '#fff',
              padding: '10px 28px',
              borderRadius: 28,
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
              letterSpacing: 0.3,
              boxShadow: '0 4px 16px rgba(176,0,32,0.35)',
            }}
          >
            మరింత చదవండి →
          </Link>
        </div>

        {/* ── Bottom nav (original, untouched) ── */}
        <MobileBottomNav
          onWhatsAppClick={() => {
            const a = news[index];
            if (a) setShareModal({ open: true, article: a });
          }}
        />
      </div>

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
};

export default Shorts;
