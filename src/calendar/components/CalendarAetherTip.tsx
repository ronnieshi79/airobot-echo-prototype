import React from 'react';
import { Bot } from 'lucide-react';

interface CalendarAetherTipProps {
  isDarkMode: boolean;
  text: string;
  title?: string;
}

/**
 * CalendarAetherTip
 * 模块化 AETHER 底部智能提示条，带有呼吸脉冲指示灯与拟物高斯模糊背景
 */
export const CalendarAetherTip: React.FC<CalendarAetherTipProps> = ({
  isDarkMode,
  text,
  title = 'AETHER 提示',
}) => {
  return (
    <div className="mt-2.5 flex-shrink-0 pt-1">
      <div
        className={`px-5 py-3.5 rounded-[2rem] border flex items-start gap-3.5 transition-all shadow-xl backdrop-blur-xl ${
          isDarkMode
            ? 'bg-indigo-900/60 border-indigo-500/30 shadow-indigo-950/50'
            : 'bg-indigo-50/90 border-indigo-200 shadow-indigo-100/20'
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex flex-shrink-0 items-center justify-center mt-0.5 relative">
          <Bot size={16} className="text-indigo-500" />
          <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p
            className={`text-[10px] font-black uppercase tracking-[0.2em] ${
              isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`}
          >
            {title}
          </p>
          <p
            className={`text-xs font-bold leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};
