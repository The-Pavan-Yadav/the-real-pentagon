import React, { useState } from 'react';
import { NetworkBg } from '../components/NetworkBg';
import { PortalTopBar } from '../components/PortalTopBar';
import { StudentStore } from '../types';
import { saveStudentData } from '../services/storage';

interface StudentDashboardProps {
  data: StudentStore;
  onUpdateData: (newData: StudentStore) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToast: (msg: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  data,
  onUpdateData,
  onNavigate,
  onLogout,
  onToast,
}) => {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  React.useEffect(() => {
    if (window.location.hash.includes('posts') || window.location.hash.includes('projects')) {
      setTimeout(() => {
        document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, []);

  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);
  const bannerInputRef = React.useRef<HTMLInputElement | null>(null);

  // Profile form state
  const [pForm, setPForm] = useState({
    name: data.profile?.name || '',
    grade: data.profile?.grade || 'Grade 10',
    school: data.profile?.school || '',
    bio: data.profile?.bio || '',
    avatar: data.profile?.avatar || '',
    banner: data.profile?.banner || '',
  });

  const processImage = (file: File, w: number, h: number, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const s = Math.max(w / img.width, h / img.height);
        const iw = w / s;
        const ih = h / s;
        c.getContext('2d')?.drawImage(
          img,
          (img.width - iw) / 2,
          (img.height - ih) / 2,
          iw,
          ih,
          0,
          0,
          w,
          h
        );
        callback(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => onToast('File could not be read as an image.');
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImage(file, 1200, 300, (url) => {
      setPForm((prev) => ({ ...prev, banner: url }));
      const updated: StudentStore = {
        ...data,
        profile: data.profile
          ? { ...data.profile, banner: url }
          : { name: 'Aarav Sharma', grade: 'Grade 10', school: 'School', bio: '', banner: url },
        events: addEvent('Updated my banner image'),
      };
      onUpdateData(updated);
      saveStudentData(updated);
      onToast('Banner image updated');
    });
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImage(file, 320, 320, (url) => {
      setPForm((prev) => ({ ...prev, avatar: url }));
      const updated: StudentStore = {
        ...data,
        profile: data.profile
          ? { ...data.profile, avatar: url }
          : { name: 'Aarav Sharma', grade: 'Grade 10', school: 'School', bio: '', avatar: url },
        events: addEvent('Updated my profile picture'),
      };
      onUpdateData(updated);
      saveStudentData(updated);
      onToast('Profile picture updated');
    });
  };

  // About form state
  const [aForm, setAForm] = useState({
    interests: data.about.interests || '',
    career: data.about.career || '',
    learnGoals: data.about.learnGoals || '',
    languages: data.about.languages || '',
    strengths: data.about.strengths || '',
    coLearner: data.about.coLearner || '',
  });

  // Add subject form state
  const [subName, setSubName] = useState('');
  const [subMarks, setSubMarks] = useState('');

  // Add skill form state
  const [skillName, setSkillName] = useState('');
  const [skillKind, setSkillKind] = useState<'Academic' | 'Extra-curricular'>('Academic');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Add achievement form state
  const [achTitle, setAchTitle] = useState('');
  const [achDate, setAchDate] = useState(new Date().toISOString().split('T')[0]);
  const [achDesc, setAchDesc] = useState('');

  // Add learning topic form state
  const [topicName, setTopicName] = useState('');

  // Add goal form state
  const [goalText, setGoalText] = useState('');
  const [goalDate, setGoalDate] = useState('');

  const PEOPLE = [
    { id: 't1', name: 'Ms. Priya Nair', role: 'Maths teacher', tags: ['maths', 'algebra', 'problem solving', 'puzzles'] },
    { id: 's1', name: 'Rahul S.', role: 'Student · Grade 10', tags: ['robotics', 'chess', 'coding', 'python'] },
    { id: 't2', name: 'Dr. Ramesh Kumar', role: 'Senior Physics teacher', tags: ['physics', 'robotics', 'electronics', 'science'] },
    { id: 's2', name: 'Ananya R.', role: 'Student · Grade 9', tags: ['music', 'guitar', 'english', 'writing'] },
    { id: 't3', name: 'Mrs. Kavitha M.', role: 'English teacher', tags: ['english', 'writing', 'reading', 'debate'] },
    { id: 's3', name: 'Karthik P.', role: 'Student · Grade 11', tags: ['football', 'fitness', 'biology', 'chemistry'] },
  ];

  const average = () => {
    if (!data.marks.length) return null;
    return data.marks.reduce((a, m) => a + m.marks, 0) / data.marks.length;
  };

  const streak = () => {
    const s: Record<string, boolean> = {};
    data.days.forEach((x) => {
      s[x] = true;
    });
    let n = 0;
    const d = new Date();
    const ymd = (dt: Date) => dt.toISOString().split('T')[0];
    if (!s[ymd(d)]) d.setDate(d.getDate() - 1);
    while (s[ymd(d)]) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  };

  const airScore = () => {
    const avg = average() || 0;
    const wonCount = data.posts.filter((p) => p.result === 'won').length;
    return Math.round(avg * 4 + data.posts.length * 10 + data.ach.length * 15 + wonCount * 15 + streak() * 5);
  };

  const addEvent = (t: string, currentData = data) => {
    const today = new Date().toISOString().split('T')[0];
    const newEvents = [{ d: today, t }, ...currentData.events].slice(0, 50);
    return newEvents;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pForm.name || !pForm.school || !pForm.bio) {
      onToast('Please fill in all required fields.');
      return;
    }
    const updated: StudentStore = {
      ...data,
      profile: {
        ...pForm,
        avatar: pForm.avatar,
        banner: pForm.banner,
      },
      events: addEvent('Updated my student profile'),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    setProfileDialogOpen(false);
    onToast('Profile updated');
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentStore = {
      ...data,
      about: { ...aForm },
      events: addEvent('Updated my About me'),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    setAboutDialogOpen(false);
    onToast('About me saved');
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseFloat(subMarks);
    if (!subName.trim() || isNaN(m)) return;
    const newMarks = [
      ...data.marks,
      { id: 'm_' + Date.now(), subject: subName.trim(), marks: Math.min(100, Math.max(0, m)) },
    ];
    const updated: StudentStore = {
      ...data,
      marks: newMarks,
      events: addEvent(`Added marks for ${subName.trim()}`),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    setSubName('');
    setSubMarks('');
    onToast(`Added ${subName.trim()}`);
  };

  const handleDeleteMark = (id: string) => {
    const updated: StudentStore = {
      ...data,
      marks: data.marks.filter((m) => m.id !== id),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    onToast('Mark removed');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    const newSkills = [
      ...data.skills,
      { id: 's_' + Date.now(), name: skillName.trim(), kind: skillKind, level: skillLevel },
    ];
    const updated: StudentStore = {
      ...data,
      skills: newSkills,
      events: addEvent(`Added skill: ${skillName.trim()}`),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    setSkillName('');
    onToast(`Added skill: ${skillName.trim()}`);
  };

  const handleDeleteSkill = (id: string) => {
    const updated: StudentStore = {
      ...data,
      skills: data.skills.filter((s) => s.id !== id),
    };
    onUpdateData(updated);
    saveStudentData(updated);
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim()) return;
    const newAch = [
      ...data.ach,
      { id: 'a_' + Date.now(), title: achTitle.trim(), date: achDate, desc: achDesc.trim() },
    ];
    const updated: StudentStore = {
      ...data,
      ach: newAch,
      events: addEvent(`Achievement: ${achTitle.trim()}`),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    setAchTitle('');
    setAchDesc('');
    onToast(`Achievement added`);
  };

  const handleDeleteAch = (id: string) => {
    const updated: StudentStore = {
      ...data,
      ach: data.ach.filter((a) => a.id !== id),
    };
    onUpdateData(updated);
    saveStudentData(updated);
  };

  const handleLogTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const t = topicName.trim();
    if (!t) return;
    const today = new Date().toISOString().split('T')[0];
    const exists = data.courses.some((c) => c.name.toLowerCase() === t.toLowerCase());
    const newCourses = exists
      ? data.courses
      : [...data.courses, { id: 'c_' + Date.now(), name: t, progress: 0 }];
    const newDays = data.days.includes(today) ? data.days : [...data.days, today];

    const updated: StudentStore = {
      ...data,
      courses: newCourses,
      days: newDays,
      events: addEvent(`Learned: ${t}`),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    setTopicName('');
    onToast(`Topic logged! Current streak: ${streak()} days`);
  };

  const handleCourseProgress = (id: string, progress: number) => {
    const newCourses = data.courses.map((c) => (c.id === id ? { ...c, progress } : c));
    const course = data.courses.find((c) => c.id === id);
    const updated: StudentStore = {
      ...data,
      courses: newCourses,
      events: course ? addEvent(`${course.name} is now ${progress}% complete`) : data.events,
    };
    onUpdateData(updated);
    saveStudentData(updated);
  };

  const handleCompleteCourse = (id: string) => {
    const c = data.courses.find((x) => x.id === id);
    if (!c) return;
    const today = new Date().toISOString().split('T')[0];
    const updated: StudentStore = {
      ...data,
      courses: data.courses.filter((x) => x.id !== id),
      done: [{ id: c.id, name: c.name, date: today }, ...data.done],
      events: addEvent(`Completed course: ${c.name}`),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    onToast('Course marked as completed. Well done!');
  };

  const handleDeleteCourse = (id: string) => {
    const updated: StudentStore = {
      ...data,
      courses: data.courses.filter((c) => c.id !== id),
    };
    onUpdateData(updated);
    saveStudentData(updated);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalText.trim()) return;
    const updated: StudentStore = {
      ...data,
      goals: [
        ...data.goals,
        { id: 'g_' + Date.now(), text: goalText.trim(), date: goalDate, done: false },
      ],
      events: addEvent(`New goal: ${goalText.trim()}`),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    setGoalText('');
    setGoalDate('');
    onToast('Goal added');
  };

  const handleToggleGoal = (id: string) => {
    const updated: StudentStore = {
      ...data,
      goals: data.goals.map((g) => {
        if (g.id === id) {
          const next = !g.done;
          return { ...g, done: next };
        }
        return g;
      }),
    };
    onUpdateData(updated);
    saveStudentData(updated);
  };

  const handleDeleteGoal = (id: string) => {
    const updated: StudentStore = {
      ...data,
      goals: data.goals.filter((g) => g.id !== id),
    };
    onUpdateData(updated);
    saveStudentData(updated);
  };

  const handleDeletePost = (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const updated: StudentStore = {
      ...data,
      posts: data.posts.filter((p) => p.id !== id),
    };
    onUpdateData(updated);
    saveStudentData(updated);
    onToast('Post deleted');
  };

  const handleToggleConnect = (id: string) => {
    const next = !data.conn[id];
    const updated: StudentStore = {
      ...data,
      conn: { ...data.conn, [id]: next },
    };
    onUpdateData(updated);
    saveStudentData(updated);
    onToast(next ? 'Connection request sent' : 'Connection request cancelled');
  };

  const avgVal = average();
  const cgpaEstimate = avgVal ? Math.min(10, avgVal / 9.5).toFixed(1) : '--';

  const userInterests = (data.about.interests || '').toLowerCase();
  const scoredPeople = PEOPLE.map((p) => {
    const matched = p.tags.filter((t) => userInterests.includes(t.toLowerCase())).length;
    const pct = Math.min(99, Math.round((100 * matched) / Math.max(p.tags.length, 3)));
    return { ...p, matchPct: pct > 0 ? pct : 65 };
  }).slice(0, 3);

  // Render 7-day tracker
  const today = new Date();
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dayStr = d.toISOString().split('T')[0];
    const letter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
    const active = data.days.includes(dayStr);
    weekDays.push({ letter, active, key: dayStr });
  }

  const allPosts = data.posts;
  const projectPosts = data.posts.filter((p) => p.type === 'project');
  const wonPosts = data.posts.filter((p) => p.result === 'won');

  return (
    <div className="student-page-root" style={{ minHeight: '100vh', position: 'relative' }}>
      <NetworkBg rgb="150,125,90" alpha={0.22} />

      <PortalTopBar
        currentView="student-dashboard"
        role="student"
        userName={data.profile?.name}
        avatarUrl={data.profile?.avatar}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onToast={onToast}
      />

      <main className="page" style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
        {/* PROFILE SECTION */}
        <section className="card profile" id="profile">
          <div
            className="banner"
            id="banner"
            style={{
              backgroundImage: data.profile?.banner ? `url("${data.profile.banner}")` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <button
              className="btn ghost sm"
              id="btn-banner"
              type="button"
              onClick={() => bannerInputRef.current?.click()}
            >
              Edit banner
            </button>
            <input
              type="file"
              ref={bannerInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleBannerFileChange}
            />
          </div>

          <div className="p-body">
            <div className="av-wrap">
              <div
                className="avatar"
                id="avatar"
                style={{
                  backgroundImage: data.profile?.avatar ? `url("${data.profile.avatar}")` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!data.profile?.avatar && (data.profile?.name ? data.profile.name.charAt(0).toUpperCase() : '?')}
              </div>
              <button
                className="av-btn"
                id="btn-avatar"
                type="button"
                aria-label="Change profile picture"
                onClick={() => avatarInputRef.current?.click()}
              >
                +
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarFileChange}
              />
            </div>

            <div className="p-info">
              <h1>
                <span id="p-name">{data.profile?.name || 'Your name'}</span>
              </h1>
              <div className="meta">
                <span id="p-grade">{data.profile?.grade || 'Academic year'}</span> &nbsp;·&nbsp;{' '}
                <span id="p-school">{data.profile?.school || 'School name'}</span>
              </div>
              <p className="bio" id="p-bio">
                {data.profile?.bio || 'Add your picture, name, grade, school and bio to get started.'}
              </p>
            </div>

            <div className="p-actions">
              <a className="btn ghost sm" href="#posts">
                Portfolio
              </a>
              <button
                className="btn sm"
                id="edit-profile"
                type="button"
                onClick={() => setProfileDialogOpen(true)}
              >
                Edit profile
              </button>
            </div>
          </div>

          <div className="stats">
            <a className="stat" href="#performance" style={{ textDecoration: 'none' }}>
              <small>Average marks</small>
              <strong id="s-avg">{avgVal !== null ? `${avgVal.toFixed(1)}%` : '--'}</strong>
              <em id="s-cgpa">
                {avgVal !== null ? `CGPA approx. ${cgpaEstimate}` : 'Add your marks'}
              </em>
            </a>
            <div className="stat">
              <small>AIR score</small>
              <strong id="s-air">{airScore()}</strong>
              <em>Preview score</em>
            </div>
            <div className="stat">
              <small>Profile views</small>
              <strong id="s-views">142</strong>
              <em>This month</em>
            </div>
            <div className="stat">
              <small>Impressions</small>
              <strong id="s-impr">1.2k</strong>
              <em>Classroom network</em>
            </div>
          </div>
        </section>

        {/* ABOUT ME */}
        <section className="card" id="about">
          <div className="head">
            <div>
              <h2>About me</h2>
              <p>Optional. Help teachers and classmates get to know you.</p>
            </div>
            <button className="btn ghost sm" id="edit-about" type="button" onClick={() => setAboutDialogOpen(true)}>
              Edit
            </button>
          </div>

          <div className="grid3" id="about-grid">
            <div className="tile">
              <h3>Interests</h3>
              {data.about.interests ? (
                <div className="chips">
                  {data.about.interests.split(',').map((x, i) => (
                    <span key={i} className="chip">
                      {x.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted">Not added yet</p>
              )}
            </div>

            <div className="tile">
              <h3>Career goals</h3>
              <p>{data.about.career || <span className="muted">Not added yet</span>}</p>
            </div>

            <div className="tile">
              <h3>Learning goals</h3>
              <p>{data.about.learnGoals || <span className="muted">Not added yet</span>}</p>
            </div>

            <div className="tile">
              <h3>Languages known</h3>
              {data.about.languages ? (
                <div className="chips">
                  {data.about.languages.split(',').map((x, i) => (
                    <span key={i} className="chip">
                      {x.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted">Not added yet</p>
              )}
            </div>

            <div className="tile">
              <h3>Personal strengths</h3>
              {data.about.strengths ? (
                <div className="chips">
                  {data.about.strengths.split(',').map((x, i) => (
                    <span key={i} className="chip">
                      {x.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted">Not added yet</p>
              )}
            </div>

            <div className="tile">
              <h3>Preferred co-learner</h3>
              <p>{data.about.coLearner || <span className="muted">Not added yet</span>}</p>
            </div>
          </div>

          <span className="lab" style={{ marginTop: '18px', display: 'block' }}>
            Suggested for you, matched on your skills and interests
          </span>
          <div className="grid3" id="match-grid">
            {scoredPeople.map((person) => {
              const isReq = data.conn[person.id];
              return (
                <div key={person.id} className="match">
                  <div className="pav">{person.name.substring(0, 2).toUpperCase()}</div>
                  <div>
                    <b>{person.name}</b>
                    <small>
                      {person.role} · {person.matchPct}% match
                    </small>
                  </div>
                  <button
                    className="btn ghost sm"
                    type="button"
                    onClick={() => handleToggleConnect(person.id)}
                  >
                    {isReq ? 'Requested' : 'Connect'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ACADEMIC PERFORMANCE */}
        <section className="card" id="performance">
          <div className="head">
            <div>
              <h2>Academic performance</h2>
              <p>Add subject marks. The average is shown on your profile.</p>
            </div>
          </div>

          <div className="avg">
            <strong id="avg-big">{avgVal !== null ? `${avgVal.toFixed(1)}%` : '--'}</strong>
            <span>
              average marks
              <br />
              across <b id="avg-n">{data.marks.length}</b> subjects
            </span>
          </div>

          <form className="inline" id="mark-form" onSubmit={handleAddSubject}>
            <input
              name="subject"
              placeholder="Subject (e.g. Mathematics)"
              required
              maxLength={40}
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
            />
            <input
              name="marks"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="Marks (%)"
              required
              value={subMarks}
              onChange={(e) => setSubMarks(e.target.value)}
            />
            <button className="btn sm" type="submit">
              Add subject
            </button>
          </form>

          <div id="marks">
            {data.marks.length ? (
              data.marks.map((m) => (
                <div key={m.id} className="row">
                  <span className="nm">{m.subject}</span>
                  <div className="bar">
                    <i style={{ width: `${Math.min(100, m.marks)}%` }} />
                  </div>
                  <b>{m.marks}%</b>
                  <button
                    type="button"
                    className="x"
                    onClick={() => handleDeleteMark(m.id)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">Add a subject to see your average here.</div>
            )}
          </div>
        </section>

        {/* SKILLS */}
        <section className="card" id="skills">
          <div className="head">
            <div>
              <h2>Skills</h2>
              <p>Academic and extra-curricular activities, with your level.</p>
            </div>
          </div>

          <form className="inline" id="skill-form" onSubmit={handleAddSkill}>
            <input
              name="name"
              placeholder="Skill (e.g. Algebra, Robotics)"
              required
              maxLength={40}
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
            <select
              name="kind"
              value={skillKind}
              onChange={(e) => setSkillKind(e.target.value as any)}
            >
              <option value="Academic">Academic</option>
              <option value="Extra-curricular">Extra-curricular (ECA)</option>
            </select>
            <select
              name="level"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as any)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button className="btn sm" type="submit">
              Add skill
            </button>
          </form>

          <div className="grid2">
            <div className="tile">
              <h3>Academic</h3>
              <div className="chips">
                {data.skills.filter((s) => s.kind === 'Academic').length ? (
                  data.skills
                    .filter((s) => s.kind === 'Academic')
                    .map((s) => (
                      <span key={s.id} className="chip">
                        {s.name} <small>{s.level}</small>
                        <button type="button" className="x" onClick={() => handleDeleteSkill(s.id)}>
                          ✕
                        </button>
                      </span>
                    ))
                ) : (
                  <span className="muted sm">None added yet</span>
                )}
              </div>
            </div>

            <div className="tile">
              <h3>Extra-curricular (ECA)</h3>
              <div className="chips">
                {data.skills.filter((s) => s.kind === 'Extra-curricular').length ? (
                  data.skills
                    .filter((s) => s.kind === 'Extra-curricular')
                    .map((s) => (
                      <span key={s.id} className="chip">
                        {s.name} <small>{s.level}</small>
                        <button type="button" className="x" onClick={() => handleDeleteSkill(s.id)}>
                          ✕
                        </button>
                      </span>
                    ))
                ) : (
                  <span className="muted sm">None added yet</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section className="card" id="achievements">
          <div className="head">
            <div>
              <h2>Achievements</h2>
              <p>Projects and activities you won. Posts marked as won appear here too.</p>
            </div>
          </div>

          <form className="inline" id="ach-form" onSubmit={handleAddAchievement}>
            <input
              name="title"
              placeholder="Achievement name"
              required
              maxLength={80}
              value={achTitle}
              onChange={(e) => setAchTitle(e.target.value)}
            />
            <input
              name="date"
              type="date"
              required
              value={achDate}
              onChange={(e) => setAchDate(e.target.value)}
            />
            <input
              name="desc"
              placeholder="Short description"
              maxLength={160}
              style={{ flexBasis: '220px' }}
              value={achDesc}
              onChange={(e) => setAchDesc(e.target.value)}
            />
            <button className="btn sm" type="submit">
              Add
            </button>
          </form>

          <div id="ach-list">
            {data.ach.length ? (
              data.ach.map((a) => (
                <div key={a.id} className="ach">
                  <div className="ic">★</div>
                  <div>
                    <h4>{a.title}</h4>
                    <p>{a.desc || 'Achievement'}</p>
                  </div>
                  <span className="d">{a.date}</span>
                  <button type="button" className="x" onClick={() => handleDeleteAch(a.id)}>
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">Add an achievement, or publish a post marked as won.</div>
            )}
          </div>
        </section>

        {/* LEARNING PROGRESS */}
        <section className="card" id="learning">
          <div className="head">
            <div>
              <h2>Learning progress</h2>
              <p>Log what you are learning each day to build your streak.</p>
            </div>
            <span className="streak-badge" id="streak-badge">
              {streak()}-day streak
            </span>
          </div>

          <div className="grid2">
            <div className="tile">
              <h3>Log today's learning</h3>
              <form className="inline" id="log-form" onSubmit={handleLogTopic} style={{ marginBottom: 0 }}>
                <input
                  name="topic"
                  placeholder="e.g. Ray optics refraction"
                  required
                  maxLength={80}
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                />
                <button className="btn sm" type="submit">
                  Log
                </button>
              </form>
              <div className="week" id="week" style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                {weekDays.map((w) => (
                  <span key={w.key} className="wd" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <i
                      className={w.active ? 'on' : ''}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: w.active ? '#3b82f6' : '#e2e8f0',
                        display: 'block',
                      }}
                    />
                    <small style={{ fontSize: '11px', color: '#64748b' }}>{w.letter}</small>
                  </span>
                ))}
              </div>
            </div>

            <div className="tile">
              <h3>Currently learning</h3>
              <div id="courses">
                {data.courses.length ? (
                  data.courses.map((c) => (
                    <div key={c.id} className="course" style={{ marginBottom: '14px' }}>
                      <div className="t" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{c.name}</span>
                        <button type="button" className="x" onClick={() => handleDeleteCourse(c.id)}>
                          ✕
                        </button>
                      </div>
                      <div className="pr" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={c.progress}
                          onChange={(e) => handleCourseProgress(c.id, parseInt(e.target.value))}
                          aria-label={`Progress for ${c.name}`}
                          style={{ flex: 1 }}
                        />
                        <b>{c.progress}%</b>
                      </div>
                      {c.progress >= 100 && (
                        <button
                          type="button"
                          className="btn sm"
                          style={{ marginTop: '8px' }}
                          onClick={() => handleCompleteCourse(c.id)}
                        >
                          Mark as completed
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty">Log what you are learning and it appears here.</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid3" style={{ marginTop: '16px' }}>
            <div>
              <h3 className="sub">Completed courses</h3>
              <div id="done">
                {data.done.length ? (
                  data.done.map((d) => (
                    <div key={d.id} className="done" style={{ padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
                      <span>{d.name}</span> <small style={{ color: '#64748b' }}>{d.date}</small>
                    </div>
                  ))
                ) : (
                  <div className="empty">Completed courses appear here.</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="sub">Upcoming learning goals</h3>
              <form className="inline" id="goal-form" onSubmit={handleAddGoal}>
                <input
                  name="text"
                  placeholder="e.g. Finish Python project"
                  required
                  maxLength={90}
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                />
                <input
                  name="date"
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                />
                <button className="btn sm" type="submit">
                  Add
                </button>
              </form>
              <div id="goals" style={{ marginTop: '10px' }}>
                {data.goals.length ? (
                  data.goals.map((g) => (
                    <div key={g.id} className={`goal ${g.done ? 'is-done' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                      <input
                        type="checkbox"
                        checked={g.done}
                        onChange={() => handleToggleGoal(g.id)}
                      />
                      <span style={{ textDecoration: g.done ? 'line-through' : 'none', color: g.done ? '#94a3b8' : 'inherit', flex: 1 }}>
                        {g.text}
                      </span>
                      {g.date && <small style={{ color: '#64748b' }}>{g.date}</small>}
                      <button type="button" className="x" onClick={() => handleDeleteGoal(g.id)}>
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty">Set a goal you want to reach next.</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="sub">Progress timeline</h3>
              <ol className="timeline" id="timeline">
                {data.events.slice(0, 6).map((ev, i) => (
                  <li key={i}>
                    {ev.t} <small>{ev.d}</small>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* POSTS */}
        <section className="card" id="posts">
          <div className="head">
            <div>
              <h2>Posts</h2>
              <p>Everything you share. Posts are created on the post page.</p>
            </div>
            <button
              className="btn sm"
              type="button"
              onClick={() => onNavigate('post')}
            >
              + New post
            </button>
          </div>

          <div className="cols">
            <div>
              <p className="colh">
                All posts · <span id="n-all">{allPosts.length}</span>
              </p>
              <div className="col">
                {allPosts.length ? (
                  allPosts.map((p) => (
                    <article key={p.id} className="pc">
                      {p.img && (
                        <div
                          className="cv"
                          style={{ backgroundImage: `url("${p.img}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                      )}
                      <div className="bd">
                        <span className={`badge ${p.result === 'won' ? 'won' : ''}`}>
                          {p.type.toUpperCase()} {p.result === 'won' ? '· Won' : ''}
                        </span>
                        <h4>{p.title}</h4>
                        <p>{p.desc}</p>
                        <div className="ft">
                          <span>{p.date}</span>
                          <span>
                            {p.link && (
                              <a href={p.link} target="_blank" rel="noopener noreferrer">
                                Open
                              </a>
                            )}
                            <button
                              type="button"
                              className="x"
                              title="Delete post"
                              onClick={() => handleDeletePost(p.id)}
                            >
                              ✕
                            </button>
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty">Nothing here yet.</div>
                )}
              </div>
            </div>

            <div>
              <p className="colh">
                Projects · <span id="n-proj">{projectPosts.length}</span>
              </p>
              <div className="col">
                {projectPosts.length ? (
                  projectPosts.map((p) => (
                    <article key={p.id} className="pc">
                      {p.img && (
                        <div
                          className="cv"
                          style={{ backgroundImage: `url("${p.img}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                      )}
                      <div className="bd">
                        <span className={`badge ${p.result === 'won' ? 'won' : ''}`}>
                          {p.type.toUpperCase()}
                        </span>
                        <h4>{p.title}</h4>
                        <p>{p.desc}</p>
                        <div className="ft">
                          <span>{p.date}</span>
                          <span>
                            <button
                              type="button"
                              className="x"
                              title="Delete post"
                              onClick={() => handleDeletePost(p.id)}
                            >
                              ✕
                            </button>
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty">Nothing here yet.</div>
                )}
              </div>
            </div>

            <div>
              <p className="colh">
                Achievements · <span id="n-won">{wonPosts.length}</span>
              </p>
              <div className="col">
                {wonPosts.length ? (
                  wonPosts.map((p) => (
                    <article key={p.id} className="pc">
                      {p.img && (
                        <div
                          className="cv"
                          style={{ backgroundImage: `url("${p.img}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                      )}
                      <div className="bd">
                        <span className="badge won">
                          {p.type.toUpperCase()} · Won
                        </span>
                        <h4>{p.title}</h4>
                        <p>{p.desc}</p>
                        <div className="ft">
                          <span>{p.date}</span>
                          <span>
                            <button
                              type="button"
                              className="x"
                              title="Delete post"
                              onClick={() => handleDeletePost(p.id)}
                            >
                              ✕
                            </button>
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty">Nothing here yet.</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* PROFILE DIALOG */}
      {profileDialogOpen && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <form onSubmit={handleSaveProfile}>
              <h2 style={{ margin: '0 0 4px', fontSize: '20px' }}>Your profile</h2>
              <p className="sub" style={{ margin: '0 0 16px', color: '#64748b', fontSize: '13.5px' }}>
                Fields marked * are required to enter your dashboard.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Profile Picture
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundImage: pForm.avatar ? `url("${pForm.avatar}")` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#e2e8f0',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 600,
                        color: '#243b63',
                        fontSize: '14px',
                        border: '1px solid #cbd5e1',
                        flex: 'none',
                      }}
                    >
                      {!pForm.avatar && (pForm.name ? pForm.name.charAt(0).toUpperCase() : '?')}
                    </div>
                    <button
                      type="button"
                      className="btn ghost sm"
                      style={{ fontSize: '11.5px', padding: '5px 10px' }}
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      {pForm.avatar ? 'Change' : 'Upload'}
                    </button>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Banner Cover
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '38px',
                        borderRadius: '6px',
                        backgroundImage: pForm.banner ? `url("${pForm.banner}")` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#e2e8f0',
                        border: '1px solid #cbd5e1',
                        flex: 'none',
                      }}
                    />
                    <button
                      type="button"
                      className="btn ghost sm"
                      style={{ fontSize: '11.5px', padding: '5px 10px' }}
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      {pForm.banner ? 'Change' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>

              <label className="req" style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Full name *
                <input
                  name="name"
                  required
                  maxLength={60}
                  value={pForm.name}
                  onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label className="req" style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                Academic year (grade) *
                <select
                  name="grade"
                  required
                  value={pForm.grade}
                  onChange={(e) => setPForm({ ...pForm, grade: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', background: '#fff' }}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={`Grade ${i + 1}`}>
                      Grade {i + 1}
                    </option>
                  ))}
                  <option value="College / Undergraduate">College / Undergraduate</option>
                </select>
              </label>

              <label className="req" style={{ display: 'block', marginBottom: '12px', fontSize: '13.5px', fontWeight: 500 }}>
                School name *
                <input
                  name="school"
                  required
                  maxLength={80}
                  value={pForm.school}
                  onChange={(e) => setPForm({ ...pForm, school: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label className="req" style={{ display: 'block', marginBottom: '16px', fontSize: '13.5px', fontWeight: 500 }}>
                Bio *
                <textarea
                  name="bio"
                  required
                  maxLength={300}
                  rows={3}
                  placeholder="Tell us about yourself in a few lines"
                  value={pForm.bio}
                  onChange={(e) => setPForm({ ...pForm, bio: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <div className="acts" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setProfileDialogOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn" type="submit">
                  Save profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ABOUT DIALOG */}
      {aboutDialogOpen && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <form onSubmit={handleSaveAbout}>
              <h2 style={{ margin: '0 0 4px', fontSize: '20px' }}>About me</h2>
              <p className="sub" style={{ margin: '0 0 16px', color: '#64748b', fontSize: '13.5px' }}>
                Everything here is optional. Separate lists with commas.
              </p>

              <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 500 }}>
                Interests
                <input
                  name="interests"
                  placeholder="Robotics, chess, music"
                  maxLength={160}
                  value={aForm.interests}
                  onChange={(e) => setAForm({ ...aForm, interests: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 500 }}>
                Career goals
                <textarea
                  name="career"
                  maxLength={240}
                  rows={2}
                  value={aForm.career}
                  onChange={(e) => setAForm({ ...aForm, career: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 500 }}>
                Learning goals
                <textarea
                  name="learnGoals"
                  maxLength={240}
                  rows={2}
                  value={aForm.learnGoals}
                  onChange={(e) => setAForm({ ...aForm, learnGoals: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 500 }}>
                Languages known
                <input
                  name="languages"
                  placeholder="English, Tamil, Hindi"
                  maxLength={120}
                  value={aForm.languages}
                  onChange={(e) => setAForm({ ...aForm, languages: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 500 }}>
                Personal strengths
                <input
                  name="strengths"
                  placeholder="Leadership, curiosity, teamwork"
                  maxLength={160}
                  value={aForm.strengths}
                  onChange={(e) => setAForm({ ...aForm, strengths: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '16px', fontSize: '13px', fontWeight: 500 }}>
                Preferred co-learner
                <textarea
                  name="coLearner"
                  maxLength={240}
                  rows={2}
                  value={aForm.coLearner}
                  onChange={(e) => setAForm({ ...aForm, coLearner: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </label>

              <div className="acts" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setAboutDialogOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
