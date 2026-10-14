import React, { useState } from 'react';
import { PortalTopBar } from '../components/PortalTopBar';
import { StudentStore, PersonalCalendarEvent } from '../types';
import { getMockCalendarYearData, getPersonalEvents, savePersonalEvents } from '../services/storage';
import {
  IconDownload,
  IconPlus,
  IconBell,
  IconFileDownload,
} from '@tabler/icons-react';

interface StudentCalendarPageProps {
  data: StudentStore;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

export const StudentCalendarPage: React.FC<StudentCalendarPageProps> = ({
  data,
  onNavigate,
  onLogout,
  onToast,
}) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [personalEvents, setPersonalEvents] = useState<PersonalCalendarEvent[]>(getPersonalEvents());

  const [addEventOpen, setAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('');

  const yearData = getMockCalendarYearData(year);
  const subjects = ['all', 'Physics', 'Mathematics', 'Computer Science', 'Chemistry', 'English'];

  // 12 Academic months starting June
  const monthList = [
    { name: 'Jun', m: 6, y: year },
    { name: 'Jul', m: 7, y: year },
    { name: 'Aug', m: 8, y: year },
    { name: 'Sep', m: 9, y: year },
    { name: 'Oct', m: 10, y: year },
    { name: 'Nov', m: 11, y: year },
    { name: 'Dec', m: 12, y: year },
    { name: 'Jan', m: 1, y: year + 1 },
    { name: 'Feb', m: 2, y: year + 1 },
    { name: 'Mar', m: 3, y: year + 1 },
    { name: 'Apr', m: 4, y: year + 1 },
    { name: 'May', m: 5, y: year + 1 },
  ];

  const currentMonthObj = monthList.find((x) => x.m === selectedMonth) || monthList[0];
  const targetYear = currentMonthObj.y;
  const targetMonth = currentMonthObj.m;

  // Calendar calculations
  const firstDayOfMonth = new Date(targetYear, targetMonth - 1, 1);
  // Shift Sunday (0) to end: Mon=0, Tue=1, ..., Sun=6
  const offset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();

  const handleStepMonth = (delta: number) => {
    const curIdx = monthList.findIndex((m) => m.m === selectedMonth);
    if (curIdx === -1) return;
    const nextIdx = curIdx + delta;
    if (nextIdx >= 0 && nextIdx < monthList.length) {
      setSelectedMonth(monthList[nextIdx].m);
    }
  };

  const handleAddPersonalEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    const newEv: PersonalCalendarEvent = {
      id: 'pe_' + Date.now(),
      title: eventTitle.trim(),
      date: eventDate,
      time: eventTime,
    };
    const updated = [...personalEvents, newEv];
    setPersonalEvents(updated);
    savePersonalEvents(updated);
    setEventTitle('');
    setEventTime('');
    setAddEventOpen(false);
    onToast('Personal event added');
  };

  const handleExportICS = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//THE PENTAGON//Academic Calendar//EN',
    ];

    personalEvents.forEach((pe) => {
      const cleanDate = pe.date.replace(/-/g, '');
      lines.push(
        'BEGIN:VEVENT',
        `UID:pe_${pe.id}@thepentagon.edu`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `SUMMARY:${pe.title}`,
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pentagon-calendar-${year}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Calendar exported (.ics)');
  };

  // Search matches
  const searchResults: Array<{ date: string; title: string }> = [];
  if (searchQuery.trim().length >= 2) {
    const q = searchQuery.toLowerCase();
    Object.keys(yearData.days).forEach((dt) => {
      const day = yearData.days[dt];
      day.classes?.forEach((c) => {
        if (c.subject.toLowerCase().includes(q)) {
          searchResults.push({ date: dt, title: `${c.subject} class` });
        }
      });
      day.events?.forEach((e) => {
        if (e.title.toLowerCase().includes(q)) {
          searchResults.push({ date: dt, title: e.title });
        }
      });
      if (day.holiday?.toLowerCase().includes(q)) {
        searchResults.push({ date: dt, title: day.holiday });
      }
    });
    personalEvents.forEach((pe) => {
      if (pe.title.toLowerCase().includes(q)) {
        searchResults.push({ date: pe.date, title: pe.title });
      }
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="student-calendar-root rs" style={{ minHeight: '100vh', position: 'relative' }}>
      <PortalTopBar
        currentView="student-calendar"
        role="student"
        userName={data.profile?.name}
        avatarUrl={data.profile?.avatar}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onToast={onToast}
      />

      <main className="page" style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
        <div>
          <p className="crumb">
            <a
              href="#class"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('student-class');
              }}
            >
              My class
            </a>{' '}
            › My calendar
          </p>

          <div className="ttl">
            <h1>My calendar</h1>
            <div className="yr">
              <span className="sync" id="sync">
                <i className="sd live" />
                Live · Academic Schedule
              </span>
              <span className="muted sm">Academic year</span>
              <div className="pill">
                <button
                  type="button"
                  aria-label="Previous year"
                  onClick={() => setYear((y) => y - 1)}
                >
                  ‹
                </button>
                <span id="ylabel">
                  {year} to {String(year + 1).slice(2)}
                </span>
                <button
                  type="button"
                  aria-label="Next year"
                  onClick={() => setYear((y) => y + 1)}
                >
                  ›
                </button>
              </div>
              <button
                className="btn ghost sm noprint"
                id="ics"
                type="button"
                onClick={handleExportICS}
              >
                <IconDownload size={16} style={{ marginRight: '4px' }} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* MONTHS TABS */}
        <div className="months" id="months" role="tablist" aria-label="Months">
          {monthList.map((m) => (
            <button
              key={`${m.y}-${m.m}`}
              type="button"
              className={`mo ${m.m === selectedMonth ? 'on' : ''}`}
              onClick={() => setSelectedMonth(m.m)}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* TOOLBAR & SEARCH */}
        <div className="tools2" style={{ position: 'relative' }}>
          <div id="filters">
            {subjects.map((s) => (
              <button
                key={s}
                type="button"
                className={`fch ${filterSubject === s ? 'on' : ''}`}
                onClick={() => setFilterSubject(s)}
              >
                {s === 'all' ? 'All subjects' : s}
              </button>
            ))}
          </div>

          <input
            className="srch noprint"
            id="q"
            type="search"
            placeholder="Search notes and topics"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery.trim().length >= 2 && (
            <div
              className="sres"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: '320px',
                background: '#fff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 50,
                maxHeight: '260px',
                overflowY: 'auto',
              }}
            >
              {searchResults.length ? (
                searchResults.slice(0, 8).map((res, i) => (
                  <a
                    key={i}
                    href="#date"
                    style={{
                      display: 'block',
                      padding: '10px 14px',
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: '13px',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onToast(`Selected date: ${res.date}`);
                      setSearchQuery('');
                    }}
                  >
                    <b>{res.title}</b>
                    <small style={{ display: 'block', color: '#64748b' }}>{res.date}</small>
                  </a>
                ))
              ) : (
                <div style={{ padding: '14px', fontSize: '13px', color: '#64748b' }}>
                  No matching topics found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* MAIN CALENDAR + SIDEBAR */}
        <div className="cwrap">
          <section className="card">
            <div className="mhead">
              <h2 id="mtitle">
                {firstDayOfMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </h2>
              <div className="noprint" style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn ghost sm"
                  type="button"
                  aria-label="Previous month"
                  onClick={() => handleStepMonth(-1)}
                >
                  ‹
                </button>
                <button
                  className="btn ghost sm"
                  type="button"
                  onClick={() => setSelectedMonth(new Date().getMonth() + 1)}
                >
                  Today
                </button>
                <button
                  className="btn ghost sm"
                  type="button"
                  aria-label="Next month"
                  onClick={() => handleStepMonth(1)}
                >
                  ›
                </button>
              </div>
            </div>

            <div className="wkh">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>

            <div className="cgrid" id="grid">
              {/* Empty offset squares */}
              {[...Array(offset)].map((_, i) => (
                <div key={`offset-${i}`} className="cd o" />
              ))}

              {/* Days in month */}
              {[...Array(daysInMonth)].map((_, i) => {
                const dayNum = i + 1;
                const p2m = targetMonth < 10 ? '0' + targetMonth : '' + targetMonth;
                const p2d = dayNum < 10 ? '0' + dayNum : '' + dayNum;
                const dateKey = `${targetYear}-${p2m}-${p2d}`;
                const dt = new Date(targetYear, targetMonth - 1, dayNum);
                const dayOfWeek = dt.getDay(); // 0 is Sun

                const info = yearData.days[dateKey] || {};
                const isSun = dayOfWeek === 0;
                const isHoliday = !!info.holiday || isSun;
                const isExam = info.events?.some((e) => e.kind === 'exam');
                const isToday = dateKey === todayStr;

                const classes = (info.classes || []).filter(
                  (c) => filterSubject === 'all' || c.subject.toLowerCase() === filterSubject.toLowerCase()
                );
                const pEvs = personalEvents.filter((pe) => pe.date === dateKey);

                let cellClass = 'cd';
                if (isHoliday) cellClass += ' h';
                if (isExam) cellClass += ' e';
                if (isSun) cellClass += ' w';
                if (isToday) cellClass += ' t';

                return (
                  <button
                    key={dayNum}
                    type="button"
                    className={cellClass}
                    onClick={() => {
                      const msg = info.holiday || info.events?.[0]?.title || `${classes.length} classes scheduled`;
                      onToast(`${dayNum} ${firstDayOfMonth.toLocaleDateString(undefined, { month: 'short' })}: ${msg}`);
                    }}
                  >
                    <span className="n">{dayNum}</span>

                    {info.holiday && <span className="p px">{info.holiday}</span>}
                    {info.events?.map((ev, ei) => (
                      <span key={ei} className="p px">
                        {ev.title}
                      </span>
                    ))}
                    {pEvs.map((pe) => (
                      <span key={pe.id} className="p px">
                        {pe.title}
                      </span>
                    ))}
                    {classes.slice(0, 2).map((c, ci) => (
                      <span key={ci} className={`p p${(ci % 3) + 1}`}>
                        {c.subject}
                      </span>
                    ))}

                    {classes.length + pEvs.length > 2 && (
                      <span className="more">+{classes.length + pEvs.length - 2} more</span>
                    )}

                    {info.notes && (
                      <span className="dt">
                        {info.notes.mine && <i className="k1" />}
                        {info.notes.board && <i className="k2" />}
                        {info.notes.ai && <i className="k3" />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="lg">
              <span>
                <i className="k1" />
                My handwritten notes
              </span>
              <span>
                <i className="k2" />
                Teacher board notes
              </span>
              <span>
                <i className="k3" />
                AI notes
              </span>
              <span>
                <i style={{ background: 'var(--gr)', border: '1px solid var(--mt)' }} />
                Holiday
              </span>
              <span>
                <i style={{ background: 'var(--pk)' }} />
                Exam day
              </span>
              <span>
                <i style={{ background: 'var(--lp)' }} />
                Weekly off
              </span>
            </div>
          </section>

          {/* SIDEBAR */}
          <div className="col2" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <section className="card" style={{ background: 'var(--lp)', borderColor: 'var(--pk)' }}>
              <h2 style={{ fontSize: '15px', margin: '0 0 8px' }}>Year progress</h2>
              <div id="progress">
                <div className="prow">
                  <span>Syllabus covered</span>
                  <b>{yearData.progress.syllabusPct}%</b>
                </div>
                <div className="bar2">
                  <i style={{ width: `${yearData.progress.syllabusPct}%` }} />
                </div>

                <div className="prow" style={{ marginTop: '10px' }}>
                  <span>Attendance</span>
                  <b>{yearData.progress.attendancePct}%</b>
                </div>
                <div className="bar2">
                  <i style={{ width: `${yearData.progress.attendancePct}%` }} />
                </div>

                <div className="prow" style={{ marginTop: '10px' }}>
                  <span>Days with notes</span>
                  <b>
                    {yearData.progress.daysWithNotes} of {yearData.progress.daysTotal}
                  </b>
                </div>
                <div className="bar2">
                  <i
                    style={{
                      width: `${((yearData.progress.daysWithNotes || 0) / (yearData.progress.daysTotal || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 style={{ fontSize: '15px', margin: '0 0 6px' }}>Coming up</h2>
              <div id="upcoming">
                {yearData.upcoming.map((u, i) => {
                  const d = new Date(u.date);
                  return (
                    <div
                      key={i}
                      className="up"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onToast(`${u.title} on ${u.date}`)}
                    >
                      <div className="ud" style={{ background: u.kind === 'exam' ? 'var(--pk)' : 'var(--mt)' }}>
                        <b>{d.getDate() || '18'}</b>
                        {d.toLocaleDateString(undefined, { month: 'short' }) || 'Oct'}
                      </div>
                      <div>
                        <b style={{ fontSize: '13.5px' }}>{u.title}</b>
                        <div className="muted sm">{u.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="card noprint">
              <h2 style={{ fontSize: '15px', margin: '0 0 6px' }}>Quick actions</h2>
              <button
                className="qa"
                type="button"
                onClick={() => setAddEventOpen(true)}
              >
                <IconPlus size={16} />
                Add personal event
              </button>
              <button
                className="qa"
                type="button"
                onClick={() => onToast('Revision reminder alert scheduled for tomorrow!')}
              >
                <IconBell size={16} />
                Set revision reminders
              </button>
              <button
                className="qa"
                type="button"
                onClick={() => window.print()}
              >
                <IconFileDownload size={16} />
                Download month as PDF
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* ADD PERSONAL EVENT MODAL */}
      {addEventOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 15, 36, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="modal-card"
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <form onSubmit={handleAddPersonalEvent}>
              <h2 style={{ margin: '0 0 4px', fontSize: '20px' }}>Add personal event</h2>
              <p className="sub" style={{ margin: '0 0 16px', color: '#64748b', fontSize: '13.5px' }}>
                Only you can see this. It is saved on this device.
              </p>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Title
                <input
                  name="title"
                  required
                  maxLength={80}
                  placeholder="e.g. Science Fair Project Revision"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Date
                <input
                  name="date"
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '16px', fontSize: '13.5px', fontWeight: 500 }}>
                Time (optional)
                <input
                  name="time"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <div className="acts" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setAddEventOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn" type="submit">
                  Save event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
