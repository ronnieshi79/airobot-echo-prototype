import React from 'react';
import { motion } from 'motion/react';
import { ConversationState } from '../types';

interface IPCharacterProps {
  conversationState: ConversationState;
  isSpeaking: boolean;
  isBlinking: boolean;
  isVoiceActive: boolean;
  onClick: () => void;
}

export const IPCharacter: React.FC<IPCharacterProps> = ({ 
  conversationState, 
  isSpeaking, 
  isBlinking, 
  isVoiceActive,
  onClick 
}) => {
  return (
    <motion.div 
      animate={{ 
        y: [0, -8, 0],
        rotate: [0, 1, -1, 0]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 4, 
        ease: "easeInOut" 
      }}
      className="relative flex flex-col items-center"
    >
      <motion.button 
        animate={{ 
          rotate: isSpeaking ? [0, -1.5, 1.5, 0] : [0, 0.5, -0.5, 0],
          scale: isSpeaking ? 1.05 : 1
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: isSpeaking ? 0.4 : 6 },
          scale: { duration: 0.3 }
        }}
        onClick={onClick}
        className={`robot-head group transition-all duration-500 border-4 bg-gradient-to-br from-violet-200 via-violet-300 to-violet-400 border-white shadow-2xl ${
          isSpeaking ? 'shadow-[0_0_60px_rgba(167,139,250,0.4)]' : ''
        }`}
      >
        <motion.div 
          animate={{ rotate: isSpeaking ? [0, 45, -45, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="robot-ear-left bg-violet-500 w-8 h-14 -left-4"
        ></motion.div>
        <motion.div 
          animate={{ rotate: isSpeaking ? [0, -45, 45, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="robot-ear-right bg-violet-500 w-8 h-14 -right-4"
        ></motion.div>
        
        <div className="flex gap-8">
          <motion.div 
            animate={isSpeaking 
              ? { scaleY: [1, 0.2, 1, 0.5, 1], scaleX: [1, 1.2, 1, 1.1, 1] } 
              : (isBlinking ? { scaleY: 0.1 } : { scaleY: [1, 1.1, 1], y: [0, 1, 0] })
            }
            transition={isSpeaking 
              ? { repeat: Infinity, duration: 0.8 } 
              : (isBlinking ? { duration: 0.1 } : { repeat: Infinity, duration: 3 })
            }
            className="robot-eye w-6 h-6 bg-slate-900 rounded-full shadow-inner border-2 border-white/20"
          >
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
          </motion.div>
          <motion.div 
            animate={isSpeaking 
              ? { scaleY: [1, 0.2, 1, 0.5, 1], scaleX: [1, 1.2, 1, 1.1, 1] } 
              : (isBlinking ? { scaleY: 0.1 } : { scaleY: [1, 1.1, 1], y: [0, 1, 0] })
            }
            transition={isSpeaking 
              ? { repeat: Infinity, duration: 0.8, delay: 0.1 } 
              : (isBlinking ? { duration: 0.1 } : { repeat: Infinity, duration: 3, delay: 0.2 })
            }
            className="robot-eye w-6 h-6 bg-slate-900 rounded-full shadow-inner border-2 border-white/20"
          >
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
          </motion.div>
        </div>

        <motion.div 
          animate={isSpeaking 
            ? { 
                height: [4, 16, 4, 12, 4],
                width: [24, 36, 24, 30, 24],
                borderRadius: ["20px", "50%", "20px", "40%", "20px"]
              } 
            : { height: 4, width: 24, borderRadius: "20px" }
          }
          transition={{ duration: 0.15, repeat: isSpeaking ? Infinity : 0 }}
          className="mt-6 bg-slate-900"
        ></motion.div>
      </motion.button>
      
      <div className="w-8 h-3 -mt-2 rounded-full shadow-inner bg-violet-400 z-10"></div>
      
      <div className="w-28 h-16 rounded-[2.5rem] -mt-1 shadow-2xl flex items-center justify-center bg-gradient-to-r from-indigo-300 to-violet-300 border-2 border-white/40">
        <div className="flex items-center justify-center gap-2">
          {[1,2,3,4,5].map(i => (
            <motion.div 
              key={i} 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
                backgroundColor: ["#ffffff", "#a78bfa", "#ffffff"]
              }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
              className="w-1.5 h-1.5 rounded-full"
            ></motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
