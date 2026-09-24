import { ContextType } from '../context-slice/types';

export interface ContextTheme {
  id: ContextType;
  name: string;
  tagline: string;
  isDark: boolean;
  // Background gradient class
  bgClass: string;
  // Neutral ambient floating light orbs (low-saturation, executive atmosphere)
  orb1Class: string;
  orb2Class: string;
  orb3Class: string;
  // Executive neutral typography & accent styling
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
    tagline: '晨光微煦 · 暖灰亚麻与柔和初霁',
    isDark: false,
    bgClass: 'bg-morning-wake',
    orb1Class: 'bg-stone-300/30',
    orb2Class: 'bg-amber-100/25',
    orb3Class: 'bg-neutral-200/25',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-500',
    accentColor: 'text-stone-700',
    accentBadgeBg: 'bg-stone-100',
    accentBadgeText: 'text-stone-700',
    pillBg: 'bg-white/85 hover:bg-white',
    pillBorder: 'border-stone-200/90',
    pillShadow: 'shadow-[0_4px_18px_rgba(0,0,0,0.04)]',
  },
  deep_work: {
    id: 'deep_work',
    name: '深度工作',
    tagline: '心流工坊 · 极简冷灰与钛银沉浸',
    isDark: false,
    bgClass: 'bg-deep-work',
    orb1Class: 'bg-slate-300/35',
    orb2Class: 'bg-zinc-200/30',
    orb3Class: 'bg-slate-200/25',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    accentColor: 'text-slate-700',
    accentBadgeBg: 'bg-slate-100',
    accentBadgeText: 'text-slate-700',
    pillBg: 'bg-white/85 hover:bg-white',
    pillBorder: 'border-slate-200/90',
    pillShadow: 'shadow-[0_4px_18px_rgba(0,0,0,0.04)]',
  },
  afternoon_break: {
    id: 'afternoon_break',
    name: '午后小憩',
    tagline: '午后静谧 · 矿物灰绿与沉木减压',
    isDark: false,
    bgClass: 'bg-afternoon-break',
    orb1Class: 'bg-stone-300/30',
    orb2Class: 'bg-emerald-950/5',
    orb3Class: 'bg-neutral-200/30',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-500',
    accentColor: 'text-stone-700',
    accentBadgeBg: 'bg-stone-100',
    accentBadgeText: 'text-stone-700',
    pillBg: 'bg-white/85 hover:bg-white',
    pillBorder: 'border-stone-200/90',
    pillShadow: 'shadow-[0_4px_18px_rgba(0,0,0,0.04)]',
  },
  evening_review: {
    id: 'evening_review',
    name: '暮色复盘',
    tagline: '暮色沉淀 · 暖褐灰与烟熏石沉淀',
    isDark: false,
    bgClass: 'bg-evening-review',
    orb1Class: 'bg-stone-400/20',
    orb2Class: 'bg-zinc-300/25',
    orb3Class: 'bg-neutral-300/25',
    textPrimary: 'text-neutral-900',
    textSecondary: 'text-neutral-500',
    accentColor: 'text-neutral-700',
    accentBadgeBg: 'bg-neutral-100',
    accentBadgeText: 'text-neutral-700',
    pillBg: 'bg-white/85 hover:bg-white',
    pillBorder: 'border-neutral-200/90',
    pillShadow: 'shadow-[0_4px_18px_rgba(0,0,0,0.04)]',
  },
  night_healing: {
    id: 'night_healing',
    name: '夜间疗愈',
    tagline: '曜石凝夜 · 哑光黑钛与极低光阻',
    isDark: true,
    bgClass: 'bg-night-healing',
    orb1Class: 'bg-slate-800/30',
    orb2Class: 'bg-zinc-800/25',
    orb3Class: 'bg-stone-900/35',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400',
    accentColor: 'text-zinc-300',
    accentBadgeBg: 'bg-zinc-800/80',
    accentBadgeText: 'text-zinc-300',
    pillBg: 'bg-zinc-900/90 hover:bg-zinc-850',
    pillBorder: 'border-white/10',
    pillShadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
  },
  active_energy: {
    id: 'active_energy',
    name: '活力运动',
    tagline: '高效节律 · 铂金灰与动能碳纤维',
    isDark: false,
    bgClass: 'bg-active-energy',
    orb1Class: 'bg-zinc-300/30',
    orb2Class: 'bg-slate-300/25',
    orb3Class: 'bg-stone-200/25',
    textPrimary: 'text-zinc-900',
    textSecondary: 'text-zinc-500',
    accentColor: 'text-zinc-700',
    accentBadgeBg: 'bg-zinc-100',
    accentBadgeText: 'text-zinc-700',
    pillBg: 'bg-white/85 hover:bg-white',
    pillBorder: 'border-zinc-200/90',
    pillShadow: 'shadow-[0_4px_18px_rgba(0,0,0,0.04)]',
  },
};

export function getContextTheme(context: ContextType): ContextTheme {
  return CONTEXT_THEMES[context] || CONTEXT_THEMES.deep_work;
}
