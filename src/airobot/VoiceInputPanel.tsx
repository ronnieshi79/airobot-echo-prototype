import React from 'react';
import { motion } from 'motion/react';
import { ConversationState } from '../types';

interface VoiceInputPanelProps {
  conversationState: ConversationState;
  isDark: boolean;
  onSendMessage: (text: string) => void;
  suggestions: string[];
}

export const VoiceInputPanel: React.FC<VoiceInputPanelProps> = ({ 
  conversationState, 
  isDark, 
  onSendMessage,
  suggestions 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 w-full mt-4"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSendMessage("比特森林在哪？")}
        className={`w-[245px] h-16 rounded-full flex items-center justify-center gap-5 cursor-pointer transition-all ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/5 shadow-xl'}`}
      >
        <div className="flex gap-1.5 items-center">
          {[1, 2, 3, 4, 5].map(i => (
            <motion.div 
              key={i}
              animate={conversationState === 'listening' ? { 
                height: [10, i === 3 ? 32 : (i === 2 || i === 4 ? 24 : 16), 10],
              } : { height: 8 }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
              className="w-2 rounded-full bg-orange-500"
            />
          ))}
        </div>
        <span className="text-base font-black text-orange-500 tracking-widest">请说话...</span>
      </motion.div>

      {/* Suggestion Tags */}
      <div className="flex flex-wrap justify-center gap-2 max-w-[282px]">
        {suggestions.slice(0, 3).map((tag, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
            onClick={() => onSendMessage(tag)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all border ${
              isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-black/5 text-slate-500'
            }`}
          >
            {tag}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
