import React, { useEffect, useState } from 'react';
import { ThreeBrain } from '../components/ThreeBrain';
import { TopNav } from '../components/TopNav';
import { DemoModal } from '../components/DemoModal';
import { UserRole } from '../types';
import {
  IconArrowRight,
  IconSparkles,
  IconSchool,
  IconChalkboard,
  IconBuildingBank,
  IconShieldLock,
  IconActivity,
  IconTrendingUp,
  IconAlertTriangle,
  IconCheck,
  IconChartBar,
  IconBroadcast,
  IconLayersLinked,
  IconUsers,
  IconDeviceLaptop,
  IconCalendar,
} from '@tabler/icons-react';

interface HomePageProps {
  onNavigateAuth: (role: UserRole, isSignup?: boolean) => void;
  onNavigatePortal: (view: string) => void;
  onWatchIntro?: () => void;
}

type DashboardTab = 'composite' | 'insights' | 'risk' | 'classrooms';

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateAuth,
  onWatchIntro,
}) => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteFading, setQuoteFading] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('composite');

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
      }, 500);
    }, 6500);

    return () => clearInterval(timer);
  }, [QUOTES.length]);

  return (
    <div className="hp-root">
      {/* 3D Brain Background with restrained opacity */}
      <ThreeBrain />

      {/* Navigation */}
      <TopNav onOpenDemo={() => setDemoOpen(true)} onNavigate={() => {}} />

      <main>
        {/* ==================== 1. HERO SECTION (Balanced Two-Column Layout) ==================== */}
        <section className="hp-hero" id="home">
          <div className="hp-container">
            <div className="hp-hero-grid">
              
              {/* ---------- LEFT COLUMN: Value Proposition & Institutional Controls ---------- */}
              <div className="hp-hero-left">
                {/* Eyebrow Status Badge */}
                <div className="hp-eyebrow-badge">
                  <span className="hp-eyebrow-pulse" aria-hidden="true" />
                  <span>State & Institutional Education Platform // Tier-4</span>
                </div>

                {/* Primary Brand & Balanced Heading */}
                <div>
                  <h1 className="hp-hero-title">
                    THE PENTAGON
                  </h1>
                  <p className="hp-hero-subtitle">
                    Unified Academic Intelligence & Connected Campus Infrastructure
                  </p>
                </div>

                {/* Author & System Credential */}
                <div className="hp-hero-author">
                  <span>Engineered for institutional governance & student success</span>
                  <span aria-hidden="true">•</span>
                  <span>Powered by <b>NightBerrieZ</b></span>
                </div>

                {/* Value Description */}
                <p className="hp-hero-desc">
                  Bridging students, educators, and institutional leadership through unified telemetry,
                  automated curriculum compliance, and predictive early-risk interventions across every
                  connected classroom.
                </p>

                {/* Prominent Action Buttons */}
                <div className="hp-cta-group">
                  <a
                    href="#access"
                    className="hp-btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>Explore Platform</span>
                    <IconArrowRight size={18} aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    className="hp-btn-secondary"
                    onClick={() => setDemoOpen(true)}
                  >
                    <IconSparkles size={18} aria-hidden="true" />
                    <span>Request Demo</span>
                  </button>
                </div>

                {/* Quick Role Direct Login Row */}
                <div className="hp-role-jumps">
                  <div className="hp-role-jumps-label">
                    <IconShieldLock size={14} aria-hidden="true" />
                    <span>Direct Institutional Portals</span>
                  </div>
                  <div className="hp-role-jumps-buttons">
                    <button
                      type="button"
                      className="hp-role-pill-btn"
                      onClick={() => onNavigateAuth('student')}
                    >
                      <IconSchool size={14} /> Students
                    </button>
                    <button
                      type="button"
                      className="hp-role-pill-btn"
                      onClick={() => onNavigateAuth('faculty')}
                    >
                      <IconChalkboard size={14} /> Faculty
                    </button>
                    <button
                      type="button"
                      className="hp-role-pill-btn"
                      onClick={() => onNavigateAuth('school')}
                    >
                      <IconBuildingBank size={14} /> School Admin
                    </button>
                    <button
                      type="button"
                      className="hp-role-pill-btn"
                      onClick={() => onNavigateAuth('admin')}
                    >
                      <IconShieldLock size={14} /> Government Admin
                    </button>
                  </div>
                </div>

                {/* Trust Metrics Strip */}
                <div className="hp-trust-strip">
                  <div className="hp-trust-item">
                    <span className="hp-trust-num">99.98%</span>
                    <span className="hp-trust-lbl">System Uptime</span>
                  </div>
                  <div className="hp-trust-item">
                    <span className="hp-trust-num">128+</span>
                    <span className="hp-trust-lbl">Live Classrooms</span>
                  </div>
                  <div className="hp-trust-item">
                    <span className="hp-trust-num">&lt;45ms</span>
                    <span className="hp-trust-lbl">Sync Latency</span>
                  </div>
                  <div className="hp-trust-item">
                    <span className="hp-trust-num">Zero-Trust</span>
                    <span className="hp-trust-lbl">FERPA Compliant</span>
                  </div>
                </div>

                {/* Institutional Quote Box */}
                <div className="hp-quote-card">
                  <div className="hp-quote-header">
                    <span>Why Education Matters</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>Thought {quoteIdx + 1} of 4</span>
                  </div>
                  <blockquote
                    className="hp-quote-text"
                    style={{
                      opacity: quoteFading ? 0 : 1,
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    "{QUOTES[quoteIdx]}"
                  </blockquote>
                </div>
              </div>

              {/* ---------- RIGHT COLUMN: Polished Education-Intelligence Dashboard Illustration ---------- */}
              <div className="hp-hero-right">
                <div className="hp-dashboard-mockup" aria-label="Education-Intelligence Dashboard Preview">
                  
                  {/* Mockup Window Top Bar */}
                  <div className="hp-dash-window-header">
                    <div className="hp-dash-dots">
                      <span className="hp-dash-dot red" />
                      <span className="hp-dash-dot amber" />
                      <span className="hp-dash-dot green" />
                    </div>
                    <div className="hp-dash-title">
                      <IconActivity size={14} style={{ color: '#38bdf8' }} />
                      <span>INSTITUTION: APEX CENTRAL UNIVERSITY // LIVE COMMAND</span>
                    </div>
                    <div className="hp-dash-status-badge">
                      <span className="hp-dash-status-dot" />
                      <span>LIVE TELEMETRY</span>
                    </div>
                  </div>

                  {/* Interactive Dashboard Tabs */}
                  <div className="hp-dash-nav-tabs" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'composite'}
                      className={`hp-dash-tab ${activeTab === 'composite' ? 'active' : ''}`}
                      onClick={() => setActiveTab('composite')}
                    >
                      <IconLayersLinked size={15} />
                      <span>Composite View</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'insights'}
                      className={`hp-dash-tab ${activeTab === 'insights' ? 'active' : ''}`}
                      onClick={() => setActiveTab('insights')}
                    >
                      <IconChartBar size={15} />
                      <span>Academic Insights</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'risk'}
                      className={`hp-dash-tab ${activeTab === 'risk' ? 'active' : ''}`}
                      onClick={() => setActiveTab('risk')}
                    >
                      <IconAlertTriangle size={15} />
                      <span>Predictive Risk (3)</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'classrooms'}
                      className={`hp-dash-tab ${activeTab === 'classrooms' ? 'active' : ''}`}
                      onClick={() => setActiveTab('classrooms')}
                    >
                      <IconBroadcast size={15} />
                      <span>Connected Rooms</span>
                    </button>
                  </div>

                  {/* Mockup Body Content */}
                  <div className="hp-dash-body">

                    {/* 1. Academic Insights Section */}
                    {(activeTab === 'composite' || activeTab === 'insights') && (
                      <div className="hp-dash-module">
                        <div className="hp-module-header">
                          <div className="hp-module-tag">
                            <IconTrendingUp size={16} />
                            <span>Academic Insights & Proficiency</span>
                          </div>
                          <span className="hp-module-meta">Term: Fall 2026 // Week 9</span>
                        </div>

                        {/* KPI Cards Row */}
                        <div className="hp-kpi-row">
                          <div className="hp-kpi-card">
                            <div className="hp-kpi-label">Institution Proficiency</div>
                            <div className="hp-kpi-val">
                              <span>94.6%</span>
                              <span className="hp-kpi-sub">+3.4% YoY</span>
                            </div>
                          </div>
                          <div className="hp-kpi-card">
                            <div className="hp-kpi-label">Syllabus Progress</div>
                            <div className="hp-kpi-val">
                              <span>78.2%</span>
                              <span className="hp-kpi-sub" style={{ color: '#38bdf8' }}>On-Track</span>
                            </div>
                          </div>
                          <div className="hp-kpi-card">
                            <div className="hp-kpi-label">Grade Health Index</div>
                            <div className="hp-kpi-val">
                              <span>A-Tier</span>
                              <span className="hp-kpi-sub">Top 4%</span>
                            </div>
                          </div>
                        </div>

                        {/* Discipline Progress Bars */}
                        <div className="hp-subject-bars">
                          <div className="hp-subj-item">
                            <div className="hp-subj-info">
                              <span>Computer Science & Distributed Systems</span>
                              <span style={{ fontWeight: 600, color: '#38bdf8' }}>96.4% Completion</span>
                            </div>
                            <div className="hp-subj-bar-bg">
                              <div className="hp-subj-bar-fill" style={{ width: '96.4%' }} />
                            </div>
                          </div>

                          <div className="hp-subj-item">
                            <div className="hp-subj-info">
                              <span>Molecular Genetics & Bio-Engineering</span>
                              <span style={{ fontWeight: 600, color: '#38bdf8' }}>91.8% Completion</span>
                            </div>
                            <div className="hp-subj-bar-bg">
                              <div className="hp-subj-bar-fill" style={{ width: '91.8%' }} />
                            </div>
                          </div>

                          <div className="hp-subj-item">
                            <div className="hp-subj-info">
                              <span>Quantitative Economics & Analytics</span>
                              <span style={{ fontWeight: 600, color: '#38bdf8' }}>88.5% Completion</span>
                            </div>
                            <div className="hp-subj-bar-bg">
                              <div className="hp-subj-bar-fill" style={{ width: '88.5%' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Predictive Risk Indicators Section */}
                    {(activeTab === 'composite' || activeTab === 'risk') && (
                      <div className="hp-dash-module" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                        <div className="hp-risk-banner">
                          <div className="hp-risk-left">
                            <IconAlertTriangle size={18} style={{ color: '#f59e0b' }} />
                            <span>AI Predictive Early-Intervention Engine Active</span>
                          </div>
                          <span className="hp-risk-pill">3 Disengagements Flagged</span>
                        </div>

                        <div className="hp-risk-cards">
                          <div className="hp-risk-card-item">
                            <div>
                              <div className="hp-risk-item-name">Aarav S. (Sem 4 CS)</div>
                              <div className="hp-risk-item-cause">Missed 2 lab submissions • Attendance dip -12%</div>
                            </div>
                            <span className="hp-risk-badge">Peer Tutor Assigned</span>
                          </div>

                          <div className="hp-risk-card-item" style={{ borderLeftColor: '#0ea5e9' }}>
                            <div>
                              <div className="hp-risk-item-name">Meera P. (Sem 2 Genetics)</div>
                              <div className="hp-risk-item-cause">Quiz 3 Outlier (&lt;58%) • Diagnostic scheduled</div>
                            </div>
                            <span className="hp-risk-badge">Faculty Review Sent</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. Connected Classrooms Section */}
                    {(activeTab === 'composite' || activeTab === 'classrooms') && (
                      <div className="hp-dash-module" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                        <div className="hp-class-header">
                          <div className="hp-class-stat">
                            <span className="hp-class-live-dot" />
                            <span style={{ fontWeight: 700, color: '#f8fafc' }}>128 Active Connected Classrooms</span>
                          </div>
                          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>
                            Live Attendance: 96.8% (4,820 Present)
                          </span>
                        </div>

                        <div className="hp-class-rooms-list">
                          <div className="hp-room-row">
                            <div>
                              <div className="hp-room-name">Hall 4A // CS-401 Distributed Systems</div>
                              <div className="hp-room-instructor">Instructor: Dr. Anand • Live Video Stream Active</div>
                            </div>
                            <div className="hp-room-attendance">
                              <span>48/50</span>
                              <span style={{ fontSize: '0.68rem', color: '#10b981' }}>● LIVE</span>
                            </div>
                          </div>

                          <div className="hp-room-row">
                            <div>
                              <div className="hp-room-name">Lab 02 // CHEM-202 Organic Synthesis</div>
                              <div className="hp-room-instructor">Instructor: Dr. Mukherjee • Practical Session</div>
                            </div>
                            <div className="hp-room-attendance">
                              <span>32/32</span>
                              <span style={{ fontSize: '0.68rem', color: '#10b981' }}>● LIVE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mockup Window Footer */}
                  <div className="hp-dash-footer">
                    <span>Sync: Sub-45ms Telemetry // TLS 1.3 Verified</span>
                    <span className="hp-dash-engine-tag">Core Engine: Pentagon v4.2</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================== 2. PORTAL LOGINS SECTION (#access) ==================== */}
        <section className="hp-access-section" id="access">
          <div className="hp-container">
            <header className="hp-section-header">
              <span className="hp-section-eyebrow">Enterprise Role-Based Access</span>
              <h2 className="hp-section-title">Institutional Portals</h2>
              <p className="hp-section-desc">
                Role-partitioned interfaces engineered to deliver precision data and workflows
                tailored specifically for each tier of the educational ecosystem.
              </p>
            </header>

            <div className="hp-portals-grid">
              
              {/* Card 1: Students */}
              <article className="hp-portal-card">
                <div className="hp-portal-card-top">
                  <div className="hp-portal-icon-box">
                    <IconSchool size={26} />
                  </div>
                  <span className="hp-portal-tier-tag">Tier 1 // Academic</span>
                </div>
                <h3 className="hp-portal-title">Students Portal</h3>
                <p className="hp-portal-desc">
                  Centralized academic dashboard for course progress, syllabus tracking, digital submissions,
                  and achievement metrics.
                </p>
                <ul className="hp-portal-features">
                  <li><IconCheck size={14} /> Interactive timetable & calendar</li>
                  <li><IconCheck size={14} /> Real-time syllabus completion tracker</li>
                  <li><IconCheck size={14} /> Direct assignment file drop</li>
                  <li><IconCheck size={14} /> Demo account: Aarav Sharma</li>
                </ul>
                <button
                  type="button"
                  className="hp-portal-btn"
                  onClick={() => onNavigateAuth('student')}
                >
                  <span>Student Sign In</span>
                  <IconArrowRight size={16} />
                </button>
              </article>

              {/* Card 2: Faculty */}
              <article className="hp-portal-card">
                <div className="hp-portal-card-top">
                  <div className="hp-portal-icon-box">
                    <IconChalkboard size={26} />
                  </div>
                  <span className="hp-portal-tier-tag">Tier 2 // Instruction</span>
                </div>
                <h3 className="hp-portal-title">Faculty Portal</h3>
                <p className="hp-portal-desc">
                  Curriculum management, automated classroom roll call, instant grading, and early
                  intervention indicators.
                </p>
                <ul className="hp-portal-features">
                  <li><IconCheck size={14} /> Real-time lecture attendance logging</li>
                  <li><IconCheck size={14} /> Rapid gradebook & exam rubric assessment</li>
                  <li><IconCheck size={14} /> Early-risk student identification</li>
                  <li><IconCheck size={14} /> Demo account: Dr. Anand</li>
                </ul>
                <button
                  type="button"
                  className="hp-portal-btn"
                  onClick={() => onNavigateAuth('faculty')}
                >
                  <span>Faculty Sign In</span>
                  <IconArrowRight size={16} />
                </button>
              </article>

              {/* Card 3: School Administration */}
              <article className="hp-portal-card">
                <div className="hp-portal-card-top">
                  <div className="hp-portal-icon-box">
                    <IconBuildingBank size={26} />
                  </div>
                  <span className="hp-portal-tier-tag">Tier 3 // Governance</span>
                </div>
                <h3 className="hp-portal-title">School Administration</h3>
                <p className="hp-portal-desc">
                  Campus-wide governance, teacher deployment, accreditation compliance audits, and
                  institutional resource allocation.
                </p>
                <ul className="hp-portal-features">
                  <li><IconCheck size={14} /> Departmental budget & asset monitoring</li>
                  <li><IconCheck size={14} /> Teacher qualification & accreditation audits</li>
                  <li><IconCheck size={14} /> Campus security & facility health sync</li>
                  <li><IconCheck size={14} /> Demo account: Principal Reynolds</li>
                </ul>
                <button
                  type="button"
                  className="hp-portal-btn"
                  onClick={() => onNavigateAuth('school')}
                >
                  <span>Admin Sign In</span>
                  <IconArrowRight size={16} />
                </button>
              </article>

              {/* Card 4: Government Administration */}
              <article className="hp-portal-card">
                <div className="hp-portal-card-top">
                  <div className="hp-portal-icon-box">
                    <IconShieldLock size={26} />
                  </div>
                  <span className="hp-portal-tier-tag">Tier 4 // State Oversight</span>
                </div>
                <h3 className="hp-portal-title">Government Admin</h3>
                <p className="hp-portal-desc">
                  Macro-level education department oversight, state-wide learning benchmarks, and
                  regulatory compliance dashboards.
                </p>
                <ul className="hp-portal-features">
                  <li><IconCheck size={14} /> Cross-district comparative benchmarks</li>
                  <li><IconCheck size={14} /> State scholarship & grant disbursements</li>
                  <li><IconCheck size={14} /> Zero-trust role & policy provisioning</li>
                  <li><IconCheck size={14} /> Demo account: State Director</li>
                </ul>
                <button
                  type="button"
                  className="hp-portal-btn"
                  onClick={() => onNavigateAuth('admin')}
                >
                  <span>Govt Sign In</span>
                  <IconArrowRight size={16} />
                </button>
              </article>

            </div>
          </div>
        </section>

        {/* ==================== 3. ABOUT & ARCHITECTURE SECTION (#about) ==================== */}
        <section className="hp-about-section" id="about">
          <div className="hp-container">
            <div className="hp-about-box">
              <div className="hp-about-copy">
                <span className="hp-section-eyebrow">Enterprise Topology</span>
                <h3>The Pentagon Network Architecture</h3>
                <p>
                  Every participant in the educational journey—from learners and instructional faculty
                  to campus leadership and state regulators—is synchronized within a single, secure,
                  low-latency telemetry loop.
                </p>
                <p>
                  Built on a distributed cloud backbone with immutable audit logging, automated
                  intervention protocols, and sub-50ms data replication across connected classrooms.
                </p>
                <div className="hp-about-pills">
                  <span className="hp-about-pill">Students</span>
                  <span className="hp-about-pill">Faculty</span>
                  <span className="hp-about-pill">School Governance</span>
                  <span className="hp-about-pill">State Regulators</span>
                  <span className="hp-about-pill">Live Telemetry</span>
                </div>
              </div>

              {/* Architecture SVG Art */}
              <div className="hp-about-art">
                <svg viewBox="0 0 460 300" width="100%" height="auto" style={{ maxWidth: '420px' }}>
                  <defs>
                    <linearGradient id="netGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0a192f" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Central Core Pentagon Node */}
                  <circle cx="230" cy="150" r="48" fill="url(#netGrad)" filter="url(#glow)" />
                  <path d="M230 118 L260 138 L248 174 L212 174 L200 138 Z" fill="#ffffff" />
                  <text x="230" y="215" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700" fontFamily="sans-serif">
                    PENTAGON CORE
                  </text>

                  {/* Connecting Links */}
                  <line x1="230" y1="150" x2="90" y2="70" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,4" />
                  <line x1="230" y1="150" x2="370" y2="70" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,4" />
                  <line x1="230" y1="150" x2="100" y2="230" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,4" />
                  <line x1="230" y1="150" x2="360" y2="230" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,4" />

                  {/* Satellite Nodes */}
                  <g transform="translate(90, 70)">
                    <circle cx="0" cy="0" r="32" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="700">Students</text>
                  </g>
                  <g transform="translate(370, 70)">
                    <circle cx="0" cy="0" r="32" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="700">Faculty</text>
                  </g>
                  <g transform="translate(100, 230)">
                    <circle cx="0" cy="0" r="32" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="700">Institutions</text>
                  </g>
                  <g transform="translate(360, 230)">
                    <circle cx="0" cy="0" r="32" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="700">Analytics</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 4. BENEFITS SECTION (#benefits) ==================== */}
        <section className="hp-benefits-section" id="benefits">
          <div className="hp-container">
            <header className="hp-section-header">
              <span className="hp-section-eyebrow">Enterprise Pillars</span>
              <h2 className="hp-section-title">Why Leading Institutions Choose The Pentagon</h2>
              <p className="hp-section-desc">
                Engineered for maximum reliability, cross-tier compliance, and tangible academic growth.
              </p>
            </header>

            <div className="hp-benefits-grid">
              <div className="hp-benefit-card">
                <span className="hp-benefit-num">01 // TELEMETRY</span>
                <h3 className="hp-benefit-title">One Connected Campus</h3>
                <p className="hp-benefit-desc">
                  Students, teachers, courseware, and institutional records coalesce into a unified,
                  high-security digital ecosystem without siloed fragmentation.
                </p>
              </div>

              <div className="hp-benefit-card">
                <span className="hp-benefit-num">02 // PREDICTION</span>
                <h3 className="hp-benefit-title">Real-Time Risk Intervention</h3>
                <p className="hp-benefit-desc">
                  Early alerts automatically highlight struggling learners before performance drops become
                  irreversible, triggering timely tutor and counselor interventions.
                </p>
              </div>

              <div className="hp-benefit-card">
                <span className="hp-benefit-num">03 // AUTOMATION</span>
                <h3 className="hp-benefit-title">Paperless Administrative Efficiency</h3>
                <p className="hp-benefit-desc">
                  Automated attendance capture, standardized rubric grading, and digitized syllabus
                  completion reduce routine administrative overhead by over 60%.
                </p>
              </div>

              <div className="hp-benefit-card">
                <span className="hp-benefit-num">04 // COMPLIANCE</span>
                <h3 className="hp-benefit-title">Zero-Trust Role Partitioning</h3>
                <p className="hp-benefit-desc">
                  Granular, role-based cryptographic isolation ensures that sensitive student records,
                  faculty appraisals, and governance data remain strictly confidential.
                </p>
              </div>

              <div className="hp-benefit-card">
                <span className="hp-benefit-num">05 // ACCESSIBILITY</span>
                <h3 className="hp-benefit-title">Anytime, Anywhere Learning</h3>
                <p className="hp-benefit-desc">
                  Responsive design, offline-capable storage, and sub-50ms synchronizations ensure students
                  and faculty maintain full access across desktop, tablet, and mobile.
                </p>
              </div>

              <div className="hp-benefit-card">
                <span className="hp-benefit-num">06 // OVERSIGHT</span>
                <h3 className="hp-benefit-title">State-Level Accreditation Audits</h3>
                <p className="hp-benefit-desc">
                  Government administrators can audit institution-wide performance metrics, resource
                  allocations, and compliance standards with one click.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== 5. FOOTER (#contact) ==================== */}
      <footer className="hp-footer" id="contact">
        <div className="hp-container">
          <div className="hp-footer-inner">
            <div className="hp-footer-left">
              <span>© {new Date().getFullYear()} The Pentagon Platform</span>
              <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
              <a href="#security" onClick={(e) => e.preventDefault()}>Security &amp; FERPA</a>
            </div>

            <div className="hp-footer-right">
              {onWatchIntro && (
                <button
                  type="button"
                  className="hp-footer-btn-intro"
                  onClick={onWatchIntro}
                >
                  Watch 3D Intro
                </button>
              )}
              <span>Architected &amp; Powered by <a href="mailto:contact@nightberries.com">NightBerrieZ</a></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Request Demo Pop-up Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};
