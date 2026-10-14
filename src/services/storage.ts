import {
  StudentStore,
  ClassroomData,
  PersonalCalendarEvent,
  CalendarYearData,
  UserSession,
  UserRole,
} from '../types';

export const SESS_KEY = 'hx_session';
export const STUDENT_KEY = 'hx_student_v2';
export const CLASSROOM_KEY = 'hx_classroom_v1';
export const PERSONAL_CALENDAR_KEY = 'hx_personal_v1';

export function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session: UserSession | null): void {
  try {
    if (session) {
      localStorage.setItem(SESS_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESS_KEY);
    }
  } catch (e) {
    console.error('Session write error', e);
  }
}

export function defaultStudentData(): StudentStore {
  return {
    profile: {
      name: 'Aarav Sharma',
      grade: 'Grade 10',
      school: 'Kendriya Vidyalaya, Sector 4',
      bio: 'Curious learner passionate about physics, robotics and competitive programming. Preparing for National Science Congress 2026.',
      avatar: '',
      banner: '',
    },
    about: {
      interests: 'Robotics, chess, physics, artificial intelligence',
      career: 'Aspiring Aerospace & Robotic Systems Engineer',
      learnGoals: 'Master Python OOP, build autonomous rover prototype, calculus fundamentals',
      languages: 'English, Hindi, Sanskrit',
      strengths: 'Analytical problem solving, resilience, team leadership',
      coLearner: 'Students working on Arduino projects and physics teachers for Olympiad prep',
    },
    marks: [
      { id: 'm1', subject: 'Mathematics', marks: 94 },
      { id: 'm2', subject: 'Physics', marks: 91 },
      { id: 'm3', subject: 'Chemistry', marks: 88 },
      { id: 'm4', subject: 'Computer Science', marks: 98 },
      { id: 'm5', subject: 'English', marks: 86 },
    ],
    skills: [
      { id: 's1', name: 'Algebra & Calculus', kind: 'Academic', level: 'Advanced' },
      { id: 's2', name: 'Python Programming', kind: 'Academic', level: 'Intermediate' },
      { id: 's3', name: 'Robotics & Arduino', kind: 'Extra-curricular', level: 'Advanced' },
      { id: 's4', name: 'Chess & Strategy', kind: 'Extra-curricular', level: 'Intermediate' },
    ],
    ach: [
      {
        id: 'a1',
        title: 'District Science Exhibition - 1st Prize',
        date: '2026-08-14',
        desc: 'Presented automated low-cost water filtration and turbidity sensor.',
      },
      {
        id: 'a2',
        title: 'Inter-School Mathematics Olympiad Merit',
        date: '2026-06-20',
        desc: 'Secured Top 5 rank in junior division.',
      },
    ],
    courses: [
      { id: 'c1', name: 'Physics: Electromagnetic Induction', progress: 75 },
      { id: 'c2', name: 'Python: Data Structures & Algorithms', progress: 60 },
      { id: 'c3', name: 'Chemistry: Chemical Kinetics', progress: 40 },
    ],
    done: [
      { id: 'd1', name: 'Trigonometry Fundamentals', date: '2026-07-10' },
      { id: 'd2', name: 'Basics of Circuit Analysis', date: '2026-08-01' },
    ],
    days: [
      new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    events: [
      { d: new Date().toISOString().split('T')[0], t: 'Logged topic: Physics: Electromagnetic Induction' },
      { d: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], t: 'Reached goal: Complete Chapter 4' },
      { d: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], t: 'Added marks for Computer Science' },
    ],
    goals: [
      { id: 'g1', text: 'Finish Electromagnetic Induction exercises', date: '2026-10-20', done: false },
      { id: 'g2', text: 'Submit Arduino sensor report to Dr. Ramesh Kumar', date: '2026-10-25', done: false },
      { id: 'g3', text: 'Revise coordinate geometry for term test', date: '2026-10-18', done: true },
    ],
    posts: [
      {
        id: 'p1',
        created: Date.now() - 86400000 * 2,
        type: 'project',
        category: 'academic',
        result: 'won',
        visibility: 'everyone',
        title: 'Low-cost Ultrasonic Sensor Rover',
        desc: 'Designed and 3D printed a two-wheeled obstacle avoiding robot controlled by an ATmega328P microcontroller with real-time telemetry.',
        date: '2026-09-28',
        tags: ['robotics', 'arduino', 'hardware', 'embedded'],
        link: 'https://github.com',
      },
      {
        id: 'p2',
        created: Date.now() - 86400000 * 6,
        type: 'achievement',
        category: 'academic',
        result: 'won',
        visibility: 'everyone',
        title: 'State Science Fair - Gold Trophy',
        desc: 'Honored with 1st place in Senior Applied Sciences category under guidance of faculty mentor Dr. Ramesh Kumar.',
        date: '2026-09-12',
        tags: ['award', 'physics', 'science fair'],
      },
    ],
    draft: null,
    conn: { t2: true },
  };
}

export function getStudentData(): StudentStore {
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultStudentData(), ...parsed };
    }
  } catch (e) {
    console.error('Error reading student store', e);
  }
  const def = defaultStudentData();
  saveStudentData(def);
  return def;
}

export function saveStudentData(data: StudentStore): void {
  try {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Storage full or write error', e);
  }
}

export function defaultClassroomData(): ClassroomData {
  const now = Date.now();
  return {
    classes: [
      {
        id: 'cl1',
        subject: 'Physics: Ray Optics & Wave Motion',
        teacher: 'Dr. Ramesh Kumar',
        at: now + 3600000 * 2, // 2 hours from now
        link: 'https://meet.google.com/demo-pentagon-class',
      },
      {
        id: 'cl2',
        subject: 'Mathematics: Vector Calculus & Matrices',
        teacher: 'Ms. Priya Nair',
        at: now + 86400000 + 3600000 * 4,
        link: 'https://meet.google.com/demo-pentagon-math',
      },
      {
        id: 'cl3',
        subject: 'Computer Science: Algorithms & Complexity',
        teacher: 'Mr. Daniel J.',
        at: now + 86400000 * 2 + 3600000 * 1,
        link: 'https://meet.google.com/demo-pentagon-cs',
      },
      {
        id: 'cl4',
        subject: 'Chemistry: Coordination Compounds',
        teacher: 'Dr. Savitha Sharma',
        at: now + 86400000 * 3 + 3600000 * 3,
        link: '',
      },
    ],
    classAvg: {
      mathematics: 78.5,
      physics: 81.0,
      chemistry: 76.2,
      'computer science': 84.0,
      english: 82.5,
    },
    attendance: {
      present: 48,
      absent: 3,
    },
    leaderboard: [
      { name: 'Divya S.', avg: 96.4 },
      { name: 'Aarav Sharma', avg: 91.4 },
      { name: 'Rohan Mehra', avg: 89.2 },
      { name: 'Ananya Roy', avg: 88.0 },
      { name: 'Karthik P.', avg: 85.6 },
      { name: 'Sneha Patel', avg: 83.1 },
    ],
  };
}

export function getClassroomData(): ClassroomData {
  try {
    const raw = localStorage.getItem(CLASSROOM_KEY);
    if (raw) return { ...defaultClassroomData(), ...JSON.parse(raw) };
  } catch {}
  const def = defaultClassroomData();
  saveClassroomData(def);
  return def;
}

export function saveClassroomData(data: ClassroomData): void {
  try {
    localStorage.setItem(CLASSROOM_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Classroom save error', e);
  }
}

export function getPersonalEvents(): PersonalCalendarEvent[] {
  try {
    const raw = localStorage.getItem(PERSONAL_CALENDAR_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const def: PersonalCalendarEvent[] = [
    {
      id: 'pe1',
      title: 'Physics Fair Presentation Preparation',
      date: new Date().toISOString().split('T')[0],
      time: '16:30',
    },
    {
      id: 'pe2',
      title: 'Maths Group Study with Rahul',
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: '18:00',
    },
  ];
  savePersonalEvents(def);
  return def;
}

export function savePersonalEvents(events: PersonalCalendarEvent[]): void {
  try {
    localStorage.setItem(PERSONAL_CALENDAR_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Personal events save error', e);
  }
}

export function getMockCalendarYearData(year: number): CalendarYearData {
  const days: Record<string, any> = {};
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  // Populate some sample schedule items around current month
  for (let m = 1; m <= 12; m++) {
    const daysInM = new Date(year, m, 0).getDate();
    for (let d = 1; d <= daysInM; d++) {
      const p2m = m < 10 ? '0' + m : '' + m;
      const p2d = d < 10 ? '0' + d : '' + d;
      const key = `${year}-${p2m}-${p2d}`;
      const dt = new Date(year, m - 1, d);
      const dayOfWeek = dt.getDay(); // 0 = Sun

      const dayObj: any = {};
      if (dayOfWeek === 0) {
        dayObj.holiday = 'Sunday Off';
      }

      // Add special dates
      if (m === 8 && d === 15) dayObj.holiday = 'Independence Day';
      if (m === 10 && d === 2) dayObj.holiday = 'Gandhi Jayanti';
      if (m === 11 && d === 12) dayObj.holiday = 'Diwali Break';
      if (m === 12 && d === 25) dayObj.holiday = 'Christmas Holiday';
      if (m === 1 && d === 26) dayObj.holiday = 'Republic Day';

      // Exams
      if (m === 11 && d >= 18 && d <= 23) {
        dayObj.events = [{ title: 'Mid-Term Examinations', kind: 'exam' }];
      }
      if (m === 3 && d >= 10 && d <= 20) {
        dayObj.events = [{ title: 'Annual Board Practical & Theory Exam', kind: 'exam' }];
      }

      // Normal weekday classes
      if (dayOfWeek !== 0 && !dayObj.holiday && (!dayObj.events || dayObj.events[0]?.kind !== 'exam')) {
        const classes = [
          { subject: 'Physics', teacher: 'Dr. Ramesh Kumar', start: `${key}T09:00:00`, end: `${key}T10:00:00` },
          { subject: 'Mathematics', teacher: 'Ms. Priya Nair', start: `${key}T10:15:00`, end: `${key}T11:15:00` },
          { subject: 'Computer Science', teacher: 'Mr. Daniel J.', start: `${key}T11:30:00`, end: `${key}T12:30:00` },
        ];
        dayObj.classes = classes;
        // notes indicators
        if (d % 2 === 0) {
          dayObj.notes = {
            mine: 1,
            board: 1,
            ai: d % 3 === 0 ? 1 : 0,
          };
        }
      }

      if (Object.keys(dayObj).length > 0) {
        days[key] = dayObj;
      }
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return {
    subjects: [
      { name: 'Physics' },
      { name: 'Mathematics' },
      { name: 'Computer Science' },
      { name: 'Chemistry' },
      { name: 'English' },
    ],
    days,
    progress: {
      syllabusPct: 78,
      attendancePct: 94,
      daysWithNotes: 68,
      daysTotal: 82,
    },
    upcoming: [
      {
        date: todayStr,
        title: 'Physics: Wave Optics Lab Experiment',
        sub: '09:00 AM · Lab 3',
        kind: 'event',
      },
      {
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        title: 'Maths Assignment: Differential Equations',
        sub: 'Due 11:59 PM',
        kind: 'event',
      },
      {
        date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        title: 'Computer Science Unit Test',
        sub: 'Chapter 1 to 5',
        kind: 'exam',
      },
    ],
  };
}

export interface RegisteredUserRecord {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  institution: string;
  passwordHash?: string;
  createdAt: string;
}

export function getRegisteredUsers(): Record<string, RegisteredUserRecord> {
  try {
    const raw = localStorage.getItem('pentagon_registered_users');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveRegisteredUser(user: RegisteredUserRecord): void {
  try {
    const existing = getRegisteredUsers();
    existing[user.email.toLowerCase()] = user;
    localStorage.setItem('pentagon_registered_users', JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving registered user', e);
  }
}
