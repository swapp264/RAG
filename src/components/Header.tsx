import React from 'react';
import { 
  GraduationCap, 
  Database, 
  UserCheck, 
  Sparkles, 
  Calendar, 
  Layers, 
  Settings2,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  currentMode: 'student' | 'admin';
  setCurrentMode: (mode: 'student' | 'admin') => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  selectedSem: string;
  setSelectedSem: (sem: string) => void;
  docCount: number;
  chunkCount: number;
}

export const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecomm',
  'AI & Data Science',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  setCurrentMode,
  selectedDept,
  setSelectedDept,
  selectedSem,
  setSelectedSem,
  docCount,
  chunkCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                CampusMind
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                RAG v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Apex Institute of Technology • Official Knowledge Base
            </p>
          </div>
        </div>

        {/* Center: Department & Semester personalizer */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Profile:</span>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
          >
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Right: RAG Vector Badge & Mode Switcher */}
        <div className="flex items-center gap-3">
          {/* Vector Status Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/50 border border-slate-700/60 rounded-full px-3 py-1 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-slate-300 font-medium">
              Vector DB: <strong className="text-emerald-400">{docCount} Docs</strong> ({chunkCount} Chunks)
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setCurrentMode('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentMode === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student Chat</span>
            </button>

            <button
              onClick={() => setCurrentMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentMode === 'admin'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Admin Studio</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
