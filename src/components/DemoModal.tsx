import React, { useState } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    role: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.institution || !formData.role) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', institution: '', role: '' });
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 15, 36, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="modal"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '480px',
          width: '100%',
          padding: '36px 32px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
        }}
      >
        <button
          type="button"
          className="modal-x"
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#64748b',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {!submitted ? (
          <div id="demo-form-wrap">
            <span
              className="eyebrow eyebrow-dark"
              style={{
                display: 'inline-block',
                fontSize: '.72rem',
                fontWeight: 600,
                letterSpacing: '.28em',
                textTransform: 'uppercase',
                color: '#2563eb',
                marginBottom: '10px',
              }}
            >
              Demo portal access
            </span>
            <h2
              id="demo-title"
              style={{
                fontSize: '24px',
                fontFamily: "'Orbitron', sans-serif",
                color: '#0c1d3d',
                marginBottom: '8px',
              }}
            >
              Request a demo
            </h2>
            <p
              className="modal-sub"
              style={{
                color: '#5e7297',
                fontSize: '14px',
                marginBottom: '24px',
              }}
            >
              Tell us a little about your institution and we will set up demo portal access for you.
            </p>

            <form id="demo-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', fontWeight: 500, color: '#334155' }}>
                Full name
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', fontWeight: 500, color: '#334155' }}>
                Work email
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@school.edu"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', fontWeight: 500, color: '#334155' }}>
                Institution
                <input
                  type="text"
                  name="institution"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="School or college name"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', fontWeight: 500, color: '#334155' }}>
                I am a
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#fff',
                  }}
                >
                  <option value="" disabled>Select your role</option>
                  <option value="Principal / Administrator">Principal / Administrator</option>
                  <option value="Faculty">Faculty</option>
                  <option value="IT / Operations">IT / Operations</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <button
                type="submit"
                className="btn-login btn-block"
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                Request demo access <span aria-hidden="true">→</span>
              </button>
            </form>
          </div>
        ) : (
          <div id="demo-success" style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              className="success-hex"
              style={{
                width: '60px',
                height: '60px',
                lineHeight: '60px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                fontSize: '28px',
                margin: '0 auto 18px',
                fontWeight: 'bold',
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: '22px',
                fontFamily: "'Orbitron', sans-serif",
                color: '#0c1d3d',
                marginBottom: '10px',
              }}
            >
              Thank you!
            </h2>
            <p style={{ color: '#5e7297', fontSize: '14px', marginBottom: '24px' }}>
              Your request has been received. Our team will share your demo portal access shortly.
            </p>
            <button
              type="button"
              className="btn-login"
              onClick={handleClose}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
