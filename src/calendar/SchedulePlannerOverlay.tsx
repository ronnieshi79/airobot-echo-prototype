import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Clock, CheckSquare, Power, GripVertical, ChevronRight, ChevronLeft, Sparkles, CloudSun, CalendarIcon, X, Plus, Minimize2, Trash2, Bot, Gift, CalendarDays, Heart } from 'lucide-react';
import { ScheduleItem, TodoItem, ScheduleType, WeatherInfo } from '../types';
import { getTodayInfo } from './utils';

interface SchedulePlannerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  schedules?: ScheduleItem[];
  todos?: TodoItem[];
  initialItem?: { id: string, type: 'schedule' | 'todo' | ScheduleType };
  selectedDate?: Date;
  todayInfo?: { 
    festival: string | undefined; 
    solarTerm: string | undefined; 
    weather: WeatherInfo; 
    lunarDate: string; 
    aiAdvice: string;
  };
  time?: Date;
}

export const SchedulePlannerOverlay: React.FC<SchedulePlannerOverlayProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  schedules = [],
  todos = [],
  initialItem,
  selectedDate,
  todayInfo: propTodayInfo,
  time = new Date()
}) => {
  const [dateOffset, setDateOffset] = useState(0);
  const [knobRotation, setKnobRotation] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Local state for items to support dragging and visualization
  const [localItems, setLocalItems] = useState<any[]>([]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const isOverTrashRef = useRef(false);

  const dateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync dateOffset when overlay opens or selectedDate changes
  useEffect(() => {
    if (isOpen) {
      if (selectedDate) {
        const t1 = new Date(time.getFullYear(), time.getMonth(), time.getDate()).getTime();
        const t2 = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).getTime();
        const diffDays = Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
        setDateOffset(diffDays);
      } else {
        setDateOffset(0);
      }
    }
  }, [isOpen, selectedDate]);

  // Calculate Active Date
  const activeDate = new Date(time);
  activeDate.setDate(activeDate.getDate() + dateOffset);

  // Dynamic day info for activeDate
  const currentDayInfo = getTodayInfo(activeDate);
  const activeDateStr = `${activeDate.getFullYear()}-${String(activeDate.getMonth() + 1).padStart(2, '0')}-${String(activeDate.getDate()).padStart(2, '0')}`;
  const activeMonthDayStr = `${String(activeDate.getMonth() + 1).padStart(2, '0')}-${String(activeDate.getDate()).padStart(2, '0')}`;

  const getRelativeDateLabel = (offset: number) => {
    if (offset === 0) return '今日';
    if (offset === -1) return '昨天';
    if (offset === -2) return '前天';
    if (offset === 1) return '明天';
    if (offset === 2) return '后天';
    if (offset < 0) return `${Math.abs(offset)}天前`;
    return `${offset}天后`;
  };

  const startDateChange = (direction: 1 | -1) => {
    setDateOffset(o => o + direction); // immediate
    dateIntervalRef.current = setInterval(() => {
      setDateOffset(o => o + direction);
    }, 150); // fast continuous change
  };

  const stopDateChange = () => {
    if (dateIntervalRef.current) {
      clearInterval(dateIntervalRef.current);
      dateIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (dateIntervalRef.current) clearInterval(dateIntervalRef.current);
    };
  }, []);

  const handleAddNewItem = () => {
    const newItem = {
      id: `new-${Date.now()}`,
      type: 'regular' as ScheduleType,
      hour: 12,
      min: 0,
      time: '12:00',
      duration: 60,
      displayTask: '新日程', // Will be editable
      side: 'right',
      isEditing: true
    };
    setLocalItems(prev => [...prev, newItem].sort((a, b) => (a.hour * 60 + a.min) - (b.hour * 60 + b.min)));
    setSelectedId(newItem.id);
    setSelectedType('regular');
  };

  // Find all-day events (Festivals, Birthdays, Anniversaries) for active date
  const allDayEvents = schedules.filter(s => {
    if (s.isAllDay || s.type === 'festival' || s.type === 'birthday' || s.type === 'anniversary') {
      if (s.repeat === 'yearly' || s.type === 'festival' || s.type === 'birthday' || s.type === 'anniversary') {
        if (s.date) {
          const parts = s.date.split('-');
          const md = parts.length === 3 ? `${parts[1]}-${parts[2]}` : s.date;
          return md === activeMonthDayStr;
        }
      }
      return s.date === activeDateStr;
    }
    return false;
  });

  // Sync initial items and selections for the timeline
  useEffect(() => {
    const timedSchedules = schedules.filter(s => !s.isAllDay && s.type !== 'festival' && s.type !== 'birthday' && s.type !== 'anniversary');
    
    const seenIds = new Set<string>();
    const uniqueRawItems: any[] = [];

    timedSchedules.forEach(s => {
      if (!seenIds.has(s.id)) {
        seenIds.add(s.id);
        uniqueRawItems.push({
          ...s,
          type: (s.type || 'regular') as ScheduleType,
          hour: parseInt(s.time?.split(':')[0] || '10'),
          min: parseInt(s.time?.split(':')[1] || '0'),
          duration: 90,
          displayTask: s.task || s.title || '无标题日程'
        });
      }
    });

    todos.filter(t => t.time).forEach(t => {
      if (!seenIds.has(t.id)) {
        seenIds.add(t.id);
        uniqueRawItems.push({
          ...t,
          type: 'todo' as ScheduleType,
          hour: parseInt(t.time?.split(':')[0] || '12'),
          min: parseInt(t.time?.split(':')[1] || '0'),
          duration: 45,
          displayTask: t.task || '无标题待办'
        });
      }
    });

    const combined = uniqueRawItems
      .sort((a, b) => (a.hour * 60 + a.min) - (b.hour * 60 + b.min))
      .slice(0, 5); // Limit to 5 items

    const fixedHours = [8, 11, 14, 17, 21];

    const aligned = combined.map((item, idx) => {
      const targetHour = fixedHours[idx % fixedHours.length];
      const timeStr = item.time || `${String(targetHour).padStart(2, '0')}:00`;
      return {
        ...item,
        side: 'right',
        hour: item.hour || targetHour,
        min: item.min || 0,
        time: timeStr,
        duration: item.duration || 90
      };
    });

    setLocalItems(aligned);

    if (isOpen && initialItem) {
      setSelectedId(initialItem.id);
      setSelectedType(initialItem.type);
    } else if (isOpen && !initialItem) {
      setSelectedId(null);
      setSelectedType(null);
    }
  }, [isOpen, initialItem, schedules, todos]);

  const startHour = 7;
  const endHour = 23;
  const totalHours = endHour - startHour;
  
  const getTopPercentFromMinutes = (minutes: number) => {
    const minMinutes = startHour * 60;
    const maxMinutes = endHour * 60;
    const percentage = ((minutes - minMinutes) / (maxMinutes - minMinutes)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const getHeightPercent = (durationMinutes: number) => {
    const maxMinutes = totalHours * 60;
    return (durationMinutes / maxMinutes) * 100;
  };

  const hours = [7, 9, 11, 13, 15, 17, 19, 21, 23];

  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'festival':
        return <Sparkles size={13} className="text-rose-400" />;
      case 'birthday':
        return <Gift size={13} className="text-pink-400" />;
      case 'todo':
        return <CheckSquare size={13} className="text-emerald-400" />;
      case 'regular':
      default:
        return <Clock size={13} className="text-amber-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
        >
          {/* Opaque/Blurred Background Container referencing Podcast Player */}
          <div className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-black/60' : 'bg-slate-900/40'}`} onClick={onClose} />
          
          <div className="relative w-full h-full max-w-[560px] mx-auto flex items-center justify-center pl-4 pr-16 mt-2">
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative group flex w-full max-h-[792px] h-[98%]"
            >
              {/* Right-Side External Knobs / Buttons */}
              <div className="absolute -right-14 top-[40%] -translate-y-1/2 flex flex-col gap-10 z-0">
                {/* Add Knob */}
                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ x: 2 }}
                  onClick={handleAddNewItem}
                  className={`relative w-16 h-40 rounded-r-3xl border-y border-r shadow-[8px_0_20px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center gap-4 group transition-colors ${
                    isDarkMode ? 'bg-slate-700 border-white/20' : 'bg-slate-300 border-white/50'
                  }`}
                  title="新增日程"
                >
                  <div className={`w-2 h-20 rounded-full absolute left-1 flex-shrink-0 ${isDarkMode ? 'bg-black/30' : 'bg-black/10'}`} />
                  <div className={`w-12 h-12 ml-2 rounded-full shadow-inner flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500 text-white'}`}>
                    <Plus size={22} strokeWidth={2.5} />
                  </div>
                  {/* Texture lines */}
                  <div className="flex flex-col gap-1.5 w-full pl-5 pr-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-[2px] w-full rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`} />
                    ))}
                  </div>
                </motion.button>

                {/* Combined Background Run / Minimize Knob */}
                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ x: 2 }}
                  onClick={onClose}
                  className={`relative w-14 h-24 rounded-r-3xl border-y border-r shadow-[6px_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center transition-colors ${
                    isDarkMode ? 'bg-slate-800 border-white/10 text-slate-400 hover:text-indigo-400' : 'bg-slate-200 border-white/40 text-slate-500 hover:text-indigo-500'
                  }`}
                  title="收起至后台"
                >
                  <div className={`w-2 h-12 rounded-full absolute left-1 ${isDarkMode ? 'bg-black/30' : 'bg-black/10'}`} />
                  <Minimize2 size={24} className="ml-2" />
                </motion.button>
              </div>

              {/* Main Vertical Body - Skeuomorphic Blackboard/Slate Board */}
              <div className={`relative z-10 w-full h-full rounded-[3rem] flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.6),inset_0_2px_15px_rgba(255,255,255,0.3)] overflow-hidden border-[3px] ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-[#111]' 
                  : 'bg-gradient-to-b from-[#2c3e50] via-[#34495e] to-[#2c3e50] border-[#1a252f]'
              }`}>
                {/* Chalkboard Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
                
                {/* Header: Title Block Independent */}
                <div className="shrink-0 pt-7 px-8 relative z-20">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center p-2 shadow-sm border ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400 border-indigo-400/20' : 'bg-white/10 text-white border-white/20'}`}>
                      <CalendarIcon size={24} />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-black tracking-tight italic leading-none text-white drop-shadow-md">AI 日程板</h1>
                      <div className="text-[10px] font-black tracking-widest mt-1.5 uppercase text-white/50 drop-shadow-sm">
                          Aether 帮你规划日程安排，请直接语音指示
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meta Container */}
                <div className="shrink-0 px-8 pt-3 relative z-10">
                  <div className="flex items-center justify-between p-3 rounded-2xl border shadow-sm bg-black/20 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black">{activeDate.getMonth() + 1}月{activeDate.getDate()}日</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white shadow-inner">{getRelativeDateLabel(dateOffset)}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{currentDayInfo.lunarDate}</span>
                      </div>
                      <div className="w-[1px] h-8 bg-white/10"></div>
                      <div className="flex items-center gap-2 text-white">
                         <CloudSun size={16} className="text-sky-300 drop-shadow" />
                         <span className="text-xs font-bold">{currentDayInfo.weather.temp} {currentDayInfo.weather.condition}</span>
                      </div>
                    </div>
                    
                    {/* Date Knob Slider */}
                    <div className="flex items-center justify-center w-24 h-8 rounded-full bg-black/40 border border-white/10 shadow-inner relative overflow-hidden">
                      <motion.button 
                        onPointerDown={() => startDateChange(-1)}
                        onPointerUp={stopDateChange}
                        onPointerLeave={stopDateChange}
                        className="absolute left-0 w-8 h-full flex items-center justify-center text-white/50 hover:text-white/90 z-10 select-none cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                      </motion.button>
                      
                      <motion.div 
                        className="w-10 h-8 rounded-full bg-gradient-to-b from-[#e2e6eb] to-[#b0b7c4] border-[2px] border-slate-500 shadow-[2px_0_10px_rgba(0,0,0,0.6)] z-20 flex items-center justify-center cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                           if (info.offset.x > 20) setDateOffset(o => o + 1);
                           if (info.offset.x < -20) setDateOffset(o => o - 1);
                        }}
                      >
                         <div className="flex gap-1">
                           <div className="w-0.5 h-3 bg-slate-500 rounded-full mix-blend-multiply opacity-50"></div>
                           <div className="w-0.5 h-3 bg-slate-500 rounded-full mix-blend-multiply opacity-50"></div>
                         </div>
                      </motion.div>
                      
                      <motion.button 
                        onPointerDown={() => startDateChange(1)}
                        onPointerUp={stopDateChange}
                        onPointerLeave={stopDateChange}
                        className="absolute right-0 w-8 h-full flex items-center justify-center text-white/50 hover:text-white/90 z-10 select-none cursor-pointer"
                      >
                        <ChevronRight size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* All-Day Special Festivities / Birthdays Banner Row (节日/生日默认全天，可重复) */}
                {(allDayEvents.length > 0 || currentDayInfo.festival) && (
                  <div className="shrink-0 px-8 pt-2 relative z-10">
                    <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
                      {currentDayInfo.festival && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-red-500/30 to-rose-600/30 border border-rose-400/40 text-rose-300 text-[11px] font-black shadow-sm shrink-0">
                          <Sparkles size={12} className="text-rose-400 animate-pulse" />
                          <span>今日节日：{currentDayInfo.festival}</span>
                          <span className="text-[9px] font-bold opacity-75 bg-rose-500/20 px-1 py-0.5 rounded">全天</span>
                        </div>
                      )}
                      {allDayEvents.map((evt) => (
                        <div 
                          key={evt.id} 
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] font-black shadow-sm shrink-0 ${
                            evt.type === 'birthday' 
                              ? 'bg-rose-500/25 border-rose-400/40 text-rose-300' 
                              : evt.type === 'anniversary'
                                ? 'bg-amber-500/25 border-amber-400/40 text-amber-300'
                                : 'bg-rose-500/25 border-rose-400/40 text-rose-300'
                          }`}
                        >
                          {evt.type === 'birthday' ? (
                            <Gift size={12} className="text-rose-400 animate-bounce" />
                          ) : evt.type === 'anniversary' ? (
                            <Heart size={12} className="text-amber-400 animate-pulse" />
                          ) : (
                            <Sparkles size={12} className="text-rose-400" />
                          )}
                          <span>
                            {evt.type === 'birthday' ? `🎂 ${evt.task}` : evt.type === 'anniversary' ? `🌟 ${evt.task}` : evt.task}
                          </span>
                          <span className="text-[9px] font-bold opacity-75 bg-white/10 px-1 py-0.5 rounded">
                            {evt.repeat === 'yearly' ? '每年全天' : '全天'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline Center */}
                <div className="flex-1 relative flex flex-col px-6 mt-1 overflow-hidden pb-16">
                  <div className="flex-1 relative" ref={scrollRef}>
                    {/* Left Vertical Ruler Line */}
                    <div className="absolute left-[52px] top-4 bottom-4 w-[1px] z-10 bg-white/10"></div>
                    
                    {/* Background Ruler Scale */}
                    <div className="absolute inset-0 py-4 flex flex-col justify-between pointer-events-none">
                      {hours.map((h) => (
                        <div key={h} className="relative w-full flex items-center h-0">
                          <div className="flex items-center w-full gap-2 opacity-60">
                             <div className="text-[10px] w-10 text-right font-mono font-black text-white/60 drop-shadow-sm">
                               {String(h).padStart(2, '0')}:00
                             </div>
                             <div className="w-2 h-[1px] bg-white/30"></div>
                             <div className="flex-1 h-[1px] border-b border-dashed border-white/10"></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Items Ticks & Duration Bars on Ruler */}
                    {localItems.map((item, idx) => {
                      const top = getTopPercentFromMinutes(item.hour * 60 + item.min);
                      const centerTop = getTopPercentFromMinutes(item.hour * 60 + item.min + item.duration / 2);
                      const height = getHeightPercent(item.duration);
                      return (
                        <React.Fragment key={`meta-${item.id}-${idx}`}>
                          <motion.div
                            style={{ top: `${centerTop}%` }}
                            className="absolute left-[50px] w-1.5 h-[2px] z-20 pointer-events-none bg-yellow-400/80 shadow-[0_0_5px_rgba(250,204,21,0.5)]"
                          />
                          <motion.div
                            style={{ top: `${top}%`, height: `${height}%` }}
                            className="absolute left-[51px] w-1 rounded-full opacity-30 z-10 pointer-events-none bg-yellow-200"
                          />
                        </React.Fragment>
                      );
                    })}
                    
                    {/* Absolute Positioned Items */}
                    <div className="relative h-full py-4 mx-2">
                      {localItems.map((item, idx) => {
                        const absoluteCenterMin = item.hour * 60 + item.min + item.duration / 2;
                        const centerTop = getTopPercentFromMinutes(absoluteCenterMin);
                        const isSelected = item.id === selectedId;

                        return (
                          <motion.div
                            key={`item-${item.id}-${idx}`}
                            drag="y"
                            dragConstraints={scrollRef}
                            dragElastic={0.05}
                            dragMomentum={false}
                            onDragStart={() => setDraggingId(item.id)}
                            onDrag={(_, info) => {
                              if (!scrollRef.current) return;
                              const rect = scrollRef.current.getBoundingClientRect();
                              const over = info.point.y > rect.bottom - 80;
                              if (over !== isOverTrashRef.current) {
                                isOverTrashRef.current = over;
                                setIsOverTrash(over);
                              }
                            }}
                            onDragEnd={(_, info) => {
                              const over = isOverTrashRef.current;
                              isOverTrashRef.current = false;
                              setIsOverTrash(false);
                              setDraggingId(null);
                              
                              if (!scrollRef.current) return;
                              
                              if (over) {
                                setLocalItems(prev => prev.filter(it => it.id !== item.id));
                                if (selectedId === item.id) {
                                  setSelectedId(null);
                                  setSelectedType(null);
                                }
                                return;
                              }

                              const containerRect = scrollRef.current.getBoundingClientRect();
                              const containerHeight = containerRect.height - 32; 
                              const deltaPercent = (info.offset.y / containerHeight) * 100;
                              const maxMinutes = totalHours * 60;
                              const deltaMin = (deltaPercent / 100) * maxMinutes;
                              
                              let newCenterMin = absoluteCenterMin + deltaMin;
                              newCenterMin = Math.max(startHour * 60 + item.duration / 2, Math.min(endHour * 60 - item.duration / 2, newCenterMin));
                              const newStartMin = newCenterMin - item.duration / 2;
                              
                              setLocalItems(prev => {
                                const isSlotFree = (startMin: number, duration: number, ignoreId: string) => {
                                   return !prev.some(it => {
                                      if (it.id === ignoreId) return false;
                                      const itStartMin = it.hour * 60 + it.min;
                                      const itEndMin = itStartMin + it.duration;
                                      const endMin = startMin + duration;
                                      return Math.max(startMin, itStartMin) < Math.min(endMin, itEndMin);
                                   });
                                };
                                
                                let proposedStartMin = Math.round(newStartMin / 15) * 15;
                                let foundStartMin = proposedStartMin;
                                
                                // Conflict resolution loop
                                if (!isSlotFree(proposedStartMin, item.duration, item.id)) {
                                    let offset = 15;
                                    let maxOffset = 12 * 60;
                                    while (offset < maxOffset) {
                                        if (proposedStartMin + offset + item.duration <= endHour * 60 && isSlotFree(proposedStartMin + offset, item.duration, item.id)) {
                                            foundStartMin = proposedStartMin + offset;
                                            break;
                                        }
                                        if (proposedStartMin - offset >= startHour * 60 && isSlotFree(proposedStartMin - offset, item.duration, item.id)) {
                                            foundStartMin = proposedStartMin - offset;
                                            break;
                                        }
                                        offset += 15;
                                    }
                                }
                                
                                const h = Math.floor(foundStartMin / 60);
                                const m = foundStartMin % 60;
                                const newTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                                
                                const sorted = prev.map(it => 
                                  it.id === item.id 
                                    ? { ...it, time: newTime, hour: h, min: m }
                                    : it
                                ).sort((a, b) => (a.hour * 60 + a.min) - (b.hour * 60 + b.min));
                                
                                return sorted.map((it) => ({ ...it, side: 'right' }));
                              });
                            }}
                            style={{ top: `${centerTop}%`, left: '60px', right: '0px' }}
                            className="absolute -translate-y-1/2 z-30 pointer-events-auto w-[85%]"
                          >
                            <motion.div
                              onClick={() => {
                                setSelectedId(item.id);
                                setSelectedType(item.type);
                              }}
                              whileHover={{ scale: 1.02 }}
                              className={`group relative w-full h-10 rounded-2xl border px-3 flex items-center gap-2 cursor-pointer transition-all shadow-md ${
                                isSelected 
                                  ? (item.type === 'festival' || item.type === 'birthday' 
                                      ? 'bg-rose-500 border-rose-400 text-white shadow-[0_10px_30px_rgba(244,63,94,0.3)]'
                                      : item.type === 'todo'
                                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)]'
                                        : 'bg-amber-500 border-amber-400 text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.3)]')
                                  : 'bg-black/40 border-white/20 text-white/90 shadow-[0_4px_15px_rgba(0,0,0,0.3)] backdrop-blur-md hover:bg-black/60'
                              }`}
                            >
                               {/* Connector Line to Ruler */}
                                <div className="absolute top-1/2 -translate-y-1/2 right-full w-4 h-[1px] opacity-40 bg-white/50" />

                                <div className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-lg ${isSelected ? 'bg-black/10' : 'bg-white/10'}`}>
                                   {renderTypeIcon(item.type)}
                                </div>
                                
                                <div className="flex-1 flex flex-col min-w-0">
                                   {item.isEditing && isSelected ? (
                                     <input 
                                       type="text" 
                                       autoFocus
                                       className="bg-black/20 text-white min-w-0 w-full text-[11px] font-black border-none outline-none rounded px-1"
                                       value={item.displayTask}
                                       onChange={(e) => {
                                         setLocalItems(prev => prev.map(it => it.id === item.id ? { ...it, displayTask: e.target.value } : it));
                                       }}
                                       onBlur={() => {
                                         setLocalItems(prev => prev.map(it => it.id === item.id ? { ...it, isEditing: false } : it));
                                       }}
                                       onKeyDown={(e) => {
                                         if (e.key === 'Enter') {
                                           setLocalItems(prev => prev.map(it => it.id === item.id ? { ...it, isEditing: false } : it));
                                         }
                                       }}
                                     />
                                   ) : (
                                     <span 
                                       className="text-[11px] font-black truncate leading-tight cursor-text"
                                       onDoubleClick={() => {
                                         if (isSelected) {
                                           setLocalItems(prev => prev.map(it => it.id === item.id ? { ...it, isEditing: true } : it));
                                         }
                                       }}
                                     >
                                       {item.displayTask}
                                     </span>
                                   )}
                                   <div className="flex items-center gap-2 mt-0.5">
                                       <span className="text-[9px] font-mono font-black italic opacity-60">{item.time}</span>
                                       <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-slate-900/40' : 'bg-white/30'}`}></div>
                                       <span className="text-[9px] font-bold opacity-60">
                                         {item.type === 'todo' ? '待办' : `${item.duration} min`}
                                       </span>
                                   </div>
                                </div>

                                {/* Conflict Warning Indicator */}
                                {idx > 0 && Math.abs((localItems[idx-1].hour * 60 + localItems[idx-1].min) - (item.hour * 60 + item.min)) < 15 && (
                                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#2c3e50] flex items-center justify-center z-50">
                                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                  </div>
                                )}
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Bottom Unified Glassmorphism Aether Prompt Card */}
                  <div className="absolute bottom-2 left-4 right-4 z-40 pointer-events-auto">
                    <div className={`px-5 py-3 rounded-[2rem] border flex items-center gap-3 transition-all shadow-2xl backdrop-blur-xl ${
                      isDarkMode ? 'bg-indigo-950/75 border-indigo-500/30' : 'bg-slate-900/85 border-white/20'
                    }`}>
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex flex-shrink-0 items-center justify-center relative">
                         <Bot size={16} className="text-indigo-400" />
                         <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                         </span>
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">AETHER 日程提示</p>
                        <p className="text-xs font-bold leading-tight truncate text-slate-200">
                          {currentDayInfo.aiAdvice || '拖拽日程卡片可调整时间，双击任务名称可修改内容'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trash Bin Overlay */}
                  <AnimatePresence>
                    {draggingId && (
                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className={`absolute bottom-6 left-12 right-6 h-16 flex items-center justify-center rounded-2xl border-2 backdrop-blur-xl z-50 transition-colors duration-200 shadow-2xl ${
                          isOverTrash ? 'bg-red-500/80 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-black/60 border-white/20 text-white/70'
                        }`}
                      >
                        <Trash2 size={24} className={`transition-transform duration-200 ${isOverTrash ? 'scale-125' : 'scale-100'}`} />
                        <span className="ml-3 font-bold text-sm tracking-widest">{isOverTrash ? '松开以删除日程' : '拖至此处删除'}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
