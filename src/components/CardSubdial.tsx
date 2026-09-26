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
    const iconSize = compact ? 18 : 32;
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
          : 'w-[195px] h-[195px] sm:w-[220px] sm:h-[220px] rounded-[2.3rem] p-5 shrink-0'
      } ${
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-800/95 via-slate-850/90 to-slate-900/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.45)] border border-slate-700/80' 
          : 'bg-gradient-to-b from-white/95 via-slate-50/90 to-slate-100/95 shadow-[inset_0_2px_5px_rgba(255,255,255,1),0_8px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.03)] border border-slate-200/85'
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
      <div className="mb-1.5 flex items-center justify-center">
        {renderIcon()}
      </div>

      {/* Micro Label */}
      <span className={`font-semibold tracking-wider text-center line-clamp-1 ${
        compact ? 'text-[10px] mb-0.5' : 'text-xs sm:text-[13px] mb-1'
      } ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {label}
      </span>

      {/* High-Contrast Bold Mono Readout */}
      <span className={`font-bold font-mono tracking-tight leading-none text-center ${
        compact 
          ? 'text-sm sm:text-base' 
          : 'text-2xl sm:text-[2.15rem] my-1'
      } ${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>
        {value}
      </span>

      {/* Subdial Indicator: Waveform or Dots */}
      {subdial?.waveform ? (
        <div className={`flex items-end gap-1 ${compact ? 'mt-1.5 h-2' : 'mt-2.5 sm:mt-3 h-3'}`}>
          <span className="w-0.5 sm:w-1 h-2 bg-violet-400 rounded-full animate-pulse"></span>
          <span className="w-0.5 sm:w-1 h-3.5 bg-violet-500 rounded-full animate-pulse [animation-delay:150ms]"></span>
          <span className="w-0.5 sm:w-1 h-1.5 bg-violet-400 rounded-full animate-pulse [animation-delay:300ms]"></span>
          <span className="w-0.5 sm:w-1 h-2.5 bg-violet-500 rounded-full animate-pulse [animation-delay:450ms]"></span>
        </div>
      ) : (
        <div className={`flex items-center gap-1.5 ${compact ? 'mt-1.5' : 'mt-2.5 sm:mt-3'}`}>
          <span className={`rounded-full ${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'} ${subdial?.dotColor || 'bg-orange-500'} ${isLiveDynamic ? 'animate-ping' : ''}`} />
          <span className={`rounded-full ${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'} ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} />
          {!compact && (
            <span className={`rounded-full w-2 h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
          )}
        </div>
      )}
    </div>
  );
};
