import { ScheduleItem, TodoItem, AlarmItem } from '../../types';
import { PodcastEpisode } from '../../podcast/usePodcast';

// Context Types
export type ContextType = 
  | 'deep_work' 
  | 'morning_wake' 
  | 'afternoon_break' 
  | 'evening_review' 
  | 'night_healing' 
  | 'active_energy';

export interface ContextMeta {
  id: ContextType;
  name: string;
  icon: string;
  description: string;
}

export const CONTEXT_PRESETS: ContextMeta[] = [
  { id: 'morning_wake', name: '晨间开工', icon: '💼', description: '全天议程排期、待办优先级对齐、行业早参速报' },
  { id: 'deep_work', name: '专注冲刺', icon: '🎯', description: '核心任务攻坚、免打扰沉浸心流、阻断即时消息' },
  { id: 'afternoon_break', name: '工间充能', icon: '☕', description: '眼部肌肉放松、咖啡小憩、重置大脑认知带宽' },
  { id: 'active_energy', name: '敏捷协作', icon: '⚡', description: '站会倒计时、头脑风暴研讨、工间体态激活' },
  { id: 'evening_review', name: '结项复盘', icon: '📊', description: '今日待办清零、产出日志沉淀、明日排期预演' },
  { id: 'night_healing', name: '离线休养', icon: '🌙', description: '工作通知静默、远离工作蓝光、安神声景解压' }
];

export type SliceType = 'focus' | 'timer' | 'calendar' | 'podcast' | 'alarm' | 'logbook';

export interface ColorTheme {
  iconBg: string;
  iconColor: string;
  pillBg: string;
  pillText: string;
  glowColor?: string;
}

export interface SubdialMeta {
  label: string;
  value: string;
  subtext?: string;
  dotColor?: string;
  accentColor?: string;
  waveform?: boolean;
}

export interface ServiceSlice {
  id: string;
  type: SliceType;
  title: string;
  description: string;
  iconType: 'timer' | 'focus' | 'calendar' | 'podcast' | 'alarm' | 'logbook';
  badge?: string;
  colorTheme: ColorTheme;
  subdial?: SubdialMeta;
  isLiveDynamic?: boolean;
  liveStatusText?: string;
  targetOverlay: 'focus' | 'timer' | 'alarm' | 'podcast' | 'logbook' | 'planner';
  targetPresetId?: string;
  recommendedActionText: string;
  recommendationReason: string;
}

export interface ContextComputationParams {
  context: ContextType;
  now: Date;
  schedules: ScheduleItem[];
  todos: TodoItem[];
  episodes: PodcastEpisode[];
  alarms: AlarmItem[];
  isFocusRunning: boolean;
  focusTime: number;
  totalFocusSeconds: number;
  isTimerRunning: boolean;
  timerSeconds: number;
  totalTimerSeconds: number;
  isPlaying: boolean;
  activeEpisode: PodcastEpisode | null;
  ringingAlarmId: string | null;
}

export interface ContextComputationResult {
  context: ContextType;
  slices: ServiceSlice[];
  primaryReason: string;
  primaryAction: string;
  activeLiveSlice?: ServiceSlice;
}

// Agent Actions for Driving Functional Cards
export type CardOverlayType = 'focus' | 'timer' | 'alarm' | 'podcast' | 'logbook' | 'planner' | null;

export type AgentAction =
  | { type: 'OPEN_CARD'; target: NonNullable<CardOverlayType>; initialData?: any }
  | { type: 'CLOSE_CARD' }
  | { type: 'START_FOCUS'; durationSeconds?: number }
  | { type: 'PAUSE_FOCUS' }
  | { type: 'RESET_FOCUS' }
  | { type: 'START_TIMER'; seconds?: number }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'DISMISS_ALARM' }
  | { type: 'SNOOZE_ALARM' }
  | { type: 'PLAY_PODCAST'; episodeId?: string; generateType?: 'audio' | 'video' | 'text'; topic?: string }
  | { type: 'PAUSE_PODCAST' }
  | { type: 'OPEN_SCHEDULE_PLANNER'; item?: ScheduleItem | TodoItem }
  | { type: 'SET_CONTEXT'; context: ContextType | 'auto' };

export interface CardDriverDelegate {
  openOverlay: (overlay: CardOverlayType) => void;
  closeOverlay: () => void;
  startFocus: (seconds?: number) => void;
  pauseFocus: () => void;
  resetFocus: () => void;
  startTimer: (seconds?: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  dismissAlarm: () => void;
  playPodcast: (episodeId?: string) => void;
  pausePodcast: () => void;
  generatePodcastEpisode: (type: 'audio' | 'video' | 'text', topic: string) => void;
  openPlanner: (item?: ScheduleItem | TodoItem) => void;
  setContext: (ctx: ContextType | 'auto') => void;
}

export interface AgentIntentResult {
  handled: boolean;
  isClosing?: boolean;
  action?: AgentAction;
  replyText?: string;
}
