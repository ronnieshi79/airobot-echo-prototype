import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Check, Sparkles, RefreshCw } from 'lucide-react';
import { ContextType, CONTEXT_PRESETS } from '../services/contextEngine';

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
    <div ref={containerRef} className="fixed bottom-8 left-10 z-30 select-none">
      
      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full left-0 mb-3 w-64 rounded-3xl p-3 shadow-2xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-slate-900/95 border-white/10 text-white' 
                : 'bg-white/95 border-slate-200/60 text-slate-800'
            }`}
          >
            <div className="px-3 py-2 border-b border-slate-100/50 mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                情境感知模式
              </span>
              {isAuto && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  实时自动感知中
                </span>
              )}
            </div>

            {/* Auto Switcher Option */}
            <button
              onClick={() => {
                onSelectContext('auto');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isAuto 
                  ? (isDarkMode ? 'bg-white/10 text-cyan-400' : 'bg-emerald-50 text-emerald-700') 
                  : 'hover:bg-black/5 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw size={14} className={isAuto ? 'animate-spin' : ''} />
                <span>自动情境感知</span>
              </div>
              {isAuto && <Check size={14} />}
            </button>

            <div className="h-px bg-slate-100/40 my-1.5" />

            {/* Manual Context List */}
            <div className="space-y-1">
              {CONTEXT_PRESETS.map((preset) => {
                const isSelected = !isAuto && currentContext === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectContext(preset.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                      isSelected
                        ? (isDarkMode ? 'bg-white/10 text-cyan-400' : 'bg-indigo-50 text-indigo-700')
                        : 'hover:bg-black/5 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{preset.icon}</span>
                      <span>{preset.name}</span>
                    </div>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bottom-Left Context Pill (Matches screenshot: "☀️ 深度工作 ⌃") */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-sm backdrop-blur-md border transition-all cursor-pointer ${
          isDarkMode
            ? 'bg-slate-900/80 border-white/10 text-slate-200 hover:bg-slate-800'
            : 'bg-white/80 border-white/90 text-slate-700 hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]'
        }`}
      >
        <span className="text-sm">{activeMeta.icon}</span>
        <span>{activeMeta.name}</span>
        <ChevronUp 
          size={14} 
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

    </div>
  );
};
