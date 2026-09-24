import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';
import { ServiceSlice } from '../services/agent/types';
import { CardSubdial } from '../components/CardSubdial';

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

  const getCategoryLabel = (slice: ServiceSlice) => {
    if (slice.badge) return slice.badge;
    switch (slice.type) {
      case 'focus': return '时间管理';
      case 'timer': return '节奏调整';
      case 'alarm': return '晨昏作息';
      case 'calendar': return '日程安排';
      case 'podcast': return '音频陪伴';
      case 'logbook': return '数据复盘';
      default: return '智能助理';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full select-none">
      
      {/* Coverflow Stage - Vertical Card Deck */}
      <div className="relative w-full max-w-[640px] h-[480px] sm:h-[500px] flex items-center justify-center overflow-visible">
        
        {/* Left Neighbor Card (Tightly stacked behind center card) */}
        {total > 1 && prevSlice && (
          <motion.div
            key={`prev-${prevSlice.id}`}
            onClick={handlePrev}
            initial={{ opacity: 0, x: -60 }}
            animate={{ 
              opacity: 0.25, 
              x: -110, 
              scale: 0.86, 
              filter: 'blur(2px)' 
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`absolute w-[290px] sm:w-[330px] h-[410px] sm:h-[430px] rounded-[2.8rem] p-6 flex flex-col items-center justify-center cursor-pointer pointer-events-auto transition-all hover:opacity-50 z-10 ${
              isDarkMode 
                ? 'bg-slate-800/70 border border-white/10 shadow-lg' 
                : 'bg-gradient-to-b from-[#eaf6f0]/80 via-white/85 to-[#e4f3ec]/80 border border-white/70 shadow-[0_16px_36px_rgba(20,110,80,0.06)]'
            }`}
          >
            <div className="flex flex-col items-center opacity-70">
              <CardSubdial slice={prevSlice} isDarkMode={isDarkMode} compact />
              <span className={`text-sm font-bold mt-4 line-clamp-1 max-w-[200px] text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {prevSlice.title}
              </span>
            </div>
          </motion.div>
        )}

        {/* Right Neighbor Card (Tightly stacked behind center card) */}
        {total > 1 && nextSlice && (
          <motion.div
            key={`next-${nextSlice.id}`}
            onClick={handleNext}
            initial={{ opacity: 0, x: 60 }}
            animate={{ 
              opacity: 0.25, 
              x: 110, 
              scale: 0.86, 
              filter: 'blur(2px)' 
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`absolute w-[290px] sm:w-[330px] h-[410px] sm:h-[430px] rounded-[2.8rem] p-6 flex flex-col items-center justify-center cursor-pointer pointer-events-auto transition-all hover:opacity-50 z-10 ${
              isDarkMode 
                ? 'bg-slate-800/70 border border-white/10 shadow-lg' 
                : 'bg-gradient-to-b from-[#eaf6f0]/80 via-white/85 to-[#e4f3ec]/80 border border-white/70 shadow-[0_16px_36px_rgba(20,110,80,0.06)]'
            }`}
          >
            <div className="flex flex-col items-center opacity-70">
              <CardSubdial slice={nextSlice} isDarkMode={isDarkMode} compact />
              <span className={`text-sm font-bold mt-4 line-clamp-1 max-w-[200px] text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {nextSlice.title}
              </span>
            </div>
          </motion.div>
        )}

        {/* Center Active Vertical Card: Spacious, Pure, Skeuomorphic */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`center-${currentSlice.id}`}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.015, y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onOpenSlice(currentSlice)}
            className={`relative z-20 w-[340px] sm:w-[380px] md:w-[400px] h-[450px] sm:h-[470px] rounded-[2.8rem] p-7 flex flex-col items-center justify-between text-center cursor-pointer pointer-events-auto transition-all group ${
              isDarkMode 
                ? 'bg-slate-900/90 border border-white/15 shadow-[0_24px_55px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                : 'bg-gradient-to-b from-[#f7fcf9]/95 via-white/95 to-[#eaf5ef]/95 backdrop-blur-2xl border border-white/95 shadow-[0_24px_50px_rgba(20,110,80,0.09),0_2px_6px_rgba(0,0,0,0.02)]'
            }`}
          >
            {/* Live Indicator Aura Glow */}
            {currentSlice.isLiveDynamic && (
              <div className="absolute -inset-1 rounded-[2.9rem] border-2 border-emerald-400/35 animate-pulse pointer-events-none" />
            )}

            {/* Top Subdial Micro-Appliance (图1) */}
            <div className="flex items-center justify-center shrink-0 pt-1">
              <CardSubdial 
                slice={currentSlice} 
                isDarkMode={isDarkMode} 
              />
            </div>

            {/* Bottom Section: AETHER Context Insight & Recommendation (图2 纯净版) */}
            <div className="flex flex-col items-center justify-center flex-1 w-full px-2 pt-3">
              {/* Header: A E T H E R 提醒 · 分类 ✨ */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-400">
                  A E T H E R 提醒 · {getCategoryLabel(currentSlice)}
                </span>
                <Sparkles size={13} className="text-amber-500 animate-pulse" />
              </div>

              {/* Title */}
              <h3 className={`text-lg sm:text-xl font-black tracking-tight leading-snug mb-2 line-clamp-1 max-w-[320px] ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {currentSlice.title}
              </h3>

              {/* AI Context Reasoning Advice */}
              <p className={`text-xs sm:text-[13px] font-normal leading-relaxed line-clamp-3 max-w-[310px] ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {currentSlice.recommendationReason || currentSlice.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Indicators & Quick Arrows */}
      <div className="flex items-center justify-center gap-4 mt-3 sm:mt-4 z-20">
        <button
          onClick={handlePrev}
          disabled={total <= 1}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            total <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
          } ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
          title="上一张卡片"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5">
          {slices.map((slice, i) => (
            <button
              key={slice.id}
              onClick={() => onSelectSliceIndex(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === activeSliceIndex 
                  ? 'w-7 h-1.5 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' 
                  : `w-1.5 h-1.5 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'}`
              }`}
              title={slice.title}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={total <= 1}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            total <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
          } ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
          title="下一张卡片"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
