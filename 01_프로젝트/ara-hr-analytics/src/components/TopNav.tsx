import React from 'react';
import { ShieldCheck, Calendar } from 'lucide-react';

interface TopNavProps {
  step: number;
  onReset: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ step, onReset }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-ara-border h-16 theme-transition">
      <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-ara-teal flex items-center justify-center text-white font-extrabold text-lg shadow-teal-glow transition-all duration-300 group-hover:scale-105">
            A
          </div>
          <span className="font-extrabold text-xl tracking-tight text-ara-navy transition-colors duration-300 group-hover:text-ara-teal">
            ARA
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-ara-muted font-medium ml-2">
            HR AI Report
          </span>
        </div>

        {/* Dynamic Context / Action buttons */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-xs text-ara-muted bg-slate-50 border border-ara-border px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-ara-teal" />
            <span>분석 후 데이터를 보관하지 않습니다</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-ara-muted font-mono bg-slate-50 border border-ara-border px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            <span>2026.05.29</span>
          </div>

          {step > 1 && (
            <button
              onClick={onReset}
              className="text-xs font-semibold text-ara-teal hover:text-ara-teal-hover hover:underline transition-colors duration-200"
            >
              처음으로 돌아가기
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
