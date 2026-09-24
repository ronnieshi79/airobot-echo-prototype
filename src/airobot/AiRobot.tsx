import React from 'react';
import { motion } from 'motion/react';

interface AiRobotProps {
  conversationState: 'idle' | 'listening' | 'thinking' | 'speaking';
  isBlinking: boolean;
  isVoiceActive: boolean;
  onClick: () => void;
  isDarkMode: boolean;
}

export const AiRobot: React.FC<AiRobotProps> = ({
  conversationState,
  isBlinking,
  isVoiceActive,
  onClick,
  isDarkMode,
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      {/* Robot Body */}
      <div className={`w-[245px] h-[245px] rounded-[4rem] flex items-center justify-center relative border-8 border-white shadow-2xl transition-all ${
        isVoiceActive ? 'bg-orange-500 scale-110' : 'bg-[#BEE9F8]'
      }`}>
        {/* Eyes */}
        <div className="flex gap-10">
          <motion.div 
            animate={isBlinking ? { scaleY: 0.1 } : (conversationState === 'speaking' ? { scaleY: [1, 0.6, 1] } : { scaleY: 1 })}
            transition={isBlinking ? { duration: 0.1 } : { repeat: Infinity, duration: 0.5 }}
            className={`w-4 h-12 rounded-full ${isVoiceActive ? 'bg-white' : 'bg-orange-500'}`}
          />
          <motion.div 
            animate={isBlinking ? { scaleY: 0.1 } : (conversationState === 'speaking' ? { scaleY: [1, 0.6, 1] } : { scaleY: 1 })}
            transition={isBlinking ? { duration: 0.1 } : { repeat: Infinity, duration: 0.5, delay: 0.1 }}
            className={`w-4 h-12 rounded-full ${isVoiceActive ? 'bg-white' : 'bg-orange-500'}`}
          />
        </div>

        {/* Voice Waves when listening */}
        {conversationState === 'listening' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.5 }}
                className="absolute w-20 h-20 rounded-full border-2 border-orange-400"
              />
            ))}
          </div>
        )}
      </div>

      {/* Robot Antenna */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className={`w-2 h-8 rounded-full ${isVoiceActive ? 'bg-orange-400' : 'bg-slate-300'}`} />
        <motion.div 
          animate={isVoiceActive ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : { scale: 1 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className={`w-4 h-4 rounded-full -mt-1 ${isVoiceActive ? 'bg-orange-500' : 'bg-slate-400'}`}
        />
      </div>
    </motion.div>
  );
};
