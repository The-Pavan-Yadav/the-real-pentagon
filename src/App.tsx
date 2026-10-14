import React, { useState, useEffect } from 'react';
import { PentagonIntro } from './components/PentagonIntro';
import { Toast } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentClassPage } from './pages/StudentClassPage';
import { StudentCalendarPage } from './pages/StudentCalendarPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { TeacherProfilePage } from './pages/TeacherProfilePage';
import { SchoolAdminPage } from './pages/SchoolAdminPage';
import { AdminPage } from './pages/AdminPage';
import {
  getSession,
  setSession,
  getStudentData,
  saveStudentData,
  getClassroomData,
} from './services/storage';
import {
  logOutFirebase,
  syncStudentDataToFirestore,
  loadStudentDataFromFirestore,
} from './firebase';
import { StudentStore, ClassroomData, UserRole, UserSession } from './types';

export type AppView =
  | 'home'
  | 'login'
  | 'signup'
  | 'student-dashboard'
  | 'student-class'
  | 'student-calendar'
  | 'post'
  | 'teacher'
  | 'school-admin'
  | 'admin';

export const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('pentagon_intro_seen');
    } catch {
      return true;
    }
  });

  const [session, setSessionState] = useState<UserSession | null>(() => getSession());
  const [view, setView] = useState<AppView>(() => {
    const hash = window.location.hash.replace('#', '');
    const searchParams = new URLSearchParams(window.location.search);
    const roleParam = searchParams.get('role');

    if (roleParam) return 'login';
    if (hash === 'login') return 'login';
    if (hash === 'signup') return 'signup';
    if (hash === 'class' || hash === 'student-class') return 'student-class';
    if (hash === 'calendar' || hash === 'student-calendar') return 'student-calendar';
    if (hash === 'post') return 'post';
    if (hash === 'teacher' || hash === 'teacher-profile') return 'teacher';
    if (hash === 'school-admin' || hash === 'school') return 'school-admin';
    if (hash === 'admin' || hash === 'platform-admin') return 'admin';
    if (hash === 'dashboard' || hash === 'student-dashboard' || hash === 'projects') return 'student-dashboard';
    return 'home';
  });

  const [authRole, setAuthRole] = useState<UserRole>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const roleParam = searchParams.get('role') as UserRole;
    return roleParam || 'student';
  });

  const [studentData, setStudentData] = useState<StudentStore>(() => getStudentData());
  const [classroomData, setClassroomData] = useState<ClassroomData>(() => getClassroomData());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  const handleCompleteIntro = () => {
    try {
      sessionStorage.setItem('pentagon_intro_seen', 'true');
    } catch {}
    setShowIntro(false);
  };

  const navigateTo = (newView: AppView | string, newRole?: UserRole) => {
    if (newRole) setAuthRole(newRole);
    setView(newView as AppView);
    window.location.hash = newView;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateStudentData = (newData: StudentStore) => {
    setStudentData(newData);
    saveStudentData(newData);
    if (session?.uid) {
      syncStudentDataToFirestore(session.uid, newData).catch(() => {});
    }
  };

  const handleAuthSuccess = async (newSession: UserSession) => {
    setSessionState(newSession);
    if (newSession.role === 'student' && newSession.uid) {
      try {
        const cloudData = await loadStudentDataFromFirestore(newSession.uid);
        if (cloudData) {
          setStudentData(cloudData);
          saveStudentData(cloudData);
        } else if (newSession.name) {
          setStudentData((prev) => {
            const currentProfile = prev.profile || {
              name: 'Scholar',
              grade: 'Grade 10',
              school: 'The Pentagon National Education Network',
              bio: 'Enrolled Scholar & Candidate',
              avatar: '',
              banner: '',
            };
            const updated: StudentStore = {
              ...prev,
              profile: {
                ...currentProfile,
                name: newSession.name || currentProfile.name,
              },
            };
            saveStudentData(updated);
            return updated;
          });
        }
      } catch {}
    }

    if (newSession.role === 'faculty') {
      navigateTo('teacher');
    } else if (newSession.role === 'school') {
      navigateTo('school-admin');
    } else if (newSession.role === 'admin') {
      navigateTo('admin');
    } else {
      navigateTo('student-dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await logOutFirebase();
    } catch {}
    setSession(null);
    setSessionState(null);
    showToast('You have been logged out.');
    navigateTo('home');
  };

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'home') setView('home');
      else if (hash === 'login') setView('login');
      else if (hash === 'signup') setView('signup');
      else if (hash === 'student-dashboard' || hash === 'dashboard' || hash === 'projects') setView('student-dashboard');
      else if (hash === 'student-class' || hash === 'class') setView('student-class');
      else if (hash === 'student-calendar' || hash === 'calendar') setView('student-calendar');
      else if (hash === 'post') setView('post');
      else if (hash === 'teacher' || hash === 'teacher-profile') setView('teacher');
      else if (hash === 'school-admin' || hash === 'school') setView('school-admin');
      else if (hash === 'admin' || hash === 'platform-admin') setView('admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-container">
      {/* Intro Animation */}
      {showIntro && <PentagonIntro onComplete={handleCompleteIntro} />}

      {/* Global Toast */}
      <Toast message={toastMessage} />

      {/* Screen Views */}
      {view === 'home' && (
        <HomePage
          onNavigateAuth={(role, isSignup) => {
            setAuthRole(role);
            navigateTo(isSignup ? 'signup' : 'login', role);
          }}
          onNavigatePortal={(p) => navigateTo(p)}
        />
      )}

      {view === 'login' && (
        <AuthPage
          initialRole={authRole}
          isSignup={false}
          onNavigateHome={() => navigateTo('home')}
          onAuthSuccess={handleAuthSuccess}
          onToast={showToast}
        />
      )}

      {view === 'signup' && (
        <AuthPage
          initialRole={authRole}
          isSignup={true}
          onNavigateHome={() => navigateTo('home')}
          onAuthSuccess={handleAuthSuccess}
          onToast={showToast}
        />
      )}

      {view === 'student-dashboard' && (
        <StudentDashboard
          data={studentData}
          onUpdateData={handleUpdateStudentData}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onToast={showToast}
        />
      )}

      {view === 'student-class' && (
        <StudentClassPage
          data={studentData}
          classroom={classroomData}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onToast={showToast}
        />
      )}

      {view === 'student-calendar' && (
        <StudentCalendarPage
          data={studentData}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onToast={showToast}
        />
      )}

      {view === 'post' && (
        <CreatePostPage
          data={studentData}
          onUpdateData={handleUpdateStudentData}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onToast={showToast}
        />
      )}

      {view === 'teacher' && (
        <TeacherProfilePage
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onToast={showToast}
        />
      )}

      {view === 'school-admin' && (
        <SchoolAdminPage
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onToast={showToast}
        />
      )}

      {view === 'admin' && (
        <AdminPage
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onToast={showToast}
        />
      )}
    </div>
  );
};
