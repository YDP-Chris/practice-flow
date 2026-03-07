import { PracticeSession, PracticeStats, Skill } from '../types';
import { isThisWeek, isThisMonth } from './timeUtils';

export const calculateStats = (sessions: PracticeSession[]): PracticeStats => {
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    currentStreak: calculateStreak(sortedSessions),
    totalWeeklyMinutes: calculateWeeklyMinutes(sessions),
    totalMonthlyMinutes: calculateMonthlyMinutes(sessions),
    skillDistribution: calculateSkillDistribution(sessions),
    recentSessions: sortedSessions.slice(0, 5)
  };
};

export const calculateStreak = (sessions: PracticeSession[]): number => {
  if (sessions.length === 0) return 0;

  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group sessions by date
  const sessionsByDate = new Map<string, PracticeSession[]>();

  sortedSessions.forEach(session => {
    const dateKey = new Date(session.date).toDateString();
    if (!sessionsByDate.has(dateKey)) {
      sessionsByDate.set(dateKey, []);
    }
    sessionsByDate.get(dateKey)!.push(session);
  });

  const dates = Array.from(sessionsByDate.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (dates.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  // Check if there's a session today or yesterday (to account for different timezones)
  const todayKey = today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toDateString();

  let startIndex = -1;
  if (dates.includes(todayKey)) {
    startIndex = dates.indexOf(todayKey);
  } else if (dates.includes(yesterdayKey)) {
    startIndex = dates.indexOf(yesterdayKey);
  } else {
    return 0; // No recent sessions
  }

  // Count consecutive days
  for (let i = startIndex; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - (i - startIndex));

    if (currentDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateWeeklyMinutes = (sessions: PracticeSession[]): number => {
  return sessions
    .filter(session => isThisWeek(session.date))
    .reduce((total, session) => total + session.duration, 0);
};

export const calculateMonthlyMinutes = (sessions: PracticeSession[]): number => {
  return sessions
    .filter(session => isThisMonth(session.date))
    .reduce((total, session) => total + session.duration, 0);
};

export const calculateSkillDistribution = (sessions: PracticeSession[]): Record<Skill, number> => {
  const distribution: Record<Skill, number> = {
    scales: 0,
    chords: 0,
    songs: 0,
    technique: 0,
    theory: 0,
    improvisation: 0
  };

  sessions.forEach(session => {
    session.skills.forEach(skill => {
      distribution[skill] += session.duration;
    });
  });

  return distribution;
};

export const getSkillLabel = (skill: Skill): string => {
  const labels: Record<Skill, string> = {
    scales: 'Scales',
    chords: 'Chords',
    songs: 'Songs',
    technique: 'Technique',
    theory: 'Theory',
    improvisation: 'Improvisation'
  };
  return labels[skill];
};

export const getRecentPracticeDays = (sessions: PracticeSession[], days: number = 7): Array<{ date: string; minutes: number }> => {
  const today = new Date();
  const result: Array<{ date: string; minutes: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];

    const dayMinutes = sessions
      .filter(session => session.date.split('T')[0] === dateKey)
      .reduce((total, session) => total + session.duration, 0);

    result.push({
      date: dateKey,
      minutes: dayMinutes
    });
  }

  return result;
};