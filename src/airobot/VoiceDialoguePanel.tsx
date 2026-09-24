import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, ConversationState, MainCategory } from '../types';
import { AISpeechBubble } from './AISpeechBubble';
import { X, Timer, MessageSquare, Calendar } from 'lucide-react';

interface VoiceDialoguePanelProps {
  messages: Message[];
  conversationState: ConversationState;
  isDark: boolean;
  mainCategory: MainCategory;
  onClose: () => void;
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
}

export const VoiceDialoguePanel: React.FC<VoiceDialoguePanelProps> = ({ 
  messages, 
  conversationState, 
  isDark, 
  mainCategory,
  onClose,
  chatScrollRef
}) => {
  return (
    <motion.div 
      key="chat-panel"
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 40 }}
      className={`relative w-[320px] rounded-[3rem] shadow-2xl overflow-visible flex flex-col ${isDark ? 'bg-slate-900/95 border border-white/10' : 'bg-white/95 border border-black/5'}`}
    >
      {/* Header Info */}
      <div className="pt-8 pb-4 px-8 flex items-center justify-between">
        <div className="ml-20 flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
              {mainCategory === 'time' && <Timer size={14} className="text-orange-500" />}
              {mainCategory === 'chat' && <MessageSquare size={14} className="text-orange-500" />}
              {mainCategory === 'calendar' && <Calendar size={14} className="text-orange-500" />}
            </div>
            <span className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {mainCategory === 'time' ? '专注时钟' : 
               mainCategory === 'chat' ? 'AI 对话' : '日程助手'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-cyan-400"
            />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {conversationState === 'listening' ? 'AETHER LISTENING' : 
               conversationState === 'thinking' ? 'AETHER THINKING' : 
               conversationState === 'speaking' ? 'AETHER SPEAKING' : 'AETHER IDLE'}
            </span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 border ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-50 border-black/5 text-slate-400 hover:bg-slate-100'}`}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={chatScrollRef}
        className="px-6 pb-8 flex flex-col gap-4 h-[400px] overflow-y-auto scroll-smooth scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <AISpeechBubble key={i} text={msg.text} isDark={isDark} role={msg.role} />
          ))}
        </AnimatePresence>
        
        {conversationState === 'thinking' && (
          <div className="flex justify-start">
            <div className="flex gap-1 p-3">
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  className="w-1 h-1 rounded-full bg-orange-400"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
