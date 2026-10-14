import React, { useEffect, useState } from 'react';

interface TopNavProps {
  onOpenDemo: () => void;
  onNavigate: (path: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenDemo, onNavigate }) => {
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
