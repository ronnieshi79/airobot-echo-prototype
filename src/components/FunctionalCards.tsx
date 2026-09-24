import React, { useState, useEffect } from 'react';
import { Brain, Timer, Bell, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FunctionalCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  active: boolean;
  onClick: () => void;
  isDarkMode: boolean;
  color: string;
  variant?: 'default' | 'compact';
}

const FunctionalCard: React.FC<FunctionalCardProps> = ({ icon, title, value, active, onClick, isDarkMode, color, variant = 'default' }) => {
  const isCompact = variant === 'compact';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, x: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative cursor-pointer transition-all flex items-center overflow-hidden ${
        isCompact 
          ? `p-3 rounded-2xl w-40 ${isDarkMode ? 'bg-slate-800/40 border border-white/5 shadow-lg' : 'bg-white/80 shadow-md border border-slate-100'}`
          : `p-5 rounded-[2.5rem] flex-1 flex-col justify-between ${isDarkMode ? 'bg-slate-800/80 border border-white/10 shadow-xl' : 'bg-white shadow-lg border border-slate-100'}`
      }`}
    >
      <div className={`flex items-center ${isCompact ? 'gap-3 w-full' : 'justify-between w-full'}`}>
        <div className={`${isCompact ? 'w-8 h-8 rounded-lg' : 'w-12 h-12 rounded-2xl'} flex items-center justify-center ${color} bg-opacity-10 shadow-inner`}>
          {React.cloneElement(icon as React.ReactElement, { size: isCompact ? 16 : 24, className: color.replace('bg-', 'text-') })}
        </div>
        
        {isCompact ? (
          <div className="flex flex-col flex-1">
            <span className={`text-[8px] font-black tracking-widest uppercase opacity-40 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</span>
            <span className={`text-sm font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</span>
          </div>
        ) : (
          active && (
            <div className="flex gap-1.5">
              <div className={`w-2 h-2 rounded-full ${color.replace('bg-', 'bg-')} animate-pulse shadow-[0_0_8px_currentColor]`} />
              <div className={`w-2 h-2 rounded-full ${color.replace('bg-', 'bg-')} animate-pulse shadow-[0_0_8px_currentColor]`} style={{ animationDelay: '0.2s' }} />
            </div>
          )
        )}
      </div>
      
      {!isCompact && (
        <div className="mt-4 w-full">
          <span className={`text-[10px] font-black tracking-[0.2em] uppercase opacity-40 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</span>
          </div>
        </div>
      )}

      {/* Active Indicator for Compact */}
      {isCompact && active && (
        <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${color.replace('bg-', 'bg-')} animate-ping`} />
      )}

      {/* Skeuomorphic Button Effect */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-white/20 to-transparent pointer-events-none`} />
    </motion.div>
  );
};

export const PhysicalDial: React.FC<FunctionalCardsProps> = ({
  isDarkMode,
  focusTime,
  isFocusRunning,
  timerSeconds,
  isTimerRunning,
  alarmCount,
  onFocusClick,
  onTimerClick,
  onAlarmClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const items = [
    { 
      id: 'focus', 
      icon: <Brain />, 
      title: '专注', 
      value: formatTime(focusTime), 
      active: isFocusRunning, 
      onClick: onFocusClick, 
      color: 'bg-indigo-500' 
    },
    { 
      id: 'timer', 
      icon: <Timer />, 
      title: '计时', 
      value: formatTime(timerSeconds), 
      active: isTimerRunning, 
      onClick: onTimerClick, 
      color: 'bg-cyan-500' 
    },
    { 
      id: 'alarm', 
      icon: <Bell />, 
      title: '闹钟', 
      value: `${alarmCount}个`, 
      active: alarmCount > 0, 
      onClick: onAlarmClick, 
      color: 'bg-orange-500' 
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
    <div className="relative w-48 h-64 flex items-center justify-center">
      {/* Physical Dial Base */}
      <div className={`absolute inset-0 rounded-[3rem] border-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-slate-50 border-white shadow-[inset_0_4px_12px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.1)]'}`}>
        {/* Dial Texture */}
        <div className="absolute inset-4 rounded-[2rem] border border-dashed border-slate-500/20 opacity-30" />
      </div>

      {/* Rotating Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1 mb-2">
          <button onClick={() => setCurrentIndex(prev => (prev - 1 + items.length) % items.length)} className="p-1 opacity-30 hover:opacity-100 transition-opacity">
            <ChevronUp size={16} />
          </button>
          <div className="flex flex-col gap-1">
            {items.map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === currentIndex ? 'h-3 bg-orange-500' : 'bg-slate-500 opacity-30'}`} />
            ))}
          </div>
          <button onClick={() => setCurrentIndex(prev => (prev + 1) % items.length)} className="p-1 opacity-30 hover:opacity-100 transition-opacity">
            <ChevronDown size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10, rotateX: -45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -10, rotateX: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={current.onClick}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${current.color} bg-opacity-10 shadow-inner group-hover:scale-110 transition-transform`}>
              {React.cloneElement(current.icon as React.ReactElement, { size: 32, className: current.color.replace('bg-', 'text-') })}
            </div>
            <span className={`text-[10px] font-black tracking-[0.3em] uppercase opacity-40 mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{current.title}</span>
            <span className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{current.value}</span>
            
            {current.active && (
              <div className="mt-3 flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${current.color.replace('bg-', 'bg-')} animate-pulse`} />
                <div className={`w-1.5 h-1.5 rounded-full ${current.color.replace('bg-', 'bg-')} animate-pulse`} style={{ animationDelay: '0.2s' }} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Side Screws/Details */}
      <div className={`absolute -left-2 top-1/4 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-white'}`} />
      <div className={`absolute -left-2 bottom-1/4 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-white'}`} />
      <div className={`absolute -right-2 top-1/4 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-white'}`} />
      <div className={`absolute -right-2 bottom-1/4 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-white'}`} />
    </div>
  );
};

interface FunctionalCardsProps {
  isDarkMode: boolean;
  focusTime: number;
  isFocusRunning: boolean;
  timerSeconds: number;
  isTimerRunning: boolean;
  alarmCount: number;
  onFocusClick: () => void;
  onTimerClick: () => void;
  onAlarmClick: () => void;
  variant?: 'default' | 'compact';
}

export const FunctionalCards: React.FC<FunctionalCardsProps> = ({
  isDarkMode,
  focusTime,
  isFocusRunning,
  timerSeconds,
  isTimerRunning,
  alarmCount,
  onFocusClick,
  onTimerClick,
  onAlarmClick,
  variant = 'default'
}) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex ${variant === 'compact' ? 'flex-col gap-3' : 'flex-col gap-4'} w-full h-full`}>
      <FunctionalCard
        icon={<Brain />}
        title="专注"
        value={formatTime(focusTime)}
        active={isFocusRunning}
        onClick={onFocusClick}
        isDarkMode={isDarkMode}
        color="bg-indigo-500"
        variant={variant}
      />
      <FunctionalCard
        icon={<Timer />}
        title="计时"
        value={formatTime(timerSeconds)}
        active={isTimerRunning}
        onClick={onTimerClick}
        isDarkMode={isDarkMode}
        color="bg-cyan-500"
        variant={variant}
      />
      <FunctionalCard
        icon={<Bell />}
        title="闹钟"
        value={`${alarmCount}个`}
        active={alarmCount > 0}
        onClick={onAlarmClick}
        isDarkMode={isDarkMode}
        color="bg-orange-500"
        variant={variant}
      />
    </div>
  );
};
