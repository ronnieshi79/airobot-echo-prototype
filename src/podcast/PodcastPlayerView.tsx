import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, MessageSquare, Sparkles, Volume2, HelpCircle, X } from 'lucide-react';
import { PodcastEpisode } from './usePodcast';

interface PodcastPlayerViewProps {
  episode: PodcastEpisode;
  isDarkMode: boolean;
  onAskAether: (topic: string) => void;
  updateProgress: (id: string, progress: number) => void;
}

export const PodcastPlayerView: React.FC<PodcastPlayerViewProps> = ({ 
  episode, 
  isDarkMode, 
  onAskAether,
  updateProgress
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [localProgress, setLocalProgress] = useState(episode.progress || 0);
  const [showQnA, setShowQnA] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying && localProgress < 100) {
      interval = setInterval(() => {
        const next = Math.min(localProgress + 0.5, 100);
        setLocalProgress(next);
        if (next % 5 === 0 || next === 100) {
          updateProgress(episode.id, next);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, localProgress, episode.id, updateProgress]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-[3rem]">
      {/* Full Screen Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={episode.bgImage} 
          alt="background" 
          className="w-full h-full object-cover opacity-60 scale-105 blur-md"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-900/60' : 'bg-white/60'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
      </div>

      {/* Header with Title and Type */}
      <div className="relative z-10 px-8 pt-10 pb-4 flex items-center justify-center gap-3">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex-shrink-0 ${
          isDarkMode ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-800'
        } backdrop-blur-md`}>
          {episode.type === 'video' ? '视频' : episode.type === 'audio' ? '音频' : '图文'}
        </span>
        <h1 className={`text-xl font-black tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {episode.title}
        </h1>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex-1 px-8 py-4 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center text-center mb-6">
          <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            {episode.summary}
          </p>
        </div>
      </div>

      {/* Q&A History Overlay */}
      <AnimatePresence>
        {showQnA && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute bottom-36 left-8 right-8 z-20 p-6 rounded-[2rem] border backdrop-blur-2xl shadow-2xl max-h-[50%] flex flex-col ${
              isDarkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
                <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  互动问答记录
                </h3>
              </div>
              <button onClick={() => setShowQnA(false)} className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'}`}>
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
              {episode.qnaHistory && episode.qnaHistory.length > 0 ? (
                episode.qnaHistory.map((qna, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex items-start gap-2 self-end max-w-[85%]">
                      <div className={`p-3 rounded-2xl rounded-tr-sm text-sm ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`}>
                        {qna.question}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 self-start max-w-[85%]">
                      <div className={`p-3 rounded-2xl rounded-tl-sm text-sm ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-700 shadow-sm'}`}>
                        {qna.answer}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 py-8">
                  <MessageSquare size={32} className={`mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <p className={`text-xs font-bold text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    暂无问答记录
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Controls (Bottom Fixed) */}
      <div className={`relative z-10 p-8 pt-6 border-t backdrop-blur-xl ${
        isDarkMode ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-black/5'
      }`}>
        {/* Progress Bar */}
        <div className="flex items-center gap-4 mb-6">
          <span className={`text-[10px] font-bold w-8 text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {Math.floor((localProgress / 100) * 15)}:{(Math.floor(((localProgress / 100) * 15 * 60) % 60)).toString().padStart(2, '0')}
          </span>
          <div className="flex-1 h-2 bg-slate-200/20 rounded-full overflow-hidden relative cursor-pointer">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${localProgress}%` }}
              layout
            />
          </div>
          <span className={`text-[10px] font-bold w-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            15:00
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4">
          <button className={`p-3 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-black/5 hover:text-slate-800'}`}>
            <Volume2 size={20} />
          </button>
          
          <div className="flex items-center gap-6">
            <button className={`p-3 rounded-full transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-black/5 hover:text-slate-900'}`}>
              <SkipBack size={24} fill="currentColor" />
            </button>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${
                isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
              }`}
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </motion.button>
            
            <button className={`p-3 rounded-full transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-black/5 hover:text-slate-900'}`}>
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>

          <button 
            onClick={() => setShowQnA(!showQnA)}
            className={`p-3 rounded-full transition-colors relative ${isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-black/5 hover:text-slate-800'}`}
          >
            <MessageSquare size={20} />
            {episode.qnaHistory && episode.qnaHistory.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
