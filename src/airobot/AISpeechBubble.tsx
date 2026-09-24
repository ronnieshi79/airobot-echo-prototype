import React from 'react';
import { motion } from 'motion/react';

interface AISpeechBubbleProps {
  text: string;
  isDark: boolean;
  role: 'user' | 'bot';
}

export const AISpeechBubble: React.FC<AISpeechBubbleProps> = ({ text, isDark, role }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: role === 'user' ? 20 : -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[90%] p-4 rounded-[2rem] text-[13px] leading-relaxed font-bold shadow-sm ${
        role === 'user' 
          ? 'bg-orange-5 text-orange-900 rounded-tr-none border border-orange-100' 
          : (isDark ? 'bg-white/5 text-slate-200 rounded-tl-none border border-white/10' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-md')
      }`}>
        {text}
      </div>
    </motion.div>
  );
};
