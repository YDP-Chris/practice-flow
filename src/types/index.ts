export interface PracticeSession {
  id: string;
  date: string; // ISO string
  duration: number; // minutes
  skills: Skill[];
  notes?: string;
}

export type Skill = 'scales' | 'chords' | 'songs' | 'technique' | 'theory' | 'improvisation';

export interface PracticeStats {
  currentStreak: number;
  totalWeeklyMinutes: number;
  totalMonthlyMinutes: number;
  skillDistribution: Record<Skill, number>;
  recentSessions: PracticeSession[];
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null;
  elapsed: number; // milliseconds
}