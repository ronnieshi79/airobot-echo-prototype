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
  { id: 'deep_work', name: '深度工作', icon: '☀️', description: '高专注心流、阻断打扰、沉浸推演' },
  { id: 'morning_wake', name: '清晨唤醒', icon: '🌅', description: '晨曦轻柔唤醒、全天日程梳理、晨报速递' },
  { id: 'afternoon_break', name: '午后小憩', icon: '☕', description: '15分钟闭目养神、白噪音声景、午后备忘' },
  { id: 'evening_review', name: '暮色复盘', icon: '🌆', description: '待办完成复盘、AI记事本洞察、晚间反思' },
  { id: 'night_healing', name: '夜间疗愈', icon: '🌙', description: '明日闹钟就绪、助眠故事、睡前远离蓝光' },
  { id: 'active_energy', name: '活力运动', icon: '🏃', description: '间歇计时、节奏音频、健康运动打卡' }
];

export type SliceType = 'focus' | 'timer' | 'calendar' | 'podcast' | 'alarm' | 'logbook';

export interface ColorTheme {
  iconBg: string;
  iconColor: string;
  pillBg: string;
  pillText: string;
  glowColor?: string;
}

export interface ServiceSlice {
  id: string;
  type: SliceType;
  title: string;
  description: string;
  iconType: 'timer' | 'focus' | 'calendar' | 'podcast' | 'alarm' | 'logbook';
  badge?: string;
  colorTheme: ColorTheme;
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
