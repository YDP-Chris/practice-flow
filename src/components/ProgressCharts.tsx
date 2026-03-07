import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PracticeStats } from '../types';
import { getSkillLabel } from '../utils/analytics';
import { loadSessions } from '../utils/storage';
import { getRecentPracticeDays } from '../utils/analytics';

interface ProgressChartsProps {
  stats: PracticeStats;
  className?: string;
}

const SKILL_COLORS = {
  scales: '#3b82f6',      // blue
  chords: '#10b981',      // emerald
  songs: '#f59e0b',       // amber
  technique: '#ef4444',   // red
  theory: '#8b5cf6',      // violet
  improvisation: '#06b6d4' // cyan
};

export default function ProgressCharts({ stats, className = '' }: ProgressChartsProps) {
  // Prepare skill distribution data for pie chart
  const skillData = Object.entries(stats.skillDistribution)
    .filter(([, minutes]) => minutes > 0)
    .map(([skill, minutes]) => ({
      name: getSkillLabel(skill as any),
      value: minutes,
      color: SKILL_COLORS[skill as keyof typeof SKILL_COLORS]
    }));

  // Get recent practice data for bar chart
  const sessions = loadSessions();
  const recentDays = getRecentPracticeDays(sessions, 7);
  const practiceData = recentDays.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    minutes: day.minutes
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-primary-600">
            {`${payload[0].value} minutes`}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-primary-600">
            {`${payload[0].value} minutes`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (skillData.length === 0 && practiceData.every(d => d.minutes === 0)) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 text-center ${className}`}>
        <p className="text-gray-500">Start practicing to see your progress charts!</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Skill Distribution */}
      {skillData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Focus</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={skillData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {skillData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {skillData.map((skill) => (
              <div key={skill.name} className="flex items-center space-x-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
                <span className="text-gray-700 truncate">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Practice */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={practiceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis
              fontSize={12}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="minutes"
              fill="#1e40af"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Daily practice over the last 7 days
        </div>
      </div>
    </div>
  );
}