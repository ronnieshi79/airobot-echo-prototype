import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IPCharacter } from './IPCharacter';
import { VoiceDialoguePanel } from './VoiceDialoguePanel';
import { VoiceInputPanel } from './VoiceInputPanel';
import { ConversationState, Message, MainCategory } from '../types';

interface VoiceBubbleKitProps {
  isChatOpen: boolean;
  setIsChatOpen: (o: boolean) => void;
  conversationState: ConversationState;
  setConversationState: (s: ConversationState) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (a: boolean) => void;
  isSpeaking: boolean;
  isBlinking: boolean;
  messages: Message[];
  suggestions: string[];
  isDarkMode: boolean;
  mainCategory: MainCategory;
  onSendMessage: (text: string) => void;
  onStartVoice: () => void;
  onStopVoice: () => void;
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
}

export const VoiceBubbleKit: React.FC<VoiceBubbleKitProps> = ({
  isChatOpen,
  setIsChatOpen,
  conversationState,
  setConversationState,
  isVoiceActive,
  setIsVoiceActive,
  isSpeaking,
  isBlinking,
  messages,
  suggestions,
  isDarkMode,
  mainCategory,
  onSendMessage,
  onStartVoice,
  onStopVoice,
  chatScrollRef
}) => {
  return (
    <div className={`hidden lg:flex justify-end ${isChatOpen ? 'items-center' : 'items-end'} h-full pointer-events-auto p-12`}>
      <div className="flex flex-col items-center gap-8 w-[395px]">
        <AnimatePresence mode="wait">
          {isChatOpen && (
            <div className="flex flex-col items-center gap-6 w-full">
              <VoiceDialoguePanel 
                messages={messages}
                conversationState={conversationState}
                isDark={isDarkMode}
                mainCategory={mainCategory}
                onClose={() => { setIsChatOpen(false); setConversationState('idle'); onStopVoice(); }}
                chatScrollRef={chatScrollRef}
              />
              <VoiceInputPanel 
                conversationState={conversationState}
                isDark={isDarkMode}
                onSendMessage={onSendMessage}
                suggestions={suggestions}
              />
            </div>
          )}
        </AnimatePresence>

        <div className={`flex flex-col items-center gap-6 relative ${isChatOpen ? 'hidden' : 'flex'}`}>
          <IPCharacter 
            conversationState={conversationState}
            isSpeaking={isSpeaking}
            isBlinking={isBlinking}
            isVoiceActive={isVoiceActive}
            onClick={() => setIsChatOpen(!isChatOpen)}
          />

          {!isChatOpen && (
            <div className="flex flex-col items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isVoiceActive ? onStopVoice : onStartVoice}
                className="flex flex-col items-center gap-4 cursor-pointer group"
              >
                <div className="flex gap-2 items-center justify-center h-12">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div 
                      key={i}
                      animate={isVoiceActive ? { 
                        height: [8, i === 3 ? 32 : (i === 2 || i === 4 ? 24 : 16), 8],
                        opacity: 1
                      } : { 
                        height: [4, 6, 4],
                        opacity: 0.6
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: isVoiceActive ? 0.6 : 3, 
                        delay: i * 0.12,
                        ease: "easeInOut"
                      }}
                      className={`w-1.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)] ${isVoiceActive ? 'bg-cyan-400' : 'bg-cyan-400/40'}`}
                    />
                  ))}
                </div>
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${isDarkMode ? 'text-cyan-400/60' : 'text-cyan-500/60'}`}>
                  叫名字对话
                </span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
