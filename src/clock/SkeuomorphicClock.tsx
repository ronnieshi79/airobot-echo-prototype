import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Hourglass, Bell } from 'lucide-react';
import { AlarmItem } from '../types';

interface SkeuomorphicClockProps {
  time: Date;
  isDarkMode: boolean;
  size?: 'sm' | 'md' | 'lg';
  focusTime?: number;
  isFocusRunning?: boolean;
  timerSeconds?: number;
  isTimerRunning?: boolean;
  alarms?: AlarmItem[];
  onFocusClick?: () => void;
  onTimerClick?: () => void;
  onAlarmClick?: () => void;
}

export const SkeuomorphicClock: React.FC<SkeuomorphicClockProps> = ({ 
  time, 
  isDarkMode, 
  size = 'lg',
  focusTime = 0,
  isFocusRunning = false,
  timerSeconds = 0,
  isTimerRunning = false,
  alarms = [],
  onFocusClick,
  onTimerClick,
  onAlarmClick
}) => {
  const containerSize = size === 'lg' ? 'w-80 h-80 md:w-[480px] md:h-[480px]' : size === 'md' ? 'w-64 h-64' : 'w-48 h-48';
  const markerOffset = size === 'lg' ? -200 : size === 'md' ? -110 : -80;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getNextAlarm = () => {
    if (!alarms || alarms.length === 0) return '无闹钟';
    const enabledAlarms = alarms.filter(a => a.enabled);
    if (enabledAlarms.length === 0) return '已关闭';
    
    // Simple logic to find the "next" alarm today or tomorrow
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const sortedAlarms = [...enabledAlarms].sort((a, b) => {
      const [ha, ma] = a.time.split(':').map(Number);
      const [hb, mb] = b.time.split(':').map(Number);
      const minA = ha * 60 + ma;
      const minB = hb * 60 + mb;
      
      const diffA = minA > currentMinutes ? minA - currentMinutes : 1440 - currentMinutes + minA;
      const diffB = minB > currentMinutes ? minB - currentMinutes : 1440 - currentMinutes + minB;
      
      return diffA - diffB;
    });
    
    return sortedAlarms[0].time;
  };

  const items = [
    { 
      id: 'alarm', 
      icon: <Bell />, 
      title: '闹钟', 
      value: getNextAlarm(), 
      active: alarms.some(a => a.enabled), 
      onClick: onAlarmClick, 
      color: 'text-orange-500' 
    },
    { 
      id: 'focus', 
      icon: <Brain />, 
      title: '专注', 
      value: formatTime(focusTime), 
      active: isFocusRunning, 
      onClick: onFocusClick, 
      color: 'text-indigo-500' 
    },
    { 
      id: 'timer', 
      icon: <Hourglass />, 
      title: '计时', 
      value: formatTime(timerSeconds), 
      active: isTimerRunning, 
      onClick: onTimerClick, 
      color: 'text-cyan-500' 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = items[currentIndex];

  return (
    <div className={`relative ${containerSize} rounded-full p-6 ${isDarkMode ? 'bg-slate-800 shadow-[inset_0_10px_20px_rgba(0,0,0,0.4),0_10px_20px_rgba(255,255,255,0.05)]' : 'bg-slate-100 shadow-[inset_0_10px_20px_rgba(255,255,255,0.8),0_10px_20px_rgba(0,0,0,0.1)]'} flex items-center justify-center transition-all duration-500`}>
      {/* Clock Face */}
      <div className={`w-full h-full rounded-full relative ${isDarkMode ? 'bg-slate-900' : 'bg-white'} shadow-inner flex items-center justify-center overflow-hidden`}>
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={`absolute w-1.5 h-5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
            style={{ transform: `rotate(${i * 30}deg) translateY(${markerOffset}px)` }}
          />
        ))}
        
        {/* Center Pin */}
        <div className="w-5 h-5 rounded-full bg-orange-600 z-40 shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        {/* Digital Display Overlay */}
        <div className="absolute bottom-24 text-4xl font-mono font-black tracking-tighter text-orange-500/80 z-10">
          {time.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {/* Integrated AI Sub-Dial (Auxiliary Display) - Moved before hands to be behind them */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-32 h-32 flex flex-col items-center justify-center z-0">
          {/* Sub-Dial Background */}
          <div className={`absolute inset-0 rounded-3xl border-2 ${isDarkMode ? 'bg-slate-800/80 border-slate-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_5px_15px_rgba(0,0,0,0.3)]' : 'bg-slate-200/50 border-slate-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_5px_15px_rgba(0,0,0,0.05)]'}`} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={current.onClick}
              className="flex flex-col items-center cursor-pointer relative z-10"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1 ${current.color} bg-opacity-10`}>
                {React.cloneElement(current.icon as React.ReactElement, { size: 24, className: current.color })}
              </div>
              <span className={`text-[8px] font-black tracking-[0.2em] uppercase opacity-40 mb-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{current.title}</span>
              <span className={`text-lg font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{current.value}</span>
              
              {current.active && (
                <div className="mt-1 flex gap-1">
                  <div className={`w-1 h-1 rounded-full ${current.color.replace('text-', 'bg-')} animate-pulse`} />
                  <div className={`w-1 h-1 rounded-full ${current.color.replace('text-', 'bg-')} animate-pulse`} style={{ animationDelay: '0.2s' }} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Progress Indicators */}
          <div className="absolute -bottom-4 flex gap-1">
            {items.map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === currentIndex ? 'w-3 bg-orange-500' : 'bg-slate-500 opacity-20'}`} />
            ))}
          </div>
        </div>

        {/* Hands */}
        <motion.div 
          className="absolute w-2.5 h-28 bg-slate-400 rounded-full origin-bottom z-20"
          style={{ top: 'calc(50% - 112px)', rotate: (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 }}
        />
        <motion.div 
          className="absolute w-2 h-40 bg-slate-500 rounded-full origin-bottom z-20"
          style={{ top: 'calc(50% - 160px)', rotate: time.getMinutes() * 6 }}
        />
        <motion.div 
          className="absolute w-1 h-44 bg-orange-500 rounded-full origin-bottom z-30"
          style={{ top: 'calc(50% - 176px)', rotate: time.getSeconds() * 6 }}
        />
      </div>
    </div>
  );
};
