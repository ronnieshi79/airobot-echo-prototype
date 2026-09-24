import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Brain, 
  Calendar, 
  Headphones, 
  Bell, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Play,
  Volume2
} from 'lucide-react';
import { ServiceSlice } from '../services/contextEngine';

interface ContextCardCarouselProps {
  slices: ServiceSlice[];
  isDarkMode: boolean;
  onOpenSlice: (slice: ServiceSlice) => void;
  activeSliceIndex: number;
  onSelectSliceIndex: (index: number) => void;
}

export const ContextCardCarousel: React.FC<ContextCardCarouselProps> = ({
  slices,
  isDarkMode,
  onOpenSlice,
  activeSliceIndex,
  onSelectSliceIndex
}) => {
  const total = slices.length;
  if (total === 0) return null;

  const currentIndex = Math.max(0, Math.min(activeSliceIndex, total - 1));
  const currentSlice = slices[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectSliceIndex((currentIndex - 1 + total) % total);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectSliceIndex((currentIndex + 1) % total);
  };

  // Render proper icon for slice
  const renderIcon = (slice: ServiceSlice, isCenter: boolean) => {
    const size = isCenter ? 40 : 32;
    switch (slice.iconType) {
      case 'timer':
        return <Timer size={size} className={slice.colorTheme.iconColor} strokeWidth={2} />;
      case 'focus':
        return <Timer size={size} className={slice.colorTheme.iconColor} strokeWidth={2} />;
      case 'calendar':
        return <Calendar size={size} className={slice.colorTheme.iconColor} strokeWidth={2} />;
      case 'podcast':
        return <Headphones size={size} className={slice.colorTheme.iconColor} strokeWidth={2} />;
      case 'alarm':
        return <Bell size={size} className={slice.colorTheme.iconColor} strokeWidth={2} />;
      case 'logbook':
        return <BookOpen size={size} className={slice.colorTheme.iconColor} strokeWidth={2} />;
      default:
        return <Sparkles size={size} className={slice.colorTheme.iconColor} strokeWidth={2} />;
    }
  };

  // Get neighbor indices
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;
  const prevSlice = slices[prevIndex];
  const nextSlice = slices[nextIndex];

  return (
    <div className="flex flex-col items-center justify-center relative w-full select-none">
      
      {/* Coverflow Stage - Tightly Stacked Card Deck */}
      <div className="relative w-full max-w-[560px] h-[450px] flex items-center justify-center overflow-visible">
        
        {/* Left Neighbor Card (Tightly stacked behind center card) */}
        {total > 1 && prevSlice && (
          <motion.div
            key={`prev-${prevSlice.id}`}
            onClick={() => onSelectSliceIndex(prevIndex)}
            initial={{ opacity: 0, x: -60 }}
            animate={{ 
              opacity: 0.32, 
              x: -110, 
              scale: 0.88, 
              filter: 'blur(1.2px)' 
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`absolute w-[300px] sm:w-[320px] h-[390px] rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer pointer-events-auto transition-all hover:opacity-55 z-10 ${
              isDarkMode 
                ? 'bg-slate-800/70 border border-white/10 shadow-lg' 
                : 'bg-gradient-to-b from-[#eaf6f0]/80 via-white/85 to-[#e4f3ec]/80 border border-white/70 shadow-[0_16px_36px_rgba(20,110,80,0.06)]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl ${prevSlice.colorTheme.iconBg} flex items-center justify-center mb-5 opacity-60`}>
              {renderIcon(prevSlice, false)}
            </div>
            <h3 className={`text-lg font-bold tracking-tight mb-2 line-clamp-1 ${isDarkMode ? 'text-white/60' : 'text-slate-700/60'}`}>
              {prevSlice.title}
            </h3>
            <p className={`text-xs line-clamp-2 max-w-[220px] ${isDarkMode ? 'text-slate-400/50' : 'text-slate-500/50'}`}>
              {prevSlice.description}
            </p>
          </motion.div>
        )}

        {/* Right Neighbor Card (Tightly stacked behind center card) */}
        {total > 1 && nextSlice && (
          <motion.div
            key={`next-${nextSlice.id}`}
            onClick={() => onSelectSliceIndex(nextIndex)}
            initial={{ opacity: 0, x: 60 }}
            animate={{ 
              opacity: 0.32, 
              x: 110, 
              scale: 0.88, 
              filter: 'blur(1.2px)' 
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`absolute w-[300px] sm:w-[320px] h-[390px] rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer pointer-events-auto transition-all hover:opacity-55 z-10 ${
              isDarkMode 
                ? 'bg-slate-800/70 border border-white/10 shadow-lg' 
                : 'bg-gradient-to-b from-[#eaf6f0]/80 via-white/85 to-[#e4f3ec]/80 border border-white/70 shadow-[0_16px_36px_rgba(20,110,80,0.06)]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl ${nextSlice.colorTheme.iconBg} flex items-center justify-center mb-5 opacity-60`}>
              {renderIcon(nextSlice, false)}
            </div>
            <h3 className={`text-lg font-bold tracking-tight mb-2 line-clamp-1 ${isDarkMode ? 'text-white/60' : 'text-slate-700/60'}`}>
              {nextSlice.title}
            </h3>
            <p className={`text-xs line-clamp-2 max-w-[220px] ${isDarkMode ? 'text-slate-400/50' : 'text-slate-500/50'}`}>
              {nextSlice.description}
            </p>
          </motion.div>
        )}

        {/* Active Center Card (Prominent, High-fidelity skeuomorphic card) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`center-${currentSlice.id}`}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            whileHover={{ scale: 1.015, y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onOpenSlice(currentSlice)}
            className={`relative z-20 w-[330px] sm:w-[350px] h-[430px] rounded-[2.6rem] p-7 flex flex-col items-center justify-center text-center cursor-pointer pointer-events-auto transition-shadow ${
              isDarkMode 
                ? 'bg-slate-900/90 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                : 'bg-gradient-to-b from-[#e8f7f0]/90 via-white/95 to-[#e4f5ed]/90 backdrop-blur-2xl border border-white/90 shadow-[0_20px_45px_rgba(20,110,80,0.07)]'
            }`}
          >
            {/* Live Dynamic Badge or Category Badge */}
            {currentSlice.isLiveDynamic ? (
              <div className="absolute top-6 right-7 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{currentSlice.liveStatusText || '运行中'}</span>
              </div>
            ) : (
              <div className="absolute top-6 right-7 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100/70 border border-slate-200/50 text-[10px] font-semibold text-slate-400">
                <span>情境切片</span>
              </div>
            )}

            {/* Icon Squircle Button */}
            <div className="relative mb-6">
              <div className={`w-20 h-20 rounded-2xl ${currentSlice.colorTheme.iconBg} flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_18px_rgba(40,160,110,0.1)] border border-white/60 transition-transform`}>
                {renderIcon(currentSlice, true)}
              </div>
              
              {/* Pulsing ring if dynamic */}
              {currentSlice.isLiveDynamic && (
                <div className="absolute -inset-2 rounded-2xl border-2 border-emerald-400/40 animate-pulse pointer-events-none" />
              )}
            </div>

            {/* Title */}
            <h2 className={`text-xl font-black tracking-tight leading-snug mb-3 max-w-[280px] ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              {currentSlice.title}
            </h2>

            {/* Description */}
            <p className={`text-xs font-medium leading-relaxed max-w-[260px] mb-4 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-500'
            }`}>
              {currentSlice.description}
            </p>

            {/* Interactive hint */}
            <div className={`mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-3.5 py-1 rounded-full transition-colors ${
              isDarkMode 
                ? 'text-slate-300 bg-white/10' 
                : 'text-emerald-700/80 bg-emerald-500/10'
            }`}>
              轻触弹出功能卡片
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Pagination Controls (< · · • · · >) */}
      <div className="flex items-center justify-center gap-3.5 mt-5 pointer-events-auto z-20">
        <button
          onClick={handlePrev}
          aria-label="Previous service slice"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            isDarkMode 
              ? 'text-slate-400 hover:text-white hover:bg-white/10' 
              : 'text-slate-400 hover:text-slate-700 hover:bg-black/5'
          }`}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5 px-2">
          {slices.map((slice, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slice.id}
                onClick={() => onSelectSliceIndex(index)}
                aria-label={`Go to slice ${index + 1}`}
                className="p-1 cursor-pointer transition-all"
              >
                <motion.div
                  animate={{
                    width: isActive ? 16 : 5,
                    height: 5,
                    borderRadius: 4,
                    opacity: isActive ? 1 : 0.35,
                    backgroundColor: isActive 
                      ? (isDarkMode ? '#38bdf8' : '#334155') 
                      : (isDarkMode ? '#94a3b8' : '#94a3b8')
                  }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next service slice"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            isDarkMode 
              ? 'text-slate-400 hover:text-white hover:bg-white/10' 
              : 'text-slate-400 hover:text-slate-700 hover:bg-black/5'
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Bottom Recommendation Strip Pill (Exact matching screenshot!) */}
      <motion.div 
        key={`reason-${currentSlice.id}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 pointer-events-auto z-20"
      >
        <div className={`px-6 py-2.5 rounded-full flex items-center gap-4 transition-all shadow-[0_8px_25px_rgba(0,0,0,0.04)] border ${
          isDarkMode 
            ? 'bg-slate-900/90 border-white/10' 
            : 'bg-white/95 border-white/90 backdrop-blur-md'
        }`}>
          <span className={`text-xs font-semibold tracking-wide ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            {currentSlice.recommendationReason}
          </span>

          <button
            onClick={() => onOpenSlice(currentSlice)}
            className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide transition-all hover:scale-105 active:scale-95 shadow-sm ${
              isDarkMode
                ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {currentSlice.recommendedActionText}
          </button>
        </div>
      </motion.div>

    </div>
  );
};
