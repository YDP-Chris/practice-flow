import { PracticeSession } from '../types';

const STORAGE_KEY = 'practice-flow-sessions';

export const loadSessions = (): PracticeSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
};

export const saveSessions = (sessions: PracticeSession[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions:', error);
    // Handle quota exceeded or other errors
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      // Remove oldest sessions to make room
      const reducedSessions = sessions.slice(-50); // Keep last 50 sessions
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedSessions));
      } catch {
        console.error('Failed to save even reduced sessions');
      }
    }
  }
};

export const addSession = (session: Omit<PracticeSession, 'id'>): PracticeSession => {
  const sessions = loadSessions();
  const newSession: PracticeSession = {
    ...session,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  };

  sessions.push(newSession);
  saveSessions(sessions);
  return newSession;
};

export const deleteSession = (sessionId: string): void => {
  const sessions = loadSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  saveSessions(filtered);
};

export const updateSession = (sessionId: string, updates: Partial<PracticeSession>): void => {
  const sessions = loadSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
    saveSessions(sessions);
  }
};