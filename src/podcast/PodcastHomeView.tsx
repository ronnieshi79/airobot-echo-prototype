import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play, Pause, Disc, Brain, MessageSquare } from 'lucide-react';
import { PodcastEpisode } from './usePodcast';
import { RecommendationStrip } from '../components/RecommendationStrip';
import { MainCategory, SubCategory, ScheduleItem } from '../types';
import { getTodayInfo } from '../constants';

interface PodcastHomeViewProps {
  isDarkMode: boolean;
  episodes: PodcastEpisode[];
  recommendation: string;
  onSelectEpisode: (episode: PodcastEpisode) => void;
  onGenerate: (type: 'video' | 'audio' | 'text') => void;
  time: Date;
  schedules: ScheduleItem[];
  onNavigate: (cat: MainCategory, sub: SubCategory) => void;
  activeEpisode?: PodcastEpisode | null;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  progress?: number;
  onOpenPlayer?: () => void;
  onShowLogbook?: () => void;
}

export const PodcastHomeView: React.FC<PodcastHomeViewProps> = ({ 
  isDarkMode, 
  episodes, 
  recommendation, 
  onSelectEpisode,
  onGenerate,
  time,
  schedules,
  onNavigate,
  activeEpisode,
  isPlaying,
  onTogglePlay,
  progress,
  onOpenPlayer,
  onShowLogbook
}) => {
  const todayInfo = getTodayInfo(time);

  // Filter out the active episode from the main list and prioritize unplayed episodes
  const displayEpisodes = [...episodes]
    .filter(ep => ep.id !== activeEpisode?.id)
    .sort((a, b) => {
      if (!a.played && b.played) return -1;
      if (a.played && !b.played) return 1;
      return 0;
    })
    .slice(0, activeEpisode ? 2 : 3);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* 1. Top Slogan */}
      <div className="mb-6 flex-shrink-0 pr-12">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <Sparkles size={20} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            AI 播客
          </h2>
        </div>
        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          自由订阅、一对一互动Ai播客
        </p>
      </div>

      {/* 2. Main Content Area (Scrollable/Flexible) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-5 pr-1 items-start pb-4">
        
        {/* Left Podcast Card (Standalone) */}
        <div className={`w-full md:w-[130px] shrink-0 rounded-[2.5rem] flex flex-col items-center justify-center py-8 text-white bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-xl z-20 mb-3 overflow-hidden border-4 border-white/20 bg-indigo-900 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&q=80" 
              alt="Podcast Cover" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <span className="text-[10px] font-black tracking-widest opacity-95 text-center px-1 z-10 text-indigo-50">
            可互动Ai播客
          </span>
          <span className="text-[8px] font-black tracking-[0.05em] mt-1.5 opacity-80 uppercase z-10 text-indigo-100 text-center leading-tight">
            Interactive
            <br />
            AI Podcast
          </span>
        </div>

        {/* Right Episodes Area Card */}
        <div className={`flex-1 min-w-0 p-6 rounded-[2.5rem] flex flex-col ${isDarkMode ? 'bg-slate-800/60 border border-white/5' : 'bg-slate-50 border border-slate-100'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
             <h4 className={`text-xs font-black tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>推荐收听</h4>
          </div>

          <div className="flex flex-col gap-3.5 h-[296px] pr-1">
            
            {/* Now Playing Widget (Background Episode) */}
            {activeEpisode && (
              <motion.div
                key="now-playing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`flex items-center gap-4 p-5 rounded-2xl border shrink-0 transition-all ${
                  isDarkMode ? 'bg-indigo-900/30 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200 shadow-sm'
                }`}
              >
                  <div 
                    className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer shrink-0 shadow-md"
                    onClick={onOpenPlayer}
                  >
                    <img src={activeEpisode.bgImage || "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&q=80"} className="absolute inset-0 w-full h-full object-cover" alt="cover" />
                    <motion.div 
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    >
                      <Disc size={20} className="text-white opacity-90 drop-shadow-md" />
                    </motion.div>
                  </div>
                  
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpenPlayer}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 pr-2 overflow-hidden">
                         {isPlaying ? (
                           <div className="flex items-end gap-[2px] h-3 shrink-0">
                             <motion.div className="w-[3px] bg-indigo-500 rounded-full" animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} />
                             <motion.div className="w-[3px] bg-indigo-500 rounded-full" animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} />
                             <motion.div className="w-[3px] bg-indigo-500 rounded-full" animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} />
                           </div>
                         ) : (
                           <span className="flex h-2 w-2 relative shrink-0">
                             <span className={`relative inline-flex rounded-full h-2 w-2 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`}></span>
                           </span>
                         )}
                         <h4 className={`text-sm font-black truncate ${isDarkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>
                           {activeEpisode.title}
                         </h4>
                      </div>
                      <span className={`text-[10px] font-black shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {Math.round(progress || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/50 rounded-full h-1 mt-1 overflow-hidden shadow-inner">
                      <div className={`h-1 rounded-full ${isPlaying ? 'bg-indigo-500' : 'bg-slate-400'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onTogglePlay?.(); }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform ${
                        isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-500 text-white hover:bg-indigo-600'
                      }`}
                    >
                       {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                    </button>
                  </div>
                </motion.div>
            )}

            {/* Other Episodes */}
            {displayEpisodes.map(episode => (
                <motion.div
                  key={episode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectEpisode(episode)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border shrink-0 cursor-pointer ${
                    isDarkMode ? 'bg-slate-800/60 border-white/5 hover:bg-slate-700/60' : 'bg-white border-slate-100 shadow-sm hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm relative ${
                    episode.type === 'video' ? 'bg-pink-500/10' :
                    episode.type === 'audio' ? 'bg-sky-500/10' : 'bg-emerald-500/10'
                  }`}>
                    {episode.bgImage ? (
                      <img src={episode.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" alt="cover" />
                    ) : (
                      <Play size={16} fill="currentColor" className={
                        episode.type === 'video' ? 'text-pink-500' :
                        episode.type === 'audio' ? 'text-sky-500' : 'text-emerald-500'
                      } />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-black truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {episode.title}
                    </h4>
                    <div className={`flex items-center gap-2 mt-1 text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span className="truncate">{episode.date} · {episode.type === 'video' ? '视频' : episode.type === 'audio' ? '音频' : '图文'}</span>
                      {(episode.qnaHistory?.length ?? 0) > 0 && (
                        <span className="flex items-center gap-1 shrink-0 ml-auto bg-pink-500/10 text-pink-500 px-1.5 py-0.5 rounded-full text-[10px]">
                          <MessageSquare size={10} />
                          {episode.qnaHistory?.length}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
            ))}

            {episodes.length === 0 && !activeEpisode && (
              <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed text-center h-full ${isDarkMode ? 'bg-slate-800/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  暂无播客记录
                </p>
              </div>
            )}
            {episodes.length > 0 && (
              <button 
                className={`mt-1 mb-1 shrink-0 flex items-center justify-center font-bold py-2 rounded-[1.2rem] hover:opacity-80 transition-opacity cursor-pointer text-xs ${isDarkMode ? 'bg-slate-700/30 text-slate-400 hover:text-slate-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
              >
                + 追加更多播客订阅
              </button>
            )}
            </div>
          </div>
      </div>

      {/* 3. Recommendation Strip (Bottom anchor) */}
      <RecommendationStrip
        isDarkMode={isDarkMode}
        time={time}
        schedules={schedules}
        episodes={episodes}
        todayInfo={todayInfo}
        onNavigate={onNavigate}
        onAction={(actionId) => {
          if (actionId === 'logbook') {
            onShowLogbook?.();
          } else if (actionId === 'play-podcast-news') {
            onGenerate('audio');
            onOpenPlayer?.();
          } else if (actionId === 'play-podcast-knowledge') {
            onGenerate('text');
            onOpenPlayer?.();
          }
        }}
        isFocusRunning={false}
        isTimerRunning={false}
        alarmCount={0}
        module="podcast"
      />
    </div>
  );
};
