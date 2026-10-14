import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div
      id="toast"
      role="status"
      className="on"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        padding: '10px 22px',
        borderRadius: '999px',
        fontSize: '13.5px',
        fontWeight: 500,
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.15)',
        zIndex: 99999,
        transition: 'all 0.25s ease',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
};
