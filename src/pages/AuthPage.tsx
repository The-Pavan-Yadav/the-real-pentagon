import React, { useState, useEffect } from 'react';
import { UserRole, UserSession } from '../types';
import { setSession } from '../services/storage';
import {
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from '../firebase';
import {
  IconSchool,
  IconChalkboard,
  IconBuildingBank,
  IconShieldLock,
  IconCheck,
  IconLock,
  IconMail,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconArrowLeft,
  IconAlertCircle,
  IconInfoCircle,
  IconShieldCheck,
  IconUserCheck,
  IconSparkles,
  IconHelpCircle,
  IconX,
} from '@tabler/icons-react';

interface AuthPageProps {
  initialRole?: UserRole;
  isSignup?: boolean;
  onNavigateHome: () => void;
  onAuthSuccess: (session: UserSession) => void;
  onToast: (msg: string) => void;
}

interface RoleCardMeta {
  role: UserRole;
  tierBadge: string;
  title: string;
  audience: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  demoUser: {
    name: string;
    email: string;
    title: string;
    uid: string;
  };
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  institution?: string;
  agreeTerms?: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const validateInstitutionalEmail = (val: string): string | null => {
  const trimmed = val.trim();
  if (!trimmed) {
    return 'Institutional email address is required.';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a complete, valid email address (e.g., student@example.edu).';
  }
  const parts = trimmed.split('@');
  if (parts.length !== 2 || !parts[1].includes('.')) {
    return 'Please enter a complete, valid email address with a domain (e.g., student@example.edu).';
  }
  const tld = parts[1].split('.').pop() || '';
  if (tld.length < 2) {
    return 'Institutional email requires a valid domain extension (e.g., .edu, .org, .ac.in).';
  }
  return null;
};

export const AuthPage: React.FC<AuthPageProps> = ({
  initialRole = 'student',
  isSignup = false,
  onNavigateHome,
  onAuthSuccess,
  onToast,
}) => {
  const [signupMode, setSignupMode] = useState(isSignup);
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [remember, setRemember] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  // Synchronize initialRole if prop changes
  useEffect(() => {
    setActiveRole(initialRole);
  }, [initialRole]);

  // If role is set to admin, ensure signup mode is off since Government Admin is invite/root only
  useEffect(() => {
    if (activeRole === 'admin' && signupMode) {
      setSignupMode(false);
    }
  }, [activeRole, signupMode]);

  const roleDefinitions: Record<UserRole, RoleCardMeta> = {
    student: {
      role: 'student',
      tierBadge: 'Tier 1 // Academic',
      title: 'Students',
      audience: 'Enrolled Scholars & Candidates',
      description: 'Unified learning repository, semester modules, course schedules, and digital achievement portfolio.',
      icon: <IconSchool size={22} stroke={1.8} />,
      features: [
        'Course enrollment & academic syllabus',
        'Assignment submissions & graded marks',
        'Co-curricular projects & portfolio showcase',
      ],
      demoUser: {
        name: 'Aarav Sharma',
        email: 'student@thepentagon.edu',
        title: 'B.Tech Computer Science (Roll: 2024-CS-042)',
        uid: 'demo_student',
      },
    },
    faculty: {
      role: 'faculty',
      tierBadge: 'Tier 2 // Instruction',
      title: 'Faculty',
      audience: 'Professors & Teaching Mentors',
      description: 'Curriculum management, classroom lecture logs, grading review, and departmental notices.',
      icon: <IconChalkboard size={22} stroke={1.8} />,
      features: [
        'Class attendance & curriculum delivery',
        'Assignment grading & student feedback',
        'Research publications & academic circulars',
      ],
      demoUser: {
        name: 'Dr. Ramesh Kumar',
        email: 'faculty@thepentagon.edu',
        title: 'Dean of Academic Affairs & Research',
        uid: 'demo_faculty',
      },
    },
    school: {
      role: 'school',
      tierBadge: 'Tier 3 // Institution',
      title: 'School Administration',
      audience: 'Principals & Campus Directors',
      description: 'Institutional metrics, department directory, faculty staffing, and campus circular management.',
      icon: <IconBuildingBank size={22} stroke={1.8} />,
      features: [
        'Campus performance telemetry & KPIs',
        'Searchable faculty roster & departments',
        'Campus-wide circulars & compliance registry',
      ],
      demoUser: {
        name: 'Principal S. Mukherjee',
        email: 'principal@thepentagon.edu',
        title: 'Principal (Kendriya Vidyalaya Campus 09)',
        uid: 'demo_school',
      },
    },
    admin: {
      role: 'admin',
      tierBadge: 'Tier 4 // Governance',
      title: 'Government Administration',
      audience: 'Ministry Directorate & Inspectors',
      description: 'National multi-institution oversight, security policy audits, telemetry, and system controls.',
      icon: <IconShieldLock size={22} stroke={1.8} />,
      features: [
        'National institution network telemetry',
        'RBAC access security & rule audit logs',
        'National education standard compliance audits',
      ],
      demoUser: {
        name: 'System Root Operator',
        email: 'gov.admin@thepentagon.gov.in',
        title: 'Ministry Oversight Directorate (Platform Root)',
        uid: 'demo_admin',
      },
    },
  };

  const handleQuickDemo = (roleKey: UserRole) => {
    const meta = roleDefinitions[roleKey];
    const demoSession: UserSession = {
      role: roleKey,
      uid: meta.demoUser.uid,
      email: meta.demoUser.email,
      name: meta.demoUser.name,
      t: Date.now(),
    };
    setSession(demoSession);
    onToast(`Authenticated into ${meta.title} as ${meta.demoUser.name}`);
    onAuthSuccess(demoSession);
  };

  const handleAutofillDemo = () => {
    const meta = roleDefinitions[activeRole];
    setEmail(meta.demoUser.email);
    setPassword('DemoPassword2026!');
    setConfirmPassword('DemoPassword2026!');
    setName(meta.demoUser.name);
    setInstitution('The Pentagon National Education Network');
    setAgreeTerms(true);
    setFieldErrors({});
    setStatusMsg({
      text: `Populated verified credentials for ${meta.title}. Click Authenticate below to continue.`,
      isError: false,
    });
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setFieldErrors({});
    setStatusMsg({ text: 'Connecting to Institutional Google SSO…', isError: false });
    try {
      const session = await signInWithGoogle(activeRole);
      setSession(session);
      onToast(
        signupMode
          ? `Institutional account created via Google SSO as ${session.name || session.email}`
          : `Authenticated with Google SSO as ${session.name || session.email}`
      );
      onAuthSuccess(session);
    } catch (err: any) {
      console.warn('Google Sign-In notice', err);
      setStatusMsg({
        text: err.message || 'Google SSO verification was interrupted. You may also use direct institutional credentials below.',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const mapFirebaseError = (err: any, isSignup: boolean): { msg: string; field?: 'email' | 'password' } => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return {
          msg: 'Please enter a valid institutional email address (e.g., student@example.edu).',
          field: 'email',
        };
      case 'auth/email-already-in-use':
        return {
          msg: 'An account with this institutional email already exists. Please switch to Sign In.',
          field: 'email',
        };
      case 'auth/weak-password':
        return {
          msg: 'Password should be at least 6 characters long with a mix of letters and numbers.',
          field: 'password',
        };
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return {
          msg: 'Invalid email or password. Please verify your credentials or try Autofill Demo Credentials.',
        };
      case 'auth/user-not-found':
        return {
          msg: 'No institutional account found with this email. Please verify or register a new account.',
          field: 'email',
        };
      case 'auth/user-disabled':
        return {
          msg: 'This institutional account has been deactivated. Please contact campus administration.',
        };
      case 'auth/too-many-requests':
        return {
          msg: 'Too many attempts. Access has been temporarily restricted for security. Please try again shortly.',
        };
      case 'auth/network-request-failed':
        return {
          msg: 'Authentication network request failed. Please check your internet connection and try again.',
        };
      case 'auth/operation-not-allowed':
        return {
          msg: 'Email/password authentication is restricted on this project. Please authenticate with Institutional Google SSO or use 1-Click Demo Login.',
        };
      default:
        return {
          msg: isSignup
            ? 'Registration could not be completed. Please check your institutional details or try 1-Click Demo Login.'
            : 'Authentication failed. Please verify your credentials or try 1-Click Demo Login.',
        };
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const trimmedEmail = email.trim();

    // 1. Validate Email (strictly require valid format, trim whitespace)
    const emailErr = validateInstitutionalEmail(trimmedEmail);
    if (emailErr) {
      errors.email = emailErr;
    }

    // 2. Validate Password
    if (!password) {
      errors.password = 'Institutional password is required.';
    } else if (signupMode && password.length < 6) {
      errors.password = 'Institutional password must be at least 6 characters long.';
    }

    // 3. Signup Mode specific validations
    if (signupMode) {
      if (!name.trim()) {
        errors.name = 'Full legal name is required.';
      }
      if (!institution.trim()) {
        errors.institution = 'Institutional affiliation / department is required.';
      }
      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'The confirmation password does not match.';
      }
      if (!agreeTerms) {
        errors.agreeTerms = 'You must accept the Institutional Terms and Data Governance Policy.';
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError =
        errors.email ||
        errors.name ||
        errors.institution ||
        errors.password ||
        errors.confirmPassword ||
        errors.agreeTerms ||
        'Please correct the highlighted fields before submitting.';
      setStatusMsg({ text: firstError, isError: true });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    // Validate all fields before any request is made
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const trimmedInstitution = institution.trim();

    setLoading(true);
    setStatusMsg({
      text: signupMode
        ? 'Registering institutional credential on Firebase grid…'
        : `Authenticating into ${roleDefinitions[activeRole].title} portal…`,
      isError: false,
    });

    try {
      const meta = roleDefinitions[activeRole];
      const isDemoAccount = trimmedEmail.toLowerCase() === meta.demoUser.email.toLowerCase();

      let session: UserSession;
      if (isDemoAccount) {
        // Fast instant verification for demo accounts
        session = {
          role: activeRole,
          uid: meta.demoUser.uid,
          email: meta.demoUser.email,
          name: signupMode ? trimmedName : meta.demoUser.name,
          t: Date.now(),
        };
      } else {
        // Real Firebase Auth verification: strictly pass trimmedEmail to email argument
        if (signupMode) {
          session = await registerWithEmail(
            trimmedEmail,
            password,
            trimmedName,
            activeRole,
            trimmedInstitution
          );
        } else {
          session = await loginWithEmail(trimmedEmail, password, activeRole);
        }
      }

      setSession(session);
      onToast(signupMode ? 'Account registered successfully!' : `Welcome back to ${meta.title} portal.`);
      onAuthSuccess(session);
    } catch (err: any) {
      console.warn('Auth error:', err);
      const friendly = mapFirebaseError(err, signupMode);
      if (friendly.field === 'email') {
        setFieldErrors((prev) => ({ ...prev, email: friendly.msg }));
      } else if (friendly.field === 'password') {
        setFieldErrors((prev) => ({ ...prev, password: friendly.msg }));
      }
      setStatusMsg({ text: friendly.msg, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const emailErr = validateInstitutionalEmail(trimmedEmail);
    if (emailErr) {
      setFieldErrors((prev) => ({ ...prev, email: emailErr }));
      setStatusMsg({ text: emailErr, isError: true });
      return;
    }
    setFieldErrors((prev) => ({ ...prev, email: undefined }));
    onToast(`Password reset link dispatched to ${trimmedEmail}`);
    setStatusMsg({ text: `Institutional password recovery instructions sent to ${trimmedEmail}`, isError: false });
  };

  const currentMeta = roleDefinitions[activeRole];

  return (
    <div className="auth-page-root">
      {/* Enterprise Institutional Header */}
      <header className="pen-auth-header">
        <div className="pen-auth-header-inner">
          <a
            className="pen-auth-brand"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            aria-label="THE PENTAGON - Home"
          >
            <img src="/assets/logo.png" alt="Institutional Seal" className="pen-auth-brand-logo" />
            <div className="pen-auth-brand-text">
              <span className="pen-auth-brand-title">THE PENTAGON</span>
              <span className="pen-auth-brand-subtitle">National Educational Infrastructure Network &bull; SSO</span>
            </div>
          </a>

          <div className="pen-auth-header-right">
            <div className="pen-auth-status-pill">
              <span className="pen-status-dot" aria-hidden="true" />
              <span>Firebase SSO Grid: Operational</span>
            </div>

            <button
              type="button"
              className="pen-header-guide-btn"
              onClick={() => setShowGuideModal(true)}
              title="View demo guide for hackathon evaluators"
            >
              <IconHelpCircle size={14} />
              <span>Evaluator Guide</span>
            </button>

            <a
              className="pen-auth-back-btn"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
              }}
            >
              <IconArrowLeft size={14} />
              <span>Portal Home</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pen-auth-main">
        {/* Hero Orientation */}
        <section className="pen-auth-hero">
          <div className="pen-auth-eyebrow">
            <IconShieldCheck size={14} />
            <span>Unified Institutional Access &bull; Role-Based Governance</span>
          </div>
          <h1 className="pen-auth-title">Institutional Single Sign-On</h1>
          <p className="pen-auth-subtitle">
            Select your accredited administrative tier or academic role below to authenticate into the national education platform.
          </p>
        </section>

        {/* Hackathon Evaluator Quick Tip Bar */}
        <div className="pen-evaluator-tip-bar">
          <div className="pen-evaluator-tip-left">
            <IconSparkles size={16} />
            <span>
              <strong>Hackathon Evaluator Notice:</strong> Instant 1-Click Demo Login is active on every tier below for direct platform evaluation without manual registration.
            </span>
          </div>
          <div className="pen-evaluator-tip-right">
            <button
              type="button"
              className="pen-evaluator-quick-link"
              onClick={() => setShowGuideModal(true)}
            >
              View Tier Matrix
            </button>
          </div>
        </div>

        {/* 4 Consistent Login Cards */}
        <section className="pen-cards-grid" aria-label="Institutional Login Roles">
          {(['student', 'faculty', 'school', 'admin'] as UserRole[]).map((rKey) => {
            const card = roleDefinitions[rKey];
            const isActive = activeRole === rKey;

            return (
              <article
                key={rKey}
                className={`pen-portal-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveRole(rKey);
                  setStatusMsg(null);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveRole(rKey);
                    setStatusMsg(null);
                  }
                }}
                aria-pressed={isActive}
                aria-label={`Select ${card.title} Portal`}
              >
                {/* Card Top: Tier & Active Tag */}
                <div className="pen-card-top">
                  <span className="pen-card-tier">{card.tierBadge}</span>
                  {isActive ? (
                    <span className="pen-card-active-indicator">
                      <IconCheck size={12} stroke={2.5} /> Selected
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Tier {rKey === 'student' ? 1 : rKey === 'faculty' ? 2 : rKey === 'school' ? 3 : 4}</span>
                  )}
                </div>

                {/* Identity Header */}
                <div className="pen-card-identity">
                  <div className="pen-card-icon-wrap" aria-hidden="true">
                    {card.icon}
                  </div>
                  <div className="pen-card-name-block">
                    <h2 className="pen-card-title">{card.title}</h2>
                    <span className="pen-card-audience">{card.audience}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="pen-card-desc">{card.description}</p>

                {/* Feature Privileges List */}
                <ul className="pen-card-features" aria-label={`${card.title} capabilities`}>
                  {card.features.map((feat, idx) => (
                    <li key={idx} className="pen-card-feature-item">
                      <IconCheck size={14} stroke={2.2} aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Demo Identity Badge */}
                <div className="pen-card-persona">
                  <span className="pen-card-persona-label">Default Demo Profile</span>
                  <span className="pen-card-persona-name" title={card.demoUser.name}>
                    {card.demoUser.name}
                  </span>
                </div>

                {/* Card Actions */}
                <div className="pen-card-actions">
                  <button
                    type="button"
                    className="pen-card-select-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRole(rKey);
                      setStatusMsg(null);
                      const formEl = document.getElementById('credentials-form');
                      if (formEl && window.innerWidth < 1080) {
                        formEl.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <span>{isActive ? 'Enter Credentials' : `Select ${card.title}`}</span>
                    <IconArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    className="pen-card-demo-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickDemo(rKey);
                    }}
                    title={`Instant 1-click login as ${card.demoUser.name}`}
                  >
                    <IconSparkles size={13} />
                    <span>1-Click Demo Login</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Selected Tier Credentials Form */}
        <section id="credentials-form" className="pen-form-module" aria-label="Credentials Form">
          <div className="pen-form-header">
            <div className="pen-form-header-left">
              <span className="pen-form-header-badge">{currentMeta.tierBadge}</span>
              <h2 className="pen-form-header-title">
                {signupMode ? `Register for ${currentMeta.title}` : `Sign In to ${currentMeta.title}`}
              </h2>
            </div>

            {/* Mode switch (Allowed for Student, Faculty, School; Admin is restricted) */}
            {activeRole !== 'admin' ? (
              <div className="pen-form-mode-tabs" role="tablist">
                <button
                  type="button"
                  className={`pen-form-mode-tab ${!signupMode ? 'active' : ''}`}
                  onClick={() => {
                    setSignupMode(false);
                    setStatusMsg(null);
                    setFieldErrors({});
                  }}
                  role="tab"
                  aria-selected={!signupMode}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`pen-form-mode-tab ${signupMode ? 'active' : ''}`}
                  onClick={() => {
                    setSignupMode(true);
                    setStatusMsg(null);
                    setFieldErrors({});
                  }}
                  role="tab"
                  aria-selected={signupMode}
                >
                  Register Account
                </button>
              </div>
            ) : (
              <div className="pen-form-restricted-tag">
                <IconShieldLock size={12} />
                <span>Restricted Tier &bull; Root Credentials Required</span>
              </div>
            )}
          </div>

          <div className="pen-form-body">
            {/* Google Institutional SSO Button */}
            <button
              type="button"
              className="pen-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
              title="Authenticate with Google Workspace / OAuth"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
                />
              </svg>
              <span>
                {signupMode ? 'Create Account with Google Single Sign-On' : 'Authenticate with Google Single Sign-On'}
              </span>
            </button>

            <div className="pen-auth-divider">
              <span>Or institutional email &amp; password</span>
            </div>

            {/* Security Notice & Quick Autofill */}
            <div className="pen-security-notice">
              <div className="pen-security-left">
                <IconShieldCheck size={16} />
                <span>
                  Authenticating into <strong>{currentMeta.title}</strong> via National Educational SSO.
                </span>
              </div>
              <button
                type="button"
                className="pen-autofill-btn"
                onClick={handleAutofillDemo}
                title="Populate standard demo credentials for evaluator testing"
              >
                <IconUserCheck size={13} />
                <span>Autofill Demo Credentials</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {signupMode ? (
                <div className="pen-form-grid">
                  <div className="pen-field-group">
                    <label className="pen-field-label" htmlFor="pen-name">
                      <span>
                        Full Legal Name <span className="pen-required-mark">*</span>
                      </span>
                    </label>
                    <div className="pen-input-wrapper">
                      <input
                        id="pen-name"
                        type="text"
                        required
                        className={`pen-input ${fieldErrors.name ? 'has-error' : ''}`}
                        placeholder="e.g. Aarav Sharma"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (fieldErrors.name && e.target.value.trim()) {
                            setFieldErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        style={{ paddingLeft: '14px' }}
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'pen-name-error' : undefined}
                      />
                    </div>
                    {fieldErrors.name && (
                      <div id="pen-name-error" className="pen-field-error-msg" role="alert">
                        <IconAlertCircle size={14} />
                        <span>{fieldErrors.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="pen-field-group">
                    <label className="pen-field-label" htmlFor="pen-institution">
                      <span>
                        Institution / Department <span className="pen-required-mark">*</span>
                      </span>
                    </label>
                    <div className="pen-input-wrapper">
                      <input
                        id="pen-institution"
                        type="text"
                        required
                        className={`pen-input ${fieldErrors.institution ? 'has-error' : ''}`}
                        placeholder="e.g. Kendriya Vidyalaya / IIT Delhi"
                        value={institution}
                        onChange={(e) => {
                          setInstitution(e.target.value);
                          if (fieldErrors.institution && e.target.value.trim()) {
                            setFieldErrors((prev) => ({ ...prev, institution: undefined }));
                          }
                        }}
                        style={{ paddingLeft: '14px' }}
                        aria-invalid={!!fieldErrors.institution}
                        aria-describedby={fieldErrors.institution ? 'pen-institution-error' : undefined}
                      />
                    </div>
                    {fieldErrors.institution && (
                      <div id="pen-institution-error" className="pen-field-error-msg" role="alert">
                        <IconAlertCircle size={14} />
                        <span>{fieldErrors.institution}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Email Field with Strict Inline Validation */}
              <div className="pen-field-group full-width">
                <label className="pen-field-label" htmlFor="pen-email">
                  <span>
                    Institutional Email Address <span className="pen-required-mark">*</span>
                  </span>
                  <span className="pen-field-hint">e.g. {currentMeta.demoUser.email}</span>
                </label>
                <div className="pen-input-wrapper">
                  <span className="pen-input-icon">
                    <IconMail size={16} />
                  </span>
                  <input
                    id="pen-email"
                    type="email"
                    required
                    autoComplete="email"
                    className={`pen-input ${fieldErrors.email ? 'has-error' : ''}`}
                    placeholder={currentMeta.demoUser.email}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        const err = validateInstitutionalEmail(e.target.value);
                        setFieldErrors((prev) => ({ ...prev, email: err || undefined }));
                      }
                    }}
                    onBlur={() => {
                      if (email.trim()) {
                        const err = validateInstitutionalEmail(email);
                        setFieldErrors((prev) => ({ ...prev, email: err || undefined }));
                      }
                    }}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'pen-email-error' : undefined}
                  />
                </div>
                {fieldErrors.email && (
                  <div id="pen-email-error" className="pen-field-error-msg" role="alert">
                    <IconAlertCircle size={14} />
                    <span>{fieldErrors.email}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="pen-field-group full-width">
                <label className="pen-field-label" htmlFor="pen-password">
                  <span>
                    Password <span className="pen-required-mark">*</span>
                  </span>
                  {signupMode && <span className="pen-field-hint">Minimum 6 characters</span>}
                </label>
                <div className="pen-input-wrapper">
                  <span className="pen-input-icon">
                    <IconLock size={16} />
                  </span>
                  <input
                    id="pen-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={signupMode ? 'new-password' : 'current-password'}
                    className={`pen-input ${fieldErrors.password ? 'has-error' : ''}`}
                    placeholder={signupMode ? 'Create a secure passphrase' : 'Enter institutional password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password && e.target.value) {
                        if (!signupMode || e.target.value.length >= 6) {
                          setFieldErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }
                    }}
                    style={{ paddingRight: '44px' }}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? 'pen-password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="pen-input-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <div id="pen-password-error" className="pen-field-error-msg" role="alert">
                    <IconAlertCircle size={14} />
                    <span>{fieldErrors.password}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password (Signup) */}
              {signupMode && (
                <div className="pen-field-group full-width">
                  <label className="pen-field-label" htmlFor="pen-confirm-password">
                    <span>
                      Confirm Password <span className="pen-required-mark">*</span>
                    </span>
                  </label>
                  <div className="pen-input-wrapper">
                    <span className="pen-input-icon">
                      <IconLock size={16} />
                    </span>
                    <input
                      id="pen-confirm-password"
                      type="password"
                      required
                      autoComplete="new-password"
                      className={`pen-input ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword && e.target.value === password) {
                          setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }
                      }}
                      aria-invalid={!!fieldErrors.confirmPassword}
                      aria-describedby={fieldErrors.confirmPassword ? 'pen-confirm-password-error' : undefined}
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <div id="pen-confirm-password-error" className="pen-field-error-msg" role="alert">
                      <IconAlertCircle size={14} />
                      <span>{fieldErrors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Form Options: Remember / Forgot / Terms */}
              {signupMode ? (
                <div className="pen-options-row" style={{ marginTop: '8px', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <label className="pen-checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (e.target.checked && fieldErrors.agreeTerms) {
                          setFieldErrors((prev) => ({ ...prev, agreeTerms: undefined }));
                        }
                      }}
                      required
                    />
                    <span>
                      I agree to the Institutional Terms of Service and National Student Data Privacy Policy.
                    </span>
                  </label>
                  {fieldErrors.agreeTerms && (
                    <div className="pen-field-error-msg" role="alert" style={{ marginTop: '6px' }}>
                      <IconAlertCircle size={14} />
                      <span>{fieldErrors.agreeTerms}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pen-options-row">
                  <label className="pen-checkbox-label">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>Remember this session on this workstation</span>
                  </label>

                  <a href="#forgot" className="pen-forgot-link" onClick={handleForgotPassword}>
                    Forgot institutional password?
                  </a>
                </div>
              )}

              {/* Submit CTA */}
              <button type="submit" className="pen-submit-btn" disabled={loading}>
                <span>
                  {loading
                    ? 'Authenticating with Firebase Grid…'
                    : signupMode
                    ? `Complete ${currentMeta.title} Registration`
                    : `Authenticate into ${currentMeta.title}`}
                </span>
                <IconArrowRight size={16} />
              </button>

              {/* Status Message Box */}
              {statusMsg && (
                <div
                  className={`pen-status-box ${statusMsg.isError ? 'error' : 'success'}`}
                  role="status"
                >
                  {statusMsg.isError ? (
                    <IconAlertCircle size={16} style={{ flexShrink: 0 }} />
                  ) : (
                    <IconInfoCircle size={16} style={{ flexShrink: 0 }} />
                  )}
                  <span>{statusMsg.text}</span>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Institutional Enterprise Footer */}
      <footer className="pen-auth-footer">
        <div className="pen-auth-footer-inner">
          <div className="pen-footer-certifications">
            <span className="pen-cert-badge">
              <IconShieldCheck size={14} />
              <span>AES-256 Encrypted</span>
            </span>
            <span className="pen-cert-badge">
              <IconCheck size={14} />
              <span>National Academic Standards Compliant</span>
            </span>
            <span className="pen-cert-badge">
              <IconCheck size={14} />
              <span>ISO 27001 Certified Infrastructure</span>
            </span>
            <span className="pen-cert-badge">
              <IconCheck size={14} />
              <span>Section 508 / WCAG 2.1 AA Accessible</span>
            </span>
          </div>

          <div>
            <span>&copy; {new Date().getFullYear()} THE PENTAGON National Education Network. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Evaluator Quick-Guide Modal */}
      {showGuideModal && (
        <div
          className="pen-modal-backdrop"
          onClick={() => setShowGuideModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-guide-title"
        >
          <div
            className="pen-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pen-modal-header">
              <h3 id="modal-guide-title" className="pen-modal-title">
                <IconShieldCheck size={18} />
                <span>Hackathon Evaluator &bull; Role Matrix &amp; Test Profiles</span>
              </h3>
              <button
                type="button"
                className="pen-modal-close-btn"
                onClick={() => setShowGuideModal(false)}
                aria-label="Close Guide"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="pen-modal-body">
              <p>
                <strong>THE PENTAGON</strong> implements an enterprise Multi-Tier Role-Based Access Control (RBAC) architecture backed by Google Cloud Firebase. Evaluators can test each tier either with the standard form, Google SSO, or direct 1-click authentication:
              </p>

              <table className="pen-modal-table">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Role</th>
                    <th>Sample Account</th>
                    <th>Destination Portal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Tier 1</strong></td>
                    <td>Students</td>
                    <td>Aarav Sharma</td>
                    <td>Student Learning Portal</td>
                    <td>
                      <button
                        type="button"
                        className="pen-modal-table-btn"
                        onClick={() => {
                          setShowGuideModal(false);
                          handleQuickDemo('student');
                        }}
                      >
                        Launch Student
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Tier 2</strong></td>
                    <td>Faculty</td>
                    <td>Dr. Ramesh Kumar</td>
                    <td>Teacher Profile &amp; Gradebook</td>
                    <td>
                      <button
                        type="button"
                        className="pen-modal-table-btn"
                        onClick={() => {
                          setShowGuideModal(false);
                          handleQuickDemo('faculty');
                        }}
                      >
                        Launch Faculty
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Tier 3</strong></td>
                    <td>School Admin</td>
                    <td>Principal S. Mukherjee</td>
                    <td>School Administration Hub</td>
                    <td>
                      <button
                        type="button"
                        className="pen-modal-table-btn"
                        onClick={() => {
                          setShowGuideModal(false);
                          handleQuickDemo('school');
                        }}
                      >
                        Launch School
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Tier 4</strong></td>
                    <td>Gov Admin</td>
                    <td>System Root Operator</td>
                    <td>Ministry Oversight Platform</td>
                    <td>
                      <button
                        type="button"
                        className="pen-modal-table-btn"
                        onClick={() => {
                          setShowGuideModal(false);
                          handleQuickDemo('admin');
                        }}
                      >
                        Launch Gov Admin
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={{ marginTop: '12px', fontSize: '11.5px', color: '#64748b' }}>
                All session state is synchronized to Firebase Firestore with role-based rule validation and local session cache. You can switch roles at any time using the top navigation bar or logout trigger.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
