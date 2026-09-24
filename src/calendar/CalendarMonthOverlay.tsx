import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays, X, Sparkles } from 'lucide-react';
import { ScheduleItem, TodoItem } from '../types';
import { CalendarFlexView } from './CalendarFlexView';

interface CalendarMonthOverlayProps {
  show: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  todos?: TodoItem[];
  schedules: ScheduleItem[];
  time: Date;
  onToggleTodo?: (id: string) => void;
  onShowPlanner?: (item?: ScheduleItem | TodoItem, date?: Date) => void;
}

export const CalendarMonthOverlay: React.FC<CalendarMonthOverlayProps> = ({
  show,
  onClose,
  isDarkMode,
  selectedDate,
  setSelectedDate,
  todos = [],
  schedules = [],
  time,
  onToggleTodo,
  onShowPlanner
}) => {
  const monthName = `${selectedDate.getMonth() + 1}月`;
  const year = selectedDate.getFullYear();

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Pop-up Skeuomorphic Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`relative z-10 w-full max-w-4xl h-[88vh] rounded-[2.5rem] flex flex-col shadow-2xl border overflow-hidden ${
              isDarkMode 
                ? 'bg-zinc-900/95 border-white/15 text-white shadow-[0_25px_60px_rgba(0,0,0,0.7)]' 
                : 'bg-white/95 border-zinc-200/90 text-zinc-900 shadow-[0_25px_60px_rgba(0,0,0,0.15)]'
            }`}
          >
            {/* Top Modal Bar */}
            <div className={`px-6 py-4 flex items-center justify-between border-b shrink-0 ${
              isDarkMode ? 'border-zinc-800' : 'border-zinc-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                  isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  <CalendarDays size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black tracking-tight">
                      AI 月历矩阵 · {year}年{monthName}全局战略全景
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      静态全景卡
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                    全局掌控整月工作节奏 · 节气与里程碑交错分布
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="收起月历"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
              <CalendarFlexView
                isDarkMode={isDarkMode}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                todos={todos}
                schedules={schedules}
                time={time}
                onNavigate={() => {}}
                onToggleTodo={onToggleTodo}
                onShowPlanner={onShowPlanner}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
