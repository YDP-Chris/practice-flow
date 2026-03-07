import { Flame, Clock, TrendingUp, Target } from 'lucide-react';
import { PracticeStats } from '../types';
import { formatDuration } from '../utils/timeUtils';
import ProgressCharts from './ProgressCharts';

interface DashboardProps {
  stats: PracticeStats;
  className?: string;
}

export default function Dashboard({ stats, className = '' }: DashboardProps) {
  const weeklyGoal = 300; // 5 hours per week
  const weeklyProgress = (stats.totalWeeklyMinutes / weeklyGoal) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="text-orange-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.currentStreak}
              </div>
              <div className="text-sm text-gray-600">Day streak</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Clock className="text-primary-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatDuration(stats.totalWeeklyMinutes)}
              </div>
              <div className="text-sm text-gray-600">This week</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatDuration(stats.totalMonthlyMinutes)}
              </div>
              <div className="text-sm text-gray-600">This month</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent-100 rounded-lg">
              <Target className="text-accent-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(weeklyProgress)}%
              </div>
              <div className="text-sm text-gray-600">Weekly goal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Goal Progress</h3>
          <span className="text-sm text-gray-600">
            {formatDuration(stats.totalWeeklyMinutes)} / {formatDuration(weeklyGoal)}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              weeklyProgress >= 100
                ? 'bg-green-500'
                : weeklyProgress >= 75
                ? 'bg-accent-500'
                : weeklyProgress >= 50
                ? 'bg-yellow-500'
                : 'bg-primary-500'
            }`}
            style={{ width: `${Math.min(100, weeklyProgress)}%` }}
          />
        </div>

        {weeklyProgress >= 100 && (
          <div className="mt-2 text-sm text-green-600 font-medium">
            🎉 You've hit your weekly goal!
          </div>
        )}
      </div>

      {/* Charts */}
      <ProgressCharts stats={stats} />

      {/* Recent Sessions */}
      {stats.recentSessions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>

          <div className="space-y-3">
            {stats.recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">
                      {formatDuration(session.duration)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {session.skills.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1)).join(', ')}
                  </div>
                  {session.notes && (
                    <div className="text-sm text-gray-500 mt-1 truncate">
                      "{session.notes}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}