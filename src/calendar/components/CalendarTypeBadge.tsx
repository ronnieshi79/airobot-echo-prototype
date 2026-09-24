import React from 'react';
import { Sparkles, Gift, Heart, CheckSquare, Clock } from 'lucide-react';
import { ScheduleType } from '../../types';

interface CalendarTypeBadgeProps {
  type?: ScheduleType;
  label?: string;
  isAllDay?: boolean;
  time?: string;
  size?: 'sm' | 'md';
}

/**
 * CalendarTypeBadge
 * 规范化日程与待办分类徽章，统一色彩与图标映射
 */
export const CalendarTypeBadge: React.FC<CalendarTypeBadgeProps> = ({
  type = 'regular',
  label,
  isAllDay,
  time,
  size = 'md',
}) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'birthday':
        return 'bg-rose-500/15 text-rose-500 dark:text-rose-400 border-rose-500/30';
      case 'anniversary':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'festival':
        return 'bg-rose-500/15 text-rose-500 dark:text-rose-400 border-rose-500/30';
      case 'todo':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'regular':
      default:
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    }
  };

  const getDefaultLabel = () => {
    if (label) return label;
    switch (type) {
      case 'festival':
        return '节日';
      case 'birthday':
        return '生日';
      case 'anniversary':
        return '纪念日';
      case 'todo':
        return '待办';
      case 'regular':
      default:
        return time || '日程';
    }
  };

  const getIcon = () => {
    const iconSize = size === 'sm' ? 11 : 13;
    switch (type) {
      case 'festival':
        return <Sparkles size={iconSize} className="text-rose-500 shrink-0" />;
      case 'birthday':
        return <Gift size={iconSize} className="text-rose-500 shrink-0" />;
      case 'anniversary':
        return <Heart size={iconSize} className="text-amber-500 shrink-0" />;
      case 'todo':
        return <CheckSquare size={iconSize} className="text-emerald-500 shrink-0" />;
      case 'regular':
      default:
        return <Clock size={iconSize} className="text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 font-extrabold rounded-md border shadow-2xs whitespace-nowrap ${
          size === 'sm' ? 'text-[9px] px-1.5 py-0.2' : 'text-[10px] px-2 py-0.5'
        } ${getBadgeStyle()}`}
      >
        {getIcon()}
        <span>{getDefaultLabel()}</span>
      </span>
      {isAllDay ? (
        <span className="text-[9px] font-bold text-slate-400">全天</span>
      ) : time && type !== 'regular' ? (
        <span className="text-[9px] font-bold text-slate-400 font-mono">{time}</span>
      ) : null}
    </div>
  );
};
