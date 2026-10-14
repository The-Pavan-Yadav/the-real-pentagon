import React from 'react';
import { NetworkBg } from '../components/NetworkBg';
import { PortalTopBar } from '../components/PortalTopBar';
import { StudentStore, ClassroomData } from '../types';
import {
  IconTrophy,
  IconChartBar,
  IconPlayerPlayFilled,
  IconCalendarEvent,
  IconNotebook,
  IconBook,
  IconBooks,
  IconClipboardCheck,
  IconBolt,
  IconFileText,
  IconClipboardList,
  IconReportAnalytics,
  IconBell,
  IconSparkles,
  IconBook2,
  IconArrowRight,
  IconChevronRight,
} from '@tabler/icons-react';

interface StudentClassPageProps {
  data: StudentStore;
  classroom: ClassroomData;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

export const StudentClassPage: React.FC<StudentClassPageProps> = ({
  data,
  classroom,
  onNavigate,
  onLogout,
  onToast,
}) => {
  const avg = data.marks.length
    ? data.marks.reduce((a, m) => a + m.marks, 0) / data.marks.length
    : null;

  const renderRing = (pct: number | null, text: string) => {
    const c = 2 * Math.PI * 50;
    const strokeDash = pct !== null ? c * (1 - Math.min(100, pct) / 100) : c;
    return (
      <div className="cl-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="rt" cx="60" cy="60" r="50" />
          <circle
            className="rv"
            cx="60"
            cy="60"
            r="50"
            strokeDasharray={c}
            strokeDashoffset={strokeDash}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <b>{text}</b>
      </div>
    );
  };

  const renderSmallRing = (pct: number | null, text: string) => {
    const c = 2 * Math.PI * 50;
    const strokeDash = pct !== null ? c * (1 - Math.min(100, pct) / 100) : c;
    return (
      <div className="cl-ring sm">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="rt" cx="60" cy="60" r="50" />
          <circle
            className="rv"
            cx="60"
            cy="60"
            r="50"
            strokeDasharray={c}
            strokeDashoffset={strokeDash}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <b>{text}</b>
      </div>
    );
  };

  // Build Leaderboard
  const studentName = data.profile?.name || 'Aarav Sharma';
  const leaderboardList = classroom.leaderboard
    .filter((r) => r.name.toLowerCase() !== studentName.toLowerCase())
    .map((r) => ({ name: r.name, avg: r.avg, me: false }));

  if (avg !== null) {
    leaderboardList.push({ name: studentName, avg, me: true });
  }
  leaderboardList.sort((a, b) => b.avg - a.avg);

  // Attendance computation
  const att = classroom.attendance;
  const attTotal = att ? att.present + att.absent : 0;
  const attPct = att && attTotal ? Math.round((att.present / attTotal) * 100) : null;

  // Format upcoming class times
  const dayLabel = (ts: number) => {
    const d = new Date(ts);
    const n = new Date();
    const t0 = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.round((d0.getTime() - t0.getTime()) / 864e5);
    return diff === 0
      ? 'Today'
      : diff === 1
      ? 'Tomorrow'
      : d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const now = Date.now() - 3600000;
  const upcomingClasses = classroom.classes
    .filter((c) => c.at >= now)
    .sort((a, b) => a.at - b.at);

  return (
    <div className="student-class-root" style={{ minHeight: '100vh', position: 'relative' }}>
      <NetworkBg rgb="150,125,90" alpha={0.22} />

      <PortalTopBar
        currentView="student-class"
        role="student"
        userName={data.profile?.name}
        avatarUrl={data.profile?.avatar}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onToast={onToast}
      />

      <main className="page cls" style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
        {/* HERO SUMMARY */}
        <section className="cl-hero">
          <div className="cl-who">
            <div
              className="cl-av"
              id="c-av"
              style={{
                backgroundImage: data.profile?.avatar ? `url("${data.profile.avatar}")` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!data.profile?.avatar && (data.profile?.name ? data.profile.name.charAt(0).toUpperCase() : 'A')}
            </div>
            <div>
              <h1 id="c-name">{data.profile?.name || 'Your name'}</h1>
              <p id="c-sub">
                {data.profile?.grade || 'Grade 10'} · {data.profile?.school || 'School name'}
              </p>
            </div>
          </div>

          <div className="cl-avg">
            <p className="cl-cap">Average marks</p>
            {renderRing(avg, avg !== null ? `${Math.round(avg)}%` : '--')}
            <p className="cl-note" id="avg-note">
              in {data.marks.length} {data.marks.length === 1 ? 'subject' : 'subjects'}
            </p>
          </div>

          <div className="cl-lb">
            <h2>
              <IconTrophy size={18} style={{ marginRight: '6px' }} />
              Class leaderboard
            </h2>
            <div id="lb">
              {leaderboardList.slice(0, 5).map((row, i) => (
                <div key={i} className={`cl-lbr ${row.me ? 'me' : ''}`}>
                  <span>
                    <em>{i + 1}</em>
                    {row.name} {row.me ? '(you)' : ''}
                  </span>
                  <span>{Math.round(row.avg)}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ANALYTICS */}
        <section className="card" id="analytics">
          <div className="head">
            <h2>
              <IconChartBar size={20} style={{ marginRight: '6px' }} />
              Classroom performance analytics
            </h2>
          </div>
          <div className="cl-an">
            <div className="cl-pn">
              <h3>Overall performance</h3>
              <div className="cl-ov">
                {renderSmallRing(avg, avg !== null ? `${Math.round(avg)}%` : '--')}
                <p id="ov-note">Based on your subject marks</p>
              </div>
            </div>

            <div className="cl-pn">
              <h3>Subject-wise average</h3>
              <div className="cl-leg">
                <span>
                  <i className="k1" />
                  Class average
                </span>
                <span>
                  <i className="k2" />
                  You
                </span>
              </div>
              <div className="cl-bars" id="bars">
                {data.marks.slice(0, 6).map((m) => {
                  const classSubAvg = classroom.classAvg[m.subject.toLowerCase()] || 78;
                  return (
                    <div key={m.id} className="g">
                      <div className="pair">
                        <i
                          className="c"
                          style={{ height: `${Math.min(100, classSubAvg)}%` }}
                          title="Class average"
                        >
                          <u>{Math.round(classSubAvg)}</u>
                        </i>
                        <i
                          className="y"
                          style={{ height: `${Math.min(100, m.marks)}%` }}
                          title="You"
                        >
                          <u>{Math.round(m.marks)}</u>
                        </i>
                      </div>
                      <span>{m.subject}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cl-pn">
              <h3>Attendance</h3>
              <div className="cl-ov">
                {renderSmallRing(attPct, attPct !== null ? `${attPct}%` : '--')}
                <ul className="cl-att" id="att">
                  <li>
                    <i />
                    Present <b>{att?.present || 48}</b>
                  </li>
                  <li>
                    <i className="d2" />
                    Absent <b>{att?.absent || 3}</b>
                  </li>
                  <li>
                    <i className="d3" />
                    Total <b>{attTotal || 51}</b>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="cl-src">Class averages and attendance are published by your teachers.</p>
        </section>

        {/* BANNERS */}
        <div className="cl-ban">
          <a
            href="#live"
            className="cl-b1"
            id="go-live"
            onClick={(e) => {
              e.preventDefault();
              const liveClass = upcomingClasses.find((c) => c.link);
              if (liveClass?.link) {
                window.open(liveClass.link, '_blank');
              } else {
                onToast('No active live class session at this moment.');
              }
            }}
          >
            <span className="cl-bi">
              <IconPlayerPlayFilled size={20} />
            </span>
            <span className="cl-bt">
              <b>Live classes</b>
              <small>Join your scheduled live sessions</small>
            </span>
            <IconArrowRight size={20} />
          </a>

          <a
            href="#calendar"
            className="cl-b2"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('student-calendar');
            }}
          >
            <span className="cl-bi">
              <IconCalendarEvent size={20} />
            </span>
            <span className="cl-bt">
              <b>My calendar</b>
              <small>See your classes and notes day by day</small>
            </span>
            <IconArrowRight size={20} />
          </a>
        </div>

        {/* TILES */}
        <div className="cl-tiles">
          <a
            href="#journal"
            className="cl-t t1"
            onClick={(e) => {
              e.preventDefault();
              onToast('School journal is coming soon.');
            }}
          >
            <span className="cl-ic">
              <IconNotebook size={20} />
            </span>
            <b>School journal</b>
            <small>Daily notes, announcements and updates</small>
          </a>
          <a
            href="#syllabus"
            className="cl-t t2"
            onClick={(e) => {
              e.preventDefault();
              onToast('Syllabus tracker is coming soon.');
            }}
          >
            <span className="cl-ic">
              <IconBook size={20} />
            </span>
            <b>Syllabus</b>
            <small>Track your syllabus and progress</small>
          </a>
          <a
            href="#library"
            className="cl-t t3"
            onClick={(e) => {
              e.preventDefault();
              onToast('E-library is coming soon.');
            }}
          >
            <span className="cl-ic">
              <IconBooks size={20} />
            </span>
            <b>Library</b>
            <small>E-books, study material and resources</small>
          </a>
          <a
            href="#quiz"
            className="cl-t t1"
            onClick={(e) => {
              e.preventDefault();
              onToast('Practice Quiz module is coming soon.');
            }}
          >
            <span className="cl-ic">
              <IconClipboardCheck size={20} />
            </span>
            <b>Quiz</b>
            <small>Practice, test and improve</small>
          </a>
        </div>

        {/* QUICK ACCESS + UPCOMING */}
        <div className="cl-two">
          <section className="card">
            <div className="head">
              <h2>
                <IconBolt size={20} style={{ marginRight: '6px' }} />
                Quick access
              </h2>
            </div>
            <a
              href="#notes"
              className="cl-q"
              onClick={(e) => {
                e.preventDefault();
                onToast('Class notes module is coming soon.');
              }}
            >
              <span className="cl-ic">
                <IconFileText size={18} />
              </span>
              <span>
                <b>Class notes</b>
                <small>Your notes, board notes and AI notes</small>
              </span>
              <IconChevronRight size={18} />
            </a>
            <a
              href="#assignments"
              className="cl-q"
              onClick={(e) => {
                e.preventDefault();
                onToast('Assignments module is coming soon.');
              }}
            >
              <span className="cl-ic">
                <IconClipboardList size={18} />
              </span>
              <span>
                <b>Assignments</b>
                <small>Pending and completed tasks</small>
              </span>
              <IconChevronRight size={18} />
            </a>
            <a
              href="#report"
              className="cl-q"
              onClick={(e) => {
                e.preventDefault();
                onToast('Detailed performance report is coming soon.');
              }}
            >
              <span className="cl-ic">
                <IconReportAnalytics size={18} />
              </span>
              <span>
                <b>Performance report</b>
                <small>Detailed subject-wise report</small>
              </span>
              <IconChevronRight size={18} />
            </a>
            <a
              href="#announcements"
              className="cl-q"
              onClick={(e) => {
                e.preventDefault();
                onToast('Class announcements is coming soon.');
              }}
            >
              <span className="cl-ic">
                <IconBell size={18} />
              </span>
              <span>
                <b>Class announcements</b>
                <small>Latest updates from your teacher</small>
              </span>
              <IconChevronRight size={18} />
            </a>
          </section>

          <section className="card" id="upcoming">
            <div className="head">
              <h2>
                <IconCalendarEvent size={20} style={{ marginRight: '6px' }} />
                Upcoming classes
              </h2>
            </div>
            <div id="cls-list">
              {upcomingClasses.slice(0, 5).map((c) => (
                <div key={c.id} className="cl-r">
                  <span className="cl-ic">
                    <IconBook2 size={18} />
                  </span>
                  <div>
                    <b>{c.subject}</b>
                    <small>
                      {dayLabel(c.at)} ·{' '}
                      {new Date(c.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </small>
                  </div>
                  <span className="tc">{c.teacher}</span>
                  {c.link ? (
                    <a
                      className="cl-join"
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join
                    </a>
                  ) : (
                    <button
                      className="cl-join"
                      type="button"
                      onClick={() => onToast('Teacher will provide link before class starts.')}
                    >
                      Join
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="cl-strip">
          <IconSparkles size={18} style={{ marginRight: '6px' }} />
          Better learning today, a brighter tomorrow.
        </div>
      </main>
    </div>
  );
};
