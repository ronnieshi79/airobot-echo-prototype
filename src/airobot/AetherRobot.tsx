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
  layoutId,
  onClick,
}) => {
  // Gentle breathing / floating idle animation matching Figure 2
  return (
    <motion.div 
      layoutId={layoutId}
      className="relative flex flex-col items-center select-none cursor-pointer"
      onClick={onClick}
    >
      {/* Main Character Body (Squircle 3D Cute Robot exactly matching Figure 2) */}
      <motion.div
        animate={isSpeaking ? {
          y: [0, -8, 0],
          scale: [1, 1.03, 1],
          rotate: [0, -1.5, 1.5, 0],
          transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
        } : {
          y: [0, -6, 0],
          rotate: [0, 0.8, -0.8, 0],
          transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.96 }}
        className="relative w-36 h-32 flex items-center justify-center"
      >
        {/* Soft Rounded Ears on Top (Behind Head) */}
        <div className="absolute -top-4 inset-x-0 flex justify-between px-7 z-0 pointer-events-none">
          {/* Left Ear */}
          <motion.div 
            animate={isSpeaking ? {
              rotate: [-10, 0, -10],
              y: [-2, 0, -2],
              transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
            } : {
              rotate: [-6, -2, -6],
              y: [0, -1, 0],
              transition: { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
            }}
            className="w-7 h-11 rounded-[1.2rem] bg-gradient-to-b from-[#ffffff] via-[#fffbf7] to-[#fbf1e7] p-1.5 shadow-[0_4px_12px_rgba(255,180,150,0.22)] border-2 border-white/90 flex items-center justify-center origin-bottom"
          >
            {/* Inner Pink Ear Glow */}
            <div className="w-full h-full rounded-[0.8rem] bg-gradient-to-b from-[#ffdfe5] to-[#ffb6c7] shadow-inner opacity-90" />
          </motion.div>

          {/* Right Ear */}
          <motion.div 
            animate={isSpeaking ? {
              rotate: [10, 0, 10],
              y: [-2, 0, -2],
              transition: { repeat: Infinity, duration: 0.8, delay: 0.1, ease: "easeInOut" }
            } : {
              rotate: [6, 2, 6],
              y: [0, -1, 0],
              transition: { repeat: Infinity, duration: 3.5, delay: 0.2, ease: "easeInOut" }
            }}
            className="w-7 h-11 rounded-[1.2rem] bg-gradient-to-b from-[#ffffff] via-[#fffbf7] to-[#fbf1e7] p-1.5 shadow-[0_4px_12px_rgba(255,180,150,0.22)] border-2 border-white/90 flex items-center justify-center origin-bottom"
          >
            {/* Inner Pink Ear Glow */}
            <div className="w-full h-full rounded-[0.8rem] bg-gradient-to-b from-[#ffdfe5] to-[#ffb6c7] shadow-inner opacity-90" />
          </motion.div>
        </div>

        {/* Head Shape: Squircle 3D Cream Marshmallow Head (Exact match with Figure 2) */}
        <div className="relative z-10 w-[132px] h-[116px] rounded-[2.9rem] bg-gradient-to-b from-[#ffffff] via-[#fffdfa] to-[#fbf1e7] shadow-[0_16px_32px_rgba(255,175,135,0.22),inset_0_4px_8px_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(255,215,195,0.32)] border-2 border-white/90 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Eyes Container */}
          <div className="flex gap-5 items-center justify-center mt-2 z-10">
            {/* Left Eye */}
            <motion.div 
              animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
              transition={{ duration: 0.12 }}
              className="w-5 h-7 rounded-full bg-[#1c1d28] relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden"
            >
              {/* Primary Large Highlight */}
              <div className="absolute top-1 left-1 w-2.5 h-3 bg-white rounded-full opacity-95" />
              {/* Secondary Tiny Highlight */}
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full opacity-80" />
            </motion.div>

            {/* Right Eye */}
            <motion.div 
              animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
              transition={{ duration: 0.12 }}
              className="w-5 h-7 rounded-full bg-[#1c1d28] relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden"
            >
              {/* Primary Large Highlight */}
              <div className="absolute top-1 left-1 w-2.5 h-3 bg-white rounded-full opacity-95" />
              {/* Secondary Tiny Highlight */}
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full opacity-80" />
            </motion.div>
          </div>

          {/* Cheeks Blush (Soft Pink Diffuse Ovals) */}
          <div className="absolute top-13 inset-x-0 flex justify-between px-3 z-0 pointer-events-none">
            <div className="w-5 h-3 rounded-full bg-[#ff7b96] opacity-60 blur-[3px]" />
            <div className="w-5 h-3 rounded-full bg-[#ff7b96] opacity-60 blur-[3px]" />
          </div>

          {/* Cute Little Dot Mouth / Nose */}
          <div className="mt-1 z-10 flex items-center justify-center">
            {isSpeaking ? (
              <motion.div 
                animate={{ 
                  height: [3, 7, 3],
                  width: [5, 9, 5],
                  borderRadius: ['10px', '40%', '10px']
                }}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="bg-[#242631]"
              />
            ) : (
              <div className="w-1.5 h-1 rounded-full bg-[#242631] opacity-75" />
            )}
          </div>
        </div>

        {/* Ambient Warm Peach Shadow Underneath (Ground Contact Glow in Figure 2) */}
        <div className="absolute -bottom-2 w-28 h-5 rounded-[100%] bg-gradient-to-r from-transparent via-[#ff9e7a]/35 to-transparent blur-md pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

