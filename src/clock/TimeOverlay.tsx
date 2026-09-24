import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, X, Power, Minimize2, Brain, Hourglass } from 'lucide-react';

import { PresetItem } from '../types';

interface TimeOverlayProps {
  show: boolean;
  subCategory: 'focus' | 'timer';
  timerSeconds: number;
  totalSeconds: number;
  isTimerRunning: boolean;
  onTimerStart: () => void;
  onTimerPause: () => void;
  onTimerReset: () => void;
  onClose: () => void;
  isDarkMode: boolean;
  activePreset?: PresetItem;
}

export const TimeOverlay: React.FC<TimeOverlayProps> = ({
  show,
  subCategory,
  timerSeconds,
  totalSeconds,
  isTimerRunning,
  onTimerStart,
  onTimerPause,
  onTimerReset,
  onClose,
  isDarkMode,
  activePreset,
}) => {
  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // For focus mode, if it's running and not finished, hide controls
  const isFocusLocked = subCategory === 'focus' && isTimerRunning && timerSeconds > 0;
  const progress = totalSeconds > 0 ? (totalSeconds - timerSeconds) / totalSeconds : 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden"
        >
          <div className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-black/40' : 'bg-slate-900/20'}`} onClick={() => !isTimerRunning && onClose()} />
          
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative group"
            >
              {/* Mechanical Control Panel (Right Side) */}
              <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                {/* Start/Pause Button (Top Right) */}
                <motion.button
                  whileHover={!isFocusLocked ? { x: -4 } : {}}
                  whileTap={!isFocusLocked ? { x: 2 } : {}}
                  onClick={() => !isFocusLocked && (isTimerRunning ? onTimerPause : onTimerStart())}
                  className={`w-14 h-24 rounded-tr-2xl border-t-2 border-r-2 shadow-[6px_0_15px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-2 transition-opacity ${
                    isDarkMode ? 'bg-slate-700 border-white/10 text-slate-400' : 'bg-slate-200 border-black/10 text-slate-600'
                  } ${isFocusLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isTimerRunning ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                  <div className="flex flex-col gap-1 mt-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-8 h-[2px] rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} />
                    ))}
                  </div>
                </motion.button>

                {/* Minimize Button (Bottom Right) */}
                <motion.button
                  whileHover={!isFocusLocked ? { x: -4 } : {}}
                  whileTap={!isFocusLocked ? { x: 2 } : {}}
                  onClick={() => !isFocusLocked && onClose()}
                  className={`w-14 h-16 rounded-br-2xl border-b-2 border-r-2 shadow-[6px_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center transition-opacity ${
                    isDarkMode ? 'bg-slate-800 border-white/10 text-slate-500' : 'bg-white border-black/10 text-slate-400'
                  } ${isFocusLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Minimize2 size={22} />
                </motion.button>
              </div>

              {/* Exit/Stop Button (Top) */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <motion.button
                  whileHover={!isFocusLocked ? { y: 3 } : {}}
                  whileTap={!isFocusLocked ? { y: 6 } : {}}
                  onClick={() => {
                    if (isFocusLocked) return;
                    onTimerPause();
                    onTimerReset();
                    onClose();
                  }}
                  className={`w-16 h-10 rounded-t-2xl border-x-2 border-t-2 shadow-lg flex items-center justify-center transition-opacity ${
                    isDarkMode ? 'bg-slate-800 border-white/10 text-red-500/80' : 'bg-slate-100 border-black/10 text-red-500'
                  } ${isFocusLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Power size={18} strokeWidth={3} />
                </motion.button>
              </div>

              {/* Mechanical Decorative Ears (Top Left/Right) */}
              <div className="absolute -top-12 left-12 w-24 h-16 pointer-events-none">
                <motion.div 
                  animate={isTimerRunning ? { 
                    rotate: subCategory === 'timer' ? [-5, 5, -5] : [-5, 5, -5],
                    y: subCategory === 'timer' ? [0, 2, 0] : 0,
                    scale: subCategory === 'focus' ? [1, 1.05, 1] : 1
                  } : {}}
                  transition={{ repeat: Infinity, duration: subCategory === 'timer' ? 1 : 3, ease: "easeInOut" }}
                  className={`w-full h-full relative shadow-lg ${
                    subCategory === 'focus' 
                      ? 'rounded-full blur-[1px]' // Organic brain-like lobe
                      : 'rounded-xl' // Hourglass frame
                  } border-t-4 border-x-4 ${
                    subCategory === 'focus' 
                      ? (isDarkMode ? 'bg-gradient-to-br from-indigo-500/40 to-indigo-800/60 border-indigo-400/30' : 'bg-gradient-to-br from-indigo-300 to-indigo-100 border-indigo-200')
                      : (isDarkMode ? 'bg-gradient-to-b from-slate-500 to-slate-700 border-slate-600' : 'bg-gradient-to-b from-slate-300 to-slate-100 border-slate-400')
                  }`}
                >
                  {/* Hourglass Sand Effect */}
                  {subCategory === 'timer' && (
                    <div className="absolute inset-2 flex flex-col items-center justify-between py-1">
                      <motion.div 
                        animate={isTimerRunning ? { scaleY: [1, 0.5, 1], opacity: [0.8, 0.4, 0.8] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-8 h-4 rounded-t-full ${isDarkMode ? 'bg-cyan-400/40' : 'bg-cyan-500/40'}`} 
                      />
                      <div className={`w-1 h-2 ${isDarkMode ? 'bg-cyan-400/20' : 'bg-cyan-500/20'}`} />
                      <motion.div 
                        animate={isTimerRunning ? { scaleY: [0.5, 1, 0.5], opacity: [0.4, 0.8, 0.4] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-8 h-4 rounded-b-full ${isDarkMode ? 'bg-cyan-400/40' : 'bg-cyan-500/40'}`} 
                      />
                    </div>
                  )}
                  {/* Focus Glow */}
                  {subCategory === 'focus' && isTimerRunning && (
                    <motion.div 
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-indigo-400/30 blur-md"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {subCategory === 'focus' ? <Brain size={24} /> : <Hourglass size={24} />}
                  </div>
                </motion.div>
              </div>

              <div className="absolute -top-12 right-12 w-24 h-16 pointer-events-none">
                <motion.div 
                  animate={isTimerRunning ? { 
                    rotate: subCategory === 'timer' ? [5, -5, 5] : [5, -5, 5],
                    y: subCategory === 'timer' ? [0, 2, 0] : 0,
                    scale: subCategory === 'focus' ? [1, 1.05, 1] : 1
                  } : {}}
                  transition={{ repeat: Infinity, duration: subCategory === 'timer' ? 1 : 3, ease: "easeInOut" }}
                  className={`w-full h-full relative shadow-lg ${
                    subCategory === 'focus' 
                      ? 'rounded-full blur-[1px]' 
                      : 'rounded-xl'
                  } border-t-4 border-x-4 ${
                    subCategory === 'focus' 
                      ? (isDarkMode ? 'bg-gradient-to-br from-indigo-500/40 to-indigo-800/60 border-indigo-400/30' : 'bg-gradient-to-br from-indigo-300 to-indigo-100 border-indigo-200')
                      : (isDarkMode ? 'bg-gradient-to-b from-slate-500 to-slate-700 border-slate-600' : 'bg-gradient-to-b from-slate-300 to-slate-100 border-slate-400')
                  }`}
                >
                  {subCategory === 'timer' && (
                    <div className="absolute inset-2 flex flex-col items-center justify-between py-1">
                      <motion.div 
                        animate={isTimerRunning ? { scaleY: [1, 0.5, 1], opacity: [0.8, 0.4, 0.8] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-8 h-4 rounded-t-full ${isDarkMode ? 'bg-cyan-400/40' : 'bg-cyan-500/40'}`} 
                      />
                      <div className={`w-1 h-2 ${isDarkMode ? 'bg-cyan-400/20' : 'bg-cyan-500/20'}`} />
                      <motion.div 
                        animate={isTimerRunning ? { scaleY: [0.5, 1, 0.5], opacity: [0.4, 0.8, 0.4] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-8 h-4 rounded-b-full ${isDarkMode ? 'bg-cyan-400/40' : 'bg-cyan-500/40'}`} 
                      />
                    </div>
                  )}
                  {subCategory === 'focus' && isTimerRunning && (
                    <motion.div 
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-indigo-400/30 blur-md"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {subCategory === 'focus' ? <Brain size={24} /> : <Hourglass size={24} />}
                  </div>
                </motion.div>
              </div>

              {/* Main Clock Face (Skeuomorphic Bezel) */}
              <div className={`relative w-[32rem] h-[32rem] rounded-full p-5 shadow-[0_40px_80px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(255,255,255,0.5)] ${
                subCategory === 'focus' 
                  ? (isDarkMode ? 'bg-gradient-to-br from-slate-800 to-black' : 'bg-gradient-to-br from-slate-200 to-slate-400')
                  : (isDarkMode ? 'bg-gradient-to-br from-cyan-800 to-blue-900' : 'bg-gradient-to-br from-cyan-100 to-blue-200')
              }`}>
                <div className={`relative w-full h-full rounded-full ${
                  subCategory === 'focus'
                    ? (isDarkMode ? 'bg-black' : 'bg-slate-100')
                    : (isDarkMode ? 'bg-slate-900' : 'bg-white')
                } shadow-[inset_0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center overflow-hidden`}>
                  
                  {/* Decorative Inner Rings */}
                  {subCategory === 'focus' && (
                    <>
                      <div className={`absolute inset-4 rounded-full border border-dashed ${isDarkMode ? 'border-indigo-400/20' : 'border-indigo-500/20'} pointer-events-none`} />
                      <div className={`absolute inset-12 rounded-full border ${isDarkMode ? 'border-white/5' : 'border-black/5'}`} />
                      
                      {/* Proportional Rotating Dot */}
                      <motion.div
                        animate={{ rotate: progress * 360 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-4 rounded-full pointer-events-none"
                      >
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-500'} shadow-[0_0_10px_rgba(129,140,248,0.8)]`} />
                      </motion.div>

                      {/* Scenario-specific Focus Effects */}
                      {isTimerRunning && (
                        <>
                          {/* Default Breathing */}
                          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.1, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 rounded-full bg-indigo-500/20 pointer-events-none" />
                          
                          {/* Coding: Matrix-like falling particles */}
                          {activePreset?.label?.includes('编码') && (
                            <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
                              {[...Array(10)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ y: -20, x: Math.random() * 200 - 100, opacity: 0 }}
                                  animate={{ y: 200, opacity: [0, 1, 0] }}
                                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                                  className="absolute text-[8px] font-mono text-green-500"
                                >
                                  {Math.random() > 0.5 ? '1' : '0'}
                                </motion.div>
                              ))}
                            </div>
                          )}

                          {/* Reading: Soft page-turning pulse */}
                          {activePreset?.label?.includes('阅读') && (
                            <motion.div 
                              animate={{ rotateY: [0, 45, 0], opacity: [0.2, 0.5, 0.2] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-8 border-l-2 border-white/20 pointer-events-none"
                            />
                          )}

                          {/* Meditation: Expanding Zen rings */}
                          {activePreset?.label?.includes('冥想') && (
                            [...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ scale: [0.8, 1.5], opacity: [0.6, 0] }}
                                transition={{ duration: 5, repeat: Infinity, delay: i * 1.6, ease: "linear" }}
                                className="absolute inset-0 border border-white/20 rounded-full pointer-events-none"
                              />
                            ))
                          )}
                        </>
                      )}
                    </>
                  )}
                  {subCategory === 'timer' && (
                    <>
                      <div className={`absolute inset-4 rounded-full border-[4px] border-dashed ${isDarkMode ? 'border-cyan-500/10' : 'border-cyan-500/10'} pointer-events-none`} />
                      
                      {/* Proportional Rotating Dot for Timer */}
                      <motion.div
                        animate={{ rotate: progress * 360 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-4 rounded-full pointer-events-none"
                      >
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${isDarkMode ? 'bg-cyan-400' : 'bg-cyan-500'} shadow-[0_0_12px_rgba(6,182,212,0.8)] border-2 ${isDarkMode ? 'border-slate-900' : 'border-white'}`} />
                      </motion.div>

                      <div className={`absolute inset-12 rounded-full border ${isDarkMode ? 'border-white/5' : 'border-black/5'}`} />
                    </>
                  )}
                  
                  {/* Progress Ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 p-8">
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke={isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeWidth="20" />
                    <motion.circle
                      cx="50%" cy="50%" r="45%" fill="none"
                      stroke={subCategory === 'focus' ? '#818CF8' : '#06B6D4'}
                      strokeWidth="20" strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: progress }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </svg>

                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                      animate={isTimerRunning ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`text-8xl font-black tracking-tighter ${
                        subCategory === 'focus'
                          ? (isDarkMode ? 'text-white' : 'text-slate-800')
                          : (isDarkMode ? 'text-cyan-50' : 'text-slate-900')
                      }`}
                    >
                      {formatSeconds(timerSeconds)}
                    </motion.div>
                    <div className={`text-sm font-black uppercase tracking-[0.3em] mt-6 opacity-40 ${
                      subCategory === 'focus'
                        ? (isDarkMode ? 'text-slate-400' : 'text-slate-600')
                        : (isDarkMode ? 'text-cyan-200' : 'text-slate-500')
                    }`}>
                      {activePreset ? activePreset.label : (subCategory === 'focus' ? '排除干扰，专注当下一刻' : '倒计时')}
                    </div>
                    {activePreset && (
                      <div className={`text-[10px] font-bold mt-2 opacity-50 flex flex-col items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {activePreset.reminderInterval ? <span>每{activePreset.reminderInterval / 60}分钟提醒</span> : null}
                        {activePreset.musicEnabled && (
                          <div className="flex items-center gap-1">
                            <span>{subCategory === 'timer' ? '⏱️ 滴答声' : `🎵 ${activePreset.bgMusic || '自然'}`}</span>
                            {isTimerRunning && (
                              <div className="flex gap-0.5 ml-1">
                                {subCategory === 'timer' ? (
                                  <motion.div 
                                    animate={{ opacity: [1, 0.2, 1] }} 
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }} 
                                    className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-cyan-400' : 'bg-cyan-500'}`} 
                                  />
                                ) : (
                                  [1, 2, 3].map(i => (
                                    <motion.div
                                      key={i}
                                      animate={{ height: [4, 10, 4] }}
                                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                      className={`w-1 rounded-full ${isDarkMode ? 'bg-slate-400' : 'bg-slate-500'}`}
                                    />
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
