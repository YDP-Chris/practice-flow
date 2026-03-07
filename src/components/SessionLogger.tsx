import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Skill } from '../types';
import { addSession } from '../utils/storage';
import { millisecondsToMinutes, formatDuration } from '../utils/timeUtils';
import { getSkillLabel } from '../utils/analytics';

interface SessionLoggerProps {
  timerDuration?: number; // milliseconds from timer
  onSessionSaved: () => void;
  className?: string;
}

const SKILL_OPTIONS: Skill[] = ['scales', 'chords', 'songs', 'technique', 'theory', 'improvisation'];

export default function SessionLogger({ timerDuration, onSessionSaved, className = '' }: SessionLoggerProps) {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [manualDuration, setManualDuration] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useTimerDuration, setUseTimerDuration] = useState(!!timerDuration);

  const handleSkillToggle = (skill: Skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) return;

    setIsSubmitting(true);

    try {
      const duration = useTimerDuration && timerDuration
        ? millisecondsToMinutes(timerDuration)
        : parseInt(manualDuration) || 0;

      if (duration <= 0) {
        alert('Please enter a valid duration');
        return;
      }

      const session = {
        date: new Date().toISOString(),
        duration,
        skills: selectedSkills,
        notes: notes.trim() || undefined
      };

      addSession(session);

      // Reset form
      setSelectedSkills([]);
      setManualDuration('');
      setNotes('');
      setUseTimerDuration(!!timerDuration);

      onSessionSaved();
    } catch (error) {
      console.error('Failed to save session:', error);
      alert('Failed to save session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const duration = useTimerDuration && timerDuration
    ? millisecondsToMinutes(timerDuration)
    : parseInt(manualDuration) || 0;

  const canSubmit = selectedSkills.length > 0 && duration > 0;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Log Practice Session</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>

          {timerDuration && (
            <div className="mb-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={useTimerDuration}
                  onChange={() => setUseTimerDuration(true)}
                  className="text-primary-500"
                />
                <span>Use timer duration: {formatDuration(millisecondsToMinutes(timerDuration))}</span>
              </label>
            </div>
          )}

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={!useTimerDuration}
              onChange={() => setUseTimerDuration(false)}
              className="text-primary-500"
            />
            <span>Manual entry:</span>
          </label>

          {!useTimerDuration && (
            <input
              type="number"
              value={manualDuration}
              onChange={(e) => setManualDuration(e.target.value)}
              placeholder="Minutes"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
              min="1"
              max="300"
            />
          )}
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What did you practice? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SKILL_OPTIONS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  selectedSkills.includes(skill)
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>{getSkillLabel(skill)}</span>
                {selectedSkills.includes(skill) && (
                  <Check size={16} className="text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What went well? What needs work?"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {notes.length}/500 characters
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-all ${
            canSubmit && !isSubmitting
              ? 'bg-primary-500 hover:bg-primary-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus size={20} />
          <span>{isSubmitting ? 'Saving...' : 'Log Session'}</span>
        </button>
      </form>
    </div>
  );
}