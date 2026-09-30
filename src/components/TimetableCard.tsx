import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, BookOpen, Coffee, Sparkles } from 'lucide-react';
import { TimetableSlot } from '../types.ts';

interface TimetableCardProps {
  data: {
    day?: string;
    slots: TimetableSlot[];
    department: string;
    semester: string;
  };
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TimetableCard: React.FC<TimetableCardProps> = ({ data }) => {
  const [selectedDay, setSelectedDay] = useState<string>(data.day || 'Monday');

  const visibleSlots = data.slots.filter((s) => !data.day || s.day === selectedDay || data.slots.length <= 6);

  return (
    <div className="my-3 rounded-2xl bg-slate-900/90 border border-indigo-500/30 overflow-hidden shadow-xl shadow-indigo-950/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/60 to-slate-800/80 px-4 py-3 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Structured Timetable Intelligence
            </h4>
            <p className="text-xs text-slate-300 font-medium">
              {data.department} • {data.semester}
            </p>
          </div>
        </div>

        {/* Day selector if multiple days present */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-2 py-1 rounded font-medium transition-all ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Slots list */}
      <div className="p-3 divide-y divide-slate-800/80">
        {visibleSlots.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No lectures or labs scheduled for {selectedDay}.
          </div>
        ) : (
          visibleSlots.map((slot, idx) => {
            const isBreak = slot.type === 'Break';
            const isLab = slot.type === 'Lab';
            return (
              <div
                key={idx}
                className={`py-2.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl transition-colors ${
                  isBreak
                    ? 'bg-slate-800/30 text-slate-400'
                    : isLab
                    ? 'bg-violet-950/20 hover:bg-violet-950/30'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                {/* Time & Type Badge */}
                <div className="flex items-center gap-2.5 min-w-[170px]">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-indigo-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot.startTime} – {slot.endTime}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isBreak
                        ? 'bg-slate-700/60 text-slate-300'
                        : isLab
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {slot.type}
                  </span>
                </div>

                {/* Subject & Code */}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                    {isBreak ? <Coffee className="w-3.5 h-3.5 text-amber-400" /> : <BookOpen className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>{slot.subject}</span>
                    {slot.subjectCode && slot.subjectCode !== 'BREAK' && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({slot.subjectCode})
                      </span>
                    )}
                  </div>
                  {!isBreak && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        {slot.professor}
                      </span>
                    </div>
                  )}
                </div>

                {/* Room / Location */}
                {!isBreak && (
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg shrink-0">
                    <MapPin className="w-3 h-3" />
                    <span>{slot.room}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
