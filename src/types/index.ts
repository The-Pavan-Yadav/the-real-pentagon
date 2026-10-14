export type UserRole = 'student' | 'faculty' | 'school' | 'admin';

export interface UserSession {
  role: UserRole;
  uid: string;
  email: string;
  name?: string;
  t: number;
}

export interface ClassroomSetup {
  className: string;
  section: string;
  roomNumber: string;
  updatedAt?: number;
}

export interface StudentProfile {
  name: string;
  grade: string;
  school: string;
  bio: string;
  avatar?: string;
  banner?: string;
}

export interface StudentAbout {
  interests?: string;
  career?: string;
  learnGoals?: string;
  languages?: string;
  strengths?: string;
  coLearner?: string;
}

export interface SubjectMark {
  id: string;
  subject: string;
  marks: number;
}

export interface SkillItem {
  id: string;
  name: string;
  kind: 'Academic' | 'Extra-curricular';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AchievementItem {
  id: string;
  title: string;
  date: string;
  desc: string;
}

export interface CourseProgress {
  id: string;
  name: string;
  progress: number;
}

export interface CompletedCourse {
  id: string;
  name: string;
  date: string;
}

export interface LearningGoal {
  id: string;
  text: string;
  date?: string;
  done: boolean;
}

export interface LearningEvent {
  d: string;
  t: string;
}

export type PostType =
  | 'project'
  | 'achievement'
  | 'article'
  | 'image'
  | 'video'
  | 'link'
  | 'code'
  | 'doc'
  | 'slides'
  | 'design'
  | 'audio'
  | 'research'
  | 'event'
  | 'cert'
  | 'other';

export interface PostItem {
  id: string;
  created: number;
  type: PostType;
  category: 'academic' | 'eca';
  result: 'none' | 'won' | 'participated';
  visibility: 'everyone' | 'class' | 'me';
  title: string;
  desc: string;
  link?: string;
  img?: string;
  tags: string[];
  date: string;
}

export interface StudentStore {
  profile: StudentProfile | null;
  about: StudentAbout;
  marks: SubjectMark[];
  skills: SkillItem[];
  ach: AchievementItem[];
  courses: CourseProgress[];
  done: CompletedCourse[];
  days: string[]; // YYYY-MM-DD
  events: LearningEvent[];
  goals: LearningGoal[];
  posts: PostItem[];
  draft: Partial<PostItem> | null;
  conn: Record<string, boolean>;
}

export interface ClassroomClass {
  id: string;
  subject: string;
  teacher: string;
  at: number; // timestamp in ms
  link?: string;
}

export interface ClassroomAttendance {
  present: number;
  absent: number;
}

export interface LeaderboardEntry {
  name: string;
  avg: number;
}

export interface ClassroomData {
  classes: ClassroomClass[];
  classAvg: Record<string, number>;
  attendance: ClassroomAttendance | null;
  leaderboard: LeaderboardEntry[];
}

export interface PersonalCalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
}

export interface CalendarDayClass {
  subject: string;
  teacher?: string;
  start: string;
  end?: string;
}

export interface CalendarDayEvent {
  title: string;
  kind?: 'exam' | 'assignment' | 'event';
}

export interface CalendarDayInfo {
  holiday?: string;
  classes?: CalendarDayClass[];
  events?: CalendarDayEvent[];
  notes?: {
    mine?: number;
    board?: number;
    ai?: number;
  };
}

export interface CalendarYearData {
  subjects: { name: string }[] | string[];
  days: Record<string, CalendarDayInfo>;
  progress: {
    syllabusPct?: number;
    attendancePct?: number;
    daysWithNotes?: number;
    daysTotal?: number;
  };
  upcoming: {
    date: string;
    title: string;
    sub?: string;
    kind?: 'exam' | 'holiday' | 'event';
  }[];
}
