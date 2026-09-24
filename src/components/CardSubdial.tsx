import React from 'react';
import { 
  Bell, 
  Timer, 
  Calendar, 
  Headphones, 
  BookOpen, 
  Sparkles, 
  Activity,
  CalendarDays,
  Layers,
  FolderOpen
} from 'lucide-react';
import { ServiceSlice } from '../services/agent/types';

interface CardSubdialProps {
  slice: ServiceSlice;
  isDarkMode: boolean;
  compact?: boolean;
}

export const CardSubdial: React.FC<CardSubdialProps> = ({
  slice,
  isDarkMode,
  compact = false
}) => {
  const { subdial, type, isLiveDynamic, isStaticHub, colorTheme, targetOverlay } = slice;

  // Fallback subdial data if not explicitly passed
  const label = subdial?.label || (
    targetOverlay === 'podcast_library' ? '知识节目库' :
    targetOverlay === 'calendar_flex' ? '月度全景' :
    type === 'focus' ? '专注心流' :
    type === 'timer' ? '倒计时' :
    type === 'alarm' ? '闹钟' :
    type === 'calendar' ? '今日日程' :
    type === 'podcast' ? 'AI 播客' : 'AI 记事本'
  );

  const value = subdial?.value || (
    targetOverlay === 'podcast_library' ? '12 专题' :
    targetOverlay === 'calendar_flex' ? '全景矩阵' :
    type === 'focus' ? '25:00' :
    type === 'timer' ? '15:00' :
    type === 'alarm' ? '07:30' :
    type === 'calendar' ? '14:00' :
    type === 'podcast' ? 'EP.01' : '心流'
  );

  const renderIcon = () => {
    const iconSize = compact ? 18 : 26;
    const iconClass = `${colorTheme.iconColor || 'text-slate-600'} transition-transform group-hover:scale-110`;

    if (targetOverlay === 'podcast_library' || slice.iconType === 'library') {
      return <Layers size={iconSize} className={iconClass} />;
    }
    if (targetOverlay === 'calendar_flex') {
      return <CalendarDays size={iconSize} className={iconClass} />;
    }

    switch (slice.iconType) {
      case 'alarm':
        return <Bell size={iconSize} className={iconClass} />;
      case 'focus':
        return <Timer size={iconSize} className={iconClass} />;
      case 'timer':
        return <Activity size={iconSize} className={iconClass} />;
      case 'calendar':
        return <Calendar size={iconSize} className={iconClass} />;
      case 'podcast':
        return <Headphones size={iconSize} className={iconClass} />;
      case 'logbook':
        return <BookOpen size={iconSize} className={iconClass} />;
      default:
        return <Sparkles size={iconSize} className={iconClass} />;
    }
  };

  return (
    <div 
      className={`relative flex flex-col items-center justify-center select-none transition-all duration-300 group ${
        compact 
          ? 'w-28 h-28 rounded-2xl p-2.5' 
          : 'w-36 h-36 sm:w-44 sm:h-44 rounded-[2rem] p-4 shrink-0'
      } ${
        isDarkMode 
          ? 'bg-slate-800/90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4),0_1px_2px_rgba(255,255,255,0.06)] border border-slate-700/80' 
          : 'bg-gradient-to-b from-slate-50/95 to-slate-100/90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.07),0_2px_5px_rgba(255,255,255,0.9)] border border-slate-200/80'
      }`}
    >
      {/* Live Pulsing Glow Ring if active */}
      {isLiveDynamic && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      )}

      {/* Top Icon */}
      <div className="mb-1 flex items-center justify-center">
        {renderIcon()}
      </div>

      {/* Micro Label */}
      <span className={`font-medium tracking-wider text-center line-clamp-1 ${
        compact ? 'text-[10px] mb-0.5' : 'text-xs sm:text-[13px] mb-1'
      } ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
        {label}
      </span>

      {/* High-Contrast Bold Mono Readout */}
      <span className={`font-bold font-mono tracking-tight text-center ${
        compact 
          ? 'text-sm sm:text-base' 
          : 'text-xl sm:text-2xl'
      } ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
        {value}
      </span>

      {/* Subdial Indicator: Waveform or Dots */}
      {subdial?.waveform ? (
        <div className={`flex items-end gap-0.5 ${compact ? 'mt-1.5 h-2' : 'mt-2 h-2.5'}`}>
          <span className="w-0.5 h-1.5 bg-violet-400 rounded-full animate-pulse"></span>
          <span className="w-0.5 h-2.5 bg-violet-500 rounded-full animate-pulse [animation-delay:150ms]"></span>
          <span className="w-0.5 h-1 bg-violet-400 rounded-full animate-pulse [animation-delay:300ms]"></span>
          <span className="w-0.5 h-2 bg-violet-500 rounded-full animate-pulse [animation-delay:450ms]"></span>
        </div>
      ) : (
        <div className={`flex items-center gap-1.5 ${compact ? 'mt-1.5' : 'mt-2.5'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${subdial?.dotColor || 'bg-orange-500'} ${isLiveDynamic ? 'animate-ping' : ''}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} />
          {!compact && (
            <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
          )}
        </div>
      )}
    </div>
  );
};
