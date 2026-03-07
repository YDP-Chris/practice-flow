export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
};

export const formatTimerDisplay = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const millisecondsToMinutes = (milliseconds: number): number => {
  return Math.round(milliseconds / (1000 * 60));
};

export const isToday = (date: string): boolean => {
  const sessionDate = new Date(date);
  const today = new Date();

  return (
    sessionDate.getDate() === today.getDate() &&
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear()
  );
};

export const isThisWeek = (date: string): boolean => {
  const sessionDate = new Date(date);
  const today = new Date();

  // Get the start of this week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return sessionDate >= startOfWeek;
};

export const isThisMonth = (date: string): boolean => {
  const sessionDate = new Date(date);
  const today = new Date();

  return (
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear()
  );
};

export const formatRelativeDate = (date: string): string => {
  const sessionDate = new Date(date);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return sessionDate.toLocaleDateString();
};