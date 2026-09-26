import React, { useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Sparkles } from 'lucide-react';
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
  const isDraggingRef = useRef(false);

  const [isMobile, setIsMobile] = React.useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bgCardOffset = isMobile ? 85 : 122;
  const bgCardHoverOffset = isMobile ? 94 : 132;

  if (total === 0) return null;

  const currentSlice = slices[activeSliceIndex] || slices[0];
  const prevIndex = (activeSliceIndex - 1 + total) % total;
  const nextIndex = (activeSliceIndex + 1) % total;
  const prevSlice = total > 1 ? slices[prevIndex] : null;
  const nextSlice = total > 1 ? slices[nextIndex] : null;

  const handlePrev = () => {
    onSelectSliceIndex(prevIndex);
  };

  const handleNext = () => {
    onSelectSliceIndex(nextIndex);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 35;
    const velocityThreshold = 250;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }

    // Reset dragging flag after a tiny delay so click doesn't trigger open
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 80);
  };

  const getCategoryLabel = (slice: ServiceSlice) => {
    if (slice.badge) return slice.badge;
    if (slice.targetOverlay === 'podcast_library') return '知识节目库';
    if (slice.targetOverlay === 'calendar_flex') return '月度全景';
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
      
      {/* Coverflow Stage - Vertical Card Deck (Framed background slices subtly peeking out) */}
      <div className="relative w-full max-w-[620px] h-[490px] sm:h-[515px] flex items-center justify-center overflow-visible">
        
        {/* Left Neighbor Card (Delicate 1.5px blur, defined 2px border framing, partially peeking out) */}
        {total > 1 && prevSlice && (
          <motion.div
            key={`prev-${prevSlice.id}`}
            onClick={handlePrev}
            initial={{ opacity: 0, x: -60 }}
            animate={{ 
              opacity: 0.58, 
              x: -bgCardOffset, 
              scale: isMobile ? 0.84 : 0.89, 
              filter: 'blur(1.5px)' 
            }}
            whileHover={{ 
              opacity: 0.88, 
              scale: isMobile ? 0.86 : 0.91, 
              filter: 'blur(0px)',
              x: -bgCardHoverOffset 
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`absolute w-[300px] sm:w-[340px] md:w-[350px] h-[420px] sm:h-[445px] rounded-[2.8rem] p-6 flex flex-col items-center justify-center cursor-pointer pointer-events-auto transition-all z-10 ${
              isDarkMode 
                ? 'bg-zinc-850/85 border-2 border-white/20 shadow-[0_16px_36px_rgba(0,0,0,0.55)]' 
                : 'bg-gradient-to-b from-white/92 via-[#fcfcfd]/88 to-[#f4f5f7]/88 border-2 border-zinc-300/85 shadow-[0_16px_36px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]'
            }`}
          >
            <div className="flex flex-col items-center pointer-events-none w-full px-3">
              <CardSubdial slice={prevSlice} isDarkMode={isDarkMode} compact />
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mt-3 mb-0.5">
                {getCategoryLabel(prevSlice)}
              </span>
              <span className={`text-sm font-bold line-clamp-1 max-w-[190px] text-center ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                {prevSlice.title}
              </span>
            </div>
          </motion.div>
        )}

        {/* Right Neighbor Card (Delicate 1.5px blur, defined 2px border framing, partially peeking out) */}
        {total > 1 && nextSlice && (
          <motion.div
            key={`next-${nextSlice.id}`}
            onClick={handleNext}
            initial={{ opacity: 0, x: 60 }}
            animate={{ 
              opacity: 0.58, 
              x: bgCardOffset, 
              scale: isMobile ? 0.84 : 0.89, 
              filter: 'blur(1.5px)' 
            }}
            whileHover={{ 
              opacity: 0.88, 
              scale: isMobile ? 0.86 : 0.91, 
              filter: 'blur(0px)',
              x: bgCardHoverOffset 
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`absolute w-[300px] sm:w-[340px] md:w-[350px] h-[420px] sm:h-[445px] rounded-[2.8rem] p-6 flex flex-col items-center justify-center cursor-pointer pointer-events-auto transition-all z-10 ${
              isDarkMode 
                ? 'bg-zinc-850/85 border-2 border-white/20 shadow-[0_16px_36px_rgba(0,0,0,0.55)]' 
                : 'bg-gradient-to-b from-white/92 via-[#fcfcfd]/88 to-[#f4f5f7]/88 border-2 border-zinc-300/85 shadow-[0_16px_36px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]'
            }`}
          >
            <div className="flex flex-col items-center pointer-events-none w-full px-3">
              <CardSubdial slice={nextSlice} isDarkMode={isDarkMode} compact />
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mt-3 mb-0.5">
                {getCategoryLabel(nextSlice)}
              </span>
              <span className={`text-sm font-bold line-clamp-1 max-w-[190px] text-center ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                {nextSlice.title}
              </span>
            </div>
          </motion.div>
        )}

        {/* Center Active Vertical Card: Interactive Drag & Swipe to Switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`center-${currentSlice.id}`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.22}
            onDragStart={() => {
              isDraggingRef.current = true;
            }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.015, y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => {
              if (!isDraggingRef.current) {
                onOpenSlice(currentSlice);
              }
            }}
            className={`relative z-20 w-[340px] sm:w-[380px] md:w-[400px] h-[460px] sm:h-[480px] rounded-[2.8rem] px-6 py-6 sm:px-7 sm:py-7 flex flex-col items-center justify-between text-center cursor-grab active:cursor-grabbing pointer-events-auto transition-all group touch-pan-y ${
              isDarkMode 
                ? 'bg-zinc-900/95 border border-white/15 shadow-[0_24px_55px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                : 'bg-gradient-to-b from-white/98 via-[#fcfcfd]/95 to-[#f4f5f8]/95 backdrop-blur-2xl border border-white/95 shadow-[0_24px_55px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.02)]'
            }`}
          >
            {/* Live Indicator Aura Glow */}
            {currentSlice.isLiveDynamic && (
              <div className="absolute -inset-1 rounded-[2.9rem] border-2 border-emerald-500/30 animate-pulse pointer-events-none" />
            )}

            {/* Top Subdial Micro-Appliance (Shifted downwards for balanced optical center) */}
            <div className="flex items-center justify-center shrink-0 pt-5 sm:pt-7 pointer-events-none">
              <CardSubdial 
                slice={currentSlice} 
                isDarkMode={isDarkMode} 
              />
            </div>

            {/* Bottom Section: AETHER Context Insight & Recommendation (Shifted down to anchor comfortably in red circle) */}
            <div className="flex flex-col items-center justify-end w-full px-2 sm:px-3 pb-1 sm:pb-2 pt-2 pointer-events-none">
              {/* Header: A E T H E R 提醒 · 分类 ✨ */}
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500">
                  {currentSlice.isStaticHub ? 'A E T H E R 全景' : 'A E T H E R 提醒'} · {getCategoryLabel(currentSlice)}
                </span>
                <Sparkles size={12} className="text-zinc-400 dark:text-zinc-400" />
              </div>

              {/* Title */}
              <h3 className={`text-lg sm:text-[1.28rem] font-black tracking-tight leading-snug mb-1.5 line-clamp-1 max-w-[330px] ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                {currentSlice.title}
              </h3>

              {/* AI Context Reasoning Advice */}
              <p className={`text-xs sm:text-[13px] font-normal leading-relaxed line-clamp-2 max-w-[320px] ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                {currentSlice.recommendationReason || currentSlice.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pure Swipe Progress Dots (No arrow buttons, sleek & minimal, no interaction hint text) */}
      <div className="flex items-center justify-center mt-4 z-20">
        <div className="flex items-center gap-1.5 py-1">
          {slices.map((slice, i) => (
            <button
              key={slice.id}
              onClick={() => onSelectSliceIndex(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === activeSliceIndex 
                  ? 'w-7 h-1.5 bg-zinc-800 dark:bg-zinc-200 shadow-[0_0_6px_rgba(0,0,0,0.2)]' 
                  : `w-1.5 h-1.5 ${isDarkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-300 hover:bg-zinc-400'}`
              }`}
              title={slice.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
