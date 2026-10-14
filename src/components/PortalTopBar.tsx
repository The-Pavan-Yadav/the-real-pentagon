import React from 'react';

interface PortalTopBarProps {
  currentView: string;
  role: 'student' | 'faculty' | 'school' | 'admin';
  userName?: string;
  avatarUrl?: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

export const PortalTopBar: React.FC<PortalTopBarProps> = ({
  currentView,
  role,
  userName = '',
  avatarUrl = '',
  onNavigate,
  onLogout,
  onToast,
}) => {
  const getInitial = () => {
    if (role === 'faculty') return 'RK';
    if (role === 'school') return 'PR';
    if (role === 'admin') return 'AD';
    if (!userName) return 'AS';
    return userName.charAt(0).toUpperCase();
  };

  const getRoleLabel = () => {
    if (role === 'faculty') return 'Faculty';
    if (role === 'school') return 'School Admin';
    if (role === 'admin') return 'Platform Admin';
    return 'Student';
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <a
          className="brand"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
        >
          <img src="/assets/logo.png" alt="THE PENTAGON" />
          <span>THE PENTAGON</span>
        </a>

        <span
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '2px 8px',
            borderRadius: '10px',
            background:
              role === 'admin'
                ? 'rgba(239, 68, 68, 0.2)'
                : role === 'school'
                ? 'rgba(245, 158, 11, 0.2)'
                : role === 'faculty'
                ? 'rgba(168, 85, 247, 0.2)'
                : 'rgba(59, 130, 246, 0.2)',
            color:
              role === 'admin'
                ? '#fca5a5'
                : role === 'school'
                ? '#fcd34d'
                : role === 'faculty'
                ? '#e9d5ff'
                : '#bfdbfe',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {getRoleLabel()}
        </span>
      </div>

      {/* Dynamic Navigation per Role */}
      {role === 'faculty' ? (
        <nav aria-label="Main">
          <a
            href="#teacher-profile"
            className={currentView === 'teacher' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('teacher');
            }}
          >
            Dashboard
          </a>
          <a
            href="#student-class"
            className={currentView === 'student-class' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('student-class');
            }}
          >
            Class Overview
          </a>
          <a
            href="#student-calendar"
            className={currentView === 'student-calendar' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('student-calendar');
            }}
          >
            Calendar
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onToast('Faculty research network is online.');
            }}
          >
            Network
          </a>
        </nav>
      ) : role === 'school' ? (
        <nav aria-label="Main">
          <a
            href="#school-admin"
            className={currentView === 'school-admin' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('school-admin');
            }}
          >
            Admin Dashboard
          </a>
          <a
            href="#teacher"
            className={currentView === 'teacher' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('teacher');
            }}
          >
            Faculty Profiles
          </a>
          <a
            href="#student-class"
            className={currentView === 'student-class' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('student-class');
            }}
          >
            Classrooms
          </a>
          <a
            href="#student-calendar"
            className={currentView === 'student-calendar' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('student-calendar');
            }}
          >
            Schedule
          </a>
        </nav>
      ) : role === 'admin' ? (
        <nav aria-label="Main">
          <a
            href="#admin"
            className={currentView === 'admin' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('admin');
            }}
          >
            System Console
          </a>
          <a
            href="#school-admin"
            className={currentView === 'school-admin' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('school-admin');
            }}
          >
            School Operations
          </a>
          <a
            href="#teacher"
            className={currentView === 'teacher' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('teacher');
            }}
          >
            Faculty Workspace
          </a>
          <a
            href="#student-dashboard"
            className={currentView === 'student-dashboard' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('student-dashboard');
            }}
          >
            Student Workspace
          </a>
        </nav>
      ) : (
        <nav aria-label="Main">
          <a
            href="#student-dashboard"
            className={currentView === 'student-dashboard' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('student-dashboard');
            }}
          >
            Dashboard
          </a>
          <a
            href="#student-class"
            className={currentView === 'student-class' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('student-class');
            }}
          >
            My class
          </a>
          <a
            href="#student-calendar"
            className={currentView === 'student-calendar' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('student-calendar');
            }}
          >
            Calendar
          </a>
          <a
            href="#post"
            className={currentView === 'post' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('post');
            }}
          >
            + New Post
          </a>
        </nav>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          className="nav-av"
          id="nav-av"
          aria-hidden="true"
          title={userName || getRoleLabel()}
          style={{
            backgroundImage: avatarUrl ? `url("${avatarUrl}")` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!avatarUrl && getInitial()}
        </div>

        <a
          href="#logout"
          className="logout"
          id="logout"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
        >
          Log out
        </a>
      </div>
    </header>
  );
};
