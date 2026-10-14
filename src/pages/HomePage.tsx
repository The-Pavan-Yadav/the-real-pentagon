import React, { useEffect, useState } from 'react';
import { ThreeBrain } from '../components/ThreeBrain';
import { TopNav } from '../components/TopNav';
import { DemoModal } from '../components/DemoModal';
import { AiCamView } from '../components/AiCamView';
import { UserRole } from '../types';

interface HomePageProps {
  onNavigateAuth: (role: UserRole, isSignup?: boolean) => void;
  onNavigatePortal: (view: string) => void;
  initialAiCamOpen?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateAuth, initialAiCamOpen = false }) => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [aiCamOpen, setAiCamOpen] = useState(initialAiCamOpen);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteFading, setQuoteFading] = useState(false);

  // Sync if hash has aicam
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'aicam' || h === 'ai-cam') {
        setAiCamOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const QUOTES = [
    'Education turns curiosity into capability, and capability into a brighter tomorrow.',
    'Every classroom is a doorway, and every educated mind opens a hundred more.',
    'The finest investment a society can make is in the minds that will build its future.',
    'Knowledge shared is knowledge multiplied: that is how a community learns to rise.',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteFading(true);
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
        setQuoteFading(false);
      }, 700);
    }, 7000);

    return () => clearInterval(timer);
  }, [QUOTES.length]);

  return (
    <div className="home-page-root" style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* 3D Brain Background */}
      <ThreeBrain />

      {/* Navigation */}
      <TopNav
        onOpenDemo={() => setDemoOpen(true)}
        onNavigate={() => {}}
        onOpenAiCam={() => setAiCamOpen(true)}
      />

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="hero-eyebrow">A NEW DIMENSION IN EDUCATION</span>
              <h1 className="brand">THE PENTAGON</h1>
              <p className="powered">
                An intelligent learning ecosystem
                <span className="powered-divider">|</span>
                by <b>NightBerrieZ</b>
              </p>
              <p className="hero-description">
                Bringing students, educators and institutions together through connected learning,
                meaningful insights and smarter digital experiences.
              </p>

              <div className="quote-wrap">
                <span className="quote-label">WHY EDUCATION MATTERS</span>
                <blockquote
                  className={`quote ${quoteFading ? 'fade' : ''}`}
                  id="quote"
                  style={{
                    opacity: quoteFading ? 0 : 1,
                    transition: 'opacity 0.7s ease',
                  }}
                >
                  {QUOTES[quoteIdx]}
                </blockquote>
              </div>

              <div className="hero-cta-group">
                <a
                  href="#about"
                  className="hero-explore"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore the platform <span aria-hidden="true">→</span>
                </a>

                <button
                  type="button"
                  className="hero-aicam-btn"
                  id="hero-open-aicam"
                  onClick={() => setAiCamOpen(true)}
                  title="Launch The Pentagon AI Cam"
                >
                  <span className="aicam-pulse-dot" />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Launch AI Cam</span>
                  <span className="hero-aicam-badge">LIVE HUB</span>
                </button>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-visual-glow" />
              <div className="brain-caption">
                <span className="brain-caption-dot" />
                CONNECTING KNOWLEDGE
              </div>
            </div>
          </div>

          <a
            className="scroll-cue"
            href="#about"
            aria-label="Scroll down"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span />
          </a>
        </section>

        {/* ABOUT */}
        <section className="section about" id="about">
          <div className="about-card in">
            <div className="about-copy">
              <span className="eyebrow">About the platform</span>
              <h2 className="about-title">THE PENTAGON</h2>
              <p className="about-text">
                Where every student, teacher, resource, and classroom insight comes together—creating a
                connected digital ecosystem built for smarter learning and better education.
              </p>
              <ul className="chips" aria-label="What connects on the platform">
                <li>Students</li>
                <li>Teachers</li>
                <li>Resources</li>
                <li>Insights</li>
              </ul>
            </div>
            <div className="about-art" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 460 300" width="100%" height="auto" style={{ maxWidth: '420px' }}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Center Node */}
                <circle cx="230" cy="150" r="48" fill="url(#netGrad)" filter="url(#glow)" />
                <path d="M230 118 L260 138 L248 174 L212 174 L200 138 Z" fill="#ffffff" />
                <text x="230" y="215" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                  THE PENTAGON
                </text>

                {/* Connecting lines */}
                <line x1="230" y1="150" x2="90" y2="70" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="230" y1="150" x2="370" y2="70" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="230" y1="150" x2="100" y2="230" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="230" y1="150" x2="360" y2="230" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4,4" />

                {/* Satellite Nodes */}
                <g transform="translate(90, 70)">
                  <circle cx="0" cy="0" r="32" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="600">Students</text>
                </g>
                <g transform="translate(370, 70)">
                  <circle cx="0" cy="0" r="32" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="600">Teachers</text>
                </g>
                <g transform="translate(100, 230)">
                  <circle cx="0" cy="0" r="32" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="600">Resources</text>
                </g>
                <g transform="translate(360, 230)">
                  <circle cx="0" cy="0" r="32" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="600">Insights</text>
                </g>
              </svg>
            </div>
          </div>
        </section>

        {/* PORTAL LOGINS */}
        <section className="section access" id="access">
          <div className="container">
            <header className="section-head in">
              <span className="eyebrow eyebrow-dark">Secure access</span>
              <h2 className="section-title">Choose your portal</h2>
              <p className="section-sub">
                Sign in with the role that fits you. Each portal is tailored to what you need.
              </p>
            </header>

            <div className="portal-grid">
              {/* Student Portal */}
              <article className="portal in" style={{ '--c1': '#2563eb', '--c2': '#1d4ed8' } as React.CSSProperties}>
                <div className="portal-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4 2 9l10 5 10-5-10-5z" />
                    <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
                    <path d="M22 9v6" />
                  </svg>
                </div>
                <h3>Students Login</h3>
                <p>Classes, resources, assignments and your learning progress in one place.</p>
                <button
                  type="button"
                  className="btn-login"
                  onClick={() => onNavigateAuth('student')}
                >
                  Login <span aria-hidden="true">→</span>
                </button>
              </article>

              {/* Faculty Portal */}
              <article className="portal in" style={{ '--c1': '#2563eb', '--c2': '#1d4ed8' } as React.CSSProperties}>
                <div className="portal-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M12 16v4M8 20h8M7 12l3-3 3 2 4-4" />
                  </svg>
                </div>
                <h3>Faculty Login</h3>
                <p>Plan lessons, share material and understand your classroom at a glance.</p>
                <button
                  type="button"
                  className="btn-login"
                  onClick={() => onNavigateAuth('faculty')}
                >
                  Login <span aria-hidden="true">→</span>
                </button>
              </article>

              {/* School Admin Portal */}
              <article className="portal in" style={{ '--c1': '#2563eb', '--c2': '#1d4ed8' } as React.CSSProperties}>
                <div className="portal-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18M5 21V9l7-5 7 5v12" />
                    <path d="M9 21v-6h6v6M9 11h.01M15 11h.01" />
                  </svg>
                </div>
                <h3>School Administration Login</h3>
                <p>Oversee departments, people and institution-wide performance.</p>
                <button
                  type="button"
                  className="btn-login"
                  onClick={() => onNavigateAuth('school')}
                >
                  Login <span aria-hidden="true">→</span>
                </button>
              </article>

              {/* Admin Portal */}
              <article className="portal in" style={{ '--c1': '#2563eb', '--c2': '#1d4ed8' } as React.CSSProperties}>
                <div className="portal-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3>Admin Login</h3>
                <p>Platform control, access management and system-level configuration.</p>
                <button
                  type="button"
                  className="btn-login"
                  onClick={() => onNavigateAuth('admin')}
                >
                  Login <span aria-hidden="true">→</span>
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="section benefits" id="benefits">
          <div className="container benefits-grid">
            <div className="benefits-copy">
              <header className="in">
                <span className="eyebrow eyebrow-dark">Benefits</span>
                <h2 className="section-title">Why institutions choose THE PENTAGON</h2>
              </header>

              <ol className="benefit-list">
                <li className="in">
                  <span className="badge">1</span>
                  <div>
                    <h3>One connected campus</h3>
                    <p>Students, teachers, resources and records live in a single digital ecosystem.</p>
                  </div>
                </li>
                <li className="in">
                  <span className="badge">2</span>
                  <div>
                    <h3>Classroom insights in real time</h3>
                    <p>Clear, actionable views of engagement, attendance and progress.</p>
                  </div>
                </li>
                <li className="in">
                  <span className="badge">3</span>
                  <div>
                    <h3>Less paperwork, more teaching</h3>
                    <p>Everyday administrative tasks become simple, fast and organised.</p>
                  </div>
                </li>
                <li className="in">
                  <span className="badge">4</span>
                  <div>
                    <h3>Secure, role-based access</h3>
                    <p>Every person sees exactly what they need, and nothing more.</p>
                  </div>
                </li>
                <li className="in">
                  <span className="badge">5</span>
                  <div>
                    <h3>Learning that goes beyond the classroom</h3>
                    <p>Resources and support are available whenever learners need them.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="benefits-art in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  borderRadius: '16px',
                  padding: '24px',
                  width: '100%',
                  maxWidth: '440px',
                  color: '#fff',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>
                    Institutional Dashboard
                  </span>
                  <span style={{ fontSize: '11px', background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                    LIVE
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                    <small style={{ color: '#94a3b8', fontSize: '12px' }}>Attendance Rate</small>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#38bdf8', marginTop: '4px' }}>96.8%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                    <small style={{ color: '#94a3b8', fontSize: '12px' }}>Resource Engagement</small>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#a855f7', marginTop: '4px' }}>88.4%</div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#cbd5e1' }}>
                    <span>Syllabus Completion</span>
                    <span>78%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <div className="footer-inner">
          <nav className="footer-left" aria-label="Legal">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Use</a>
          </nav>
          <div className="footer-right">
            <a href="mailto:contact@nightberries.com">Contact NightBerrieZ</a>
          </div>
        </div>
      </footer>

      {/* Request Demo Pop-up */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Dedicated Full-Screen AI Cam Interface */}
      {aiCamOpen && (
        <AiCamView
          onClose={() => {
            setAiCamOpen(false);
            if (window.location.hash === '#aicam' || window.location.hash === '#ai-cam') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      )}
    </div>
  );
};
