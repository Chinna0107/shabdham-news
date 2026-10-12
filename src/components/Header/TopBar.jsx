import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaCircle } from 'react-icons/fa';

const TopBar = () => {
  const [now, setNow] = useState(new Date());

  // Tick every second for live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formattedDate = now.toLocaleDateString('te-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0f1b6e 0%, #1a237e 50%, #0f1b6e 100%)',
      borderBottom: '2px solid #c8102e',
      padding: '5px 0',
    }}>
      <div style={{
        maxWidth: '100%',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>

        {/* Left — Live dot + Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-block',
              width: 7, height: 7,
              borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 0 2px rgba(239,68,68,0.3)',
              animation: 'topbar-pulse 1.4s ease-in-out infinite',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 9, fontWeight: 800, color: '#ef4444',
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}>LIVE</span>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />

          {/* Calendar icon + Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <FaCalendarAlt size={11} style={{ color: '#93c5fd', flexShrink: 0 }} />
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#e0e7ff',
              letterSpacing: 0.2,
              whiteSpace: 'nowrap',
            }}>
              {formattedDate}
            </span>
          </div>

          {/* Location — desktop only */}
          <div style={{ display: 'none' }} className="md-loc">
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <FaMapMarkerAlt size={11} style={{ color: '#93c5fd' }} />
              <span style={{ fontSize: 12, color: '#c7d2fe', fontWeight: 600 }}>తెలంగాణ</span>
            </div>
          </div>
        </div>

        {/* Right — Live digital clock */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '3px 12px',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{
              fontSize: 13, fontWeight: 800,
              color: '#ffffff',
              fontFamily: '"Courier New", monospace',
              letterSpacing: 1,
              minWidth: 90,
              textAlign: 'center',
            }}>
              {formattedTime}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes topbar-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        @media (min-width: 768px) {
          .md-loc { display: flex !important; align-items: center; gap: 10px; }
        }
      `}</style>
    </div>
  );
};

export default TopBar;
