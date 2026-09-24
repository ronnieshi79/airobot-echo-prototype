import React from 'react';
import { motion } from 'motion/react';
import { Bell, Clock, Volume2, VolumeX, Mic, Power, Settings2, History, Brain } from 'lucide-react';
import { AlarmItem, AlarmHistoryItem } from '../types';

interface AlarmViewProps {
  isDarkMode: boolean;
  alarms: AlarmItem[];
  alarmHistory: AlarmHistoryItem[];
  onToggleAlarm: (id: string) => void;
  onUpdateAlarm: (id: string, updates: Partial<AlarmItem>) => void;
  ringingAlarmId: string | null;
  nextAlarmMinutes: number | null;
  onShowOverlay: (id: string) => void;
  onShowLogbook: () => void;
}

export const AlarmView: React.FC<AlarmViewProps> = ({
  isDarkMode,
  alarms,
  alarmHistory,
  onToggleAlarm,
  onUpdateAlarm,
  ringingAlarmId,
  nextAlarmMinutes,
  onShowOverlay,
  onShowLogbook,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const voiceModes = [
    { id: 'gentle', label: '温柔', icon: <Volume2 size={14} /> },
    { id: 'standard', label: '标准', icon: <Volume2 size={14} /> },
    { id: 'urgent', label: '急切', icon: <VolumeX size={14} /> },
  ];

  const typeLabels = {
    everyday: '每天',
    workday: '工作日',
    temporary: '临时'
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative pb-4">
      {/* Header */}
      <div className="mb-2 flex-shrink-0 pr-12">
        <div className="flex items-center gap-3 mb-1">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
            <Bell size={20} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            AI 闹钟
          </h2>
        </div>
        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          规律你的作息，智能语音唤醒
        </p>
      </div>

      {/* Main Content: Alarm List in a unified container */}
      <div className={`shrink min-h-0 overflow-y-auto custom-scrollbar mt-6 pt-4 px-4 pb-2 rounded-[3rem] ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
        <div className="space-y-3">
          {alarms.map((alarm) => (
            <motion.div
              key={alarm.id}
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
                    onShowOverlay(alarm.id);
                  }}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}>
                    <Bell size={20} />
                  </div>
                  <div className="flex flex-col flex-1">
                    {editingId === alarm.id ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <input 
                            type="text" 
                            value={alarm.time}
                            onChange={(e) => onUpdateAlarm(alarm.id, { time: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-2xl font-black bg-transparent outline-none w-20 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
                          />
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            {voiceModes.map(mode => (
                              <button
                                key={mode.id}
                                onClick={() => onUpdateAlarm(alarm.id, { voiceMode: mode.id as any })}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                                  alarm.voiceMode === mode.id
                                    ? (isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600')
                                    : (isDarkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400')
                                }`}
                              >
                                {mode.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input 
                          type="text" 
                          value={alarm.label}
                          onChange={(e) => onUpdateAlarm(alarm.id, { label: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="闹钟名称"
                          className={`text-xs font-bold bg-transparent outline-none border-b border-orange-500/20 pb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
                        />
                        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>唤醒次数</span>
                            <select 
                              value={alarm.repeatCount}
                              onChange={(e) => onUpdateAlarm(alarm.id, { repeatCount: Number(e.target.value) })}
                              className={`text-xs font-black bg-transparent outline-none ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                            >
                              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}次</option>)}
                            </select>
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>间隔时间</span>
                            <select 
                              value={alarm.interval}
                              onChange={(e) => onUpdateAlarm(alarm.id, { interval: Number(e.target.value) })}
                              className={`text-xs font-black bg-transparent outline-none ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                            >
                              {[1,3,5,10,15].map(n => <option key={n} value={n}>{n}分钟</option>)}
                            </select>
                          </div>
                          <button 
                            onClick={() => onUpdateAlarm(alarm.id, { requireName: !alarm.requireName })}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              alarm.requireName
                                ? (isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600')
                                : (isDarkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400')
                            }`}
                          >
                            叫名字关闭
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={`text-2xl font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {alarm.time}
                        </div>
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {alarm.label} • {typeLabels[alarm.type]} • {voiceModes.find(m => m.id === alarm.voiceMode)?.label || '标准'}模式
                          {alarm.requireName && ' • 需叫名字'}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAlarm(alarm.id);
                    }}
                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                      alarm.enabled 
                        ? 'bg-orange-500' 
                        : (isDarkMode ? 'bg-slate-700' : 'bg-slate-200')
                    }`}
                  >
                    <motion.div 
                      animate={{ x: alarm.enabled ? 24 : 2 }}
                      className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(editingId === alarm.id ? null : alarm.id);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      editingId === alarm.id
                        ? (isDarkMode ? 'bg-orange-500 text-white' : 'bg-orange-600 text-white')
                        : (isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
                    }`}
                  >
                    <Settings2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>

      {/* Bottom Aether Prompt */}
      <div className="absolute bottom-0 left-2 right-8 flex-shrink-0 z-20">
        <div className={`px-5 py-3.5 rounded-[2rem] border flex items-start gap-3 transition-all shadow-xl backdrop-blur-xl ${
          isDarkMode ? 'bg-orange-900/60 border-orange-500/30' : 'bg-orange-50/90 border-orange-200'
        }`}>
          <div className="w-9 h-9 rounded-full bg-orange-500/20 flex flex-shrink-0 items-center justify-center mt-0.5 relative">
             <Brain size={16} className="text-orange-500" />
             <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
             </span>
          </div>
          <div className="flex flex-col gap-1 mt-0.5">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>AETHER 提示</p>
            <p className={`text-xs font-bold leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              无论是每日唤醒还是临时提醒，对我说“Aether，每周工作日 7 点叫我起床”，我会准时轻柔地唤醒您。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
