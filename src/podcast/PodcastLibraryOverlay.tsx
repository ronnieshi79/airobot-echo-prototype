import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Sparkles, FolderOpen, Minimize2 } from 'lucide-react';
import { PodcastEpisode } from './usePodcast';
import { PodcastLibraryView } from './PodcastLibraryView';
import { ScheduleItem } from '../types';

interface PodcastLibraryOverlayProps {
  show: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  episodes: PodcastEpisode[];
  onSelectEpisode: (episode: PodcastEpisode) => void;
  onGenerate: (type: 'video' | 'audio' | 'text') => void;
  time: Date;
  schedules: ScheduleItem[];
  onAddCustomEpisode?: (
    title: string, 
    summary: string, 
    content: string, 
    channelName: string, 
    type: 'video' | 'audio' | 'text'
  ) => void;
}

export const PodcastLibraryOverlay: React.FC<PodcastLibraryOverlayProps> = ({
  show,
  onClose,
  isDarkMode,
  episodes,
  onSelectEpisode,
  onGenerate,
  time,
  schedules,
  onAddCustomEpisode
}) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Pop-up Skeuomorphic Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`relative z-10 w-full max-w-4xl h-[88vh] rounded-[2.5rem] flex flex-col shadow-2xl border overflow-hidden ${
              isDarkMode 
                ? 'bg-zinc-900/95 border-white/15 text-white shadow-[0_25px_60px_rgba(0,0,0,0.7)]' 
                : 'bg-white/95 border-zinc-200/90 text-zinc-900 shadow-[0_25px_60px_rgba(0,0,0,0.15)]'
            }`}
          >
            {/* Top Modal Bar */}
            <div className={`px-6 py-4 flex items-center justify-between border-b shrink-0 ${
              isDarkMode ? 'border-zinc-800' : 'border-zinc-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                  isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
                }`}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black tracking-tight">
                      AI 播客节目库 · 沉浸知识资产
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                      静态全景库
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                    收纳 {episodes.length} 期专属智能体精编节目 · 支持本地媒体扫描一键生成
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="收起节目库"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
              <PodcastLibraryView
                isDarkMode={isDarkMode}
                episodes={episodes}
                onSelectEpisode={onSelectEpisode}
                onGenerate={onGenerate}
                time={time}
                schedules={schedules}
                onNavigate={() => {}}
                onAddCustomEpisode={onAddCustomEpisode}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
