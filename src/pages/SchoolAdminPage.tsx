import React, { useState } from 'react';
import { NetworkBg } from '../components/NetworkBg';
import { PortalTopBar } from '../components/PortalTopBar';
import {
  IconBuilding,
  IconUsers,
  IconSchool,
  IconChartBar,
  IconBell,
  IconPlus,
  IconDownload,
  IconSearch,
  IconCheck,
  IconCalendarEvent,
  IconFileText,
  IconMail,
  IconTrendingUp,
} from '@tabler/icons-react';

interface SchoolAdminPageProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

interface FacultyMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  experience: string;
  rating: number;
  classes: number;
  email: string;
}

interface Notice {
  id: string;
  title: string;
  dept: string;
  date: string;
  priority: 'normal' | 'urgent';
  desc: string;
}

export const SchoolAdminPage: React.FC<SchoolAdminPageProps> = ({
  onNavigate,
  onLogout,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'faculty' | 'departments' | 'notices'>('overview');
  const [searchFaculty, setSearchFaculty] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 'n1',
      title: 'Term 1 Final Examination Schedule Published',
      dept: 'Academic Council',
      date: '2026-10-14',
      priority: 'urgent',
      desc: 'Examinations for Grades 9 through 12 commence on November 10. All faculty must submit question blueprints by October 28.',
    },
    {
      id: 'n2',
      title: 'District Inter-School STEM Competition Nominations',
      dept: 'Science Department',
      date: '2026-10-12',
      priority: 'normal',
      desc: 'Nominations open for the 2026 State Science & Robotics Fair. Mentorship hours eligible for credit.',
    },
    {
      id: 'n3',
      title: 'Parent-Teacher Consultations - Phase 2',
      dept: 'Administration',
      date: '2026-10-08',
      priority: 'normal',
      desc: 'Online consultation bookings are now live on the student portal for all parents.',
    },
  ]);

  const [facultyList, setFacultyList] = useState<FacultyMember[]>([
    {
      id: 'f1',
      name: 'Dr. Ramesh Kumar',
      role: 'Senior Science & Physics Teacher',
      dept: 'Science',
      experience: '18 yrs',
      rating: 4.9,
      classes: 4,
      email: 'ramesh.kumar@thepentagon.edu',
    },
    {
      id: 'f2',
      name: 'Ms. Priya Nair',
      role: 'Head of Mathematics',
      dept: 'Mathematics',
      experience: '12 yrs',
      rating: 4.8,
      classes: 5,
      email: 'priya.nair@thepentagon.edu',
    },
    {
      id: 'f3',
      name: 'Mrs. Kavitha M.',
      role: 'Senior English & Humanities Teacher',
      dept: 'Languages',
      experience: '15 yrs',
      rating: 4.7,
      classes: 4,
      email: 'kavitha.m@thepentagon.edu',
    },
    {
      id: 'f4',
      name: 'Dr. Sunil Verma',
      role: 'Chemistry Faculty Lead',
      dept: 'Science',
      experience: '9 yrs',
      rating: 4.8,
      classes: 3,
      email: 'sunil.verma@thepentagon.edu',
    },
    {
      id: 'f5',
      name: 'Mr. Arvind Joshi',
      role: 'Computer Science & AI Instructor',
      dept: 'Technology',
      experience: '7 yrs',
      rating: 4.9,
      classes: 4,
      email: 'arvind.joshi@thepentagon.edu',
    },
  ]);

  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeDept, setNewNoticeDept] = useState('Academic Council');
  const [newNoticeDesc, setNewNoticeDesc] = useState('');
  const [newNoticeUrgent, setNewNoticeUrgent] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);

  const departments = [
    { name: 'Science & Technology', code: 'Science', faculty: 28, students: 480, avg: 86.4, lead: 'Dr. Ramesh Kumar' },
    { name: 'Mathematics & Computing', code: 'Mathematics', faculty: 22, students: 480, avg: 83.8, lead: 'Ms. Priya Nair' },
    { name: 'Languages & Literature', code: 'Languages', faculty: 18, students: 480, avg: 88.2, lead: 'Mrs. Kavitha M.' },
    { name: 'Humanities & Social Sciences', code: 'Humanities', faculty: 14, students: 340, avg: 82.5, lead: 'Mr. D. Sengupta' },
    { name: 'Arts & Physical Education', code: 'Arts', faculty: 10, students: 480, avg: 91.0, lead: 'Coach R. Gill' },
  ];

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeDesc.trim()) {
      onToast('Please enter both title and description');
      return;
    }
    const newN: Notice = {
      id: 'n_' + Date.now(),
      title: newNoticeTitle.trim(),
      dept: newNoticeDept,
      date: new Date().toISOString().split('T')[0],
      priority: newNoticeUrgent ? 'urgent' : 'normal',
      desc: newNoticeDesc.trim(),
    };
    setNotices([newN, ...notices]);
    setNewNoticeTitle('');
    setNewNoticeDesc('');
    setNewNoticeUrgent(false);
    setNoticeModalOpen(false);
    onToast('Official notice published to campus portal');
  };

  const filteredFaculty = facultyList.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(searchFaculty.toLowerCase()) ||
      f.role.toLowerCase().includes(searchFaculty.toLowerCase()) ||
      f.email.toLowerCase().includes(searchFaculty.toLowerCase());
    const matchDept = selectedDept === 'all' || f.dept.toLowerCase() === selectedDept.toLowerCase();
    return matchSearch && matchDept;
  });

  return (
    <div className="school-admin-root" style={{ minHeight: '100vh', position: 'relative', background: '#0a101f' }}>
      <NetworkBg rgb="100,140,240" alpha={0.16} />

      <PortalTopBar
        currentView="school-admin"
        role="school"
        userName="Principal S. Mukherjee"
        onNavigate={onNavigate}
        onLogout={onLogout}
        onToast={onToast}
      />

      <main className="page" style={{ position: 'relative', zIndex: 1, padding: '32px 24px 80px', maxWidth: '1240px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#60a5fa', fontWeight: 600 }}>
                Institutional Leadership Portal
              </span>
              <span style={{ background: 'rgba(59,130,246,0.18)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                Academic Year 2026–27
              </span>
            </div>
            <h1 style={{ color: '#fff', fontSize: '28px', margin: 0, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
              The Pentagon Campus Administration
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0' }}>
              Overviewing 1,480 enrolled students, 92 faculty members, and institutional learning performance.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => {
                onToast('Campus Attendance & Analytics Report downloaded (.csv)');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IconDownload size={16} />
              Export Report
            </button>
            <button
              type="button"
              className="btn sm"
              onClick={() => setNoticeModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IconPlus size={16} />
              Publish Circular
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Enrolled Students</span>
              <span style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.15)', padding: '6px', borderRadius: '8px' }}>
                <IconSchool size={18} />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>1,480</div>
            <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <IconTrendingUp size={14} /> +4.2% vs last term
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Teaching Faculty</span>
              <span style={{ color: '#a855f7', background: 'rgba(168,85,247,0.15)', padding: '6px', borderRadius: '8px' }}>
                <IconUsers size={18} />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>92</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              100% active in classroom portal
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Average Campus Attendance</span>
              <span style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '6px', borderRadius: '8px' }}>
                <IconCheck size={18} />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>94.6%</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
              Above district benchmark (90%)
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Academic Aggregate</span>
              <span style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.15)', padding: '6px', borderRadius: '8px' }}>
                <IconChartBar size={18} />
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>84.2%</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Across 36 active cohorts
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: '24px' }}>
          {(
            [
              ['overview', 'Campus Overview'],
              ['departments', 'Departments (5)'],
              ['faculty', 'Faculty Directory'],
              ['notices', 'Notices & Circulars'],
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
                borderBottom: activeTab === key ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === key ? '#60a5fa' : '#94a3b8',
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

        {/* TAB CONTENTS */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Department Highlights */}
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 16px' }}>Academic Departments Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {departments.map((d) => (
                    <div key={d.code} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <strong style={{ color: '#f1f5f9', fontSize: '14.5px' }}>{d.name}</strong>
                          <span style={{ color: '#94a3b8', fontSize: '12.5px', marginLeft: '10px' }}>Lead: {d.lead}</span>
                        </div>
                        <span style={{ color: '#60a5fa', fontWeight: 600, fontSize: '14.5px' }}>{d.avg}% avg</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', width: `${d.avg}%`, height: '100%' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                        <span>{d.faculty} Faculty members</span>
                        <span>{d.students} Students enrolled</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Cohort Distribution */}
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 16px' }}>Cohort Breakdown</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                  {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g, i) => (
                    <div key={g} style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>{g}</div>
                      <div style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>{360 + i * 15}</div>
                      <div style={{ color: '#10b981', fontSize: '11px', marginTop: '4px' }}>{(83 + i * 1.5).toFixed(1)}% avg</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Notices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>Campus Circulars</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('notices')}
                    style={{ background: 'transparent', border: 'none', color: '#60a5fa', fontSize: '12px', cursor: 'pointer' }}
                  >
                    View all
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notices.slice(0, 3).map((n) => (
                    <div key={n.id} style={{ background: 'rgba(30,41,59,0.5)', padding: '12px', borderRadius: '8px', borderLeft: n.priority === 'urgent' ? '3px solid #ef4444' : '3px solid #3b82f6' }}>
                      <span style={{ fontSize: '11px', color: n.priority === 'urgent' ? '#f87171' : '#93c5fd', fontWeight: 600, textTransform: 'uppercase' }}>
                        {n.priority === 'urgent' ? 'Urgent · ' : ''}{n.dept}
                      </span>
                      <h4 style={{ color: '#fff', fontSize: '13px', margin: '3px 0 5px' }}>{n.title}</h4>
                      <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, lineHeight: 1.4 }}>{n.desc.slice(0, 80)}…</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Institution Actions */}
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px' }}>
                <h3 style={{ color: '#fff', fontSize: '16px', margin: '0 0 12px' }}>Quick Controls</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn ghost sm"
                    style={{ textAlign: 'left', width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => onNavigate('student-calendar')}
                  >
                    📅 View Academic Calendar
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm"
                    style={{ textAlign: 'left', width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => onToast('Campus syllabus audit running in background')}
                  >
                    📊 Trigger Syllabus Audit
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm"
                    style={{ textAlign: 'left', width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => onNavigate('teacher')}
                  >
                    👨‍🏫 Inspect Senior Faculty Profiles
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEPARTMENTS TAB */}
        {activeTab === 'departments' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {departments.map((d) => (
              <div key={d.code} style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 4px' }}>{d.name}</h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>HOD: {d.lead}</span>
                  </div>
                  <span style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                    {d.avg}% avg
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '16px 0', background: 'rgba(30,41,59,0.5)', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Faculty</span>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>{d.faculty} Staff</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Students</span>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>{d.students} Pupils</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn ghost sm"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setSelectedDept(d.code);
                      setActiveTab('faculty');
                    }}
                  >
                    View Faculty
                  </button>
                  <button
                    type="button"
                    className="btn sm"
                    style={{ flex: 1 }}
                    onClick={() => onToast(`Allocations updated for ${d.name}`)}
                  >
                    Manage Dept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FACULTY DIRECTORY TAB */}
        {activeTab === 'faculty' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div style={{ position: 'relative', minWidth: '260px' }}>
                <IconSearch size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search faculty by name, subject, or email…"
                  value={searchFaculty}
                  onChange={(e) => setSearchFaculty(e.target.value)}
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
                {['all', 'Science', 'Mathematics', 'Languages', 'Technology'].map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    style={{
                      background: selectedDept === dept ? '#2563eb' : 'rgba(30,41,59,0.6)',
                      color: selectedDept === dept ? '#fff' : '#94a3b8',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                    }}
                  >
                    {dept === 'all' ? 'All Departments' : dept}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredFaculty.map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(30, 41, 59, 0.45)',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '15px',
                      }}
                    >
                      {f.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', margin: 0, fontSize: '15px' }}>{f.name}</h4>
                      <span style={{ color: '#94a3b8', fontSize: '12.5px' }}>
                        {f.role} · {f.experience} experience
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 600 }}>⭐ {f.rating} rating</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>{f.classes} active classes</div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn ghost sm"
                        onClick={() => {
                          onToast(`Email drafted to ${f.email}`);
                        }}
                      >
                        <IconMail size={15} style={{ marginRight: '4px' }} />
                        Contact
                      </button>
                      <button
                        type="button"
                        className="btn sm"
                        onClick={() => {
                          if (f.id === 'f1') {
                            onNavigate('teacher');
                          } else {
                            onToast(`Opening portfolio for ${f.name}`);
                          }
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTICES TAB */}
        {activeTab === 'notices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Campus Circulars & Announcements</h3>
              <button type="button" className="btn sm" onClick={() => setNoticeModalOpen(true)}>
                + New Notice
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {notices.map((n) => (
                <div
                  key={n.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    borderLeft: n.priority === 'urgent' ? '4px solid #ef4444' : '4px solid #3b82f6',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: n.priority === 'urgent' ? '#f87171' : '#93c5fd', fontWeight: 600, textTransform: 'uppercase' }}>
                      {n.priority === 'urgent' ? '⚠️ URGENT · ' : ''}Issued by {n.dept}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{n.date}</span>
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px' }}>{n.title}</h4>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CREATE NOTICE MODAL */}
      {noticeModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 15, 36, 0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <form onSubmit={handlePublishNotice}>
              <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: '20px' }}>Publish Institutional Circular</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px' }}>
                This announcement will appear on student and faculty notice boards across the campus.
              </p>

              <label style={{ display: 'block', marginBottom: '12px', color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>
                Notice Title *
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Mid-Term Assessments"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: '#1e293b',
                    color: '#fff',
                    marginTop: '4px',
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '12px', color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>
                Issuing Department
                <select
                  value={newNoticeDept}
                  onChange={(e) => setNewNoticeDept(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: '#1e293b',
                    color: '#fff',
                    marginTop: '4px',
                  }}
                >
                  <option value="Academic Council">Academic Council</option>
                  <option value="Administration">Administration</option>
                  <option value="Science Department">Science Department</option>
                  <option value="Mathematics Department">Mathematics Department</option>
                  <option value="Examination Board">Examination Board</option>
                </select>
              </label>

              <label style={{ display: 'block', marginBottom: '12px', color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>
                Notice Content *
                <textarea
                  required
                  rows={4}
                  placeholder="Provide full announcement details..."
                  value={newNoticeDesc}
                  onChange={(e) => setNewNoticeDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: '#1e293b',
                    color: '#fff',
                    marginTop: '4px',
                  }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#f87171', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newNoticeUrgent}
                  onChange={(e) => setNewNoticeUrgent(e.target.checked)}
                />
                Mark as high-priority / urgent alert
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setNoticeModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
