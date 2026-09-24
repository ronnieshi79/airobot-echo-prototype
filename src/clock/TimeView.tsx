import React from 'react';
import { motion } from 'motion/react';
import { Play, Brain, Hourglass, History, Mic, Settings2 } from 'lucide-react';
import { PresetItem, SubCategory, TimerHistoryItem, FocusHistoryItem } from '../types';

interface TimeViewProps {
  subCategory: SubCategory;
  time: Date;
  timerSeconds: number;
  isTimerRunning: boolean;
  presets: PresetItem[];
  timerHistory: TimerHistoryItem[];
  focusHistory: FocusHistoryItem[];
  onTimerStart: () => void;
  onTimerPause: () => void;
  onTimerReset: () => void;
  onTimerAdjust: (amount: number) => void;
  onTimerSet: (seconds: number) => void;
  onUpdatePreset: (id: string, updates: Partial<PresetItem>) => void;
  isDarkMode: boolean;
  onShowOverlay: (presetId?: string) => void;
  onShowLogbook: () => void;
}

export const TimeView: React.FC<TimeViewProps> = ({
  subCategory,
  time,
  timerSeconds,
  isTimerRunning,
  presets,
  timerHistory,
  focusHistory,
  onTimerStart,
  onTimerPause,
  onTimerReset,
  onTimerAdjust,
  onTimerSet,
  onUpdatePreset,
  isDarkMode,
  onShowOverlay,
  onShowLogbook,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative pb-4">
      {/* Header */}
      <div className="mb-2 flex-shrink-0 pr-12">
        <div className="flex items-center gap-3 mb-1">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <Hourglass size={20} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            AI 计时
          </h2>
        </div>
        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          智能记录时间与专注模式，分秒高效，深度专注
        </p>
      </div>

      {/* Main Content: Presets List in a unified container */}
      <div className={`shrink min-h-0 overflow-y-auto custom-scrollbar mt-6 pt-4 px-4 pb-2 rounded-[3rem] ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
        <div className="space-y-3">
          {presets.map((preset) => {
            const isFocusMode = preset.mode === 'focus';
            return (
              <motion.div
                key={preset.id}
                className={`w-full p-5 rounded-[2rem] flex flex-col transition-all ${
                  isDarkMode 
                    ? 'hover:bg-white/5' 
                    : 'hover:bg-white shadow-sm border border-transparent hover:border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => {
                      onTimerSet(preset.seconds);
                      onShowOverlay(preset.id);
                    }}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isFocusMode 
                        ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                        : (isDarkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600')
                    }`}>
                      {isFocusMode ? <Brain size={18} /> : <Hourglass size={18} />}
                    </div>
                    <div className="flex flex-col flex-1">
                      {editingId === preset.id ? (
                        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={preset.label}
                              onChange={(e) => onUpdatePreset(preset.id, { label: e.target.value })}
                              className={`text-lg font-black bg-transparent outline-none flex-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                            />
                            <div className="flex items-center gap-1">
                              <input 
                                type="number" 
                                value={Math.floor(preset.seconds / 60)}
                                onChange={(e) => {
                                  const mins = parseInt(e.target.value) || 1;
                                  onUpdatePreset(preset.id, { seconds: mins * 60 });
                                }}
                                className={`w-10 text-xs font-black bg-transparent outline-none text-right ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
                              />
                              <span className="text-[10px] font-bold text-slate-500">min</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {/* Service mode configuration */}
                            <div className="flex flex-col">
                              <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>服务模式</span>
                              <select 
                                value={preset.mode || 'timer'}
                                onChange={(e) => {
                                  const newMode = e.target.value as 'timer' | 'focus';
                                  onUpdatePreset(preset.id, { 
                                    mode: newMode,
                                    bgMusic: newMode === 'focus' ? 'nature' : 'ticking'
                                  });
                                }}
                                className={`text-xs font-black bg-transparent outline-none ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                              >
                                <option value="timer">⏱️ 计时</option>
                                <option value="focus">🧠 专注</option>
                              </select>
                            </div>

                            <div className="flex flex-col">
                              <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>提醒间隔</span>
                              <select 
                                value={preset.reminderInterval || 0}
                                onChange={(e) => onUpdatePreset(preset.id, { reminderInterval: parseInt(e.target.value) })}
                                className={`text-xs font-black bg-transparent outline-none ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                              >
                                <option value={0}>无提醒</option>
                                <option value={300}>5分钟</option>
                                <option value={600}>10分钟</option>
                                <option value={900}>15分钟</option>
                                <option value={1200}>20分钟</option>
                              </select>
                            </div>

                            <div className="flex flex-col">
                              <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>背景音</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => onUpdatePreset(preset.id, { musicEnabled: !preset.musicEnabled })}
                                  className={`w-8 h-4 rounded-full relative transition-all duration-300 ${
                                    preset.musicEnabled 
                                      ? 'bg-indigo-500' 
                                      : (isDarkMode ? 'bg-slate-700' : 'bg-slate-200')
                                  }`}
                                >
                                  <motion.div 
                                    animate={{ x: preset.musicEnabled ? 18 : 2 }}
                                    className="absolute top-0.5 left-0 w-3 h-3 rounded-full bg-white shadow-sm"
                                  />
                                </button>
                                {preset.musicEnabled && isFocusMode ? (
                                  <select 
                                    value={preset.bgMusic || 'nature'}
                                    onChange={(e) => onUpdatePreset(preset.id, { bgMusic: e.target.value })}
                                    className={`text-[10px] font-black bg-transparent outline-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                                  >
                                    <option value="nature">自然</option>
                                    <option value="lofi">Lofi</option>
                                    <option value="piano">钢琴</option>
                                    <option value="cyberpunk">赛博朋克</option>
                                    <option value="library">图书馆</option>
                                    <option value="zen">禅意</option>
                                  </select>
                                ) : preset.musicEnabled ? (
                                  <span className="text-[10px] font-black text-slate-500">滴答声</span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                              {preset.label}
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              isFocusMode 
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                            }`}>
                              {isFocusMode ? '专注' : '计时'}
                            </span>
                          </div>
                          <div className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {Math.floor(preset.seconds / 60)} 分钟
                            {preset.reminderInterval ? ` • 每${preset.reminderInterval / 60}分钟提醒` : ''}
                            {preset.musicEnabled ? (isFocusMode ? ` • 🎵 ${preset.bgMusic || '自然'}` : ` • ⏱️ 滴答声`) : ''}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(editingId === preset.id ? null : preset.id);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      editingId === preset.id
                        ? (isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white')
                        : (isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
                    }`}
                  >
                    <Settings2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Aether Prompt */}
      <div className="absolute bottom-0 left-2 right-8 flex-shrink-0 z-20">
        <div className={`px-5 py-3.5 rounded-[2rem] border flex items-start gap-3 transition-all shadow-xl backdrop-blur-xl ${
          isDarkMode ? 'bg-indigo-900/60 border-indigo-500/30' : 'bg-indigo-50/90 border-indigo-200'
        }`}>
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex flex-shrink-0 items-center justify-center mt-0.5 relative">
             <Brain size={16} className="text-indigo-500" />
             <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
             </span>
          </div>
          <div className="flex flex-col gap-1 mt-0.5">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>AETHER 提示</p>
            <p className={`text-xs font-bold leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              您可以根据任务需要配置计时模式或专注模式。对我说“Aether，帮我倒计时 15 分钟”便可直接启动，我会为您播放合适的背景音。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
