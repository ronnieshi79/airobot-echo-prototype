import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Timer, 
  Sparkles, 
  Calendar, 
  Headphones, 
  Bell, 
  BookOpen
} from 'lucide-react';
import { ServiceSlice } from './types';

interface ContextCardCarouselProps {
  slices: ServiceSlice[];
  isDarkMode: boolean;
  onOpenSlice: (slice: ServiceSlice) => void;
  activeSliceIndex: number;
  onSelectSliceIndex: (index: number | ((prev: number) => number)) => void;
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

  const currentSlice = slices[activeSliceIndex] || slices[0];
  const prevIndex = (activeSliceIndex - 1 + total) % total;
  const nextIndex = (activeSliceIndex + 1) % total;
  const prevSlice = total > 1 ? slices[prevIndex] : null;
  const nextSlice = total > 1 ? slices[nextIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectSliceIndex(prevIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectSliceIndex(nextIndex);
  };

  const renderIcon = (slice: ServiceSlice, isCenter: boolean = false) => {
    const size = isCenter ? 36 : 28;
    switch (slice.iconType) {
      case 'timer':
        return <Timer size={size} className={slice.colorTheme.iconColor} strokeWidth={2.2} />;
      case 'focus':
        return <Sparkles size={size} className={slice.colorTheme.iconColor} strokeWidth={2.2} />;
      case 'calendar':
        return <Calendar size={size} className={slice.colorTheme.iconColor} strokeWidth={2.2} />;
      case 'podcast':
        return <Headphones size={size} className={slice.colorTheme.iconColor} strokeWidth={2.2} />;
      case 'alarm':
        return <Bell size={size} className={slice.colorTheme.iconColor} strokeWidth={2.2} />;
      case 'logbook':
        return <BookOpen size={size} className={slice.colorTheme.iconColor} strokeWidth={2.2} />;
      default:
        return <Timer size={size} className={slice.colorTheme.iconColor} strokeWidth={2.2} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full select-none">
      
      {/* Coverflow Stage - Tightly Stacked Card Deck */}
      <div className="relative w-full max-w-[560px] h-[450px] flex items-center justify-center overflow-visible">
        
        {/* Left Neighbor Card (Tightly stacked behind center card) */}
        {total > 1 && prevSlice && (
          <motion.div
            key={`prev-${prevSlice.id}`}
            onClick={handlePrev}
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
            onClick={handleNext}
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

        {/* Center Active Slice Card (Sharp, Skeuomorphic, Interactive) */}
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

      {/* Pagination Indicators & Quick Arrows */}
      <div className="flex items-center gap-4 mt-6 z-20">
        <button
          onClick={handlePrev}
          disabled={total <= 1}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            total <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
          } ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1.5">
          {slices.map((slice, i) => (
            <button
              key={slice.id}
              onClick={() => onSelectSliceIndex(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === activeSliceIndex
                  ? (isDarkMode ? 'w-6 h-1.5 bg-emerald-400' : 'w-6 h-1.5 bg-slate-800')
                  : (isDarkMode ? 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40' : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400')
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={total <= 1}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            total <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
          } ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
};

