import { 
  ContextType, 
  ServiceSlice, 
  ContextComputationParams, 
  ContextComputationResult 
} from './types';

/**
 * Automatically detects current contextual period based on wall clock time
 */
export function detectAutoContext(now: Date): ContextType {
  const hour = now.getHours();
  if (hour >= 6 && hour < 9) return 'morning_wake';
  if (hour >= 9 && hour < 12) return 'deep_work';
  if (hour >= 12 && hour < 14) return 'afternoon_break';
  if (hour >= 14 && hour < 18) return 'deep_work';
  if (hour >= 18 && hour < 21) return 'evening_review';
  return 'night_healing';
}

function formatSec(s: number): string {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Extracts live dynamic service slices (running timers, active alarms, playing podcasts)
 * Dynamic slices always take top priority in user recommendation.
 */
export function computeDynamicLiveSlices(params: ContextComputationParams): ServiceSlice[] {
  const {
    alarms,
    ringingAlarmId,
    isFocusRunning,
    focusTime,
    isTimerRunning,
    timerSeconds,
    isPlaying,
    activeEpisode
  } = params;

  const liveSlices: ServiceSlice[] = [];

  // 1. Ringing Alarm
  if (ringingAlarmId) {
    const currentAlarm = alarms.find(a => a.id === ringingAlarmId) || alarms[0];
    liveSlices.push({
      id: 'dynamic-alarm-ringing',
      type: 'alarm',
      title: '闹钟正在响铃中！',
      description: `设定标签: ${currentAlarm?.label || '起床闹钟'} · 轻触卡片关闭或开启小睡`,
      iconType: 'alarm',
      badge: '响铃中',
      colorTheme: {
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        pillBg: 'bg-rose-50',
        pillText: 'text-rose-600',
      },
      subdial: {
        label: '响铃中',
        value: '响铃中!',
        subtext: currentAlarm?.label || '起床闹钟',
        dotColor: 'bg-rose-500',
      },
      isLiveDynamic: true,
      liveStatusText: '响铃中',
      targetOverlay: 'alarm',
      recommendedActionText: '闹钟卡片',
      recommendationReason: '闹钟正在响铃中，可直接语音吩咐关闭或开启稍后提醒'
    });
  }

  // 2. Active Focus (Pomodoro)
  if (isFocusRunning) {
    liveSlices.push({
      id: 'dynamic-focus-live',
      type: 'focus',
      title: '深度编码与番茄工作法心流',
      description: `当前沉浸专注进行中 · 剩余倒计时 ${formatSec(focusTime)}`,
      iconType: 'focus',
      badge: '专注中',
      colorTheme: {
        iconBg: 'bg-[#c5f2de]/80',
        iconColor: 'text-emerald-700',
        pillBg: 'bg-emerald-50',
        pillText: 'text-emerald-700',
      },
      subdial: {
        label: '专注心流',
        value: formatSec(focusTime),
        subtext: '心流进行',
        dotColor: 'bg-emerald-500',
      },
      isLiveDynamic: true,
      liveStatusText: formatSec(focusTime),
      targetOverlay: 'focus',
      recommendedActionText: '专注卡片',
      recommendationReason: `专注心流进行中，当前剩余 ${formatSec(focusTime)}，保持高效沉浸状态`
    });
  }

  // 3. Active Countdown Timer
  if (isTimerRunning) {
    liveSlices.push({
      id: 'dynamic-timer-live',
      type: 'timer',
      title: '倒计时计时器运行中',
      description: `计时器正在运行 · 剩余 ${formatSec(timerSeconds)}`,
      iconType: 'timer',
      badge: '计时中',
      colorTheme: {
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        pillBg: 'bg-amber-50',
        pillText: 'text-amber-600',
      },
      subdial: {
        label: '倒计时',
        value: formatSec(timerSeconds),
        subtext: '运行中',
        dotColor: 'bg-amber-500',
      },
      isLiveDynamic: true,
      liveStatusText: formatSec(timerSeconds),
      targetOverlay: 'timer',
      recommendedActionText: '计时卡片',
      recommendationReason: `计时器运行中，当前剩余 ${formatSec(timerSeconds)}`
    });
  }

  // 4. Playing Podcast Episode
  if (isPlaying && activeEpisode) {
    liveSlices.push({
      id: 'dynamic-podcast-live',
      type: 'podcast',
      title: activeEpisode.title,
      description: `AI 播客正在播放 · 已播放 ${activeEpisode.progress || 0}%`,
      iconType: 'podcast',
      badge: '播放中',
      colorTheme: {
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        pillBg: 'bg-violet-50',
        pillText: 'text-violet-600',
      },
      subdial: {
        label: 'AI 播客',
        value: `${activeEpisode.progress || 0}%`,
        subtext: '正在播放',
        waveform: true,
        dotColor: 'bg-violet-500',
      },
      isLiveDynamic: true,
      liveStatusText: '正在播放',
      targetOverlay: 'podcast',
      recommendedActionText: '播客卡片',
      recommendationReason: `正在播放《${activeEpisode.title}》，伴随知识与思考流动`
    });
  }

  return liveSlices;
}

function computeDeepWorkSlices(params: ContextComputationParams): ServiceSlice[] {
  const { schedules, todos, episodes, now, isFocusRunning, isTimerRunning } = params;
  const todayDayOfWeek = now.getDay();
  const todaySchedules = schedules.filter(s => s.dayOfWeek === todayDayOfWeek || !s.dayOfWeek);
  const pendingTodos = todos.filter(t => t.status === 'open');
  const firstPendingSchedule = todaySchedules.find(s => !s.completed);

  const slices: ServiceSlice[] = [];

  if (!isFocusRunning) {
    slices.push({
      id: 'deep-work-focus',
      type: 'focus',
      title: '深度编码与番茄工作法心流',
      description: '45分钟沉浸编码与架构推演，屏蔽打扰阻断上下文切换',
      iconType: 'timer',
      badge: '专注心流',
      colorTheme: {
        iconBg: 'bg-[#c5f2de]/70',
        iconColor: 'text-emerald-700',
        pillBg: 'bg-indigo-50/90',
        pillText: 'text-indigo-600',
      },
      subdial: {
        label: '专注心流',
        value: '45:00',
        subtext: '沉浸编码',
        dotColor: 'bg-emerald-500',
      },
      targetOverlay: 'focus',
      recommendedActionText: '专注卡片',
      recommendationReason: '午后干扰高峰，建议开启 45 分钟沉浸式编码番茄心流'
    });
  }

  slices.push({
    id: 'deep-work-schedule',
    type: 'calendar',
    title: firstPendingSchedule ? `${firstPendingSchedule.title || firstPendingSchedule.task} 与待办规划` : '下午评审会议与待办清点',
    description: firstPendingSchedule 
      ? `今日重点日程待推进 · 还有 ${pendingTodos.length} 项未完成待办事项` 
      : '下午评审会议与架构对齐，清晰排布时间块，避免拖延',
    iconType: 'calendar',
    badge: '日程安排',
    colorTheme: {
      iconBg: 'bg-amber-100/70',
      iconColor: 'text-amber-700',
      pillBg: 'bg-amber-50',
      pillText: 'text-amber-700',
    },
    subdial: {
      label: '今日日程',
      value: firstPendingSchedule?.time || '14:00',
      subtext: `${pendingTodos.length}项未结`,
      dotColor: 'bg-amber-500',
    },
    targetOverlay: 'planner',
    recommendedActionText: '日程卡片',
    recommendationReason: firstPendingSchedule 
      ? `即将进行的日程：${firstPendingSchedule.title || firstPendingSchedule.task}，建议确认规划` 
      : '下午评审会议即将开始，建议打开日程确认待办事项'
  });

  if (!isTimerRunning) {
    slices.push({
      id: 'deep-work-break-timer',
      type: 'timer',
      title: '拉伸与 5 分钟微冥想',
      description: '深度用脑后短歇激活脑力，深呼吸恢复认知带宽',
      iconType: 'timer',
      badge: '微休息',
      colorTheme: {
        iconBg: 'bg-cyan-100/70',
        iconColor: 'text-cyan-700',
        pillBg: 'bg-cyan-50',
        pillText: 'text-cyan-700',
      },
      subdial: {
        label: '微休息',
        value: '05:00',
        subtext: '拉伸冥想',
        dotColor: 'bg-cyan-500',
      },
      targetOverlay: 'timer',
      recommendedActionText: '计时卡片',
      recommendationReason: '保持长效工作节奏，每 45 分钟建议配合 5 分钟拉伸微休息'
    });
  }

  slices.push({
    id: 'deep-work-podcast',
    type: 'podcast',
    title: episodes[0]?.title || '科技架构与 AI 商业前沿',
    description: episodes[0]?.summary || '深度解构智能体系统工程演进，为当下架构设计汲取灵感',
    iconType: 'podcast',
    badge: 'AI播客',
    colorTheme: {
      iconBg: 'bg-violet-100/70',
      iconColor: 'text-violet-700',
      pillBg: 'bg-violet-50',
      pillText: 'text-violet-700',
    },
    subdial: {
      label: '前沿播客',
      value: '15:20',
      subtext: 'EP.01',
      waveform: true,
      dotColor: 'bg-violet-500',
    },
    targetOverlay: 'podcast',
    recommendedActionText: '播客卡片',
    recommendationReason: '收听最新订阅播客《AI时代的系统架构演进》，启发架构思考'
  });

  return slices;
}

function computeMorningWakeSlices(params: ContextComputationParams): ServiceSlice[] {
  const { schedules, todos, episodes, now } = params;
  const todayDayOfWeek = now.getDay();
  const todaySchedules = schedules.filter(s => s.dayOfWeek === todayDayOfWeek || !s.dayOfWeek);
  const pendingTodos = todos.filter(t => t.status === 'open');

  return [
    {
      id: 'morning-alarm',
      type: 'alarm',
      title: '晨曦轻柔唤醒与舒缓旋律',
      description: '07:30 预设自然晨鸣，以渐强音律唤醒身体机能',
      iconType: 'alarm',
      badge: '晨间闹钟',
      colorTheme: {
        iconBg: 'bg-amber-100/80',
        iconColor: 'text-amber-700',
        pillBg: 'bg-amber-50',
        pillText: 'text-amber-700',
      },
      subdial: {
        label: '晨间闹钟',
        value: '07:30',
        subtext: '轻柔唤醒',
        dotColor: 'bg-amber-500',
      },
      targetOverlay: 'alarm',
      recommendedActionText: '闹钟卡片',
      recommendationReason: '新的一天开始啦，温和晨光伴随渐强音律开启活力一天'
    },
    {
      id: 'morning-schedule',
      type: 'calendar',
      title: '今日全天日程与核心目标梳理',
      description: `今日有 ${todaySchedules.length} 项排期与 ${pendingTodos.length} 项待办，提前规划从容掌控`,
      iconType: 'calendar',
      badge: '日程规划',
      colorTheme: {
        iconBg: 'bg-emerald-100/80',
        iconColor: 'text-emerald-700',
        pillBg: 'bg-emerald-50',
        pillText: 'text-emerald-700',
      },
      subdial: {
        label: '全天排期',
        value: `${todaySchedules.length} 项`,
        subtext: `${pendingTodos.length}项待办`,
        dotColor: 'bg-emerald-500',
      },
      targetOverlay: 'planner',
      recommendedActionText: '日程卡片',
      recommendationReason: '建议先花 2 分钟查看今日日程清单，明确最重要的 3 件事'
    },
    {
      id: 'morning-podcast',
      type: 'podcast',
      title: episodes[1]?.title || '早间 AI 资讯与全球晨报',
      description: '10分钟晨间速览，快速洞察科技商业动态与热点脉搏',
      iconType: 'podcast',
      badge: '晨报早参',
      colorTheme: {
        iconBg: 'bg-blue-100/80',
        iconColor: 'text-blue-700',
        pillBg: 'bg-blue-50',
        pillText: 'text-blue-700',
      },
      subdial: {
        label: '晨报早参',
        value: '10:00',
        subtext: 'EP.02',
        waveform: true,
        dotColor: 'bg-blue-500',
      },
      targetOverlay: 'podcast',
      recommendedActionText: '播客卡片',
      recommendationReason: '洗漱用餐时间，不妨戴上耳机聆听 10 分钟晨间行业速报'
    },
    {
      id: 'morning-timer',
      type: 'timer',
      title: '10分钟晨间伸展与正念呼吸',
      description: '舒展肩颈与脊椎，深长呼吸唤醒全身微循环',
      iconType: 'timer',
      badge: '晨间伸展',
      colorTheme: {
        iconBg: 'bg-teal-100/80',
        iconColor: 'text-teal-700',
        pillBg: 'bg-teal-50',
        pillText: 'text-teal-700',
      },
      subdial: {
        label: '晨间伸展',
        value: '10:00',
        subtext: '正念呼吸',
        dotColor: 'bg-teal-500',
      },
      targetOverlay: 'timer',
      recommendedActionText: '计时卡片',
      recommendationReason: '开启 10 分钟晨间唤醒计时，激活身体代谢与清醒神经'
    }
  ];
}

function computeAfternoonBreakSlices(params: ContextComputationParams): ServiceSlice[] {
  const { schedules, now } = params;
  const todayDayOfWeek = now.getDay();
  const todaySchedules = schedules.filter(s => s.dayOfWeek === todayDayOfWeek || !s.dayOfWeek);

  return [
    {
      id: 'afternoon-timer',
      type: 'timer',
      title: '15分钟高效深睡能量小憩',
      description: '科学午睡时间阈值，快速补充精力且不产生睡眠迟钝',
      iconType: 'timer',
      badge: '午间能量',
      colorTheme: {
        iconBg: 'bg-[#c5f2de]/80',
        iconColor: 'text-emerald-700',
        pillBg: 'bg-emerald-50',
        pillText: 'text-emerald-700',
      },
      subdial: {
        label: '能量小憩',
        value: '15:00',
        subtext: '深睡充电',
        dotColor: 'bg-emerald-500',
      },
      targetOverlay: 'timer',
      recommendedActionText: '计时卡片',
      recommendationReason: '正值午后精力低谷，建议开启 15 分钟深度小憩恢复注意力'
    },
    {
      id: 'afternoon-podcast',
      type: 'podcast',
      title: '雨声与自然白噪音声景漫游',
      description: '林间小雨与舒缓低频声浪，有效屏蔽环境干扰助您入眠',
      iconType: 'podcast',
      badge: '助眠声景',
      colorTheme: {
        iconBg: 'bg-violet-100/80',
        iconColor: 'text-violet-700',
        pillBg: 'bg-violet-50',
        pillText: 'text-violet-700',
      },
      subdial: {
        label: '雨音声景',
        value: '30:00',
        subtext: '白噪音',
        waveform: true,
        dotColor: 'bg-violet-500',
      },
      targetOverlay: 'podcast',
      recommendedActionText: '播客卡片',
      recommendationReason: '搭配雨声白噪音小憩，让大脑神经得到彻底放松'
    },
    {
      id: 'afternoon-schedule',
      type: 'calendar',
      title: '下午重要日程与关键待办速览',
      description: `下午 14:00 起共有 ${todaySchedules.length} 项日程待完成，提前明晰要务`,
      iconType: 'calendar',
      badge: '待办速览',
      colorTheme: {
        iconBg: 'bg-amber-100/80',
        iconColor: 'text-amber-700',
        pillBg: 'bg-amber-50',
        pillText: 'text-amber-700',
      },
      subdial: {
        label: '下午要务',
        value: '14:00',
        subtext: `${todaySchedules.length}项日程`,
        dotColor: 'bg-amber-500',
      },
      targetOverlay: 'planner',
      recommendedActionText: '日程卡片',
      recommendationReason: '小憩醒来后，快速预览下午日程，有条不紊启动下半天工作'
    }
  ];
}

function computeEveningReviewSlices(params: ContextComputationParams): ServiceSlice[] {
  const { todos } = params;
  const pendingTodos = todos.filter(t => t.status === 'open');

  return [
    {
      id: 'evening-schedule',
      type: 'calendar',
      title: '今日日程达成与待办复盘',
      description: `今日已完成进度回顾 · 还剩 ${pendingTodos.length} 项待处理事项，沉淀成就感`,
      iconType: 'calendar',
      badge: '今日复盘',
      colorTheme: {
        iconBg: 'bg-indigo-100/80',
        iconColor: 'text-indigo-700',
        pillBg: 'bg-indigo-50',
        pillText: 'text-indigo-700',
      },
      subdial: {
        label: '今日复盘',
        value: `${todos.filter(t => t.status === 'closed').length}/${todos.length || 3} 达成`,
        subtext: '待办回顾',
        dotColor: 'bg-indigo-500',
      },
      targetOverlay: 'planner',
      recommendedActionText: '日程卡片',
      recommendationReason: '日落暮色渐浓，花 3 分钟复盘今日待办，收获满满成就感'
    },
    {
      id: 'evening-logbook',
      type: 'logbook',
      title: 'AI 记事本全天数据与专注洞察',
      description: '汇总今日番茄专注总时长、完成事项与情绪节奏，生成个人成长日报',
      iconType: 'logbook',
      badge: '成长洞察',
      colorTheme: {
        iconBg: 'bg-emerald-100/80',
        iconColor: 'text-emerald-700',
        pillBg: 'bg-emerald-50',
        pillText: 'text-emerald-700',
      },
      subdial: {
        label: 'AI 记事本',
        value: '135m',
        subtext: '专注洞察',
        dotColor: 'bg-emerald-500',
      },
      targetOverlay: 'logbook',
      recommendedActionText: '记事本卡片',
      recommendationReason: '查看今日 AI 记事本专注总时长与效率分析'
    },
    {
      id: 'evening-podcast',
      type: 'podcast',
      title: '晚风夜谈：科技与人文反思',
      description: '放下白天的快节奏编码，沉浸在思想碰撞与轻松对谈中',
      iconType: 'podcast',
      badge: '夜读播客',
      colorTheme: {
        iconBg: 'bg-rose-100/80',
        iconColor: 'text-rose-700',
        pillBg: 'bg-rose-50',
        pillText: 'text-rose-700',
      },
      subdial: {
        label: '晚风夜读',
        value: '18:40',
        subtext: 'EP.03',
        waveform: true,
        dotColor: 'bg-rose-500',
      },
      targetOverlay: 'podcast',
      recommendedActionText: '播客卡片',
      recommendationReason: '在晚风中享受轻松对谈播客，卸去整日紧张与疲惫'
    }
  ];
}

function computeNightHealingSlices(): ServiceSlice[] {
  return [
    {
      id: 'night-alarm',
      type: 'alarm',
      title: '明日晨起智能闹钟预设',
      description: '建议预设 07:30 闹钟，确保充足 8 小时高质量深睡眠周期',
      iconType: 'alarm',
      badge: '明日唤醒',
      colorTheme: {
        iconBg: 'bg-amber-100/80',
        iconColor: 'text-amber-700',
        pillBg: 'bg-amber-50',
        pillText: 'text-amber-700',
      },
      subdial: {
        label: '明日唤醒',
        value: '07:30',
        subtext: '8h深睡眠',
        dotColor: 'bg-amber-500',
      },
      targetOverlay: 'alarm',
      recommendedActionText: '闹钟卡片',
      recommendationReason: '夜已深，已为你准备好明日晨起闹钟，安心入睡吧'
    },
    {
      id: 'night-podcast',
      type: 'podcast',
      title: '睡前冥想与沉浸晚安故事',
      description: '温柔轻语、脑波助眠引导，引导身心彻底平缓进入梦乡',
      iconType: 'podcast',
      badge: '晚安电台',
      colorTheme: {
        iconBg: 'bg-violet-100/80',
        iconColor: 'text-violet-700',
        pillBg: 'bg-violet-50',
        pillText: 'text-violet-700',
      },
      subdial: {
        label: '晚安电台',
        value: '25:00',
        subtext: '助眠故事',
        waveform: true,
        dotColor: 'bg-violet-500',
      },
      targetOverlay: 'podcast',
      recommendedActionText: '播客卡片',
      recommendationReason: '开启睡前沉浸助眠播客，让温暖声线陪伴安然入睡'
    },
    {
      id: 'night-timer',
      type: 'timer',
      title: '睡前放下手机倒计时 (20分钟)',
      description: '倒计时阻断蓝光刺激，静心阅读或伸展，改善褪黑素分泌',
      iconType: 'timer',
      badge: '远离屏幕',
      colorTheme: {
        iconBg: 'bg-blue-100/80',
        iconColor: 'text-blue-700',
        pillBg: 'bg-blue-50',
        pillText: 'text-blue-700',
      },
      subdial: {
        label: '远离屏幕',
        value: '20:00',
        subtext: '睡前防蓝光',
        dotColor: 'bg-blue-500',
      },
      targetOverlay: 'timer',
      recommendedActionText: '计时卡片',
      recommendationReason: '开启 20 分钟睡前放下手机倒计时，给大脑营造优质睡眠准备'
    }
  ];
}

function computeActiveEnergySlices(): ServiceSlice[] {
  return [
    {
      id: 'active-timer',
      type: 'timer',
      title: 'HIIT 间歇训练与运动计时',
      description: '高强度间歇循环，蜂鸣提示间歇时间，精准掌控运动负荷',
      iconType: 'timer',
      badge: '间歇计时',
      colorTheme: {
        iconBg: 'bg-rose-100/80',
        iconColor: 'text-rose-700',
        pillBg: 'bg-rose-50',
        pillText: 'text-rose-700',
      },
      subdial: {
        label: '间歇计时',
        value: '30:00',
        subtext: 'HIIT高燃',
        dotColor: 'bg-rose-500',
      },
      targetOverlay: 'timer',
      recommendedActionText: '计时卡片',
      recommendationReason: '运动时间到！开启 HIIT 间歇训练计时器激发多巴胺'
    },
    {
      id: 'active-podcast',
      type: 'podcast',
      title: '动感节奏与运动伴随音频',
      description: '高燃节奏节拍驱动步伐，让体能训练充满澎湃动力',
      iconType: 'podcast',
      badge: '燃脂节奏',
      colorTheme: {
        iconBg: 'bg-orange-100/80',
        iconColor: 'text-orange-700',
        pillBg: 'bg-orange-50',
        pillText: 'text-orange-700',
      },
      subdial: {
        label: '燃脂节拍',
        value: '130 BPM',
        subtext: '动感节奏',
        waveform: true,
        dotColor: 'bg-orange-500',
      },
      targetOverlay: 'podcast',
      recommendedActionText: '播客卡片',
      recommendationReason: '运动时戴上耳机，让节奏播客助你突破运动瓶颈'
    },
    {
      id: 'active-schedule',
      type: 'calendar',
      title: '每周运动目标与打卡排期',
      description: '记录今日运动打卡与饮水进度，达成健康习惯闭环',
      iconType: 'calendar',
      badge: '健康打卡',
      colorTheme: {
        iconBg: 'bg-emerald-100/80',
        iconColor: 'text-emerald-700',
        pillBg: 'bg-emerald-50',
        pillText: 'text-emerald-700',
      },
      subdial: {
        label: '运动打卡',
        value: '3/5 天',
        subtext: '健康闭环',
        dotColor: 'bg-emerald-500',
      },
      targetOverlay: 'planner',
      recommendedActionText: '日程卡片',
      recommendationReason: '完成运动后，记得在日程中打卡记录运动成果'
    }
  ];
}

/**
 * Computes context and generates prioritized service slices.
 */
export function computeContextSlices(params: ContextComputationParams): ContextComputationResult {
  const dynamicSlices = computeDynamicLiveSlices(params);
  let presetSlices: ServiceSlice[] = [];

  switch (params.context) {
    case 'deep_work':
      presetSlices = computeDeepWorkSlices(params);
      break;
    case 'morning_wake':
      presetSlices = computeMorningWakeSlices(params);
      break;
    case 'afternoon_break':
      presetSlices = computeAfternoonBreakSlices(params);
      break;
    case 'evening_review':
      presetSlices = computeEveningReviewSlices(params);
      break;
    case 'night_healing':
      presetSlices = computeNightHealingSlices();
      break;
    case 'active_energy':
      presetSlices = computeActiveEnergySlices();
      break;
  }

  const activeOverlayTargets = new Set(dynamicSlices.map(s => s.targetOverlay));
  const filteredPresets = presetSlices.filter(s => !activeOverlayTargets.has(s.targetOverlay));

  const allSlices = [...dynamicSlices, ...filteredPresets];
  const primarySlice = allSlices[0];

  return {
    context: params.context,
    slices: allSlices,
    primaryReason: primarySlice?.recommendationReason || '基于当前情境，为你推荐最适合的服务',
    primaryAction: primarySlice?.recommendedActionText || '查看卡片',
    activeLiveSlice: dynamicSlices[0]
  };
}
