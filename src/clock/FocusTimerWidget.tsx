import React from 'react';
import { motion } from 'motion/react';
import { SubCategory } from '../types';
import { formatSeconds } from '../services/utils';

interface FocusTimerWidgetProps {
  seconds: number;
  isDarkMode: boolean;
  subCategory: SubCategory;
  isRunning: boolean;
}

export const FocusTimerWidget: React.FC<FocusTimerWidgetProps> = ({ seconds, isDarkMode, subCategory, isRunning }) => {
  const ringColor = subCategory === 'focus' ? '#10b981' : '#0ea5e9';
  const label = subCategory === 'focus' ? 'FOCUS TIME' : 'COUNTDOWN';

  return (
    <div className="relative z-10">
      {subCategory !== 'timer' && <div className="stopwatch-button-top left-1/2 -translate-x-1/2 z-0"></div>}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-12 h-32 flex flex-col gap-2 z-0">
        {[1,2,3,4].map(i => <div key={i} className="flex-1 bg-slate-200 rounded-l-xl shadow-md border-r border-white/20"></div>)}
      </div>
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-12 h-32 flex flex-col gap-2 z-0">
        {[1,2,3,4].map(i => <div key={i} className="flex-1 bg-slate-200 rounded-r-xl shadow-md border-l border-white/20"></div>)}
      </div>

      <motion.div 
        animate={{ 
          scale: isRunning ? [1, 1.02, 1] : 1,
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={`${isDarkMode ? 'stopwatch-outer-dark' : 'stopwatch-outer'} w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] xl:w-[520px] xl:h-[520px] p-6 ${
          subCategory === 'timer' ? 'rounded-[4rem] rotate-0' : 'rounded-full'
        }`}
        style={{ 
          '--ring-color': ringColor,
          clipPath: subCategory === 'timer' ? 'polygon(0% 0%, 100% 0%, 80% 50%, 100% 100%, 0% 100%, 20% 50%)' : 'none'
        } as React.CSSProperties}
      >
        <div className={`${isDarkMode ? 'stopwatch-inner-dark' : 'stopwatch-inner'} w-full h-full p-10 ${
          subCategory === 'timer' ? 'rounded-[3rem]' : 'rounded-full'
        }`}>
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {[...Array(60)].map((_, i) => (
              <div 
                key={i} 
                className={`absolute left-1/2 top-1/2 w-0.5 ${i % 5 === 0 ? (isDarkMode ? 'bg-slate-500' : 'bg-slate-400') : (isDarkMode ? 'bg-slate-700' : 'bg-slate-200')}`}
                style={{ 
                  height: i % 5 === 0 ? '16px' : '8px',
                  transform: `translate(-50%, -50%) rotate(${i * 6}deg) translateY(-160px)` 
                }}
              ></div>
            ))}
          </div>

          <div className={`absolute top-20 text-[10px] font-black tracking-[0.4em] uppercase bg-opacity-10 px-4 py-1 rounded-full shadow-sm border ${
            subCategory === 'focus' ? 'text-emerald-500 bg-emerald-500 border-emerald-500/20' : 'text-sky-500 bg-sky-500 border-sky-500/20'
          }`}>
            {label}
          </div>

          <div className={`text-6xl md:text-7xl xl:text-9xl font-mono font-black tracking-tighter z-10 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            {formatSeconds(seconds)}
          </div>

          {/* Playful Second Hand */}
          <motion.div 
            className={`absolute w-1 h-[140px] rounded-full origin-bottom top-[calc(50%-140px)] left-[calc(50%-2px)] ${
              subCategory === 'focus' ? 'bg-emerald-500' : 'bg-sky-500'
            }`}
            animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-inherit shadow-lg" />
          </motion.div>

          <div className={`absolute inset-10 border-[16px] rounded-full ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}></div>
          <motion.div 
            className={`absolute inset-10 border-[16px] rounded-full ${
              subCategory === 'focus' ? 'border-emerald-500' : 'border-sky-500'
            }`}
            style={{ clipPath: 'inset(0 0 0 0)' }}
            animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
};
