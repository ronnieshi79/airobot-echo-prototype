import { WeatherInfo, ScheduleItem } from './types';

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

export const WEATHER_MOCKS: WeatherInfo[] = [
  { temp: '22°C', condition: '晴朗', icon: '☀️', advice: '阳光明媚，适合户外活动，记得涂防晒哦！' },
  { temp: '18°C', condition: '多云', icon: '☁️', advice: '云层较厚，气温略低，出门记得加件外套。' },
  { temp: '15°C', condition: '小雨', icon: '🌧️', advice: '细雨蒙蒙，路面湿滑，出门请带好雨具，注意保暖。' },
  { temp: '25°C', condition: '晴', icon: '☀️', advice: '天寒地冻，注意防寒保暖，多喝热水。' },
];

export const MOCK_WEATHER = WEATHER_MOCKS[0];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  { id: '1', title: '早起冥想', task: '早起冥想', time: '07:00', completed: true, category: 'health', dayOfWeek: 1 },
  { id: '2', title: '核心团队会议', task: '核心团队会议', time: '10:00', completed: false, category: 'work', dayOfWeek: 1 },
  { id: '3', title: '产品设计评审', task: '产品设计评审', time: '14:30', completed: false, category: 'work', dayOfWeek: 1 },
  { id: '4', title: '健身房锻炼', task: '健身房锻炼', time: '18:00', completed: false, category: 'health', dayOfWeek: 1 },
  { id: '5', title: '阅读《AI未来》', task: '阅读《AI未来》', time: '21:00', completed: false, category: 'personal', dayOfWeek: 1 },
];

export function getTodayInfo(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const key = `${month}-${day}`;
  
  // Use date as seed for consistent mock weather
  const weatherIndex = (month + day) % WEATHER_MOCKS.length;
  const weather = WEATHER_MOCKS[weatherIndex];
  
  let aiAdvice = weather.advice;
  const festival = FESTIVALS[key];
  const solarTerm = SOLAR_TERMS[key];
  
  if (festival === '春节') {
    aiAdvice = "大年初一头一天！穿新衣，戴新帽，开开心心去拜年，记得多吃饺子哦！";
  } else if (festival === '儿童节') {
    aiAdvice = "今天是属于你的节日！尽情玩耍吧，保持童心，快乐无敌！";
  } else if (solarTerm === '清明') {
    aiAdvice = "清明时节雨纷纷，适合静心缅怀，也可以去郊外踏青感受春意。";
  }

  return {
    festival: festival || null,
    solarTerm: solarTerm || null,
    weather,
    aiAdvice
  };
}
