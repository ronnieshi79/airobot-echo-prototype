import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Sparkles, ChevronRight, Bell, Gift, Heart, CloudSun } from 'lucide-react';
import { ScheduleItem, TodoItem, MainCategory, SubCategory, ScheduleType } from '../types';
import { getTodayInfo, isScheduleOnDate } from './utils';
import { RecommendationStrip } from '../components/RecommendationStrip';
import { SchedulePlannerOverlay } from './SchedulePlannerOverlay';
import { CalendarTypeBadge } from './components/CalendarTypeBadge';

interface CalendarHomeViewProps {
  isDarkMode: boolean;
  todos: TodoItem[];
  schedules: ScheduleItem[];
  time: Date;
  onNavigate: (cat: MainCategory, sub: SubCategory) => void;
  onShowLogbook: () => void;
  onShowPlanner?: (item?: ScheduleItem | TodoItem, date?: Date) => void;
  onTriggerReminder?: (item: { type: 'schedule' | 'todo' | ScheduleType; item: ScheduleItem | TodoItem }) => void;
}

/**
 * CalendarHomeView
 * AI 日历主页视图 (View Layer)
 * 包含拟物日期立牌、天气农历特别纪念标签、精选今日日程卡片与悬挂式日程板尾部
 */
export const CalendarHomeView: React.FC<CalendarHomeViewProps> = ({
  isDarkMode,
  todos = [],
  schedules = [],
  time,
  onNavigate,
  onShowLogbook,
  onShowPlanner,
  onTriggerReminder
}) => {
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: 'schedule' | 'todo' | ScheduleType } | null>(null);
  
  const todayInfo = getTodayInfo(time);
  
  // 筛选属于今日的所有日程（含每年重复的节日、生日与纪念日）
  const todaySchedules = schedules.filter(s => isScheduleOnDate(s, time));

  // 今日特定纪念事项
  const todayBirthdays = todaySchedules.filter(s => s.type === 'birthday');
  const todayAnniversaries = todaySchedules.filter(s => s.type === 'anniversary');

  const handleOpenPlanner = (id?: string, type?: 'schedule' | 'todo' | ScheduleType) => {
    let itemObj: ScheduleItem | TodoItem | undefined = undefined;
    if (id) {
      itemObj = schedules.find(s => s.id === id) || todos.find(t => t.id === id);
    }
    if (onShowPlanner) {
      onShowPlanner(itemObj, time);
    } else {
      if (id && type) {
        setSelectedItem({ id, type });
      } else {
        setSelectedItem(null);
      }
      setIsPlanningOpen(true);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4 overflow-hidden relative">
        {/* 1. Header with Slogan */}
        <div className="mb-4 flex-shrink-0 pr-12 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                <Calendar size={20} />
              </div>
              <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                AI 日历
              </h2>
            </div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Aether 帮你规划日程安排，请直接语音指示
            </p>
          </div>
        </div>

        {/* 2. Main Functional Area (Left Standalone Date Card, Right Info Area) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-5 pr-1 items-start pb-4">
          
         {/* Left Date Card (Standalone Skeuomorphic Card) */}
         <div className={`w-full md:w-[130px] shrink-0 rounded-[2.5rem] flex flex-col items-center justify-center py-8 text-white bg-gradient-to-b from-[#ff8c00] to-[#e55d00] shadow-xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <span className="text-xs font-black tracking-[0.2em] mb-2 opacity-90">
              {time.toLocaleDateString('zh-CN', { month: 'long' })}
            </span>
            <span className="text-6xl font-black tracking-tighter mb-4 leading-none">
              {time.getDate()}
            </span>
            <div className="w-8 h-1 bg-white/30 rounded-full mb-3"></div>
            <span className="text-sm font-black tracking-widest opacity-90">
              {time.toLocaleDateString('zh-CN', { weekday: 'long' })}
            </span>
         </div>

         {/* Right Info Area Card */}
         <div className={`flex-1 min-w-0 p-6 pb-6 rounded-[2.5rem] flex flex-col relative ${isDarkMode ? 'bg-slate-800/60 border border-white/5' : 'bg-slate-50 border border-slate-100'} shadow-sm`}>
            {/* Weather & Date Tags Row (Single row: Weather + Lunar + Special event name, no wrap) */}
            <div className="flex items-center gap-2 mb-4 overflow-hidden flex-nowrap">
               {/* Weather Tag */}
               <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm shrink-0 ${isDarkMode ? 'bg-gradient-to-br from-sky-500/20 to-sky-600/10 text-sky-400 border border-sky-500/20' : 'bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd]/50 text-sky-700 border border-[#bae6fd]'}`}>
                 <CloudSun size={13} className="shrink-0" />
                 <span className="whitespace-nowrap">{todayInfo.weather.condition} {todayInfo.weather.temp}</span>
               </span>
               
               {/* Lunar Date */}
               <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm shrink-0 ${isDarkMode ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/20' : 'bg-gradient-to-br from-amber-100 to-orange-50 text-amber-700 border border-amber-200'}`}>
                 <span className="whitespace-nowrap">{todayInfo.lunarDate}</span>
               </span>

               {/* Single Special Tag (Birthday / Anniversary / Festival - Name only, placed after Lunar, single-line guaranteed) */}
               {todayBirthdays.length > 0 ? (
                 <button
                   onClick={() => onTriggerReminder?.({ type: 'birthday', item: todayBirthdays[0] })}
                   className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm transition-all hover:scale-105 cursor-pointer shrink-0 min-w-0 max-w-[130px] ${
                     isDarkMode 
                       ? 'bg-gradient-to-br from-rose-500/25 via-pink-500/20 to-rose-600/15 text-rose-300 border border-rose-400/40 shadow-rose-950/40' 
                       : 'bg-gradient-to-br from-rose-100 to-pink-50 text-rose-700 border border-rose-300 shadow-rose-100'
                   }`}
                   title={`今日生日：${todayBirthdays[0].task}`}
                 >
                   <Gift size={13} className="text-rose-500 shrink-0 animate-bounce" />
                   <span className="truncate">{todayBirthdays[0].task}</span>
                 </button>
               ) : todayAnniversaries.length > 0 ? (
                 <button
                   onClick={() => onTriggerReminder?.({ type: 'anniversary', item: todayAnniversaries[0] })}
                   className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm transition-all hover:scale-105 cursor-pointer shrink-0 min-w-0 max-w-[130px] ${
                     isDarkMode 
                       ? 'bg-gradient-to-br from-amber-500/25 via-orange-500/20 to-amber-600/15 text-amber-300 border border-amber-400/40 shadow-amber-950/40' 
                       : 'bg-gradient-to-br from-amber-100 to-orange-50 text-amber-700 border border-amber-300 shadow-amber-100'
                   }`}
                   title={`今日纪念日：${todayAnniversaries[0].task}`}
                 >
                   <Heart size={13} className="text-amber-500 shrink-0 animate-pulse" />
                   <span className="truncate">{todayAnniversaries[0].task}</span>
                 </button>
               ) : todayInfo.festival ? (
                 <span 
                   className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm shrink-0 min-w-0 max-w-[130px] ${
                     isDarkMode 
                       ? 'bg-gradient-to-br from-rose-500/25 to-pink-500/15 text-rose-400 border border-rose-500/30' 
                       : 'bg-gradient-to-br from-rose-100 to-pink-50 text-rose-700 border border-rose-200'
                   }`}
                   title={`节日：${todayInfo.festival}`}
                 >
                   <Sparkles size={13} className="text-rose-500 shrink-0 animate-pulse" />
                   <span className="truncate">{todayInfo.festival}</span>
                 </span>
               ) : null}
            </div>

            {/* Today's Affairs Header */}
            <div className="flex items-center justify-between mb-3">
               <h4 className={`text-xs font-black tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>今日重要日程与待办</h4>
               <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                 精选事项
               </span>
            </div>
            
            {/* Top 3 Scheduled Items List */}
            <div className="flex flex-col gap-2.5">
              {todaySchedules.slice(0, 3).map((item, idx) => {
                const itemType = item.type || 'regular';
                const isItemClosed = item.status === 'closed' || item.completed;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={`h-item-${item.id}`}
                    onClick={() => onTriggerReminder?.({ type: itemType, item })}
                    className={`flex items-center gap-3.5 p-3 rounded-[1.3rem] shrink-0 cursor-pointer transition-all hover:scale-[1.01] ${
                      isDarkMode ? 'bg-slate-700/50 hover:bg-slate-600 border border-transparent' : 'bg-white shadow-md shadow-slate-200/50 border border-slate-100 hover:border-slate-300'
                    }`}
                    title="点击打开 AI 日程卡片"
                  >
                    {/* Left Type Icon (Clean, skeuomorphic, single icon) */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ${
                      itemType === 'birthday'
                        ? 'bg-rose-500/15 text-rose-500'
                        : itemType === 'anniversary'
                        ? 'bg-amber-500/15 text-amber-500'
                        : itemType === 'festival'
                        ? 'bg-rose-500/15 text-rose-500'
                        : itemType === 'todo'
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'bg-blue-500/15 text-blue-500'
                    }`}>
                      {itemType === 'birthday' ? (
                        <Gift size={16} />
                      ) : itemType === 'anniversary' ? (
                        <Heart size={16} />
                      ) : itemType === 'festival' ? (
                        <Sparkles size={16} />
                      ) : itemType === 'todo' ? (
                        <span className="text-xs font-black">待</span>
                      ) : (
                        <Calendar size={16} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className={`text-sm font-bold truncate ${isItemClosed ? 'line-through opacity-50' : ''} ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {item.task}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <CalendarTypeBadge type={itemType} isAllDay={item.isAllDay} time={item.time} size="sm" />
                      </div>
                    </div>

                    <div
                      className={`p-1.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                        isDarkMode 
                          ? 'text-indigo-400 bg-indigo-500/10' 
                          : 'text-indigo-600 bg-indigo-50'
                      }`}
                    >
                      <Bell size={13} />
                    </div>
                  </motion.div>
                );
              })}
              {todaySchedules.length === 0 && (
                <div className={`p-4 rounded-2xl border border-dashed ${isDarkMode ? 'border-white/10' : 'border-slate-200'} text-center`}>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>今日无特定日程事务</span>
                </div>
              )}
            </div>

            {/* Hanging Bottom Tail Component: Center-aligned on the bottom border line */}
            {todaySchedules.length > 0 && (
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-10 flex justify-center">
                <button 
                  type="button"
                  onClick={() => handleOpenPlanner()}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-black transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs shadow-md border ${
                    isDarkMode 
                      ? 'bg-slate-800 text-indigo-300 border-indigo-500/30 hover:bg-slate-700 shadow-slate-950/60' 
                      : 'bg-white text-indigo-600 border-indigo-200/90 hover:bg-indigo-50/70 shadow-indigo-100/90'
                  }`}
                  title="点击打开 AI 日程版"
                >
                  <span>共 {todaySchedules.length} 项 · 打开 AI 日程版</span>
                  <ChevronRight size={13} className="stroke-[2.5]" />
                </button>
              </div>
            )}

         </div>

        </div>

        {/* 3. Bottom Aether Reminders */}
        <RecommendationStrip
          isDarkMode={isDarkMode}
          time={time}
          schedules={schedules}
          todos={todos}
          todayInfo={todayInfo}
          onNavigate={(cat, sub) => {
            onNavigate(cat, sub);
          }}
          onAction={(actionId) => {
            if (actionId === 'planner') {
              handleOpenPlanner();
            } else if (actionId === 'logbook') {
              onShowLogbook();
            }
          }}
          isFocusRunning={false}
          isTimerRunning={false}
          alarmCount={0}
          module="calendar"
        />
      </div>

      {/* 4. Schedule Planning Skeuomorphic Modal (Overlay) */}
      <SchedulePlannerOverlay 
        isOpen={isPlanningOpen} 
        onClose={() => setIsPlanningOpen(false)} 
        isDarkMode={isDarkMode}
        schedules={schedules}
        todos={todos}
        initialItem={selectedItem || undefined}
        todayInfo={todayInfo}
        time={time}
        selectedDate={time}
      />
    </>
  );
};
