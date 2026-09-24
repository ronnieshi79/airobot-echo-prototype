import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, X, Power, Minimize2, Mic } from 'lucide-react';
import { AlarmItem } from '../types';

interface AlarmOverlayProps {
  show: boolean;
  isDarkMode: boolean;
  currentAlarm: AlarmItem | undefined;
  isRinging: boolean;
  onToggleAlarm: (id: string) => void;
  onStopRinging: () => void;
  onClose: () => void;
}

export const AlarmOverlay: React.FC<AlarmOverlayProps> = ({
  show,
  isDarkMode,
  currentAlarm,
  isRinging,
  onToggleAlarm,
  onStopRinging,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden"
        >
          <div className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-black/40' : 'bg-slate-900/20'}`} onClick={() => !isRinging && onClose()} />
          
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative group"
            >
              {/* Mechanical Control Panel (Right Side) */}
              <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                {/* Toggle Button (Top Right) */}
                <motion.button
                  whileHover={{ x: -4 }}
                  whileTap={{ x: 2 }}
                  onClick={() => currentAlarm && onToggleAlarm(currentAlarm.id)}
                  className={`w-14 h-24 rounded-tr-2xl border-t-2 border-r-2 shadow-[6px_0_15px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-2 ${
                    isDarkMode ? 'bg-slate-700 border-white/10 text-slate-400' : 'bg-slate-200 border-black/10 text-slate-600'
                  }`}
                >
                  {currentAlarm?.enabled ? <Square size={20} fill="currentColor" className="text-red-500" /> : <Play size={20} fill="currentColor" className="text-orange-500" />}
                  <div className="flex flex-col gap-1 mt-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-8 h-[2px] rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} />
                    ))}
                  </div>
                </motion.button>

                {/* Minimize Button (Bottom Right) */}
                <motion.button
                  whileHover={{ x: -4 }}
                  whileTap={{ x: 2 }}
                  onClick={onClose}
                  className={`w-14 h-16 rounded-br-2xl border-b-2 border-r-2 shadow-[6px_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center ${
                    isDarkMode ? 'bg-slate-800 border-white/10 text-slate-500' : 'bg-white border-black/10 text-slate-400'
                  }`}
                >
                  <Minimize2 size={22} />
                </motion.button>
              </div>

              {/* Exit/Stop Button (Top) */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <motion.button
                  whileHover={{ y: 3 }}
                  whileTap={{ y: 6 }}
                  onClick={() => {
                    if (isRinging) onStopRinging();
                    onClose();
                  }}
                  className={`w-16 h-10 rounded-t-2xl border-x-2 border-t-2 shadow-lg flex items-center justify-center ${
                    isDarkMode ? 'bg-slate-800 border-white/10 text-red-500/80' : 'bg-slate-100 border-black/10 text-red-500'
                  }`}
                >
                  <Power size={18} strokeWidth={3} />
                </motion.button>
              </div>

              {/* Alarm Face */}
              <motion.div 
                animate={isRinging ? { x: [-3, 3, -3] } : {}}
                transition={{ repeat: Infinity, duration: 0.1 }}
                className="relative flex items-center justify-center"
              >
                {/* Bells */}
                <motion.div 
                  animate={isRinging ? { rotate: [-20, 20, -20] } : {}}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                  className={`absolute -top-8 left-16 w-28 h-20 rounded-t-full shadow-xl origin-bottom ${isDarkMode ? 'bg-gradient-to-br from-slate-600 to-slate-800' : 'bg-gradient-to-br from-slate-300 to-slate-500'}`} 
                />
                <motion.div 
                  animate={isRinging ? { rotate: [20, -20, 20] } : {}}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                  className={`absolute -top-8 right-16 w-28 h-20 rounded-t-full shadow-xl origin-bottom ${isDarkMode ? 'bg-gradient-to-br from-slate-600 to-slate-800' : 'bg-gradient-to-br from-slate-300 to-slate-500'}`} 
                />
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-12 rounded-full z-10 shadow-md ${isDarkMode ? 'bg-gradient-to-br from-slate-500 to-slate-700' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`} />
                
                {/* Main Clock Face (Skeuomorphic Bezel) */}
                <div className={`relative w-[32rem] h-[32rem] rounded-full p-5 shadow-[0_40px_80px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(255,255,255,0.5)] z-20 ${isDarkMode ? 'bg-gradient-to-br from-slate-700 to-slate-900' : 'bg-gradient-to-br from-slate-100 to-slate-300'}`}>
                  <div className={`relative w-full h-full rounded-full ${isDarkMode ? 'bg-slate-900' : 'bg-white'} shadow-[inset_0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center overflow-hidden`}>
                    
                    {/* Decorative Inner Rings */}
                    <div className={`absolute inset-4 rounded-full border border-dashed ${isDarkMode ? 'border-white/10' : 'border-black/10'}`} />
                    
                    {/* Proportional Rotating Dot for Alarm (based on current time of day) */}
                    <motion.div
                      animate={{ 
                        rotate: (() => {
                          if (!currentAlarm) return 0;
                          const [h, m] = currentAlarm.time.split(':').map(Number);
                          return ((h % 12) * 60 + m) / 720 * 360;
                        })()
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-4 rounded-full pointer-events-none"
                    >
                      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${isDarkMode ? 'bg-orange-400' : 'bg-orange-500'} shadow-[0_0_15px_rgba(249,115,22,0.8)] border-2 ${isDarkMode ? 'border-slate-900' : 'border-white'}`} />
                    </motion.div>

                    <div className={`absolute inset-12 rounded-full border ${isDarkMode ? 'border-white/5' : 'border-black/5'}`} />

                    <div className={`text-sm font-black uppercase tracking-[0.4em] mb-4 z-10 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {isRinging ? '正在响铃' : (currentAlarm?.enabled ? '已开启' : '已关闭')}
                    </div>
                    <div className={`text-9xl font-black tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {currentAlarm ? currentAlarm.time : '--:--'}
                    </div>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div 
                          key={i}
                          animate={isRinging ? { height: [12, 40, 12], opacity: [0.4, 1, 0.4] } : { height: 12, opacity: 0.1 }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                          className="w-3 rounded-full bg-orange-500"
                        />
                      ))}
                    </div>
                    <div className={`text-sm font-black uppercase tracking-widest mt-8 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                      {currentAlarm?.label} • {
                        currentAlarm?.voiceMode === 'gentle' ? '温柔' : 
                        currentAlarm?.voiceMode === 'urgent' ? '急切' : '标准'
                      }模式
                      {currentAlarm?.requireName && ' • 需叫名字关闭'}
                    </div>
                    {isRinging && currentAlarm?.requireName && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex flex-col items-center gap-2"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                          <Mic size={14} className="text-indigo-500 animate-pulse" />
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">请说出你的名字以关闭</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
