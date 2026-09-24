import { useState, useEffect, useRef } from 'react';
import { AlarmItem, PresetItem, TimerHistoryItem, FocusHistoryItem, AlarmHistoryItem } from '../types';

export const useClock = (onTimerEnd?: (msg: string, type: 'timer'|'focus') => void, onHourlyChime?: (hour: number) => void) => {
  const [time, setTime] = useState(new Date());
  
  const onTimerEndRef = useRef(onTimerEnd);
  const onHourlyChimeRef = useRef(onHourlyChime);
  
  useEffect(() => {
    onTimerEndRef.current = onTimerEnd;
    onHourlyChimeRef.current = onHourlyChime;
  }, [onTimerEnd, onHourlyChime]);

  // Timer State (Countdown)
  const [timerSeconds, setTimerSeconds] = useState(1800); // Default 30 min
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(1800);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Focus State (Countdown)
  const [focusTime, setFocusTime] = useState(3600); // Default 60 min
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(3600);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { 
      id: 'workday-morning', 
      time: '08:30', 
      label: '工作早起', 
      enabled: true, 
      days: [1, 2, 3, 4, 5], 
      type: 'workday',
      repeatCount: 3,
      interval: 5,
      voiceMode: 'standard',
      requireName: true
    },
    { 
      id: 'everyday-sleep', 
      time: '22:30', 
      label: '准备睡觉', 
      enabled: true, 
      days: [0, 1, 2, 3, 4, 5, 6], 
      type: 'everyday',
      repeatCount: 3,
      interval: 5,
      voiceMode: 'gentle',
      requireName: false
    },
    { 
      id: 'temporary-alarm', 
      time: '10:00', 
      label: '临时', 
      enabled: false, 
      days: [new Date().getDay()], 
      type: 'temporary',
      repeatCount: 1,
      interval: 5,
      voiceMode: 'standard',
      requireName: false
    },
  ]);

  const [timerPresets, setTimerPresets] = useState<PresetItem[]>([
    { id: 't1', label: '30分钟阅读', seconds: 1800, reminderInterval: 600, bgMusic: 'ticking', musicEnabled: true, mode: 'timer' },
    { id: 't2', label: '45分钟听力', seconds: 2700, reminderInterval: 900, bgMusic: 'ticking', musicEnabled: true, mode: 'timer' },
    { id: 'f1', label: '专注编码60分钟', seconds: 3600, reminderInterval: 1200, bgMusic: 'cyberpunk', musicEnabled: true, mode: 'focus' },
  ]);

  const focusPresets = timerPresets.filter(p => p.mode === 'focus');

  const [timerHistory, setTimerHistory] = useState<TimerHistoryItem[]>([
    { id: 'th1', label: '30分钟阅读', duration: 1800, timestamp: Date.now() - 86400000, insight: '昨天你完成了30分钟的完整阅读，干得漂亮！保持这个习惯。' }
  ]);
  const [focusHistory, setFocusHistory] = useState<FocusHistoryItem[]>([
    { 
      id: 'fh1', 
      task: '专注编码60分钟', 
      duration: 2700, // 45 minutes
      targetDuration: 3600, // 60 minutes
      startTime: Date.now() - 86400000, 
      insight: '昨天你专注编码了45分钟，离目标还差15分钟，是被什么打断了吗？下次可以尝试开启免打扰模式进入心流状态。' 
    }
  ]);
  const [alarmHistory, setAlarmHistory] = useState<AlarmHistoryItem[]>([
    { 
      id: 'ah1', 
      label: '工作早起', 
      time: '08:30', 
      triggerTime: Date.now() - 86400000 + 3600000,
      insight: '昨天在 08:30 准时把你唤醒，反应很快，看起来昨晚休息得不错。'
    }
  ]);

  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const focusInterval = useRef<NodeJS.Timeout | null>(null);
  const focusStartRef = useRef<number | null>(null);
  const triggeredAlarms = useRef<Set<string>>(new Set());

  // Clock update and alarm check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      const currentTimeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
      const currentDay = now.getDay();
      
      // Hourly chime logic
      if (now.getMinutes() === 0 && now.getSeconds() === 0) {
        const hour = now.getHours();
        if (hour >= 7 && hour <= 22) {
          onHourlyChimeRef.current?.(hour);
        }
      }

      const ringing = alarms.find(a => 
        a.enabled && 
        a.time === currentTimeStr && 
        a.days.includes(currentDay)
      );
      
      if (ringing) {
        const triggerKey = `${ringing.id}-${currentTimeStr}`;
        if (!triggeredAlarms.current.has(triggerKey)) {
          triggeredAlarms.current.add(triggerKey);
          setRingingAlarmId(ringing.id);
        }
      }
      
      // Clean up old trigger keys periodically
      if (now.getSeconds() === 0) {
        for (const key of triggeredAlarms.current) {
          if (!key.endsWith(currentTimeStr)) {
            triggeredAlarms.current.delete(key);
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  // Timer logic (Countdown)
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerInterval.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            onTimerEndRef.current?.("计时结束！", "timer");
            
            setTimerHistory(prevH => [{
              id: Math.random().toString(36).substr(2, 9),
              label: '计时任务',
              duration: totalTimerSeconds,
              timestamp: Date.now()
            }, ...prevH].slice(0, 5));
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); };
  }, [isTimerRunning, timerSeconds, totalTimerSeconds, onTimerEnd]);

  // Focus logic
  useEffect(() => {
    if (isFocusRunning && focusTime > 0) {
      if (!focusStartRef.current) focusStartRef.current = Date.now();
      focusInterval.current = setInterval(() => {
        setFocusTime(prev => {
          if (prev <= 1) {
            setIsFocusRunning(false);
            onTimerEndRef.current?.("专注时间结束！休息一下吧。", "focus");
            
            setFocusHistory(prevH => [{
              id: Math.random().toString(36).substr(2, 9),
              task: '专注任务',
              duration: totalFocusSeconds,
              startTime: focusStartRef.current || Date.now()
            }, ...prevH].slice(0, 5));
            focusStartRef.current = null;
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (focusInterval.current) clearInterval(focusInterval.current);
      focusStartRef.current = null;
    }
    return () => { if (focusInterval.current) clearInterval(focusInterval.current); };
  }, [isFocusRunning, focusTime, totalFocusSeconds, onTimerEnd]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const updateAlarm = (id: string, updates: Partial<AlarmItem>) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const updateTimerPreset = (id: string, updates: Partial<PresetItem>) => {
    setTimerPresets(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateFocusPreset = (id: string, updates: Partial<PresetItem>) => {
    updateTimerPreset(id, updates);
  };

  const getNextAlarmTime = () => {
    const enabledAlarms = alarms.filter(a => a.enabled);
    if (enabledAlarms.length === 0) return null;

    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let minDiff = Infinity;

    enabledAlarms.forEach(alarm => {
      const [h, m] = alarm.time.split(':').map(Number);
      const alarmMinutes = h * 60 + m;

      alarm.days.forEach(day => {
        let dayDiff = day - currentDay;
        if (dayDiff < 0 || (dayDiff === 0 && alarmMinutes <= currentMinutes)) {
          dayDiff += 7;
        }
        const totalDiff = dayDiff * 1440 + (alarmMinutes - currentMinutes);
        if (totalDiff < minDiff) minDiff = totalDiff;
      });
    });

    return minDiff === Infinity ? null : minDiff;
  };

  return {
    time,
    timerSeconds,
    setTimerSeconds,
    isTimerRunning,
    setIsTimerRunning,
    focusTime,
    setFocusTime,
    isFocusRunning,
    setIsFocusRunning,
    alarms,
    timerPresets,
    focusPresets,
    timerHistory,
    focusHistory,
    alarmHistory,
    toggleAlarm,
    updateAlarm,
    updateTimerPreset,
    updateFocusPreset,
    ringingAlarmId,
    setRingingAlarmId,
    nextAlarmMinutes: getNextAlarmTime(),
    totalTimerSeconds,
    setTotalTimerSeconds,
    totalFocusSeconds,
    setTotalFocusSeconds
  };
};
