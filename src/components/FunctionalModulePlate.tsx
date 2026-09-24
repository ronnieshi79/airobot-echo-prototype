import React from 'react';
import { motion } from 'motion/react';

interface FunctionalModulePlateProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  className?: string;
  footer?: React.ReactNode;
}

export const FunctionalModulePlate: React.FC<FunctionalModulePlateProps> = ({ 
  children, 
  isDarkMode,
  className = "",
  footer
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`w-full max-w-[640px] h-[725px] p-10 rounded-[5rem] transition-all duration-500 relative border-2 ${
        isDarkMode 
          ? 'bg-slate-900/80 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]' 
          : 'bg-white/90 border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.1)]'
      } backdrop-blur-xl ${className}`}
    >
      {/* Decorative background element */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-10 -mr-20 -mt-20 overflow-hidden pointer-events-none ${isDarkMode ? 'bg-orange-500' : 'bg-orange-200'}`}></div>
      
      <div className="relative z-10 h-full w-full">
        {children}
      </div>

      {/* Mounted Footer (e.g. SubCategoryDial) */}
      {footer && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-50">
          {footer}
        </div>
      )}
    </motion.div>
  );
};
