import { useEffect, useState } from 'react';
import logo from './Admin/logo.jpeg';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter | hold | exit

  useEffect(() => {
    // enter animation: 600ms, hold 1.2s, exit 500ms
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('exit'), 1800);
    const t3 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#ffffff',
      transition: 'opacity 0.5s ease',
      opacity: phase === 'exit' ? 0 : 1,
      pointerEvents: phase === 'exit' ? 'none' : 'auto',
    }}>
      {/* Animated background rings */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: i * 220,
            height: i * 220,
            borderRadius: '50%',
            border: `1.5px solid rgba(200,16,46,${0.08 / i})`,
            animation: `pulse-ring 2s ease-out ${i * 0.3}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes splash-in {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes pulse-ring {
          0%   { transform: translate(-50%,-50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(1.4); opacity: 0; }
        }
        @keyframes shimmer-bar {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes fade-up {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Logo card */}
      <div style={{
        animation: 'splash-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 110, height: 110, borderRadius: 28,
          background: '#fff',
          boxShadow: '0 20px 60px rgba(200,16,46,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          border: '2px solid rgba(200,16,46,0.12)',
        }}>
          <img src={logo} alt="Shabdham TV" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
        </div>

        <div style={{ textAlign: 'center', animation: 'fade-up 0.5s ease 0.3s both' }}>
          <div style={{
            fontSize: 26, fontWeight: 900, color: '#1e293b',
            letterSpacing: '-0.5px', lineHeight: 1.1,
          }}>శబ్దం TV</div>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#94a3b8',
            letterSpacing: 3, textTransform: 'uppercase', marginTop: 4,
          }}>Telugu News</div>
        </div>

        {/* Loading bar */}
        <div style={{
          width: 120, height: 3, borderRadius: 10,
          background: '#f1f5f9', overflow: 'hidden',
          animation: 'fade-up 0.5s ease 0.4s both',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg,#c8102e,#f97316)',
            borderRadius: 10,
            transformOrigin: 'left center',
            animation: 'shimmer-bar 1.4s ease 0.3s forwards',
            transform: 'scaleX(0)',
          }} />
        </div>
      </div>
    </div>
  );
}
