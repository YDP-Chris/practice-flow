import { useState, useEffect } from 'react';
import { Guitar, BarChart3, History } from 'lucide-react';
import Timer from './components/Timer';
import SessionLogger from './components/SessionLogger';
import Dashboard from './components/Dashboard';
import SessionHistory from './components/SessionHistory';
import { PracticeSession } from './types';
import { loadSessions } from './utils/storage';
import { calculateStats } from './utils/analytics';
import { millisecondsToMinutes } from './utils/timeUtils';

type View = 'timer' | 'dashboard' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<View>('timer');
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [completedSessionDuration, setCompletedSessionDuration] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load sessions on mount
  useEffect(() => {
    setSessions(loadSessions());
  }, [refreshKey]);

  const stats = calculateStats(sessions);

  const handleTimerComplete = (duration: number) => {
    setCompletedSessionDuration(duration);
    // Don't switch views automatically - let user decide when to log
  };

  const handleSessionSaved = () => {
    setCompletedSessionDuration(null);
    setRefreshKey(prev => prev + 1); // Trigger reload
  };

  const handleSessionUpdate = () => {
    setRefreshKey(prev => prev + 1); // Trigger reload
  };

  const clearCompletedSession = () => {
    setCompletedSessionDuration(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Guitar className="text-primary-600" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Practice Flow</h1>
                <p className="text-sm text-gray-600">Guitar Practice Analytics</p>
              </div>
            </div>

            {/* Current streak display */}
            {stats.currentStreak > 0 && (
              <div className="hidden sm:flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
                <span className="text-orange-600">🔥</span>
                <span className="text-sm font-medium text-orange-700">
                  {stats.currentStreak} day streak
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1 pb-4">
            {[
              { id: 'timer' as View, label: 'Practice', icon: Guitar },
              { id: 'dashboard' as View, label: 'Progress', icon: BarChart3 },
              { id: 'history' as View, label: 'History', icon: History }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'timer' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Timer onComplete={handleTimerComplete} />

            {completedSessionDuration && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <span className="font-medium text-green-800">
                      Session completed! ({millisecondsToMinutes(completedSessionDuration)} minutes)
                    </span>
                  </div>
                  <button
                    onClick={clearCompletedSession}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-green-700 mb-4">
                  Log this session to track your progress:
                </p>
                <SessionLogger
                  timerDuration={completedSessionDuration}
                  onSessionSaved={handleSessionSaved}
                />
              </div>
            )}

            {!completedSessionDuration && (
              <>
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Or log a session manually:</p>
                </div>
                <SessionLogger onSessionSaved={handleSessionSaved} />
              </>
            )}
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            <Dashboard stats={stats} />
          </div>
        )}

        {currentView === 'history' && (
          <div className="max-w-4xl mx-auto">
            <SessionHistory
              sessions={sessions}
              onUpdate={handleSessionUpdate}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>Practice consistently. Track progress. Improve daily.</p>
            <p className="mt-2">Built with ❤️ for guitarists who want to level up.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;