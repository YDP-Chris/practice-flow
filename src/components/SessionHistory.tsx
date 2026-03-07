import { useState, useMemo } from 'react';
import { Calendar, Clock, Filter, Trash2 } from 'lucide-react';
import { PracticeSession, Skill } from '../types';
import { formatDuration, formatRelativeDate } from '../utils/timeUtils';
import { getSkillLabel } from '../utils/analytics';
import { deleteSession } from '../utils/storage';

interface SessionHistoryProps {
  sessions: PracticeSession[];
  onUpdate: () => void;
  className?: string;
}

const SKILL_OPTIONS: Skill[] = ['scales', 'chords', 'songs', 'technique', 'theory', 'improvisation'];

export default function SessionHistory({ sessions, onUpdate, className = '' }: SessionHistoryProps) {
  const [filterSkill, setFilterSkill] = useState<Skill | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration'>('date');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedSessions = useMemo(() => {
    let filtered = sessions;

    // Filter by skill
    if (filterSkill !== 'all') {
      filtered = sessions.filter(session =>
        session.skills.includes(filterSkill)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.duration - a.duration;
      }
    });

    return filtered;
  }, [sessions, filterSkill, sortBy]);

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
      onUpdate();
    }
  };

  const totalMinutes = filteredAndSortedSessions.reduce((sum, session) => sum + session.duration, 0);

  if (sessions.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 text-center ${className}`}>
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h3>
        <p className="text-gray-600">Start practicing to build your history!</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header with filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Practice History</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by skill:
                </label>
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value as Skill | 'all')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="all">All skills</option>
                  {SKILL_OPTIONS.map(skill => (
                    <option key={skill} value={skill}>
                      {getSkillLabel(skill)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'duration')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="date">Date (newest first)</option>
                  <option value="duration">Duration (longest first)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          {filteredAndSortedSessions.length} session{filteredAndSortedSessions.length !== 1 ? 's' : ''} · {formatDuration(totalMinutes)} total
        </div>
      </div>

      {/* Sessions list */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAndSortedSessions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No sessions match your current filters.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAndSortedSessions.map((session) => (
              <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Duration and Date */}
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-1 text-primary-600 font-semibold">
                        <Clock size={16} />
                        <span>{formatDuration(session.duration)}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatRelativeDate(session.date)}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {session.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
                        >
                          {getSkillLabel(skill)}
                        </span>
                      ))}
                    </div>

                    {/* Notes */}
                    {session.notes && (
                      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">
                        "{session.notes}"
                      </div>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}