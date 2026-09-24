import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Check, RefreshCw, Sparkles } from 'lucide-react';
import { ContextType, CONTEXT_PRESETS } from './types';
import { getContextTheme } from '../theme/contextThemes';

interface ContextSelectorProps {
  currentContext: ContextType;
  isAuto: boolean;
  onSelectContext: (ctx: ContextType | 'auto') => void;
  isDarkMode: boolean;
}

export const ContextSelector: React.FC<ContextSelectorProps> = ({
  currentContext,
  isAuto,
  onSelectContext,
  isDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeMeta = CONTEXT_PRESETS.find(p => p.id === currentContext) || CONTEXT_PRESETS[0];
  const activeTheme = getContextTheme(currentContext);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative select-none">
      
      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full left-0 mb-3 w-72 rounded-3xl p-3 shadow-2xl backdrop-blur-xl border z-50 ${
              isDarkMode 
                ? 'bg-slate-900/95 border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]' 
                : 'bg-white/95 border-slate-200/70 text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
            }`}
          >
            <div className="px-3 py-2 border-b border-slate-100/50 dark:border-slate-800/50 mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  情境与动态主题
                </span>
                <Sparkles size={11} className="text-amber-500 animate-pulse" />
              </div>
              {isAuto && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                  自动感知中
                </span>
              )}
            </div>

            {/* Auto Switcher Option */}
            <button
              onClick={() => {
                onSelectContext('auto');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isAuto 
                  ? (isDarkMode ? 'bg-white/10 text-cyan-400' : 'bg-emerald-50 text-emerald-700') 
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw size={14} className={isAuto ? 'animate-spin' : ''} />
                <div className="flex flex-col text-left">
                  <span>算法自动感知</span>
                  <span className="text-[10px] font-normal opacity-70">随自然作息与生理节律动态演进</span>
                </div>
              </div>
              {isAuto && <Check size={14} />}
            </button>

            <div className="h-px bg-slate-100/60 dark:bg-slate-800/60 my-1.5" />

            {/* Context & Theme List */}
            <div className="space-y-1">
              {CONTEXT_PRESETS.map((preset) => {
                const isSelected = !isAuto && currentContext === preset.id;
                const theme = getContextTheme(preset.id);
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectContext(preset.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? (isDarkMode ? 'bg-white/10 text-cyan-400' : 'bg-slate-100 text-slate-900')
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{preset.icon}</span>
                      <div className="flex flex-col text-left">
                        <span>{preset.name}</span>
                        <span className="text-[10px] font-normal opacity-60">
                          {theme.tagline}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Pill Button: Integrated Context & Theme Pill */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-xl border transition-all cursor-pointer ${
          isDarkMode 
            ? 'bg-slate-900/80 border-white/10 text-slate-200 hover:bg-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' 
            : `${activeTheme.pillBg} ${activeTheme.pillBorder} ${activeTheme.textPrimary} ${activeTheme.pillShadow}`
        }`}
      >
        <span className="text-base">{activeMeta.icon}</span>
        <span className="text-xs font-black tracking-tight">{activeMeta.name}</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </motion.button>
    </div>
  );
};
