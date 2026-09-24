import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Brain, Hourglass, Bell, ChevronDown, Headphones, MessageSquare, Timer, Minimize2, Calendar, Sparkles } from 'lucide-react';
import { TimerHistoryItem, FocusHistoryItem, AlarmHistoryItem, ScheduleItem, TodoItem } from '../types';
import { PodcastEpisode } from '../podcast/usePodcast';

interface LogbookOverlayProps {
  show: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  timerHistory: TimerHistoryItem[];
  focusHistory: FocusHistoryItem[];
  alarmHistory: AlarmHistoryItem[];
  episodes: PodcastEpisode[];
  schedules?: ScheduleItem[];
  todos?: TodoItem[];
}

export const LogbookOverlay: React.FC<LogbookOverlayProps> = ({
  show,
  onClose,
  isDarkMode,
  timerHistory,
  focusHistory,
  alarmHistory,
  episodes,
  schedules = [],
  todos = []
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = Math.imul(31, hash) + seed.charCodeAt(i) | 0;
    }
    return (Math.abs(hash) % 1000) / 1000;
  };

  const parseToMs = (item: any) => {
    if (item._time) return item._time;
    if (item._type === 'ai_summary') return item.timestamp;
    if (item._type === 'focus') return item.startTime;
    if (item._type === 'timer') return item.timestamp;
    if (item._type === 'alarm') return item.triggerTime;
    
    // Spread items without exact timestamps over the past 14 days pseudo-randomly
    const randomFrac = seededRandom(String(item.id || item.task || item.title || Math.random()));
    const spreadOffset = randomFrac * 1000 * 60 * 60 * 24 * 14; 
    
    if (item._type === 'podcast') return Date.now() - spreadOffset; 
    if (item._type === 'schedule') {
        const d = new Date(`${item.date}T${item.time || '00:00:00'}`);
        return isNaN(d.getTime()) ? Date.now() - spreadOffset : d.getTime();
    }
    if (item._type === 'todo') {
        const d = new Date(`${item.date}T12:00:00`);
        return isNaN(d.getTime()) ? Date.now() - spreadOffset : d.getTime();
    }
    return 0;
  };

  const mockHistoryRecords = [
    {
      id: 'mock-f1',
      _type: 'focus' as const,
      task: '阅读《深度学习》',
      startTime: new Date('2026-04-05T09:00:00').getTime(),
      duration: 2700,
      targetDuration: 2700,
      insight: '早晨的专注力非常高，未受任何干扰。',
    },
    {
      id: 'mock-t1',
      _type: 'timer' as const,
      label: '泡咖啡',
      timestamp: new Date('2026-04-05T10:00:00').getTime(),
      duration: 300,
      insight: '手冲咖啡的香气很解乏。',
    },
    {
      id: 'mock-ep1',
      _type: 'podcast' as const,
      title: '科技前沿：量子计算的新突破',
      date: '2026-04-06',
      type: 'news',
      channelName: '科技速递',
      progress: 100,
      qnaHistory: [
        { question: '量子霸权意味着什么？', answer: '代表量子计算机能在特定任务上超越经典计算机。' }
      ],
      _time: new Date('2026-04-06T15:30:00').getTime(),
    },
    {
      id: 'mock-s1',
      _type: 'schedule' as const,
      task: '提交算法大作业',
      date: '2026-04-08',
      time: '23:59',
      status: 'closed',
      _time: new Date('2026-04-08T23:59:00').getTime(),
    },
    {
      id: 'mock-a1',
      _type: 'alarm' as const,
      label: '早起练习瑜伽',
      time: '06:30',
      triggerTime: new Date('2026-04-12T06:30:00').getTime(),
      insight: '虽然有点困，但坚持下来了。',
    },
    {
      id: 'mock-td1',
      _type: 'todo' as const,
      task: '预定音乐会门票',
      date: '2026-04-15',
      completed: true,
      _time: new Date('2026-04-15T12:00:00').getTime(),
    },
    {
      id: 'mock-f2',
      _type: 'focus' as const,
      task: '雅思真题训练',
      startTime: new Date('2026-04-18T14:00:00').getTime(),
      duration: 7200,
      targetDuration: 7200,
      insight: '感觉状态渐入佳境。',
    },
    {
      id: 'mock-ep2',
      _type: 'podcast' as const,
      title: '人文社科：罗马帝国的衰亡史（上）',
      date: '2026-04-22',
      type: 'story',
      channelName: '历史漫谈',
      progress: 85,
      qnaHistory: [],
      _time: new Date('2026-04-22T10:00:00').getTime(),
    },
    {
      id: 'mock-t2',
      _type: 'timer' as const,
      label: '眼部放松',
      timestamp: new Date('2026-04-23T20:00:00').getTime(),
      duration: 600,
    },
    {
      id: 'mock-s2',
      _type: 'schedule' as const,
      task: '社团纳新会议',
      date: '2026-04-26',
      time: '19:00',
      status: 'open',
      _time: new Date('2026-04-26T19:00:00').getTime(),
    },
    {
      id: 'mock-f3',
      _type: 'focus' as const,
      task: '期中考试复习',
      startTime: new Date('2026-04-29T21:00:00').getTime(),
      duration: 5400,
      targetDuration: 5400,
      insight: '稍微有些疲倦，建议早点休息。',
    }
  ];

  const mockAiSummaries = [
    {
      id: 'ai-summary-1',
      _type: 'ai_summary' as const,
      title: 'Aether 周期观察报告',
      timestamp: new Date('2026-04-26T10:00:00').getTime(),
      content: '过去一周里，你在「计算机体系结构」与「托福词汇」上累计完成 15 次深度专注，表现出的长期耐力较上周期提升约 30%。然而，我检测到你有连续两天熬夜的迹象，导致第三天的早晨计划未能按时启动。建议：请适当将学习日程提前，睡前通过轻播客或冥想放松，避免精力在深夜枯竭。你做得很棒，要继续保持。',
    },
    {
      id: 'ai-summary-2',
      _type: 'ai_summary' as const,
      title: 'Aether 月度观察报告',
      timestamp: new Date('2026-05-01T08:00:00').getTime(),
      content: '这是我们共度的一个月！你累计使用专注时钟 50+ 小时，主要听取了「人文拓展」与「科技简讯」频道，这为你的知识体系构筑了很好的广度。不过，本月你的课外活动日程完成度仅有 40%，Aether 提醒你：运动与呼吸新鲜空气不仅能滋养身体，更能让大脑保持敏锐哦，下个计划中多安排些户外活动吧。',
    }
  ];

  const allRecords = [
    ...mockAiSummaries,
    ...mockHistoryRecords,
    ...focusHistory.map(h => ({ ...h, _type: 'focus' as const })),
    ...timerHistory.map(h => ({ ...h, _type: 'timer' as const })),
    ...alarmHistory.map(h => ({ ...h, _type: 'alarm' as const })),
    ...episodes.map(ep => ({ ...ep, _type: 'podcast' as const })),
    ...schedules.map(s => ({ ...s, _type: 'schedule' as const })),
    ...todos.map(t => ({ ...t, _type: 'todo' as const }))
  ].map(item => ({ ...item, _time: parseToMs(item) })).sort((a, b) => b._time - a._time);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/60' : 'bg-slate-900/40'}`} 
            onClick={onClose} 
          />

          <div className="relative flex items-center justify-center w-full max-w-[500px] h-[95%] z-10">
            {/* Skeuomorphic Notebook Container */}
            <motion.div
              initial={{ scale: 0.9, y: 30, rotateX: 10 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 30, rotateX: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col ${
                isDarkMode ? 'bg-[#1e1e1e]' : 'bg-[#fdfbf7]'
              }`}
              style={{
                boxShadow: isDarkMode 
                  ? '20px 0 30px -10px rgba(0,0,0,0.8), inset 5px 0 15px rgba(0,0,0,0.5)' 
                  : '20px 0 30px -10px rgba(0,0,0,0.3), inset 5px 0 15px rgba(0,0,0,0.05)',
                borderLeft: isDarkMode ? '4px solid #2d2d2d' : '4px solid #8b5a2b'
              }}
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/notebook.png")' }}></div>

              {/* Spiral Binding */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-evenly py-6 pointer-events-none z-30">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i} className="flex -ml-3">
                    <div className="w-7 h-4 rounded-full border-[3.5px] border-black/40 absolute mt-0.5 ml-0.5 blur-[1px]"></div>
                    <div className="w-7 h-4 rounded-full border-[3.5px] border-slate-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.4)] relative"></div>
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className={`relative pl-12 pr-6 pt-8 pb-4 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-amber-100 text-amber-700'}`}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-black tracking-widest uppercase ${isDarkMode ? 'text-slate-100' : 'text-slate-800'} font-serif`}>
                      Aether 记事本
                    </h2>
                    <p className={`text-[10px] font-bold tracking-wider mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} leading-relaxed`}>
                      记录你的每次行为，通过分析与建议，协助你更好地利用时间。
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Area (Pages) */}
              <div ref={scrollContainerRef} className={`flex-1 overflow-y-auto pl-12 pr-6 py-6 custom-scrollbar relative ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-[#fdfbf7]'}`}>
                 <div className="space-y-4 pb-12">
                   {allRecords.length === 0 && <p className="text-center text-slate-500 text-xs py-8 italic font-serif">这页还是空白的...</p>}
                   
                   {allRecords.map((h: any, idx) => {
                      if (h._type === 'ai_summary') {
                        return (
                          <div key={`${h._type}-${h.id}-${idx}`} className={`p-4 rounded-xl border-y border-x border-amber-400 shadow-[inset_0_3px_10px_rgba(251,191,36,0.1)] relative mt-8 mb-4 ${isDarkMode ? 'bg-amber-900/10' : 'bg-amber-50'}`}>
                            <div className="absolute -left-2 top-4 w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            </div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                               <div>
                                 <h4 className={`text-sm font-black flex items-center gap-2 ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                                   <Sparkles size={16} className="text-amber-500" />
                                   {h.title}
                                 </h4>
                                 <p className="text-[10px] font-bold text-amber-500/60 mt-1">{new Date(h.timestamp).toLocaleString()} · 分析总结</p>
                               </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-dashed border-amber-200/50 pl-2">
                              <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-amber-200/80' : 'text-amber-800/80'} font-serif`}>
                                {h.content}
                              </p>
                            </div>
                          </div>
                        );
                      } else if (h._type === 'focus') {
                        return (
                          <div key={`focus-${h.id}-${idx}`} className={`p-4 rounded-xl border-l-4 border-indigo-500 shadow-sm relative ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                            <div className="absolute -left-2 top-4 w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            </div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                               <div>
                                 <h4 className={`text-sm font-black flex items-center gap-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                                   <Brain size={14} className="opacity-70 text-indigo-500" />
                                   Aether 观察到你的专注领域：{h.task}
                                 </h4>
                                 <p className="text-[10px] font-bold text-slate-500 mt-1">{new Date(h.startTime).toLocaleString()} · 专注时间</p>
                               </div>
                               <div className="text-right">
                                 <div className="text-lg font-black text-indigo-500">{Math.floor(h.duration / 60)}<span className="text-xs">m</span></div>
                                 {h.targetDuration && <div className="text-[9px] font-bold text-slate-400">目标 {Math.floor(h.targetDuration / 60)}m</div>}
                               </div>
                            </div>
                            {h.insight && (
                              <div className="mt-3 pt-3 border-t border-dashed border-indigo-200/30 pl-2">
                                <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-indigo-200/80' : 'text-slate-600'} font-serif italic`}>
                                  Aether 洞察："{h.insight}"
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      } else if (h._type === 'timer') {
                        return (
                          <div key={`timer-${h.id}-${idx}`} className={`p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm relative ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                            <div className="absolute -left-2 top-4 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                               <div>
                                 <h4 className={`text-sm font-black flex items-center gap-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                   <Hourglass size={14} className="opacity-70 text-emerald-500" />
                                   你使用计时器规划了：{h.label}
                                 </h4>
                                 <p className="text-[10px] font-bold text-slate-500 mt-1">{new Date(h.timestamp).toLocaleString()} · 计时器</p>
                               </div>
                               <div className="text-lg font-black text-emerald-500">{formatSeconds(h.duration)}</div>
                            </div>
                            {h.insight && (
                              <div className="mt-3 pt-3 border-t border-dashed border-emerald-200/30 pl-2">
                                <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-emerald-200/80' : 'text-slate-600'} font-serif italic`}>
                                  Aether 洞察："{h.insight}"
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      } else if (h._type === 'alarm') {
                        return (
                          <div key={`alarm-${h.id}-${idx}`} className={`p-4 rounded-xl border-l-4 border-orange-500 shadow-sm relative ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                            <div className="absolute -left-2 top-4 w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            </div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                               <div>
                                 <h4 className={`text-sm font-black flex items-center gap-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                                   <Bell size={14} className="opacity-70 text-orange-500" />
                                   我按时唤醒了你：{h.label}
                                 </h4>
                                 <p className="text-[10px] font-bold text-slate-500 mt-1">{new Date(h.triggerTime).toLocaleString()} · 唤醒记录</p>
                               </div>
                               <div className="text-lg font-black text-orange-500">{h.time}</div>
                            </div>
                            {h.insight && (
                              <div className="mt-3 pt-3 border-t border-dashed border-orange-200/30 pl-2">
                                <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-orange-200/80' : 'text-slate-600'} font-serif italic`}>
                                  Aether 洞察："{h.insight}"
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      } else if (h._type === 'podcast') {
                        const ep = h;
                        return (
                          <div key={`podcast-${ep.id}-${idx}`} className={`p-4 rounded-xl border-l-4 border-pink-500 shadow-sm relative ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                            <div className="absolute -left-2 top-4 w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                            </div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                               <div>
                                 <h4 className={`text-sm font-black flex items-center gap-2 ${isDarkMode ? 'text-pink-300' : 'text-pink-800'}`}>
                                   <Headphones size={14} className="opacity-70 text-pink-500" />
                                   你收听了播客：{ep.title}
                                 </h4>
                                 <p className="text-[10px] font-bold text-slate-500 mt-1">{ep.date} · {ep.type === 'story' ? '故事' : ep.type === 'news' ? '资讯' : '知识'} · {ep.channelName || '播客'}</p>
                               </div>
                               <div className="flex flex-col items-end">
                                 <div className="text-sm font-black text-pink-500">{ep.progress ? Math.round(ep.progress) : 0}%</div>
                               </div>
                            </div>
                            {(ep.qnaHistory && ep.qnaHistory.length > 0) ? (
                              <div className="mt-3 pt-3 border-t border-dashed border-pink-200/30 pl-2">
                                <p className={`text-[10px] font-black uppercase tracking-widest text-pink-500/70 mb-2 flex items-center gap-1`}><MessageSquare size={12} /> 探讨记录 ({ep.qnaHistory.length})</p>
                                <div className="space-y-2">
                                  {ep.qnaHistory.map((qna: any, idx2: number) => (
                                    <div key={idx2} className="flex flex-col gap-1">
                                      <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Q: {qna.question}</p>
                                      <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-pink-200/80' : 'text-slate-600'} font-serif italic`}>"{qna.answer}"</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3 pt-3 border-t border-dashed border-pink-200/30 pl-2">
                                <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-pink-200/80' : 'text-slate-600'} font-serif italic`}>
                                  未留下探讨记录。
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      } else if (h._type === 'schedule' || h._type === 'todo') {
                        const item = h;
                        return (
                          <div key={`${item._type}-${item.id}-${idx}`} className={`p-4 rounded-xl border-l-4 border-blue-500 shadow-sm relative ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                            <div className="absolute -left-2 top-4 w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            </div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                               <div>
                                 <h4 className={`text-sm font-black flex items-center gap-2 ${item.status === 'closed' || item.completed ? 'line-through opacity-50' : ''} ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                   <Calendar size={14} className="opacity-70 text-blue-500" />
                                   你计划了：{item.task}
                                 </h4>
                                 <p className="text-[10px] font-bold text-slate-500 mt-1">
                                   {item._type === 'todo' ? '代办事务' : '日程安排'} {item.date ? `· ${item.date}` : ''} {item.time ? `· ${item.time}` : ''}
                                 </p>
                               </div>
                               <div className="flex flex-col items-end">
                                 <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.status === 'closed' || item.completed ? 'bg-slate-500/10 text-slate-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                   {item.status === 'closed' || item.completed ? '已完成' : '进行中'}
                                 </div>
                               </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-dashed border-blue-200/30 pl-2">
                              {/* Mocked AI Robot log for items */}
                              <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-blue-200/80' : 'text-slate-600'} font-serif italic`}>
                                Aether 记录：{item.status === 'closed' || item.completed ? '该事项已处理完毕。' : '正在跟进中，记得按时完成哦。'}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                   })}
                 </div>
              </div>
              
              {/* Page bottom curl effect */}
              <div className="h-6 bg-gradient-to-t from-black/5 to-transparent flex-shrink-0 z-20"></div>
            </motion.div>

            {/* Right Side Control Knobs Area */}
            <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-0">
              
              {/* Pull-to-Scroll Lever/Knob */}
              <div className={`w-14 h-48 rounded-r-3xl border-y border-r flex justify-center py-4 relative shadow-[6px_0_15px_rgba(0,0,0,0.3)] overflow-hidden ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-700 border-white/10' 
                  : 'bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 border-white/50'
              }`}>
                {/* Track groove */}
                <div className={`absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-1.5 rounded-full ${
                  isDarkMode ? 'bg-black/80 shadow-inner' : 'bg-slate-400/50 shadow-inner'
                }`}></div>

                <div className={`absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-black tracking-[0.2em] uppercase pointer-events-none whitespace-nowrap pl-2 ${
                  isDarkMode ? 'text-white/30' : 'text-black/30'
                }`}>
                  SCROLL
                </div>

                <motion.div
                  drag="y"
                  dragConstraints={{ top: -30, bottom: 90 }}
                  dragElastic={0.1}
                  onDrag={(e, info) => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTop += info.delta.y * 3;
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-14 rounded-2xl cursor-pointer absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1.5 shadow-lg z-10 ${
                    isDarkMode 
                      ? 'bg-slate-600 border-t border-slate-500 shadow-[0_4px_10px_rgba(0,0,0,0.8)]' 
                      : 'bg-slate-100 border-t border-white shadow-[0_4px_10px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  <div className={`w-5 h-[2px] rounded-full ${isDarkMode ? 'bg-black/40' : 'bg-black/20'}`}></div>
                  <div className={`w-5 h-[2px] rounded-full ${isDarkMode ? 'bg-black/40' : 'bg-black/20'}`}></div>
                  <div className={`w-5 h-[2px] rounded-full ${isDarkMode ? 'bg-black/40' : 'bg-black/20'}`}></div>
                  <ChevronDown size={14} className={`mt-0.5 ${isDarkMode ? 'text-white/40' : 'text-black/40'}`} strokeWidth={3} />
                </motion.div>
              </div>

              {/* Exit/Close Knob (Similar to Podcast Minimize Button) */}
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ x: 2 }}
                onClick={onClose}
                className={`relative w-14 h-24 rounded-r-3xl border-y border-r shadow-[6px_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center transition-colors ${
                  isDarkMode ? 'bg-slate-800 border-white/10 text-slate-400 hover:text-indigo-400' : 'bg-slate-200 border-white/40 text-slate-500 hover:text-indigo-500'
                }`}
                title="返回系统首页"
              >
                <div className={`w-2 h-12 rounded-full absolute left-1 ${isDarkMode ? 'bg-black/30' : 'bg-black/10'}`} />
                <Minimize2 size={24} className="ml-2" />
              </motion.button>
              
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

