import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTrendingNews } from '../services/api';
import { FaFire, FaTimes, FaClock, FaChevronRight } from 'react-icons/fa';

const toIST = (raw) => {
  if (!raw) return '';
  return new Date(raw).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
};

export default function TrendingPopup({ onClose }) {
  const [news, setNews]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchTrendingNews()
      .then(data => setNews(data.slice(0, 5)))
      .catch(console.error)
      .finally(() => setLoading(false));
    // Animate in
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <>
      <style>{`
        @keyframes slide-up-pop {
          from { transform: translateY(60px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes news-item-in {
          from { transform: translateX(-16px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        .trending-item:hover {
          background: #fff7f7 !important;
          transform: translateX(4px);
        }
        .trending-item {
          transition: background 0.18s, transform 0.18s !important;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 8000,
          background: 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.35s',
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 8001,
        background: '#ffffff',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        maxHeight: '88vh',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.35s cubic-bezier(0.34,1.1,0.64,1), opacity 0.35s',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        opacity: visible ? 1 : 0,
        overflowY: 'hidden',
      }}>

        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 10, background: '#e2e8f0' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px 12px',
          borderBottom: '1px solid #f1f5f9',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#c8102e,#f97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FaFire size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                ట్రెండింగ్ వార్తలు
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                Today's top stories
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: 'none', background: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
            aria-label="Close"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* News list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0 24px' }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, padding: '14px 20px',
                animation: `news-item-in 0.3s ease ${i * 0.07}s both`,
              }}>
                <div style={{ width: 76, height: 56, borderRadius: 10, background: '#f1f5f9', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ height: 12, borderRadius: 6, background: '#f1f5f9', width: '85%' }} />
                  <div style={{ height: 12, borderRadius: 6, background: '#f1f5f9', width: '60%' }} />
                </div>
              </div>
            ))
          ) : news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: 14 }}>
              ట్రెండింగ్ వార్తలు అందుబాటులో లేవు.
            </div>
          ) : (
            news.map((item, i) => (
              <Link
                key={item.id}
                to={`/article/${item.slug}`}
                onClick={handleClose}
                className="trending-item"
                style={{
                  display: 'flex', gap: 14, padding: '13px 20px',
                  textDecoration: 'none', color: 'inherit',
                  borderBottom: i < news.length - 1 ? '1px solid #f8fafc' : 'none',
                  animation: `news-item-in 0.35s ease ${i * 0.08}s both`,
                  cursor: 'pointer',
                  alignItems: 'center',
                }}
              >
                {/* Rank badge */}
                <div style={{
                  flexShrink: 0,
                  width: 26, height: 26, borderRadius: 8,
                  background: i === 0 ? 'linear-gradient(135deg,#c8102e,#f97316)' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  color: i === 0 ? '#fff' : '#94a3b8',
                  alignSelf: 'flex-start',
                  marginTop: 2,
                }}>
                  {i + 1}
                </div>

                {/* Thumbnail */}
                <div style={{
                  width: 80, height: 60, borderRadius: 10,
                  overflow: 'hidden', flexShrink: 0,
                  background: '#f1f5f9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FaFire size={18} color="#cbd5e1" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {item.category && (
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: '#c8102e',
                      textTransform: 'uppercase', letterSpacing: 0.8,
                    }}>
                      {item.category}
                    </span>
                  )}
                  <span style={{
                    fontSize: 13.5, fontWeight: 700, color: '#0f172a',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {item.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaClock size={9} color="#94a3b8" />
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
                      {toIST(item.created_at)}
                    </span>
                  </div>
                </div>

                <FaChevronRight size={12} color="#cbd5e1" style={{ flexShrink: 0 }} />
              </Link>
            ))
          )}
        </div>

        {/* Footer CTA */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #f1f5f9',
          flexShrink: 0,
        }}>
          <Link
            to="/trending"
            onClick={handleClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '13px 0',
              background: 'linear-gradient(135deg,#c8102e,#a50026)',
              color: '#fff', borderRadius: 14,
              fontSize: 14, fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(200,16,46,0.3)',
              letterSpacing: 0.3,
            }}
          >
            <FaFire size={13} /> అన్ని ట్రెండింగ్ వార్తలు చూడండి
          </Link>
        </div>
      </div>
    </>
  );
}
