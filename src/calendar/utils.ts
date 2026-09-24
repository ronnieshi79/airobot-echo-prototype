import { ScheduleItem } from '../types';

export const FESTIVALS: Record<string, string> = {
  '1-1': '元旦',
  '2-14': '情人节',
  '3-8': '妇女节',
  '3-12': '植树节',
  '5-1': '劳动节',
  '5-4': '青年节',
  '6-1': '儿童节',
  '8-1': '建军节',
  '9-10': '教师节',
  '10-1': '国庆节',
  '12-24': '平安夜',
  '12-25': '圣诞节',
};

export const SOLAR_TERMS: Record<string, string> = {
  '2-3': '立春',
  '2-18': '雨水',
  '3-5': '惊蛰',
  '3-20': '春分',
  '4-4': '清明',
  '4-19': '谷雨',
  '5-5': '立夏',
  '5-20': '小满',
  '6-5': '芒种',
  '6-21': '夏至',
  '7-6': '小暑',
  '7-22': '大暑',
  '8-7': '立秋',
  '8-22': '处暑',
  '9-7': '白露',
  '9-22': '秋分',
  '10-8': '寒露',
  '10-23': '霜降',
  '11-7': '立冬',
  '11-22': '小雪',
  '12-6': '大雪',
  '12-21': '冬至',
  '1-5': '小寒',
  '1-20': '大寒',
};

export const WEATHER_MOCKS = [
  { temp: '12°C', condition: '晴朗', icon: '☀️', advice: '阳光明媚，紫外线较强。建议穿单层长袖或薄外套，出门记得涂抹防晒霜并佩戴墨镜。' },
  { temp: '8°C', condition: '多云', icon: '☁️', advice: '云层较厚，气温适中。建议穿针织衫加防风外套，适合户外散步或慢跑。' },
  { temp: '5°C', condition: '小雨', icon: '🌧️', advice: '有降水概率，体感湿冷。建议穿防水外套或带伞，注意保暖，路面湿滑请小心慢行。' },
  { temp: '15°C', condition: '微风', icon: '🍃', advice: '春风拂面，非常舒适。建议穿轻薄透气的春装，适合开窗通风或进行户外踏青。' },
];

/**
 * 格式化本地日期为 YYYY-MM-DD
 */
export const getLocalDateString = (d: Date): string => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * 获取指定日期的 ISO 周数
 */
export const getWeekNumber = (d: Date): number => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

/**
 * 获取相对日期的自然语言标签 (今天、明天、昨天、N天后/前)
 */
export const getRelativeDaysLabel = (target: Date, base: Date): string => {
  const t1 = new Date(base.getFullYear(), base.getMonth(), base.getDate()).getTime();
  const t2 = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const diffDays = Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '明天';
  if (diffDays === -1) return '昨天';
  if (diffDays > 0) return `${diffDays}天后`;
  return `${Math.abs(diffDays)}天前`;
};

/**
 * 判断日程项在指定日期是否生效（兼容单日、每年重复、节日、生日、纪念日、星期循环）
 */
export const isScheduleOnDate = (schedule: ScheduleItem, targetDate: Date): boolean => {
  const targetStr = getLocalDateString(targetDate);
  const targetMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
  const targetDay = String(targetDate.getDate()).padStart(2, '0');
  const targetMonthDay = `${targetMonth}-${targetDay}`;

  // 每年重复或特殊节日/生日/纪念日
  if (
    schedule.repeat === 'yearly' ||
    schedule.type === 'festival' ||
    schedule.type === 'birthday' ||
    schedule.type === 'anniversary'
  ) {
    if (schedule.date) {
      const parts = schedule.date.split('-');
      if (parts.length === 3) {
        return `${parts[1]}-${parts[2]}` === targetMonthDay;
      } else if (parts.length === 2) {
        return schedule.date === targetMonthDay;
      }
    }
  }

  // 精确单日匹配
  if (schedule.date) {
    return schedule.date === targetStr;
  }

  // 星期循环匹配
  if (schedule.dayOfWeek !== undefined) {
    return schedule.dayOfWeek === targetDate.getDay();
  }

  return false;
};

/**
 * 获取指定日期的综合农历、节气、节日、宜忌及天气状况信息
 */
export const getTodayInfo = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const key = `${month}-${day}`;
  
  const festival = FESTIVALS[key];
  const solarTerm = SOLAR_TERMS[key];
  const weather = WEATHER_MOCKS[day % WEATHER_MOCKS.length];
  
  // 稳定模拟农历推算
  const LUNAR_MOCKS = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
  const LUNAR_MONTHS = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
  const hash = day + month * 31;
  const lunarMonth = LUNAR_MONTHS[month % 12];
  const lunarDay = LUNAR_MOCKS[hash % 30];
  const lunarDate = `农历${lunarMonth}月${lunarDay}`;
  
  const adviceList = [
    "今天是高效工作的好时机，保持专注！",
    "记得多喝水，保持身体水分充足。",
    "适合学习新技能，哪怕只是10分钟。",
    "给家人或朋友打个电话吧，分享你的快乐。",
    "晚上早点休息，保证充足的睡眠。",
    "保持微笑，好运会伴随你一整天！"
  ];

  const YI_LIST = ["沐浴 理发 会亲友", "出行 祈福 交易", "修造 动土 纳财", "祭祀 祈福 求嗣", "嫁娶 纳采 出行", "安机械 破土 纳财"];
  const JI_LIST = ["开市 入宅 动土", "安葬 伐木 作灶", "置产 嫁娶 移徙", "词讼 针灸 破土", "开仓 出货 探病", "行舟 掘井 动土"];

  return {
    festival,
    solarTerm,
    weather,
    lunarDate,
    yi: YI_LIST[hash % YI_LIST.length],
    ji: JI_LIST[hash % JI_LIST.length],
    aiAdvice: adviceList[day % adviceList.length]
  };
};
