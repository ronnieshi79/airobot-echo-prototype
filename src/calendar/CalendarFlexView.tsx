import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { ScheduleItem, TodoItem, MainCategory, SubCategory } from '../types';
import { getTodayInfo, getLocalDateString, getWeekNumber, getRelativeDaysLabel, isScheduleOnDate } from './utils';
import { SchedulePlannerOverlay } from './SchedulePlannerOverlay';
import { CalendarAetherTip } from './components/CalendarAetherTip';

interface CalendarFlexViewProps {
  isDarkMode: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  todos?: TodoItem[];
  schedules: ScheduleItem[];
  time: Date;
  onNavigate: (cat: MainCategory, sub: SubCategory) => void;
  onToggleTodo?: (id: string) => void;
  onShowPlanner?: (item?: ScheduleItem | TodoItem, date?: Date) => void;
}

/**
 * CalendarFlexView
 * AI 月历视图 (View Layer)
 * 包含拟物月历网格、节气与纪念日点标、选中日悬挂小尾巴及 AETHER 智能月度摘要
 */
export const CalendarFlexView: React.FC<CalendarFlexViewProps> = ({ 
  isDarkMode, 
  selectedDate,
  setSelectedDate,
  todos = [],
  schedules = [], 
  time,
  onNavigate,
  onToggleTodo,
  onShowPlanner
}) => {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [activePlannerItem, setActivePlannerItem] = useState<{ id: string; type: 'schedule' | 'todo' } | undefined>(undefined);

  const openPlanner = (item?: { id: string; type: 'schedule' | 'todo' }, targetDate?: Date) => {
    let itemObj: ScheduleItem | TodoItem | undefined = undefined;
    if (item) {
      if (item.type === 'todo') itemObj = todos.find(t => t.id === item.id);
      else itemObj = schedules.find(s => s.id === item.id);
    }
    const d = targetDate || selectedDate;
    if (onShowPlanner) {
      onShowPlanner(itemObj, d);
    } else {
      setActivePlannerItem(item);
      setPlannerOpen(true);
    }
  };

  // Month grid logic
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthName = `${selectedDate.getMonth() + 1}月`;
  const weekNumber = getWeekNumber(selectedDate);
  const selectedDayInfo = getTodayInfo(selectedDate);

  const monthSchedulesCount = schedules.filter(s => {
    if (s.date) {
      const sDate = new Date(s.date);
      return sDate.getMonth() === selectedDate.getMonth();
    }
    return true; 
  }).length;

  const monthFestivals = monthDays
    .map(d => getTodayInfo(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d)).festival)
    .filter(Boolean);
  const uniqueFestivals = Array.from(new Set(monthFestivals)).slice(0, 2);

  const aetherMonthPrompt = `主人，本月是${monthName}，您有 ${monthSchedulesCount} 项日程安排。${
    uniqueFestivals.length > 0 ? `包含 ${uniqueFestivals.join(' 和 ')} 等重要节日。` : ''
  }记得合理规划时间哦！`;

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden relative">
      {/* 1. Standard App Title Bar */}
      <div className="mb-2 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <CalendarIcon size={20} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            AI 月历
          </h2>
        </div>
      </div>

      {/* 2. Month / Year / Week Header */}
      <div className="flex items-center justify-between mb-2 pl-1 pr-1 flex-shrink-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {selectedDate.getFullYear()}年{monthName}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${isDarkMode ? 'bg-indigo-500/10 text-indigo-500' : 'bg-indigo-50 text-indigo-600'}`}>
            第 {weekNumber} 周
          </span>
        </div>
      </div>

      {/* 3. Dynamic Grid Container */}
      <div className="flex-1 flex flex-col justify-start min-h-0 overflow-hidden px-0.5">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1.5 flex-shrink-0">
          {['日', '一', '二', '三', '四', '五', '六'].map((d, i) => (
            <span key={d} className={`text-xs font-black uppercase tracking-wider ${i === 0 || i === 6 ? 'text-indigo-400' : (isDarkMode ? 'text-slate-400' : 'text-slate-400')}`}>{d}</span>
          ))}
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 pb-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="min-h-[50px]" />)}
          {monthDays.map(d => {
            const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
            const isTodayLocal = getLocalDateString(date) === getLocalDateString(time);
            const isSelected = getLocalDateString(date) === getLocalDateString(selectedDate);
            
            const hasItems = schedules.some(s => isScheduleOnDate(s, date));
            const daySpecialEvents = schedules.filter(s => (s.type === 'festival' || s.type === 'birthday' || s.type === 'anniversary') && isScheduleOnDate(s, date));
            
            const cellInfo = getTodayInfo(date);
            const displayLunar = daySpecialEvents.length > 0
              ? daySpecialEvents[0].task
              : (cellInfo.festival || cellInfo.solarTerm || cellInfo.lunarDate.replace(/农历.*月/, ''));

            const hasFestival = !!cellInfo.festival || daySpecialEvents.some(s => s.type === 'festival');
            const hasBirthday = daySpecialEvents.some(s => s.type === 'birthday');
            const hasAnniversary = daySpecialEvents.some(s => s.type === 'anniversary');

            return (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                key={`m-${d}`} 
                onClick={() => {
                  setSelectedDate(date);
                }}
                className={`flex flex-col items-center justify-between py-1 px-0.5 rounded-xl transition-all relative min-h-[50px] cursor-pointer ${
                  isSelected
                    ? (isDarkMode 
                        ? 'bg-indigo-950/60 ring-2 ring-indigo-500 text-white shadow-sm' 
                        : 'bg-indigo-50/70 ring-2 ring-indigo-500 border-indigo-200 text-slate-800 shadow-sm')
                    : (isDarkMode 
                        ? 'bg-slate-800/30 border border-slate-800/50 text-slate-300 hover:bg-slate-800/60' 
                        : 'bg-white/80 border border-slate-100 hover:bg-white hover:shadow-xs text-slate-700')
                }`}
              >
                {/* Day Number */}
                <div className="flex items-center justify-center relative w-full pt-0.5">
                  <span className={`text-sm font-extrabold leading-none ${
                    isTodayLocal 
                      ? 'text-indigo-600 dark:text-indigo-400 font-black' 
                      : (isDarkMode ? 'text-slate-200' : 'text-slate-800')
                  }`}>
                    {d}
                  </span>
                  {isTodayLocal && (
                    <span className="absolute right-0.5 top-0 text-[8px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1 rounded-full scale-90">
                      今
                    </span>
                  )}
                </div>

                {/* Lunar / Festival / Birthday / Anniversary text */}
                <div className={`text-[10px] font-bold leading-tight my-0.5 text-center truncate max-w-full px-0.5 ${
                  hasBirthday
                    ? 'text-rose-500 font-black'
                    : hasAnniversary
                      ? 'text-amber-500 font-black'
                      : hasFestival
                        ? 'text-rose-500 font-black' 
                        : cellInfo.solarTerm
                          ? 'text-emerald-500'
                          : (isDarkMode ? 'text-slate-400' : 'text-slate-400')
                }`}>
                  {displayLunar}
                </div>

                {/* Schedule Indicator Dot */}
                <div className="h-2 flex items-center justify-center flex-shrink-0">
                  {hasItems ? (
                    <div className={`w-1.5 h-1.5 rounded-full shadow-xs ${
                      hasBirthday 
                        ? 'bg-rose-500' 
                        : hasAnniversary
                          ? 'bg-amber-500'
                          : hasFestival 
                            ? 'bg-rose-500' 
                            : 'bg-indigo-500'
                    }`} />
                  ) : (
                    <div className="w-1.5 h-1.5" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {/* 4. Selected Date "Little Tail" Widget - Centered, clickable to open planner */}
        <div className="flex justify-center mt-2.5 mb-1.5 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openPlanner(undefined, selectedDate)}
            className={`flex items-center gap-2.5 px-5 py-2 rounded-[1.5rem] border transition-all shadow-md backdrop-blur-md cursor-pointer ${
              isDarkMode
                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200 hover:bg-indigo-950/60 shadow-indigo-950/50'
                : 'bg-white/95 border-indigo-100 hover:bg-white hover:border-indigo-200 text-slate-700 shadow-indigo-100/20'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded text-[10px] font-extrabold whitespace-nowrap">
                {getRelativeDaysLabel(selectedDate, time)}
              </span>
              <span className={`font-black whitespace-nowrap ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {selectedDayInfo.lunarDate.replace('农历', '')}
              </span>
              {selectedDayInfo.festival && (
                <span className="text-rose-500 font-bold text-[9px] bg-rose-500/10 px-1 py-0.5 rounded whitespace-nowrap scale-95">
                  {selectedDayInfo.festival}
                </span>
              )}
              {selectedDayInfo.solarTerm && (
                <span className="text-emerald-500 font-bold text-[9px] bg-emerald-500/10 px-1 py-0.5 rounded whitespace-nowrap scale-95">
                  {selectedDayInfo.solarTerm}
                </span>
              )}
            </div>

            <div className={`w-[1px] h-3.5 ${isDarkMode ? 'bg-indigo-500/30' : 'bg-indigo-100'} mx-0.5`} />

            <div className="flex items-center gap-1.5 text-xs font-bold truncate max-w-[180px] sm:max-w-[280px]">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider">今日事务:</span>
              <span className={`truncate ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} font-black`}>
                {(() => {
                  const daySchedules = schedules.filter(s => isScheduleOnDate(s, selectedDate));
                  const items = daySchedules.map(s => {
                    if (s.type === 'festival' || s.type === 'birthday' || s.isAllDay) {
                      return `[全天] ${s.task}`;
                    }
                    return `${s.time ? s.time + ' ' : ''}${s.task || s.title || ''}`;
                  });
                  if (items.length === 0) return '暂无日程，点击规划';
                  return items.join('；');
                })()}
              </span>
              <Sparkles size={12} className="text-indigo-400 animate-pulse flex-shrink-0" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* 5. Bottom Modular Aether Prompt */}
      <CalendarAetherTip
        isDarkMode={isDarkMode}
        text={aetherMonthPrompt}
      />
      
      <SchedulePlannerOverlay 
        isOpen={plannerOpen} 
        onClose={() => setPlannerOpen(false)} 
        isDarkMode={isDarkMode}
        schedules={schedules}
        todos={todos}
        initialItem={activePlannerItem}
        todayInfo={selectedDayInfo}
        time={time}
      />
    </div>
  );
};
