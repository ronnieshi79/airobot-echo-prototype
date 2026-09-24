import { FESTIVALS, SOLAR_TERMS, WEATHER_MOCKS } from '../constants';
import { WeatherInfo } from '../types';

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

export function formatSeconds(s: number) {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
