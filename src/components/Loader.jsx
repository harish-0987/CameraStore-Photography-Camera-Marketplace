import React from 'react';
import { Camera } from 'lucide-react';

const Loader = ({ text = "Loading Photography Gear..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      gap: '16px'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f97316 0%, #38bdf8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        boxShadow: '0 0 25px rgba(249, 115, 22, 0.5)'
      }}>
        <Camera size={26} color="#ffffff" />
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>{text}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg) scale(0.9); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
