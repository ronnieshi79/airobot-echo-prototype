import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Clock, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Bell, 
  Sparkles, 
  Gift, 
  CheckSquare, 
  Sun, 
  Cloud,
  CheckCircle2,
  Calendar,
  Heart,
  PartyPopper,
  CalendarDays,
  CalendarCheck
} from 'lucide-react';
import { ScheduleItem, TodoItem, ScheduleType } from '../types';

interface CalendarReminderOverlayProps {
  show: boolean;
  isDarkMode: boolean;
  reminderItem: { type: 'schedule' | 'todo' | ScheduleType; item: ScheduleItem | TodoItem } | null;
  onClose: () => void;
  onComplete: (id: string, type: 'schedule' | 'todo') => void;
  onUpdateItem?: (id: string, type: 'schedule' | 'todo', updates: Partial<ScheduleItem>) => void;
  isAlertMode?: boolean;
}

// 规范四大分类：普通/默认，待办，生日，纪念日
export const SCHEDULE_TYPES = [
  { 
    id: 'regular' as ScheduleType, 
    label: '普通/默认', 
    shortLabel: '普通日程',
    title: 'AI 日程卡',
    slogan: '标准时段规划 · 准时专注执行',
    dotColor: 'bg-blue-500', 
    badgeBg: 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30',
    headerTheme: 'from-[#0d1b32] via-[#16294d] to-[#0a1527] border-blue-500/40',
    accentColor: '#3b82f6',
    icon: CalendarDays,
    footerStamp: 'SCHEDULE · EXECUTION',
  },
  { 
    id: 'todo' as ScheduleType, 
    label: '待办', 
    shortLabel: '待办任务',
    title: 'AI 待办卡',
    slogan: '行动目标管理 · 击破各项要务',
    dotColor: 'bg-emerald-500', 
    badgeBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    headerTheme: 'from-[#0b2b1d] via-[#124430] to-[#082216] border-emerald-500/40',
    accentColor: '#10b981',
    icon: CheckSquare,
    footerStamp: 'TODO · ACTION PLAN',
  },
  { 
    id: 'birthday' as ScheduleType, 
    label: '生日', 
    shortLabel: '生日纪念',
    title: 'AI 生日卡',
    slogan: '美好诞生之日 · 岁岁常欢愉',
    dotColor: 'bg-rose-500', 
    badgeBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/30',
    headerTheme: 'from-[#330c18] via-[#521427] to-[#2b0a14] border-rose-500/40',
    accentColor: '#f43f5e',
    icon: Gift,
    footerStamp: 'CELEBRATION · BIRTHDAY',
  },
  { 
    id: 'anniversary' as ScheduleType, 
    label: '纪念日', 
    shortLabel: '重要纪念',
    title: 'AI 纪念日卡',
    slogan: '特别时光珍藏 · 铭记初心美好',
    dotColor: 'bg-amber-500', 
    badgeBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30',
    headerTheme: 'from-[#301a06] via-[#4f2c0a] to-[#271504] border-amber-500/40',
    accentColor: '#f59e0b',
    icon: Heart,
    footerStamp: 'MEMORIAL · ANNIVERSARY',
  },
];

const LEAD_TIME_OPTIONS = [
  { label: '日程发生时 (准时)', value: '0min' },
  { label: '提前 5 分钟', value: '5min' },
  { label: '提前 15 分钟', value: '15min' },
  { label: '提前 30 分钟', value: '30min' },
  { label: '提前 1 小时', value: '1hour' },
  { label: '日程当天 (09:00)', value: 'day_0900' },
  { label: '提前 1 天 (09:00)', value: '1day' },
  { label: '提前 3 天', value: '3days' },
];

const REPEAT_OPTIONS = [
  { label: '不重复', value: 'none' as const },
  { label: '每天', value: 'daily' as const },
  { label: '每周', value: 'weekly' as const },
  { label: '每月', value: 'monthly' as const },
  { label: '每年', value: 'yearly' as const },
];

export const CalendarReminderOverlay: React.FC<CalendarReminderOverlayProps> = ({
  show,
  isDarkMode,
  reminderItem,
  onClose,
  onComplete,
  onUpdateItem,
  isAlertMode = false,
}) => {
  const [isSnoozing, setIsSnoozing] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);

  // Form State
  const [taskName, setTaskName] = useState('');
  const [itemType, setItemType] = useState<ScheduleType>('regular');
  const [startTime, setStartTime] = useState('07:45');
  const [endTime, setEndTime] = useState('08:45');
  const [isAllDay, setIsAllDay] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'yearly' | 'daily' | 'weekly' | 'monthly' | 'none'>('none');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [leadTime, setLeadTime] = useState('0min');
  const [itemDateStr, setItemDateStr] = useState('');

  // Dropdown Popovers
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false);
  const [isLeadTimePickerOpen, setIsLeadTimePickerOpen] = useState(false);
  const [isRepeatPickerOpen, setIsRepeatPickerOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Weather Text
  const [weatherInfo, setWeatherInfo] = useState({ text: '晴朗 26°C', tip: '适合户外', icon: 'sun' });

  // Sync Item on Open
  useEffect(() => {
    if (show && reminderItem) {
      setIsSnoozing(false);
      setCompleteSuccess(false);
      setIsTypePickerOpen(false);
      setIsLeadTimePickerOpen(false);
      setIsRepeatPickerOpen(false);

      const rawItem = reminderItem.item || (reminderItem as any).data;
      if (rawItem) {
        setTaskName(rawItem.task || (rawItem as any).title || '日程事项');

        let rawType = (rawItem as ScheduleItem).type || (reminderItem.type === 'todo' ? 'todo' : 'regular');
        if (rawType === ('festival' as any)) {
          rawType = 'anniversary';
        }
        let detectedType: ScheduleType = rawType;
        if (rawItem.type) {
          detectedType = rawItem.type === ('festival' as any) ? 'anniversary' : rawItem.type;
        }
        setItemType(detectedType);

        const allDayDefault = (detectedType === 'birthday' || detectedType === 'anniversary' || detectedType === ('festival' as any)) ? true : !!(rawItem as ScheduleItem).isAllDay;
        setIsAllDay(allDayDefault);

        const repeatDefault = (detectedType === 'birthday' || detectedType === 'anniversary' || detectedType === ('festival' as any)) ? 'yearly' : ((rawItem as ScheduleItem).repeat || 'none');
        setRepeatMode(repeatDefault);

        const startT = rawItem.time || '07:45';
        setStartTime(startT);

        if ((rawItem as ScheduleItem).endTime) {
          setEndTime((rawItem as ScheduleItem).endTime!);
        } else {
          const [h, m] = startT.split(':').map(Number);
          const totalMin = (h || 7) * 60 + (m || 45) + 60;
          const endH = Math.floor(totalMin / 60) % 24;
          const endM = totalMin % 60;
          setEndTime(`${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`);
        }

        setReminderEnabled(rawItem.reminderEnabled !== undefined ? rawItem.reminderEnabled : true);
        setLeadTime(rawItem.leadTime || (detectedType === 'birthday' || detectedType === 'anniversary' ? 'day_0900' : '0min'));

        // Format Date string: e.g. "8月15日 周六"
        let d = new Date();
        if ((rawItem as any).date) {
          const parsed = new Date((rawItem as any).date);
          if (!isNaN(parsed.getTime())) d = parsed;
        }
        const m = d.getMonth() + 1;
        const day = d.getDate();
        const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
        setItemDateStr(`${m}月${day}日 ${week}`);
      }

      // Weather mapping
      const hour = parseInt((rawItem?.time || '08:00').split(':')[0], 10);
      if (hour >= 6 && hour < 12) {
        setWeatherInfo({ text: '晴朗 24°C', tip: '适合户外', icon: 'sun' });
      } else if (hour >= 12 && hour < 18) {
        setWeatherInfo({ text: '晴 28°C', tip: '适合户外', icon: 'sun' });
      } else if (hour >= 18 && hour < 22) {
        setWeatherInfo({ text: '多云 22°C', tip: '清爽舒适', icon: 'cloud' });
      } else {
        setWeatherInfo({ text: '清凉 19°C', tip: '夜间微凉', icon: 'cloud' });
      }
    }
  }, [show, reminderItem]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsTypePickerOpen(false);
        setIsLeadTimePickerOpen(false);
        setIsRepeatPickerOpen(false);
      }
    };
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show]);

  if (!reminderItem) return null;
  const item = reminderItem.item || (reminderItem as any).data;
  if (!item) return null;

  const currentTypeConfig = SCHEDULE_TYPES.find(t => t.id === itemType) || SCHEDULE_TYPES[0];
  const currentLeadTimeLabel = LEAD_TIME_OPTIONS.find(o => o.value === leadTime)?.label || '日程发生时';
  const currentRepeatLabel = REPEAT_OPTIONS.find(o => o.value === repeatMode)?.label || '不重复';

  // Handle Type Change
  const handleSelectType = (newType: ScheduleType) => {
    setItemType(newType);
    setIsTypePickerOpen(false);

    if (newType === 'birthday' || newType === 'anniversary') {
      setIsAllDay(true);
      setRepeatMode('yearly');
      setLeadTime('day_0900');
    } else {
      setIsAllDay(false);
      setRepeatMode('none');
      setLeadTime('0min');
    }
  };

  const handleSaveAndAction = (actionType: 'complete' | 'snooze' | 'save') => {
    if (onUpdateItem) {
      onUpdateItem(item.id, itemType === 'todo' ? 'todo' : 'schedule', {
        task: taskName.trim() || '未命名日程',
        type: itemType,
        time: isAllDay ? undefined : startTime,
        endTime: isAllDay ? undefined : endTime,
        isAllDay,
        repeat: repeatMode,
        reminderEnabled,
        leadTime,
      });
    }

    if (actionType === 'complete') {
      if (completeSuccess) return;
      setCompleteSuccess(true);
      setTimeout(() => {
        onComplete(item.id, itemType === 'todo' ? 'todo' : 'schedule');
        onClose();
      }, 450);
    } else if (actionType === 'snooze') {
      setIsSnoozing(true);
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const IconComponent = currentTypeConfig.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center p-3 rounded-[3rem] overflow-hidden"
          id="calendar-reminder-overlay-bg"
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-black/80' : 'bg-slate-900/40'}`} 
            onClick={onClose}
          />

          <div className="relative w-full h-full flex items-center justify-center pointer-events-auto" ref={containerRef}>
            
            {/* Skeuomorphic Assembly */}
            <motion.div 
              initial={{ scale: 0.94, y: 15 }}
              animate={{ 
                scale: 1, 
                y: 0,
                rotate: isAlertMode ? [0, -1.2, 1.2, -1, 1, 0] : 0 
              }}
              exit={{ scale: 0.94, y: 15 }}
              transition={isAlertMode ? { rotate: { repeat: Infinity, duration: 1.2, repeatDelay: 1 } } : { duration: 0.2 }}
              className="relative group flex items-center justify-center"
            >
              
              {/* ===== RIGHT-SIDE PHYSICAL MECHANICAL CONTROL LEVERS (REFINED INDUSTRIAL STYLE) ===== */}
              <div className="absolute -right-11 sm:-right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 z-30">
                {itemType === 'todo' ? (
                  <>
                    {/* Complete Button Lever */}
                    <motion.button
                      whileHover={{ x: -3, scale: 1.02 }}
                      whileTap={{ x: 2, scale: 0.97 }}
                      onClick={() => handleSaveAndAction('complete')}
                      disabled={completeSuccess}
                      className={`w-13 h-20 rounded-tr-3xl border-t border-r border-b shadow-[6px_4px_16px_rgba(0,0,0,0.35),inset_0_1px_3px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer transition-all ${
                        completeSuccess
                          ? 'bg-slate-700 border-slate-600 text-emerald-400'
                          : isDarkMode
                            ? 'bg-slate-700/90 border-slate-600 text-slate-300 hover:text-emerald-400 hover:bg-slate-700'
                            : 'bg-slate-300 border-slate-400 text-slate-700 hover:text-emerald-600 hover:bg-slate-200'
                      }`}
                      title="完成待办"
                    >
                      <div className="w-8 h-13 rounded-xl bg-black/20 border border-white/10 flex flex-col items-center justify-center shadow-inner gap-1.5">
                        <Check size={18} strokeWidth={2.6} className={completeSuccess ? 'text-emerald-400' : 'currentColor'} />
                        <div className="w-2.5 h-0.5 bg-current opacity-40 rounded-full" />
                      </div>
                    </motion.button>

                    {/* Exit Button Lever */}
                    <motion.button
                      whileHover={{ x: -3, scale: 1.02 }}
                      whileTap={{ x: 2, scale: 0.97 }}
                      onClick={onClose}
                      className={`w-13 h-17 rounded-br-3xl border-b border-r border-t shadow-[6px_4px_14px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer transition-all ${
                        isDarkMode 
                          ? 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                          : 'bg-slate-200/90 border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                      title="退出"
                    >
                      <div className="w-8 h-10 rounded-xl bg-black/20 border border-white/10 flex flex-col items-center justify-center shadow-inner gap-1.5">
                        <X size={17} strokeWidth={2.4} />
                        <div className="w-2.5 h-0.5 bg-current opacity-30 rounded-full" />
                      </div>
                    </motion.button>
                  </>
                ) : (
                  <>
                    {/* Save Button Lever (Sleek slate with subtle colored indicator) */}
                    <motion.button
                      whileHover={{ x: -3, scale: 1.02 }}
                      whileTap={{ x: 2, scale: 0.97 }}
                      onClick={() => handleSaveAndAction('save')}
                      className={`w-13 h-20 rounded-tr-3xl border-t border-r border-b shadow-[6px_4px_16px_rgba(0,0,0,0.35),inset_0_1px_3px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer transition-all ${
                        isDarkMode
                          ? 'bg-slate-700/90 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700'
                          : 'bg-slate-300 border-slate-400 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                      title="保存事项"
                    >
                      <div className="w-8 h-13 rounded-xl bg-black/20 border border-white/10 flex flex-col items-center justify-center shadow-inner gap-1.5">
                        <Check size={18} strokeWidth={2.6} className="text-white drop-shadow-xs" />
                        <div className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: currentTypeConfig.accentColor }} />
                      </div>
                    </motion.button>

                    {/* Exit Button Lever */}
                    <motion.button
                      whileHover={{ x: -3, scale: 1.02 }}
                      whileTap={{ x: 2, scale: 0.97 }}
                      onClick={onClose}
                      className={`w-13 h-17 rounded-br-3xl border-b border-r border-t shadow-[6px_4px_14px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer transition-all ${
                        isDarkMode 
                          ? 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                          : 'bg-slate-200/90 border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                      title="退出"
                    >
                      <div className="w-8 h-10 rounded-xl bg-black/20 border border-white/10 flex flex-col items-center justify-center shadow-inner gap-1.5">
                        <X size={17} strokeWidth={2.4} />
                        <div className="w-2.5 h-0.5 bg-current opacity-30 rounded-full" />
                      </div>
                    </motion.button>
                  </>
                )}
              </div>

              {/* ===== MAIN SKEUOMORPHIC CARD SHELL (SLIMMER & ELONGATED) ===== */}
              <motion.div 
                animate={isSnoozing ? { y: 240, opacity: 0 } : {}}
                transition={{ duration: 0.3 }}
                className={`relative w-[25rem] sm:w-[27rem] min-h-[39rem] max-h-[45rem] rounded-[2.8rem] p-5 shadow-[0_32px_80px_rgba(0,0,0,0.65),inset_0_2px_8px_rgba(255,255,255,0.4),inset_0_-3px_8px_rgba(0,0,0,0.3)] z-10 overflow-y-auto border flex flex-col justify-between scrollbar-none ${
                  isDarkMode 
                    ? 'bg-[#12141c] border-slate-700/80 text-white' 
                    : 'bg-[#f4f5f8] border-slate-300/90 text-slate-850'
                }`}
              >
                
                {/* Top Heavy Metallic Clamp / Rivet Bar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-4.5 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-400 rounded-b-xl border-x border-b border-slate-400/90 shadow-[0_3px_6px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-between px-4 z-20">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center">
                    <div className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                  </div>
                  <div className="w-20 h-1.5 bg-slate-700/25 rounded-full shadow-inner" />
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center">
                    <div className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                  </div>
                </div>

                {/* Left Hole Punches with Deep 3D Cutout */}
                <div className="absolute left-2.5 top-0 bottom-0 flex flex-col justify-around py-10 pointer-events-none z-10">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-3 h-3 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.3)] border ${
                        isDarkMode ? 'bg-[#08090d] border-slate-800' : 'bg-slate-400/70 border-slate-500/40'
                      }`} 
                    />
                  ))}
                </div>

                {/* Content Interior Area */}
                <div className="pl-4 pr-1 pt-2 flex-1 flex flex-col gap-3.5">
                  
                  {/* ============================================================== */}
                  {/* HEADER: AI 日程版 拟物黑板/钛金头部 (Single Line Title & Meta) */}
                  {/* ============================================================== */}
                  <div className={`rounded-[1.6rem] p-3.5 sm:p-4 border shadow-sm relative overflow-hidden bg-gradient-to-r ${currentTypeConfig.headerTheme} text-white`}>
                    {/* Chalkboard Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
                    
                    {/* Visual atmosphere glowing rings (No text badges) */}
                    {itemType === 'birthday' && (
                      <>
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-rose-500/30 to-pink-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute right-12 bottom-0 w-16 h-16 bg-rose-400/20 rounded-full blur-lg pointer-events-none" />
                      </>
                    )}
                    {itemType === 'anniversary' && (
                      <>
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-amber-500/30 to-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute right-12 bottom-0 w-16 h-16 bg-amber-400/20 rounded-full blur-lg pointer-events-none" />
                      </>
                    )}
                    {itemType === 'todo' && (
                      <div className="absolute -right-4 -top-4 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                    )}
                    {itemType === 'regular' && (
                      <div className="absolute -right-4 -top-4 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
                    )}

                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Dynamic Logo with Skeuomorphic Outer Ring */}
                        <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.25)] border ${
                          itemType === 'birthday' ? 'bg-gradient-to-br from-rose-500/30 to-rose-600/15 border-rose-400/50 text-rose-300 shadow-rose-950/40' :
                          itemType === 'anniversary' ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/15 border-amber-400/50 text-amber-300 shadow-amber-950/40' :
                          itemType === 'todo' ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-600/15 border-emerald-400/50 text-emerald-300 shadow-emerald-950/40' :
                          'bg-gradient-to-br from-blue-500/30 to-blue-600/15 border-blue-400/50 text-blue-300 shadow-blue-950/40'
                        }`}>
                          <IconComponent 
                            size={22} 
                            className={
                              itemType === 'birthday' ? 'animate-bounce drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 
                              itemType === 'anniversary' ? 'animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : ''
                            } 
                          />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <h2 className="text-base sm:text-lg font-black tracking-tight drop-shadow-sm text-white flex items-center gap-1.5 whitespace-nowrap truncate">
                            <span className="truncate">{currentTypeConfig.title}</span>
                            {itemType === 'birthday' && (
                              <Sparkles size={14} className="text-rose-300 animate-spin opacity-90 shrink-0" />
                            )}
                            {itemType === 'anniversary' && (
                              <Sparkles size={14} className="text-amber-300 animate-spin opacity-90 shrink-0" />
                            )}
                          </h2>
                          <span className="text-[11px] font-bold text-slate-200/90 tracking-wide mt-0.5 whitespace-nowrap truncate">
                            {currentTypeConfig.slogan}
                          </span>
                        </div>
                      </div>

                      {/* Header Date Tag (Keep single-line, shrink-0) */}
                      <div className="flex flex-col items-end shrink-0 pl-1">
                        <span className="text-xs font-black text-white uppercase font-mono tracking-tight whitespace-nowrap">
                          {itemDateStr.split(' ')[0] || '今日'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-200 whitespace-nowrap mt-0.5">
                          {isAllDay ? '全天安排' : startTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* CARD 1: 核心信息与时间设置块 (Hero Info & Time Card) */}
                  {/* ============================================================== */}
                  <div className={`rounded-[1.6rem] p-4 sm:p-4.5 transition-all relative border shadow-sm ${
                    isDarkMode 
                      ? 'bg-[#1a1e2b] border-slate-700/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)]' 
                      : 'bg-white border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)]'
                  }`}>
                    
                    {/* 1. 事项名称 (大标题，最醒目) */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        {completeSuccess && (
                          <span className="text-xs font-bold text-emerald-400 animate-pulse flex items-center gap-1">
                            <CheckCircle2 size={13} /> 已标记完成
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="输入事项内容..."
                        className={`w-full text-2xl sm:text-3xl font-black bg-transparent outline-none tracking-tight leading-snug placeholder:text-slate-500 ${
                          completeSuccess ? 'line-through opacity-50' : ''
                        } ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                      />
                    </div>

                    {/* 2. 时间与日期设置 (日期是时间设置的一部分，并跟天气在一起) */}
                    {isAllDay ? (
                      /* 全天日程模式 (生日/纪念日/全天事件) */
                      <div className="py-1">
                        <div className={`text-base font-black flex items-center gap-2.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          <span>{itemDateStr}</span>
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border shadow-xs ${
                            isDarkMode 
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' 
                              : currentTypeConfig.badgeBg
                          }`}>
                            {itemType === 'birthday' ? '🎂 每年全天' : itemType === 'anniversary' ? '🌟 每年全天' : '全天事件'}
                          </span>
                        </div>
                        {/* 天气与情境建议融合 (清晰高亮) */}
                        <div className={`text-xs font-semibold mt-2 flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>
                          <Sun size={14} className="text-amber-400 shrink-0" />
                          <span>{itemDateStr.split(' ')[0]}，天气{weatherInfo.text}，{weatherInfo.tip}</span>
                        </div>
                      </div>
                    ) : (
                      /* 时段型日程模式 (开始与结束并排) */
                      <div className="py-0.5">
                        <div className="grid grid-cols-2 gap-4">
                          {/* 开始时间 */}
                          <div className="flex flex-col">
                            <span className={`text-xs font-bold mb-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>开始</span>
                            <div className="flex items-baseline gap-1">
                              <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className={`text-2xl sm:text-3xl font-black font-mono bg-transparent outline-none cursor-pointer -ml-0.5 ${
                                  isDarkMode ? 'text-white' : 'text-slate-900'
                                }`}
                              />
                            </div>
                            <span className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>
                              {itemDateStr}
                            </span>
                          </div>

                          {/* 结束时间 */}
                          <div className="flex flex-col">
                            <span className={`text-xs font-bold mb-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>结束</span>
                            <div className="flex items-baseline gap-1">
                              <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className={`text-2xl sm:text-3xl font-black font-mono bg-transparent outline-none cursor-pointer -ml-0.5 ${
                                  isDarkMode ? 'text-white' : 'text-slate-900'
                                }`}
                              />
                            </div>
                            <span className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>
                              {itemDateStr}
                            </span>
                          </div>
                        </div>

                        {/* 天气情境条目 (清晰高亮) */}
                        <div className={`text-xs font-semibold mt-2.5 pt-2.5 border-t flex items-center gap-1.5 ${
                          isDarkMode 
                            ? 'border-slate-700/70 text-slate-200' 
                            : 'border-slate-100 text-slate-600'
                        }`}>
                          <Sun size={14} className="text-amber-400 shrink-0" />
                          <span>{itemDateStr.split(' ')[0]}，天气{weatherInfo.text}，{weatherInfo.tip}</span>
                        </div>
                      </div>
                    )}

                    {/* 3. 卡片底部：四大规范分类点标与全天切换 */}
                    <div className={`mt-3 pt-3 border-t flex items-center justify-between ${
                      isDarkMode ? 'border-slate-700/70' : 'border-slate-100'
                    }`}>
                      {/* 分类选择器 */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsTypePickerOpen(!isTypePickerOpen);
                            setIsLeadTimePickerOpen(false);
                            setIsRepeatPickerOpen(false);
                          }}
                          className="flex items-center gap-2 py-1 px-1.5 -ml-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <span className={`w-3 h-3 rounded-full ${currentTypeConfig.dotColor} shadow-xs`} />
                          <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {currentTypeConfig.label}
                          </span>
                          <ChevronDown size={14} className={isDarkMode ? 'text-slate-300' : 'text-slate-500'} />
                        </button>

                        {/* 类型 Popover (四大规范分类：普通/默认，待办，生日，纪念日) */}
                        <AnimatePresence>
                          {isTypePickerOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.96 }}
                              className={`absolute top-full left-0 mt-2 p-1.5 rounded-2xl border shadow-2xl z-50 min-w-[11rem] backdrop-blur-md ${
                                isDarkMode 
                                  ? 'bg-[#222736] border-slate-700 shadow-black/80' 
                                  : 'bg-white border-slate-200 shadow-slate-400/50'
                              }`}
                            >
                              <div className="flex flex-col gap-1">
                                {SCHEDULE_TYPES.map((t) => {
                                  const TIcon = t.icon;
                                  return (
                                    <button
                                      key={t.id}
                                      type="button"
                                      onClick={() => handleSelectType(t.id)}
                                      className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                                        itemType === t.id 
                                          ? 'bg-blue-500 text-white shadow-sm' 
                                          : isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <TIcon size={15} className={itemType === t.id ? 'text-white' : t.dotColor.replace('bg-', 'text-')} />
                                        <span>{t.label}</span>
                                      </div>
                                      {itemType === t.id && <Check size={14} className="stroke-[3]" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* 全天 / 时段 快速切换 */}
                      <button
                        type="button"
                        onClick={() => setIsAllDay(!isAllDay)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          isAllDay 
                            ? isDarkMode
                              ? 'bg-blue-500/30 text-blue-300 font-black border border-blue-400/40'
                              : 'bg-blue-500/20 text-blue-600 font-black' 
                            : isDarkMode 
                              ? 'text-slate-300 hover:text-white hover:bg-white/5' 
                              : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {isAllDay ? '全天事件' : '时段日程'}
                      </button>
                    </div>

                  </div>


                  {/* ============================================================== */}
                  {/* CARD 2: 设置与规则列表块 (Settings & Notification List) */}
                  {/* ============================================================== */}
                  <div className={`rounded-[1.6rem] transition-all relative border overflow-hidden shadow-sm ${
                    isDarkMode 
                      ? 'bg-[#1a1e2b] border-slate-700/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)]' 
                      : 'bg-white border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)]'
                  }`}>
                    
                    {/* 1. 提醒时间 (Row 1) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLeadTimePickerOpen(!isLeadTimePickerOpen);
                          setIsTypePickerOpen(false);
                          setIsRepeatPickerOpen(false);
                        }}
                        className="w-full px-4.5 py-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer text-left"
                      >
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>提醒</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-sky-300' : 'text-blue-600'}`}>{currentLeadTimeLabel}</span>
                          <ChevronDown size={14} className={isDarkMode ? 'text-slate-300' : 'text-slate-500'} />
                        </div>
                      </button>

                      {/* 提醒时间 Popover */}
                      <AnimatePresence>
                        {isLeadTimePickerOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.96 }}
                            className={`absolute top-full left-3 right-3 mt-1.5 p-1.5 rounded-2xl border shadow-2xl z-50 backdrop-blur-md max-h-52 overflow-y-auto ${
                              isDarkMode 
                                ? 'bg-[#222736] border-slate-700 shadow-black/80' 
                                : 'bg-white border-slate-200 shadow-slate-400/50'
                            }`}
                          >
                            <div className="flex flex-col gap-1">
                              {LEAD_TIME_OPTIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setLeadTime(opt.value);
                                    setIsLeadTimePickerOpen(false);
                                  }}
                                  className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                                    leadTime === opt.value 
                                      ? 'bg-blue-500 text-white shadow-sm' 
                                      : isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                                  }`}
                                >
                                  <span>{opt.label}</span>
                                  {leadTime === opt.value && <Check size={14} className="stroke-[3]" />}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 分割线 */}
                    <div className={`border-t mx-4.5 ${isDarkMode ? 'border-slate-700/70' : 'border-slate-100'}`} />

                    {/* 2. 响铃提醒 (Row 2) */}
                    <div className="px-4.5 py-3.5 flex items-center justify-between">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>响铃提醒</span>
                      
                      {/* iOS风格拟物开关 */}
                      <button
                        type="button"
                        onClick={() => setReminderEnabled(!reminderEnabled)}
                        className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer relative shadow-inner ${
                          reminderEnabled 
                            ? 'bg-blue-500' 
                            : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                        }`}
                      >
                        <motion.div
                          animate={{ x: reminderEnabled ? 22 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 32 }}
                          className="w-5.5 h-5.5 rounded-full bg-white shadow-md"
                        />
                      </button>
                    </div>

                    {/* 分割线 */}
                    <div className={`border-t mx-4.5 ${isDarkMode ? 'border-slate-700/70' : 'border-slate-100'}`} />

                    {/* 3. 重复规则 (Row 3) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRepeatPickerOpen(!isRepeatPickerOpen);
                          setIsTypePickerOpen(false);
                          setIsLeadTimePickerOpen(false);
                        }}
                        className="w-full px-4.5 py-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer text-left"
                      >
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>重复</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-sky-300' : 'text-blue-600'}`}>{currentRepeatLabel}</span>
                          <ChevronRight size={14} className={isDarkMode ? 'text-slate-300' : 'text-slate-500'} />
                        </div>
                      </button>

                      {/* 重复规则 Popover */}
                      <AnimatePresence>
                        {isRepeatPickerOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.96 }}
                            className={`absolute bottom-full left-3 right-3 mb-1.5 p-1.5 rounded-2xl border shadow-2xl z-50 backdrop-blur-md ${
                              isDarkMode 
                                ? 'bg-[#222736] border-slate-700 shadow-black/80' 
                                : 'bg-white border-slate-200 shadow-slate-400/50'
                            }`}
                          >
                            <div className="flex flex-col gap-1">
                              {REPEAT_OPTIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setRepeatMode(opt.value);
                                    setIsRepeatPickerOpen(false);
                                  }}
                                  className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                                    repeatMode === opt.value 
                                      ? 'bg-blue-500 text-white shadow-sm' 
                                      : isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                                  }`}
                                >
                                  <span>{opt.label}</span>
                                  {repeatMode === opt.value && <Check size={14} className="stroke-[3]" />}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                </div>

                {/* ===== SKEUOMORPHIC BOTTOM CUSTOM STAMP PER CATEGORY ===== */}
                <div className={`pl-4 pr-1.5 pt-3 border-t flex items-center justify-between text-[11px] font-bold ${
                  isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shadow-xs" style={{ backgroundColor: currentTypeConfig.accentColor }} />
                    <span className="tracking-wider uppercase font-mono">
                      {currentTypeConfig.footerStamp}
                    </span>
                  </div>
                  <span className="text-[10px] font-black tracking-wider opacity-80">AETHER REMINDER</span>
                </div>

              </motion.div>

            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
