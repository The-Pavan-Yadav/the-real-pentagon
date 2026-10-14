import React, { useEffect, useState } from 'react';

interface TopNavProps {
  onOpenDemo: () => void;
  onNavigate: (path: string) => void;
  onOpenAiCam?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenDemo, onNavigate, onOpenAiCam }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
      <a
        className="nav-logo"
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="THE PENTAGON - home"
      >
        <svg viewBox="-60 -64 120 128" width="38" height="40" aria-hidden="true">
          <defs>
            <linearGradient id="logoG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#60a5fa" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path
            d="M0 -60 L52 -30 L52 30 L0 60 L-52 30 L-52 -30 Z"
            fill="none"
            stroke="url(#logoG)"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path
            d="M0 -26 L22 -13 L22 13 L0 26 L-22 13 L-22 -13 Z"
            fill="url(#logoG)"
          />
        </svg>
        <span className="nav-brand-text">THE PENTAGON</span>
      </a>

      <nav className="nav-links" aria-label="Main navigation">
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          About Us
        </a>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Support
        </a>

        {/* AI Cam Button */}
        {onOpenAiCam && (
          <button
            className="nav-aicam-btn"
            id="nav-open-aicam"
            type="button"
            onClick={onOpenAiCam}
            title="Launch The Pentagon AI Cam"
            aria-label="Launch Pentagon AI Cam"
          >
            <span className="aicam-pulse-dot" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span>AI Cam</span>
          </button>
        )}

        <button
          className="nav-cta"
          id="open-demo"
          type="button"
          onClick={onOpenDemo}
        >
          Request Demo
        </button>
      </nav>
    </header>
  );
};
