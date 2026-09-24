import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { SkeuomorphicClock } from '../clock';
import { RecommendationStrip } from './RecommendationStrip';
import { MainCategory, SubCategory, ScheduleItem, AlarmItem, AlarmHistoryItem, FocusHistoryItem, TimerHistoryItem } from '../types';
import { getTodayInfo } from '../constants';

interface HomeMenuProps {
  isDarkMode: boolean;
  time: Date;
  schedules: ScheduleItem[];
  focusTime: number;
  isFocusRunning: boolean;
  timerSeconds: number;
  isTimerRunning: boolean;
  alarms: AlarmItem[];
  alarmHistory?: AlarmHistoryItem[];
  focusHistory?: FocusHistoryItem[];
  timerHistory?: TimerHistoryItem[];
  onNavigate: (cat: MainCategory, sub: SubCategory) => void;
  onAction?: (actionId: string) => void;
  onFocusClick: () => void;
  onTimerClick: () => void;
  onAlarmClick: () => void;
}

export const HomeMenu: React.FC<HomeMenuProps> = ({
  isDarkMode,
  time,
  schedules,
  focusTime,
  isFocusRunning,
  timerSeconds,
  isTimerRunning,
  alarms,
  alarmHistory,
  focusHistory,
  timerHistory,
  onNavigate,
  onAction,
  onFocusClick,
  onTimerClick,
  onAlarmClick
}) => {
  const todayInfo = getTodayInfo(time);
  const alarmCount = alarms.length;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-0 flex-shrink-0 pr-12">
        <div className="flex items-center gap-3 mb-1">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
            <Clock size={20} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            AI 时钟
          </h2>
        </div>
        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          ai时间管理好搭档
        </p>
      </div>

      {/* Top Section: Main Clock */}
      <div className="flex flex-col items-center justify-start flex-1 -mt-10">
        <SkeuomorphicClock 
          time={time} 
          isDarkMode={isDarkMode} 
          size="lg" 
          focusTime={focusTime}
          isFocusRunning={isFocusRunning}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          alarms={alarms}
          onFocusClick={onFocusClick}
          onTimerClick={onTimerClick}
          onAlarmClick={onAlarmClick}
        />
      </div>

      {/* Bottom Section: Context-Aware Recommendations */}
      <RecommendationStrip
        isDarkMode={isDarkMode}
        time={time}
        schedules={schedules}
        todayInfo={todayInfo}
        onNavigate={onNavigate}
        onAction={onAction}
        isFocusRunning={isFocusRunning}
        isTimerRunning={isTimerRunning}
        alarmCount={alarmCount}
        module="time"
        alarmHistory={alarmHistory}
        focusHistory={focusHistory}
        timerHistory={timerHistory}
      />
    </div>
  );
};
