import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Sparkles, Cloud, ChevronRight, Brain, Timer, Bell, MessageSquare, Headphones, BookOpen, CheckSquare } from 'lucide-react';
import { MainCategory, SubCategory, ScheduleItem, WeatherInfo, TodoItem, AlarmHistoryItem, FocusHistoryItem, TimerHistoryItem } from '../types';

interface Recommendation {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  prompt: string;
  category?: MainCategory;
  subCategory?: SubCategory;
  color: string;
  actionId?: string;
}

interface RecommendationStripProps {
  isDarkMode: boolean;
  time: Date;
  schedules: ScheduleItem[];
  todos?: TodoItem[];
  todayInfo: any;
  onNavigate: (cat: MainCategory, sub: SubCategory) => void;
  onAction?: (actionId: string) => void;
  isFocusRunning: boolean;
  isTimerRunning: boolean;
  alarmCount: number;
  module?: MainCategory;
  episodes?: any[];
  alarmHistory?: AlarmHistoryItem[];
  focusHistory?: FocusHistoryItem[];
  timerHistory?: TimerHistoryItem[];
}

export const RecommendationStrip: React.FC<RecommendationStripProps> = ({
  isDarkMode,
  time,
  schedules,
  todos = [],
  episodes = [],
  todayInfo,
  onNavigate,
  onAction,
  isFocusRunning,
  isTimerRunning,
  alarmCount,
  module,
  alarmHistory = [],
  focusHistory = [],
  timerHistory = []
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const todaySchedules = schedules.filter(s => s.dayOfWeek === time.getDay());
  const pendingSchedules = todaySchedules.filter(s => !s.completed);

  // Context-aware recommendations - Dynamic List
  const getDynamicRecommendations = (): Recommendation[] => {
    const recs: Recommendation[] = [];

    // 1. Time Module
    if (!module || module === 'time') {
      // 时间管理
      recs.push({
        title: '时间管理',
        icon: <Timer />,
        content: isFocusRunning ? '你正在深度专注中。AETHER 建议：保持当前节奏，我会为你屏蔽不必要的干扰。' : (isTimerRunning ? '正在记录你的努力。AETHER 提醒：适时休息能让接下来的计时更高效。' : '现在是高效工作的黄金时间。AETHER 建议：开启一个 25 分钟的番茄钟，或设置下一个闹钟。'),
        prompt: isFocusRunning ? '正在专注中' : (isTimerRunning ? '计时进行中' : '去设置日程/时钟'),
        actionId: isFocusRunning ? 'popup-focus' : (isTimerRunning ? 'popup-timer' : 'popup-alarm'),
        color: 'text-orange-500'
      });

      // AiRobot 记录 Combining alarmHistory, focusHistory, timerHistory
      const combinedHistories = [
        ...alarmHistory.map(h => ({ type: 'alarm' as const, time: h.triggerTime, data: h })),
        ...focusHistory.map(h => ({ type: 'focus' as const, time: h.startTime, data: h })),
        ...timerHistory.map(h => ({ type: 'timer' as const, time: h.timestamp, data: h }))
      ].sort((a, b) => b.time - a.time);

      let latestTimeContent: React.ReactNode;
      let actionId = 'logbook';
      
      if (combinedHistories.length > 0) {
        const item = combinedHistories[0];
        let insight = '';
        if (item.type === 'alarm') insight = (item.data as AlarmHistoryItem).insight || '没有更多洞察。';
        else if (item.type === 'focus') insight = (item.data as FocusHistoryItem).insight || '记录了一次专注。';
        else if (item.type === 'timer') insight = (item.data as TimerHistoryItem).insight || '记录了一次计时。';
        
        latestTimeContent = (
          <>
            {insight} 详情前往 <span onClick={(e) => { e.stopPropagation(); if(onAction) onAction('logbook'); }} className="font-bold underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"><BookOpen size={12} />[ai记事本]</span> 查阅。
          </>
        );
      } else {
         latestTimeContent = (
          <>
            还没有任何时间管理记录。详情可前往 <span onClick={(e) => { e.stopPropagation(); if(onAction) onAction('logbook'); }} className="font-bold underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"><BookOpen size={12} />[ai记事本]</span> 查阅。
          </>
        );
      }

      recs.push({
        title: 'AiRobot 记录',
        icon: <Brain />,
        content: latestTimeContent,
        prompt: '查看 Aether 记录本',
        actionId: 'logbook',
        color: 'text-amber-500'
      });
    }

    // 3. Schedule State (Today) (Calendar Module)
    if (!module || module === 'calendar') {
      const todayStr = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')}`;
      const overdues = todos.filter(t => t.status === 'open' && t.date && t.date < todayStr);
      const openTodos = todos.filter(t => t.status === 'open');
      const todayTodos = todos.filter(t => t.date === todayStr);
      const todaySchedulesFiltered = schedules.filter(s => s.date ? s.date === todayStr : s.dayOfWeek === time.getDay());

      const filteredItems = [
        ...todayTodos.map(t => ({ type: 'todo' as const, data: t })),
        ...todaySchedulesFiltered.map(s => ({ type: 'schedule' as const, data: s }))
      ];

      // "今日日程" content
      let todaySummary = `今天是 ${time.getMonth() + 1}月${time.getDate()}日。`;
      if (todayInfo?.weather) todaySummary += `天气${todayInfo.weather.condition}，气温${todayInfo.weather.temp}；`;
      if (filteredItems.length > 0) {
        todaySummary += `今日共有 ${filteredItems.length} 项事务安排，Aether建议您挑重点优先处理。`;
      } else {
        todaySummary += `暂无重要事务，可适度放松。`;
      }

      recs.push({
        title: '今日日程',
        icon: <Calendar />,
        content: todaySummary,
        prompt: '进入今日 AI 日历',
        actionId: 'planner',
        color: 'text-indigo-500'
      });

      // "待办管理" content
      let taskSummary = `您目前有 ${openTodos.length} 项待办任务`;
      if (overdues.length > 0) {
        taskSummary += `，其中 ${overdues.length} 项已过期需要重点关注`;
      }
      if (todaySchedulesFiltered.length > 0) {
        taskSummary += `；今天还有 ${todaySchedulesFiltered.length} 项日程提醒。`;
      } else {
        taskSummary += `。`;
      }

      recs.push({
        title: '待办管理',
        icon: <CheckSquare />,
        content: taskSummary,
        prompt: '前往 AI 待办中心',
        actionId: 'planner',
        color: 'text-indigo-500'
      });

      // "AiRobot 记录" content
      const allItemsSorted = [
        ...todos.map(t => ({ type: 'todo' as const, data: t, timeValue: t.id })),
        ...schedules.map(s => ({ type: 'schedule' as const, data: s, timeValue: s.id }))
      ].sort((a, b) => b.timeValue.localeCompare(a.timeValue)); // Roughly sort by recent ID

      let latestRecordContent: React.ReactNode;
      if (allItemsSorted.length > 0) {
        const item = allItemsSorted[0];
        const dateStr = item.data.date;
        const timeStr = 'time' in item.data && item.data.time ? item.data.time : '';
        const actionStr = item.type === 'todo' ? '添加了待办' : '安排了日程';
        const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric'}) : '最近';
        
        latestRecordContent = (
          <>
            您在 {formattedDate} {timeStr} {actionStr}：“<span className="font-bold">{item.data.task}</span>”。详细记录可前往 <span onClick={(e) => { e.stopPropagation(); if(onAction) onAction('logbook'); }} className="font-bold underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"><BookOpen size={12} />[ai记事本]</span> 查阅。
          </>
        );
      } else {
        latestRecordContent = (
          <>
            还没有记录任何日程代办内容，可通过语音添加。详情可前往 <span onClick={(e) => { e.stopPropagation(); if(onAction) onAction('logbook'); }} className="font-bold underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"><BookOpen size={12} />[ai记事本]</span> 查阅。
          </>
        );
      }

      recs.push({
        title: 'AiRobot 记录',
        icon: <Brain />,
        content: latestRecordContent,
        prompt: '查看 Aether 记录本',
        actionId: 'logbook',
        color: 'text-amber-500'
      });
    }

    // 5. AI Podcast (Podcast Module)
    if (!module || module === 'podcast') {
      recs.push({
        title: 'AI 播客',
        icon: <Headphones />,
        content: '想听听今天的新闻资讯或者有趣的故事吗？AETHER 为你准备了专属播客。',
        prompt: '播放今天的资讯播客',
        category: 'podcast',
        subCategory: 'podcast-home',
        actionId: 'play-podcast-news',
        color: 'text-pink-500'
      });

      // AiRobot 记录 for Podcast
      let podcastLatestContent: React.ReactNode;
      if (episodes.length > 0) {
        podcastLatestContent = (
          <>
            最近收听了《<span className="font-bold">{episodes[0].title}</span>》。详细记录可前往 <span onClick={(e) => { e.stopPropagation(); if(onAction) onAction('logbook'); }} className="font-bold underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"><BookOpen size={12} />[ai记事本]</span> 查阅。
          </>
        );
      } else {
        podcastLatestContent = (
          <>
            还没有收听任何播客内容。详情可前往 <span onClick={(e) => { e.stopPropagation(); if(onAction) onAction('logbook'); }} className="font-bold underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"><BookOpen size={12} />[ai记事本]</span> 查阅。
          </>
        );
      }

      recs.push({
        title: 'AiRobot 记录',
        icon: <Brain />,
        content: podcastLatestContent,
        prompt: '查看 Aether 记录本',
        actionId: 'logbook',
        color: 'text-amber-500'
      });
    }

    // 6. Knowledge / Learning (Podcast Module)
    if (!module || module === 'podcast') {
      recs.push({
        title: '每日知识',
        icon: <BookOpen />,
        content: `今天是个学习新知识的好日子。AETHER 建议：听听关于“${todayInfo.weather.condition}”背后的科学知识。`,
        prompt: '生成一期科普播客',
        category: 'podcast',
        subCategory: 'podcast-knowledge',
        actionId: 'play-podcast-knowledge',
        color: 'text-blue-500'
      });
    }

    return recs;
  };

  const recommendations = getDynamicRecommendations();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % recommendations.length);
    }, 15000); // 15 seconds auto-scroll
    return () => clearInterval(interval);
  }, [recommendations.length]);

  const current = recommendations[currentIndex];

  const handleAction = () => {
    if (current.actionId && onAction) {
      onAction(current.actionId);
    } else if (current.category && current.subCategory) {
      onNavigate(current.category, current.subCategory);
    }
  };

  return (
    <div className="w-full px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={handleAction}
          className={`w-full p-5 rounded-[2rem] border cursor-pointer transition-all flex items-center gap-5 relative overflow-hidden ${
            isDarkMode ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div className={`w-14 h-14 rounded-[1.8rem] flex items-center justify-center ${current.color} bg-opacity-10 shrink-0 shadow-inner`}>
            {React.cloneElement(current.icon as React.ReactElement, { size: 28 })}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black tracking-[0.3em] uppercase opacity-40 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                AETHER 提醒 · {current.title}
              </span>
              <Sparkles size={12} className="text-orange-500 animate-pulse" />
            </div>
            <p className={`text-sm md:text-base font-medium leading-relaxed line-clamp-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              {current.content}
            </p>
          </div>

          {/* Dynamic Update Visual */}
          <div className="flex flex-col items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={24} className="text-orange-500 animate-bounce-x" />
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-slate-500 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
