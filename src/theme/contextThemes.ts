import { ContextType } from '../context-slice/types';

export interface ContextTheme {
  id: ContextType;
  name: string;
  tagline: string;
  isDark: boolean;
  // Background gradient class or style
  bgClass: string;
  // Ambient floating light orbs
  orb1Class: string;
  orb2Class: string;
  orb3Class: string;
  // Accent & text styling
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  accentBadgeBg: string;
  accentBadgeText: string;
  pillBg: string;
  pillBorder: string;
  pillShadow: string;
}

export const CONTEXT_THEMES: Record<ContextType, ContextTheme> = {
  morning_wake: {
    id: 'morning_wake',
    name: '清晨唤醒',
    tagline: '晨曦金晖 · 自然温润唤醒',
    isDark: false,
    bgClass: 'bg-morning-wake',
    orb1Class: 'bg-amber-300/45',
    orb2Class: 'bg-orange-200/50',
    orb3Class: 'bg-rose-200/35',
    textPrimary: 'text-amber-950',
    textSecondary: 'text-amber-700/80',
    accentColor: 'text-amber-600',
    accentBadgeBg: 'bg-amber-100/90',
    accentBadgeText: 'text-amber-800',
    pillBg: 'bg-amber-50/90 hover:bg-white',
    pillBorder: 'border-amber-200/70',
    pillShadow: 'shadow-[0_4px_16px_rgba(217,119,6,0.08)]',
  },
  deep_work: {
    id: 'deep_work',
    name: '深度工作',
    tagline: '心流翡翠 · 极简无扰沉浸',
    isDark: false,
    bgClass: 'bg-deep-work',
    orb1Class: 'bg-[#bcf2da]/60',
    orb2Class: 'bg-[#d2f4e5]/50',
    orb3Class: 'bg-cyan-100/45',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-emerald-800/80',
    accentColor: 'text-emerald-600',
    accentBadgeBg: 'bg-emerald-100/90',
    accentBadgeText: 'text-emerald-800',
    pillBg: 'bg-emerald-50/90 hover:bg-white',
    pillBorder: 'border-emerald-200/70',
    pillShadow: 'shadow-[0_4px_16px_rgba(16,185,129,0.08)]',
  },
  afternoon_break: {
    id: 'afternoon_break',
    name: '午后小憩',
    tagline: '绿茶静谧 · 舒缓神经充能',
    isDark: false,
    bgClass: 'bg-afternoon-break',
    orb1Class: 'bg-teal-200/50',
    orb2Class: 'bg-emerald-200/40',
    orb3Class: 'bg-sky-200/30',
    textPrimary: 'text-teal-950',
    textSecondary: 'text-teal-700/80',
    accentColor: 'text-teal-600',
    accentBadgeBg: 'bg-teal-100/90',
    accentBadgeText: 'text-teal-800',
    pillBg: 'bg-teal-50/90 hover:bg-white',
    pillBorder: 'border-teal-200/70',
    pillShadow: 'shadow-[0_4px_16px_rgba(13,148,136,0.08)]',
  },
  evening_review: {
    id: 'evening_review',
    name: '暮色复盘',
    tagline: '暮光落日 · 沉淀成就洞察',
    isDark: false,
    bgClass: 'bg-evening-review',
    orb1Class: 'bg-indigo-300/40',
    orb2Class: 'bg-violet-200/50',
    orb3Class: 'bg-rose-200/35',
    textPrimary: 'text-indigo-950',
    textSecondary: 'text-indigo-700/80',
    accentColor: 'text-indigo-600',
    accentBadgeBg: 'bg-indigo-100/90',
    accentBadgeText: 'text-indigo-800',
    pillBg: 'bg-indigo-50/90 hover:bg-white',
    pillBorder: 'border-indigo-200/70',
    pillShadow: 'shadow-[0_4px_16px_rgba(99,102,241,0.08)]',
  },
  night_healing: {
    id: 'night_healing',
    name: '夜间疗愈',
    tagline: '曜夜星河 · 滤光安神入梦',
    isDark: true,
    bgClass: 'bg-night-healing',
    orb1Class: 'bg-indigo-950/60',
    orb2Class: 'bg-violet-950/50',
    orb3Class: 'bg-blue-950/45',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    accentColor: 'text-violet-400',
    accentBadgeBg: 'bg-violet-950/80',
    accentBadgeText: 'text-violet-300',
    pillBg: 'bg-slate-900/85 hover:bg-slate-800',
    pillBorder: 'border-white/10',
    pillShadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
  },
  active_energy: {
    id: 'active_energy',
    name: '活力运动',
    tagline: '高燃活力 · 多巴胺节拍迸发',
    isDark: false,
    bgClass: 'bg-active-energy',
    orb1Class: 'bg-rose-300/45',
    orb2Class: 'bg-orange-300/40',
    orb3Class: 'bg-amber-200/40',
    textPrimary: 'text-rose-950',
    textSecondary: 'text-rose-700/80',
    accentColor: 'text-rose-600',
    accentBadgeBg: 'bg-rose-100/90',
    accentBadgeText: 'text-rose-800',
    pillBg: 'bg-rose-50/90 hover:bg-white',
    pillBorder: 'border-rose-200/70',
    pillShadow: 'shadow-[0_4px_16px_rgba(244,63,94,0.08)]',
  },
};

export function getContextTheme(context: ContextType): ContextTheme {
  return CONTEXT_THEMES[context] || CONTEXT_THEMES.deep_work;
}
