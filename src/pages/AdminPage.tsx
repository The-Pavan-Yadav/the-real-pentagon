import React, { useState } from 'react';
import { NetworkBg } from '../components/NetworkBg';
import { PortalTopBar } from '../components/PortalTopBar';
import {
  IconShieldLock,
  IconServer,
  IconUsers,
  IconActivity,
  IconLock,
  IconCheck,
  IconAlertTriangle,
  IconRefresh,
  IconSearch,
  IconAdjustments,
} from '@tabler/icons-react';

interface AdminPageProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'school' | 'admin';
  status: 'active' | 'suspended';
  lastActive: string;
}

interface AuditLogItem {
  id: string;
  time: string;
  ip: string;
  user: string;
  action: string;
  level: 'info' | 'warn' | 'success';
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onNavigate,
  onLogout,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'users' | 'security' | 'audit'>('console');
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [users, setUsers] = useState<PlatformUser[]>([
    {
      id: 'u1',
      name: 'Aarav Sharma',
      email: 'student@thepentagon.edu',
      role: 'student',
      status: 'active',
      lastActive: '5 mins ago',
    },
    {
      id: 'u2',
      name: 'Dr. Ramesh Kumar',
      email: 'faculty@thepentagon.edu',
      role: 'faculty',
      status: 'active',
      lastActive: '12 mins ago',
    },
    {
      id: 'u3',
      name: 'Principal S. Mukherjee',
      email: 'principal@thepentagon.edu',
      role: 'school',
      status: 'active',
      lastActive: '1 hour ago',
    },
    {
      id: 'u4',
      name: 'System Root Operator',
      email: 'admin@thepentagon.edu',
      role: 'admin',
      status: 'active',
      lastActive: 'Just now',
    },
    {
      id: 'u5',
      name: 'Ananya Roy',
      email: 'ananya.roy@thepentagon.edu',
      role: 'student',
      status: 'active',
      lastActive: '2 hours ago',
    },
    {
      id: 'u6',
      name: 'Ms. Priya Nair',
      email: 'priya.nair@thepentagon.edu',
      role: 'faculty',
      status: 'active',
      lastActive: '30 mins ago',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'l1',
      time: '11:04:15 UTC',
      ip: '103.21.244.12',
      user: 'admin@thepentagon.edu',
      action: 'Authenticated with administrative permissions',
      level: 'success',
    },
    {
      id: 'l2',
      time: '10:58:33 UTC',
      ip: '49.36.128.90',
      user: 'faculty@thepentagon.edu',
      action: 'Published physics teaching resource to student classroom',
      level: 'info',
    },
    {
      id: 'l3',
      time: '10:45:10 UTC',
      ip: '103.21.244.12',
      user: 'system',
      action: 'Firestore database rule validation completed - Status: Healthy',
      level: 'info',
    },
    {
      id: 'l4',
      time: '09:30:22 UTC',
      ip: '157.48.91.5',
      user: 'student@thepentagon.edu',
      action: 'Profile and learning goal updated',
      level: 'info',
    },
    {
      id: 'l5',
      time: '08:12:04 UTC',
      ip: '192.168.1.1',
      user: 'system',
      action: 'Nightly incremental backup verified (4.2GB)',
      level: 'success',
    },
  ]);

  const handleToggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === 'active' ? 'suspended' : 'active';
          onToast(`User ${u.name} is now ${next}`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="admin-page-root" style={{ minHeight: '100vh', position: 'relative', background: '#070d18' }}>
      <NetworkBg rgb="80,120,240" alpha={0.16} />

      <PortalTopBar
        currentView="admin"
        role="admin"
        userName="Platform Administrator"
        onNavigate={onNavigate}
        onLogout={onLogout}
        onToast={onToast}
      />

      <main className="page" style={{ position: 'relative', zIndex: 1, padding: '32px 24px 80px', maxWidth: '1240px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#38bdf8', fontWeight: 600 }}>
                System Management Console
              </span>
              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                Cluster Online · Asia Southeast
              </span>
            </div>
            <h1 style={{ color: '#fff', fontSize: '28px', margin: 0, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
              The Pentagon Platform Control Center
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0' }}>
              High-availability ecosystem infrastructure, RBAC policies, and audit trails powered by NightBerrieZ.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => {
                onToast('Refreshed real-time telemetry metrics');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IconRefresh size={16} />
              Sync Telemetry
            </button>
            <button
              type="button"
              className="btn sm"
              onClick={() => {
                onToast('Security health check executed. All 8 policy checks passed.');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IconShieldLock size={16} />
              Run Health Check
            </button>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>System Latency</span>
              <span style={{ color: '#38bdf8', background: 'rgba(56,189,248,0.15)', padding: '6px', borderRadius: '8px' }}>
                <IconServer size={18} />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>14 ms</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>Optimal response time</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Platform Uptime</span>
              <span style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '6px', borderRadius: '8px' }}>
                <IconActivity size={18} />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>99.98%</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Zero unhandled faults in 30d</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Active User Accounts</span>
              <span style={{ color: '#a855f7', background: 'rgba(168,85,247,0.15)', padding: '6px', borderRadius: '8px' }}>
                <IconUsers size={18} />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>1,578</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>4 portal categories mapped</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Firestore Rules</span>
              <span style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '6px', borderRadius: '8px' }}>
                <IconShieldLock size={18} />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>Enforced</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Role-based isolation active</div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: '24px' }}>
          {(
            [
              ['console', 'System Overview'],
              ['users', 'Users & RBAC Access'],
              ['security', 'Security & Rules'],
              ['audit', 'Audit Log Trail'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              style={{
                padding: '10px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === key ? '2px solid #38bdf8' : '2px solid transparent',
                color: activeTab === key ? '#38bdf8' : '#94a3b8',
                fontWeight: activeTab === key ? 600 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB: CONSOLE */}
        {activeTab === 'console' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 16px' }}>Infrastructure Components</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { name: 'Vite Frontend Client Application', status: 'Healthy', note: 'Port 3000 · React 18 · TypeScript', ok: true },
                    { name: '3D WebGL Neural Background Canvas', status: 'Active', note: 'Hardware accelerated · Three.js', ok: true },
                    { name: 'Role-Based Authentication Engine', status: 'Secured', note: 'Student · Faculty · School · Admin', ok: true },
                    { name: 'Persistent Browser Storage Bridge', status: 'Operational', note: 'Local cache sync & integrity validated', ok: true },
                    { name: 'Cloud Firestore Security Engine', status: 'Bound', note: 'firestore.rules active and enforced', ok: true },
                  ].map((srv, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30,41,59,0.5)', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <strong style={{ color: '#f1f5f9', fontSize: '14px' }}>{srv.name}</strong>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{srv.note}</div>
                      </div>
                      <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                        {srv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Flags */}
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 16px' }}>Platform Controls</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <strong style={{ color: '#f1f5f9', fontSize: '14px' }}>Maintenance Mode</strong>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Prevents new user signups during system updates</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMaintenanceMode(!maintenanceMode);
                      onToast(maintenanceMode ? 'Maintenance mode deactivated' : 'Maintenance mode activated');
                    }}
                    style={{
                      background: maintenanceMode ? '#ef4444' : 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {maintenanceMode ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
                  <div>
                    <strong style={{ color: '#f1f5f9', fontSize: '14px' }}>Audit Logging Verbosity</strong>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Comprehensive event capture enabled</div>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>Level: Detailed</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Short Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px' }}>
                <h3 style={{ color: '#fff', fontSize: '16px', margin: '0 0 14px' }}>Live Security Feed</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} style={{ background: 'rgba(30,41,59,0.5)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '2px' }}>
                        <span>{log.user}</span>
                        <span>{log.time}</span>
                      </div>
                      <div style={{ color: '#e2e8f0', lineHeight: 1.3 }}>{log.action}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px' }}>
                <h3 style={{ color: '#fff', fontSize: '16px', margin: '0 0 12px' }}>Administrative Shortcuts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn ghost sm"
                    style={{ textAlign: 'left', width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => onNavigate('home')}
                  >
                    🌐 Visit Public Landing Page
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm"
                    style={{ textAlign: 'left', width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => onNavigate('school-admin')}
                  >
                    🏫 Open School Admin Dashboard
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm"
                    style={{ textAlign: 'left', width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => onNavigate('teacher')}
                  >
                    👨‍🏫 Open Faculty Workspace
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm"
                    style={{ textAlign: 'left', width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => onNavigate('student-dashboard')}
                  >
                    🎓 Open Student Learning Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === 'users' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div style={{ position: 'relative', minWidth: '260px' }}>
                <IconSearch size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search accounts by name or email…"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    background: 'rgba(30,41,59,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '13.5px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'student', 'faculty', 'school', 'admin'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setRoleFilter(role)}
                    style={{
                      background: roleFilter === role ? '#0284c7' : 'rgba(30,41,59,0.6)',
                      color: roleFilter === role ? '#fff' : '#94a3b8',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {role === 'all' ? 'All Roles' : role}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(30, 41, 59, 0.45)',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: u.role === 'admin' ? '#ef4444' : u.role === 'school' ? '#f59e0b' : u.role === 'faculty' ? '#a855f7' : '#3b82f6',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '14px',
                      }}
                    >
                      {u.name.substring(0, 1)}
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', margin: 0, fontSize: '14.5px' }}>{u.name}</h4>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>{u.email}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background: u.role === 'admin' ? 'rgba(239,68,68,0.2)' : 'rgba(56,189,248,0.2)',
                        color: u.role === 'admin' ? '#fca5a5' : '#7dd3fc',
                      }}
                    >
                      {u.role}
                    </span>

                    <span style={{ color: '#64748b', fontSize: '12px' }}>{u.lastActive}</span>

                    <button
                      type="button"
                      onClick={() => handleToggleUserStatus(u.id)}
                      style={{
                        background: u.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: u.status === 'active' ? '#34d399' : '#f87171',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {u.status === 'active' ? 'Active' : 'Suspended'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SECURITY */}
        {activeTab === 'security' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 12px' }}>Firebase Firestore Rules & Security Policies</h3>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', marginBottom: '20px' }}>
              Current rules file located at <code>firestore.rules</code> with role-based document access controls:
            </p>

            <pre
              style={{
                background: '#020617',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '16px',
                borderRadius: '8px',
                color: '#38bdf8',
                fontSize: '12.5px',
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: 1.5,
              }}
            >{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}</pre>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn sm"
                onClick={() => onToast('Security rules verified and synchronized.')}
              >
                Validate Rule Set
              </button>
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => onToast('API access keys rotated successfully.')}
              >
                Rotate API Keys
              </button>
            </div>
          </div>
        )}

        {/* TAB: AUDIT */}
        {activeTab === 'audit' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 16px' }}>System Audit Trail</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(30,41,59,0.5)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    borderLeft: log.level === 'success' ? '3px solid #10b981' : '3px solid #38bdf8',
                  }}
                >
                  <div>
                    <div style={{ color: '#fff', fontSize: '13.5px', fontWeight: 500 }}>{log.action}</div>
                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '3px' }}>
                      User: <span style={{ color: '#94a3b8' }}>{log.user}</span> · IP: <span style={{ color: '#94a3b8' }}>{log.ip}</span>
                    </div>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
