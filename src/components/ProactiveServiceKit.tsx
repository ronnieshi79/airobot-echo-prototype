import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, ListTodo, ChevronRight, Check, Plus, ChevronLeft } from 'lucide-react';
import { ScheduleItem, WeatherInfo, SubCategory } from '../types';

interface ProactiveServiceKitProps {
  isDarkMode: boolean;
  subCategory: SubCategory;
  todayInfo: {
    festival: string | null;
    solarTerm: string | null;
    weather: WeatherInfo;
    aiAdvice: string;
  };
  schedules: ScheduleItem[];
  onAddSchedule: () => void;
  onToggleSchedule: (id: string) => void;
}

export const ProactiveServiceKit: React.FC<ProactiveServiceKitProps> = ({ 
  isDarkMode, 
  subCategory,
  todayInfo, 
  schedules,
  onAddSchedule,
  onToggleSchedule
}) => {
  const [selectedWeekDay, setSelectedWeekDay] = useState(new Date().getDay());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const today = new Date();

  const renderToday = () => {
    const todaySchedules = schedules.filter(s => s.dayOfWeek === today.getDay());
    return (
      <div className="flex flex-col h-full">
        {/* Today's Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
              </span>
              <div className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
                TODAY
              </div>
            </div>
            <span className={`text-sm font-bold mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {today.toLocaleDateString('zh-CN', { weekday: 'long' })} · {todayInfo.solarTerm || '常日'} {todayInfo.festival ? `· ${todayInfo.festival}` : ''}
            </span>
          </div>
          
          <div className={`flex items-center gap-4 p-4 rounded-3xl ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-xl border border-black/5'}`}>
            <span className="text-3xl">{todayInfo.weather.icon}</span>
            <div className="flex flex-col">
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{todayInfo.weather.temp}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{todayInfo.weather.condition}</span>
            </div>
          </div>
        </div>

        {/* AI Advice Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className={`p-8 rounded-[3rem] mb-8 relative overflow-hidden group ${isDarkMode ? 'bg-indigo-600/20 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-100'}`}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Sparkles size={80} className="text-indigo-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles size={16} />
            </div>
            <span className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em]">AI 晨间寄语</span>
          </div>
          <p className={`text-lg font-black leading-relaxed relative z-10 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            {todayInfo.aiAdvice}
          </p>
        </motion.div>

        {/* Schedule Preview */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <ListTodo size={18} className="text-orange-500" />
              <span className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>今日行程</span>
            </div>
            <button 
              onClick={onAddSchedule}
              className={`p-2 rounded-xl transition-all active:scale-90 ${isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-white text-slate-400 hover:bg-slate-50 shadow-md'}`}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {todaySchedules.length > 0 ? (
              todaySchedules.map(item => (
                <motion.div 
                  key={item.id}
                  whileHover={{ x: 5 }}
                  onClick={() => onToggleSchedule(item.id)}
                  className={`p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    item.completed 
                      ? (isDarkMode ? 'bg-white/5 opacity-50' : 'bg-slate-50 opacity-60') 
                      : (isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white shadow-sm hover:shadow-md border border-black/5')
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-black ${
                      item.completed ? 'bg-slate-200 text-slate-400' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {item.time}
                    </div>
                    <span className={`text-sm font-bold ${item.completed ? 'line-through text-slate-400' : (isDarkMode ? 'text-slate-200' : 'text-slate-700')}`}>
                      {item.task}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    item.completed ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-200'
                  }`}>
                    {item.completed && <Check size={14} strokeWidth={4} />}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30">
                <Calendar size={48} className="mb-4" />
                <p className="text-sm font-bold">今日暂无安排</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSchedule = () => {
    const filteredSchedules = schedules.filter(s => s.dayOfWeek === selectedWeekDay);
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>日程安排</span>
          <button 
            onClick={onAddSchedule}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} /> 添加
          </button>
        </div>

        <div className="flex justify-between mb-8">
          {weekDays.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWeekDay(idx)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                selectedWeekDay === idx 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110' 
                  : (isDarkMode ? 'text-slate-500 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-50')
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{day}</span>
              <span className="text-lg font-black">{idx === today.getDay() ? '今' : idx}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => onToggleSchedule(item.id)}
                className={`p-6 rounded-[2rem] flex items-center justify-between cursor-pointer transition-all border ${
                  item.completed 
                    ? (isDarkMode ? 'bg-white/5 border-transparent opacity-50' : 'bg-slate-50 border-transparent opacity-60') 
                    : (isDarkMode ? 'bg-slate-800/50 border-white/5 hover:bg-slate-800' : 'bg-white shadow-xl border-black/5 hover:scale-[1.02]')
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono text-sm font-black ${
                    item.completed ? 'bg-slate-200 text-slate-400' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {item.time}
                  </div>
                  <span className={`text-base font-black ${item.completed ? 'line-through text-slate-400' : (isDarkMode ? 'text-slate-200' : 'text-slate-700')}`}>
                    {item.task}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  item.completed ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-200'
                }`}>
                  {item.completed && <Check size={18} strokeWidth={4} />}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <ListTodo size={64} className="mb-4" />
              <p className="text-lg font-black">这一天很空闲哦</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {year}年 {month + 1}月
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentMonth(new Date(year, month - 1))}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white text-slate-600 shadow-md hover:bg-slate-50'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date(year, month + 1))}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white text-slate-600 shadow-md hover:bg-slate-50'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className={`text-center text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 flex-1">
          {days.map((day, idx) => {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const hasSchedule = day !== null && schedules.some(s => s.dayOfWeek === new Date(year, month, day).getDay());

            return (
              <div 
                key={idx}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all ${
                  day === null ? '' : (isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-sm hover:shadow-md border border-black/5')
                } ${isToday ? 'bg-orange-500 !text-white shadow-lg shadow-orange-500/30' : ''}`}
              >
                {day && (
                  <>
                    <span className={`text-sm font-black ${isToday ? 'text-white' : (isDarkMode ? 'text-slate-300' : 'text-slate-700')}`}>
                      {day}
                    </span>
                    {hasSchedule && !isToday && (
                      <div className="absolute bottom-2 w-1 h-1 rounded-full bg-orange-500"></div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={subCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="h-full"
        >
          {subCategory === 'today' && renderToday()}
          {subCategory === 'schedule' && renderSchedule()}
          {subCategory === 'calendar-view' && renderCalendar()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
