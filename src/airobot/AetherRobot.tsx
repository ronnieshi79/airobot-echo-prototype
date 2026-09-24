import React from 'react';
import { motion } from 'motion/react';
import { RobotState } from './useAether';

interface AetherRobotProps {
  isSpeaking: boolean;
  isBlinking: boolean;
  isChatOpen: boolean;
  robotState?: RobotState;
  activeCardType?: 'focus' | 'timer' | 'calendar' | 'podcast' | 'alarm' | 'logbook';
  layoutId?: string;
  onClick: () => void;
}

export const AetherRobot: React.FC<AetherRobotProps> = ({
  isSpeaking,
  isBlinking,
  isChatOpen,
  robotState = 'ready',
  activeCardType = 'focus',
  layoutId,
  onClick,
}) => {
  // Determine actual emotional state
  let currentState = isSpeaking ? 'talking' : robotState;
  if (!isSpeaking && robotState === 'ready') {
    if (activeCardType === 'focus') currentState = 'working';
    else if (activeCardType === 'podcast') currentState = 'talking';
    else if (activeCardType === 'alarm') currentState = 'ready';
  }

  // Float animation
  const floatVariants = {
    ready: { y: [0, -10, 0], rotate: [0, 1.5, -1.5, 0], transition: { repeat: Infinity, duration: 3.5, ease: "easeInOut" } },
    talking: { y: [0, -12, 0], rotate: [0, -3, 3, 0], scale: [1, 1.03, 1], transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } },
    sleeping: { y: [5, 12, 5], rotate: [0, -1, 1, 0], transition: { repeat: Infinity, duration: 4.5, ease: "easeInOut" } },
    working: { y: [0, -6, 0], rotate: [0, 1, -1, 0], scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
    dazing: { y: [0, -15, 0], rotate: [0, 4, -4, 0], transition: { repeat: Infinity, duration: 5, ease: "easeInOut" } },
  };

  const currentVariant = (floatVariants as any)[currentState] || floatVariants.ready;

  return (
    <motion.div 
      layoutId={layoutId}
      className="relative flex flex-col items-center select-none cursor-pointer"
      onClick={onClick}
    >
      {/* State effect particles (Zzz for sleeping) */}
      {currentState === 'sleeping' && (
        <>
          <motion.div 
            animate={{ y: [-5, -35], opacity: [0, 1, 0], x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute -top-4 right-2 text-rose-300 font-bold text-sm z-30 pointer-events-none"
          >
            z
          </motion.div>
          <motion.div 
            animate={{ y: [-10, -45], opacity: [0, 1, 0], x: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: 0.8 }}
            className="absolute -top-8 -right-2 text-rose-400 font-extrabold text-base z-30 pointer-events-none"
          >
            Z
          </motion.div>
        </>
      )}

      {/* Musical notes when on podcast */}
      {activeCardType === 'podcast' && !isSpeaking && (
        <motion.div 
          animate={{ y: [-5, -25], opacity: [0, 0.9, 0], x: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute -top-5 right-2 text-violet-400 font-bold text-sm z-30 pointer-events-none"
        >
          ♪
        </motion.div>
      )}

      {/* Main Character Body (Borderless, Skeuomorphic 3D Bunny Robot matching screenshot) */}
      <motion.div
        animate={currentVariant}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="relative w-36 h-32 flex items-center justify-center transition-all duration-500"
      >
        {/* Soft Bunny Ears on Top */}
        <div className="absolute -top-6 inset-x-0 flex justify-between px-6 z-0 pointer-events-none">
          {/* Left Ear */}
          <motion.div 
            animate={
              currentState === 'sleeping' ? { rotate: -25, y: 6 } :
              currentState === 'talking' ? { rotate: [-10, -2, -10], y: [-2, 0, -2] } :
              currentState === 'working' ? { rotate: -4, y: -2 } :
              { rotate: [-6, 0, -6], y: [0, -2, 0] }
            }
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-8 h-14 rounded-full bg-gradient-to-b from-[#ffffff] via-[#fff5ee] to-[#fcebe3] p-1.5 shadow-[0_6px_16px_rgba(255,180,160,0.25)] border-2 border-white/90 flex items-center justify-center origin-bottom -rotate-6"
          >
            {/* Inner Pink Ear Glow */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#ffccd8] to-[#ffb1c4] shadow-inner opacity-90" />
          </motion.div>

          {/* Right Ear */}
          <motion.div 
            animate={
              currentState === 'sleeping' ? { rotate: 25, y: 6 } :
              currentState === 'talking' ? { rotate: [10, 2, 10], y: [-2, 0, -2] } :
              currentState === 'working' ? { rotate: 4, y: -2 } :
              { rotate: [6, 0, 6], y: [0, -2, 0] }
            }
            transition={{ repeat: Infinity, duration: 3, delay: 0.2, ease: "easeInOut" }}
            className="w-8 h-14 rounded-full bg-gradient-to-b from-[#ffffff] via-[#fff5ee] to-[#fcebe3] p-1.5 shadow-[0_6px_16px_rgba(255,180,160,0.25)] border-2 border-white/90 flex items-center justify-center origin-bottom rotate-6"
          >
            {/* Inner Pink Ear Glow */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#ffccd8] to-[#ffb1c4] shadow-inner opacity-90" />
          </motion.div>
        </div>

        {/* Head Shape: Smooth, plump cream squircle with warm 3D lighting */}
        <div className="relative z-10 w-32 h-28 rounded-[3.2rem] bg-gradient-to-b from-[#ffffff] via-[#fff9f4] to-[#f9ede3] shadow-[0_18px_35px_rgba(240,160,130,0.2),inset_0_-8px_16px_rgba(255,200,180,0.25),inset_0_4px_8px_rgba(255,255,255,0.9)] border border-white/80 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Eyes Container */}
          <div className="flex gap-6 items-center justify-center mt-3 z-10">
            {/* Left Eye */}
            <motion.div 
              animate={
                isBlinking ? { scaleY: 0.1 } :
                currentState === 'sleeping' ? { scaleY: 0.1, y: 3 } :
                currentState === 'working' ? { scaleY: 1, scaleX: 1.05 } :
                { scaleY: [1, 1.04, 1] }
              }
              transition={{ repeat: Infinity, duration: 3.2 }}
              className="w-6 h-8 rounded-full bg-[#1b1c24] relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden"
            >
              {/* Primary Large Highlight */}
              <div className="absolute top-1.5 left-1.5 w-2.5 h-3.5 bg-white rounded-full opacity-95 shadow-[0_0_2px_white]" />
              {/* Secondary Tiny Highlight */}
              <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-white rounded-full opacity-80" />
            </motion.div>

            {/* Right Eye */}
            <motion.div 
              animate={
                isBlinking ? { scaleY: 0.1 } :
                currentState === 'sleeping' ? { scaleY: 0.1, y: 3 } :
                currentState === 'working' ? { scaleY: 1, scaleX: 1.05 } :
                { scaleY: [1, 1.04, 1] }
              }
              transition={{ repeat: Infinity, duration: 3.2, delay: 0.1 }}
              className="w-6 h-8 rounded-full bg-[#1b1c24] relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden"
            >
              {/* Primary Large Highlight */}
              <div className="absolute top-1.5 left-1.5 w-2.5 h-3.5 bg-white rounded-full opacity-95 shadow-[0_0_2px_white]" />
              {/* Secondary Tiny Highlight */}
              <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-white rounded-full opacity-80" />
            </motion.div>
          </div>

          {/* Cheeks Blush */}
          <div className="absolute top-14 inset-x-0 flex justify-between px-3 z-0 pointer-events-none">
            <motion.div 
              animate={{ opacity: isSpeaking ? [0.7, 0.9, 0.7] : [0.55, 0.7, 0.55] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-5 h-3 rounded-full bg-[#ff7b95] blur-[4px]"
            />
            <motion.div 
              animate={{ opacity: isSpeaking ? [0.7, 0.9, 0.7] : [0.55, 0.7, 0.55] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              className="w-5 h-3 rounded-full bg-[#ff7b95] blur-[4px]"
            />
          </div>

          {/* Cute Little Mouth */}
          <div className="mt-1.5 z-10 flex items-center justify-center">
            {isSpeaking ? (
              <motion.div 
                animate={{ 
                  height: [3, 9, 4, 8, 3],
                  width: [6, 11, 7, 10, 6],
                  borderRadius: ['10px', '40%', '10px', '50%', '10px']
                }}
                transition={{ repeat: Infinity, duration: 0.35 }}
                className="bg-[#242631]"
              />
            ) : (
              <motion.div 
                animate={{ width: 5, height: 2, borderRadius: '4px' }}
                className="bg-[#242631] opacity-70"
              />
            )}
          </div>

          {/* Under Chin Warm Glow Rim */}
          <div className="absolute bottom-1 inset-x-4 h-1.5 rounded-full bg-gradient-to-r from-transparent via-[#ffe4d4] to-transparent opacity-80" />
        </div>

        {/* Cute Rounded Hands / Paws holding the cheeks */}
        <motion.div 
          animate={
            currentState === 'working' ? { x: [0, 1, 0], y: [0, -1, 0] } :
            currentState === 'talking' ? { rotate: [-5, 5, -5], y: [-1, 1, -1] } :
            { y: [0, 1, 0] }
          }
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -left-1 top-12 w-6 h-7 rounded-full bg-gradient-to-br from-white to-[#fff2ec] border border-white/80 shadow-[0_4px_8px_rgba(240,160,130,0.25)] z-20"
        />
        <motion.div 
          animate={
            currentState === 'working' ? { x: [0, -1, 0], y: [0, -1, 0] } :
            currentState === 'talking' ? { rotate: [5, -5, 5], y: [-1, 1, -1] } :
            { y: [0, 1, 0] }
          }
          transition={{ repeat: Infinity, duration: 2, delay: 0.15 }}
          className="absolute -right-1 top-12 w-6 h-7 rounded-full bg-gradient-to-bl from-white to-[#fff2ec] border border-white/80 shadow-[0_4px_8px_rgba(240,160,130,0.25)] z-20"
        />

        {/* Subtle Ambient Shadow Underneath */}
        <div className="absolute -bottom-3 w-24 h-4 rounded-[100%] bg-[#408570]/10 blur-sm pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};
