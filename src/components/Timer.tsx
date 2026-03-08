import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { TimerState } from '../types';
import { formatTimerDisplay } from '../utils/timeUtils';

interface TimerProps {
  onComplete: (duration: number) => void;
  className?: string;
}

export default function Timer({ onComplete, className = '' }: TimerProps) {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    startTime: null,
    elapsed: 0
  });

  const intervalRef = useRef<number | null>(null);
  const pausedElapsedRef = useRef<number>(0);

  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused && timerState.startTime) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          elapsed: Date.now() - prev.startTime! + pausedElapsedRef.current
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.isPaused, timerState.startTime]);

  const startTimer = () => {
    const now = Date.now();
    setTimerState({
      isRunning: true,
      isPaused: false,
      startTime: now,
      elapsed: pausedElapsedRef.current
    });
  };

  const pauseTimer = () => {
    if (timerState.isRunning && !timerState.isPaused) {
      pausedElapsedRef.current = timerState.elapsed;
      setTimerState(prev => ({
        ...prev,
        isPaused: true
      }));
    }
  };

  const resumeTimer = () => {
    if (timerState.isPaused) {
      const now = Date.now();
      setTimerState({
        isRunning: true,
        isPaused: false,
        startTime: now,
        elapsed: timerState.elapsed
      });
    }
  };

  const stopTimer = () => {
    const finalElapsed = timerState.elapsed;

    setTimerState({
      isRunning: false,
      isPaused: false,
      startTime: null,
      elapsed: 0
    });

    pausedElapsedRef.current = 0;

    if (finalElapsed > 0) {
      onComplete(finalElapsed);
    }
  };

  const resetTimer = () => {
    setTimerState({
      isRunning: false,
      isPaused: false,
      startTime: null,
      elapsed: 0
    });
    pausedElapsedRef.current = 0;
  };

  const isIdle = !timerState.isRunning && !timerState.isPaused;
  const isRunning = timerState.isRunning && !timerState.isPaused;
  const isPaused = timerState.isPaused;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="text-center">
        <div className="text-6xl font-mono font-bold text-primary-600 mb-6">
          {formatTimerDisplay(timerState.elapsed)}
        </div>

        <div className="flex justify-center space-x-4">
          {isIdle && (
            <button
              onClick={startTimer}
              className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Play size={20} />
              <span>Start Practice</span>
            </button>
          )}

          {isRunning && (
            <>
              <button
                onClick={pauseTimer}
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                <Pause size={20} />
                <span>Pause</span>
              </button>
              <button
                onClick={stopTimer}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                <Square size={20} />
                <span>Finish</span>
              </button>
            </>
          )}

          {isPaused && (
            <>
              <button
                onClick={resumeTimer}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                <Play size={20} />
                <span>Resume</span>
              </button>
              <button
                onClick={stopTimer}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                <Square size={20} />
                <span>Finish</span>
              </button>
              <button
                onClick={resetTimer}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
              >
                Reset
              </button>
            </>
          )}
        </div>

        {timerState.elapsed > 0 && (
          <div className="mt-4 text-gray-600">
            {isPaused ? 'Paused' : isRunning ? 'Recording...' : 'Ready to log'}
          </div>
        )}
      </div>
    </div>
  );
}