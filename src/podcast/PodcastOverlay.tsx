import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Minimize2,
  Power,
  Disc,
  Radio,
  MessageCircle,
  Tv,
  BookOpen,
  Volume2,
  Bookmark,
  Sparkles,
  Layers,
  CheckSquare,
  AudioLines,
} from "lucide-react";
import { PodcastEpisode } from "./usePodcast";

interface PodcastOverlayProps {
  show: boolean;
  isDarkMode: boolean;
  episode: PodcastEpisode | null;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  onClose: () => void;
  onAskAether: (topic: string) => void;
}

export const PodcastOverlay: React.FC<PodcastOverlayProps> = ({
  show,
  isDarkMode,
  episode,
  isPlaying,
  progress,
  onTogglePlay,
  onClose,
  onAskAether,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (featureName: string) => {
    setToastMessage(`【${featureName}】功能后续将根据用户需求开发，当前先作为演示原型。`);
    setTimeout(() => {
      setToastMessage((prev) => (prev?.includes(featureName) ? null : prev));
    }, 2800);
  };

  if (!episode) return null;

  // Split content into paragraphs or dialogue segments for dynamic captions and notebook tracking
  const scriptLines = episode.content
    ? episode.content.split("\n").filter((line) => line.trim())
    : [];
  const activeScriptIndex = Math.min(
    Math.floor((progress / 100) * Math.max(scriptLines.length, 1)),
    Math.max(scriptLines.length - 1, 0),
  );
  const activeSubtitle =
    scriptLines[activeScriptIndex] || "连接 Airobot 共同解锁更多话题见解...";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
        >
          <div
            className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? "bg-black/60" : "bg-slate-900/40"}`}
            onClick={onClose}
          />

          {/* Container tuned to cover maximum functional area without spilling over the right knobs */}
          <div className="relative w-full h-full max-w-[560px] mx-auto flex items-center justify-center pl-4 pr-16">
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative group flex w-full max-h-[792px] h-[98%]"
            >
              {/* Right-Side External Knobs / Buttons */}
              <div className="absolute -right-14 top-[40%] -translate-y-1/2 flex flex-col gap-10 z-0">
                {/* Play/Pause Knob */}
                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ x: 2 }}
                  onClick={onTogglePlay}
                  className={`relative w-16 h-40 rounded-r-3xl border-y border-r shadow-[8px_0_20px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center gap-4 group transition-colors ${
                    isDarkMode
                      ? "bg-slate-700 border-white/20"
                      : "bg-slate-300 border-white/50"
                  }`}
                  title="播放/暂停"
                >
                  <div
                    className={`w-2 h-20 rounded-full absolute left-1 flex-shrink-0 ${isDarkMode ? "bg-black/30" : "bg-black/10"}`}
                  />
                  <div
                    className={`w-12 h-12 ml-2 rounded-full shadow-inner flex items-center justify-center flex-shrink-0 ${isPlaying ? "bg-indigo-500 text-white" : isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}
                  >
                    {isPlaying ? (
                      <Pause size={22} fill="currentColor" />
                    ) : (
                      <Play size={22} fill="currentColor" className="ml-1" />
                    )}
                  </div>
                  {/* Texture lines */}
                  <div className="flex flex-col gap-1.5 w-full pl-5 pr-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-[2px] w-full rounded-full ${isDarkMode ? "bg-slate-600" : "bg-slate-400"}`}
                      />
                    ))}
                  </div>
                </motion.button>

                {/* Combined Background Run / Minmize Knob */}
                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ x: 2 }}
                  onClick={onClose}
                  className={`relative w-14 h-24 rounded-r-3xl border-y border-r shadow-[6px_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center transition-colors ${
                    isDarkMode
                      ? "bg-slate-800 border-white/10 text-slate-400 hover:text-indigo-400"
                      : "bg-slate-200 border-white/40 text-slate-500 hover:text-indigo-500"
                  }`}
                  title="收起至后台"
                >
                  <div
                    className={`w-2 h-12 rounded-full absolute left-1 ${isDarkMode ? "bg-black/30" : "bg-black/10"}`}
                  />
                  <Minimize2 size={24} className="ml-2" />
                </motion.button>
              </div>

              {/* Main Vertical Body */}
              <div
                className={`relative z-10 w-full h-full rounded-[3rem] p-8 flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.6),inset_0_2px_15px_rgba(255,255,255,0.3)] ${
                  isDarkMode
                    ? "bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 border-2 border-slate-600"
                    : "bg-gradient-to-b from-[#E2DCC8] via-[#F1F0E8] to-[#D5CEA3] border-2 border-white"
                }`}
              >
                {/* Turntable Platter (Top) - Switchable according to type */}
                <div className="w-full flex-1 flex items-center justify-center relative mb-8 min-h-[300px]">
                  {episode.type === "audio" ? (
                    /* 1. 音频：古典黑胶唱盘机 HIFI Player */
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Platter Base Ring */}
                      <div
                        className={`w-full aspect-square max-w-[310px] max-h-[310px] rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_5px_10px_rgba(255,255,255,0.1)] ${
                          isDarkMode
                            ? "bg-slate-900 border-4 border-slate-800"
                            : "bg-slate-800 border-4 border-slate-700"
                        }`}
                      >
                        {/* Vinyl Record */}
                        <motion.div
                          animate={isPlaying ? { rotate: 360 } : {}}
                          transition={{
                            repeat: Infinity,
                            duration: 5,
                            ease: "linear",
                          }}
                          className="w-[92%] h-[92%] rounded-full bg-[#111] flex items-center justify-center relative overflow-hidden shadow-[inset_0_4px_15px_rgba(255,255,255,0.15)]"
                        >
                          {/* Retro Grooves */}
                          <div className="absolute inset-[4%] rounded-full border border-white/5" />
                          <div className="absolute inset-[8%] rounded-full border border-white/10" />
                          <div className="absolute inset-[13%] rounded-full border border-white/5" />
                          <div className="absolute inset-[18%] rounded-full border border-white/10" />
                          <div className="absolute inset-[24%] rounded-full border border-white/5" />
                          <div className="absolute inset-[30%] rounded-full border border-white/10" />
                          <div className="absolute inset-[36%] rounded-full border border-white/5" />

                          {/* Center Label (Cover Art) */}
                          <div className="relative w-[35%] h-[35%] rounded-full border-[6px] border-[#111] shadow-[0_0_15px_rgba(0,0,0,0.8)] overflow-hidden bg-slate-200">
                            <img
                              src={episode.bgImage}
                              alt="Album Art"
                              className="absolute inset-0 w-full h-full object-cover opacity-90"
                              referrerPolicy="no-referrer"
                            />
                            {/* Spindle hole */}
                            <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-slate-300 border border-slate-500 shadow-inner" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Tone Arm Base */}
                      <div className="absolute top-0 right-2 w-16 h-16 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-500 border border-slate-400">
                        <div className="w-8 h-8 rounded-full shadow-inner bg-gradient-to-br from-slate-400 to-slate-600" />
                      </div>

                      {/* Tone Arm Stick - sweeps in physically depending on play/progress */}
                      <motion.div
                        animate={{
                          rotate: isPlaying ? 15 + progress * 0.15 : 2,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 50,
                          damping: 20,
                        }}
                        className="absolute top-8 right-9 w-2.5 h-[65%] shadow-[2px_10px_15px_rgba(0,0,0,0.5)] origin-top z-10"
                        style={{ transformOrigin: "top center" }}
                      >
                        {/* The Arm Line */}
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400 rounded-full border border-white/20" />
                        {/* The Stylus/Head */}
                        <div className="absolute bottom-0 -left-2.5 w-7 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-sm shadow-xl flex items-center justify-center border-t border-slate-400">
                          <div className="w-1/2 h-1/2 bg-red-500/20 rounded-full" />
                        </div>
                      </motion.div>

                      {/* Sound VU equalizers hopping under the turntable */}
                      <div className="absolute bottom-1 left-2 flex items-end gap-[3px] bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="flex flex-col gap-[2px]">
                            {[...Array(4)].map((_, j) => (
                              <motion.div
                                key={j}
                                animate={
                                  isPlaying
                                    ? { opacity: [0.2, 1, 0.2] }
                                    : { opacity: 0.2 }
                                }
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.25 + i * 0.08,
                                  delay: j * 0.04,
                                  ease: "easeInOut",
                                }}
                                className={`w-1.5 h-1 rounded-[1px] ${
                                  j === 0
                                    ? "bg-rose-500"
                                    : j === 1
                                      ? "bg-amber-400"
                                      : "bg-emerald-400"
                                }`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : episode.type === "video" ? (
                    /* 2. 视频：复古科幻 CRT 显示电视机 Retro Monitor */
                    <div className="relative w-full h-full max-w-[340px] aspect-[4/3] rounded-[2.5rem] p-4 bg-gradient-to-b from-stone-800 to-stone-950 border-[6px] border-stone-700 shadow-[0_25px_50px_rgba(0,0,0,0.8),inset_0_4px_10px_rgba(255,255,255,0.15)] flex flex-col overflow-hidden">
                      {/* CRT Screen inside */}
                      <div className="relative flex-1 bg-[#101c16] rounded-[1.5rem] overflow-hidden border-2 border-stone-900 flex flex-col justify-between p-4 shadow-[inset_0_10px_25px_rgba(0,0,0,0.9)]">
                        {/* CRT reflection glass layer */}
                        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.14] bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />
                        <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.9),0_0_15px_rgba(20,184,166,0.15)] rounded-[1.2rem]" />

                        {/* Header VHS status info */}
                        <div className="flex items-center justify-between z-10 text-[9px] font-mono font-black text-teal-400 tracking-wider">
                          <div className="flex items-center gap-1.5 animate-pulse">
                            <div className="w-2 h-2 bg-rose-500 rounded-full" />
                            <span>PLAY CH1</span>
                          </div>
                          <span>
                            TR {Math.floor(progress * 0.09)}:
                            {(Math.floor(progress * 5.4) % 60)
                              .toString()
                              .padStart(2, "0")}
                          </span>
                        </div>

                        {/* Center content: custom audio wave and thumbnail */}
                        <div className="relative flex-1 flex items-center justify-center z-0">
                          {/* Concentric expanding ripples around thumb */}
                          {[...Array(4)].map((_, index) => (
                            <motion.div
                              key={index}
                              animate={
                                isPlaying
                                  ? {
                                      scale: [
                                        0.9 + index * 0.1,
                                        1.4 + index * 0.2,
                                        0.9 + index * 0.1,
                                      ],
                                      opacity: [
                                        0.55 - index * 0.12,
                                        0.15,
                                        0.55 - index * 0.12,
                                      ],
                                    }
                                  : {}
                              }
                              transition={{
                                repeat: Infinity,
                                duration: 2 + index * 0.4,
                                ease: "linear",
                              }}
                              className="absolute rounded-full border border-teal-500/30 flex items-center justify-center"
                              style={{
                                width: `${65 + index * 32}px`,
                                height: `${65 + index * 32}px`,
                              }}
                            />
                          ))}

                          {/* Sine wave oscilloscope */}
                          <svg
                            className="absolute w-full h-16 opacity-75"
                            viewBox="0 0 300 100"
                          >
                            <motion.path
                              d="M 0 50 Q 50 20 100 50 T 200 50 T 300 50"
                              fill="none"
                              stroke="#2dd4bf"
                              strokeWidth="3.5"
                              animate={
                                isPlaying
                                  ? {
                                      d: [
                                        "M 0 50 Q 30 15, 75 85, 120 15 T 180 85 T 240 15 T 300 50",
                                        "M 0 50 Q 40 85, 80 15, 120 85 T 180 15 T 240 85 T 300 50",
                                        "M 0 50 Q 30 15, 75 85, 120 15 T 180 85 T 240 15 T 300 50",
                                      ],
                                    }
                                  : {}
                              }
                              transition={{
                                repeat: Infinity,
                                duration: 1.1,
                                ease: "easeInOut",
                              }}
                            />
                          </svg>

                          <img
                            src={episode.bgImage}
                            alt="feed cover"
                            className="w-16 h-16 rounded-xl border border-stone-800 object-cover opacity-80 absolute filter grayscale contrast-125 brightness-90 shadow-md"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Captions box at the bottom (animated sentences from script content) */}
                        <div className="relative z-10 w-full min-h-[46px] px-2 py-1.5 bg-black/70 rounded-lg border border-teal-950/40 text-center flex items-center justify-center">
                          <p className="text-[11px] font-black font-mono leading-snug text-teal-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2">
                            {activeSubtitle}
                          </p>
                        </div>
                      </div>

                      {/* Status metal bar on cabinet bottom */}
                      <div className="flex items-center justify-between mt-3 px-2 text-stone-500 text-[10px] uppercase font-bold shrink-0">
                        <div className="flex gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>VIDEO SIGNAL OK</span>
                        </div>
                        <span>CRT_MODE_ON</span>
                      </div>
                    </div>
                  ) : (
                    /* 3. 图文：精致纸质漫画绘本 Comic Panel Book */
                    <div className="relative w-full h-[320px] max-w-[340px] rounded-[2rem] bg-[#FCF9F2] border-[4px] border-amber-950 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.25),inset_0_2px_8px_rgba(255,255,255,0.8)] flex flex-col justify-between overflow-hidden">
                      {/* Decorative paper texture background */}
                      <div className="absolute inset-0 bg-[radial-gradient(#e2dcc8_0.8px,transparent_0.8px)] [background-size:12px_12px] opacity-15 pointer-events-none" />

                      {/* 1. Styled Comic panel on top */}
                      <div className="relative h-[155px] w-full border-[3.5px] border-amber-950 bg-white rounded-2xl overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,0.15)] shrink-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/5 to-transparent pointer-events-none z-10" />

                        <img
                          src={episode.bgImage}
                          alt="Comic Scene Illustration"
                          className="w-full h-full object-cover brightness-95 contrast-105"
                          referrerPolicy="no-referrer"
                        />

                        {/* Action badge on picture-book corner */}
                        <div className="absolute top-2 left-2 bg-amber-950 text-[#FCF9F2] text-[8px] font-black uppercase px-2 py-0.5 rounded-full z-10 tracking-widest border border-[#FCF9F2]/20">
                          PANEL 0{(activeScriptIndex % 4) + 1}
                        </div>

                        {/* Beautiful retro comic speech bubble! */}
                        <motion.div
                          key={activeScriptIndex}
                          initial={{ scale: 0.82, opacity: 0, y: 5 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                          className="absolute bottom-2.5 right-2 text-stone-900 border-[2.5px] border-stone-900 rounded-2xl px-2.5 py-1.5 text-[10px] font-bold tracking-tight leading-snug max-w-[82%] shadow-[3px_3px_0px_#422006] bg-[#FFF] z-10 origin-bottom-right"
                        >
                          <span className="line-clamp-2">{activeSubtitle}</span>
                          {/* Dialogue tail */}
                          <div className="absolute -bottom-2.5 right-4 w-3 h-3 bg-white border-r-[2.5px] border-b-[2.5px] border-stone-900 transform rotate-45 z-[-1]" />
                        </motion.div>
                      </div>

                      {/* Mid paper page dividing perforation line */}
                      <div className="w-full flex items-center justify-between px-3 py-1.5 shrink-0 z-10 relative">
                        <div className="h-[2px] flex-1 bg-amber-950/25 bg-[radial-gradient(#1e1b18_1px,transparent_1px)] bg-[size:5px_5px]" />
                        <div className="flex items-center gap-1.5 mx-3 bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-amber-950/20 shadow-sm">
                          <BookOpen
                            size={11}
                            className="text-amber-900 animate-pulse"
                          />
                          <span className="text-[8px] font-black font-sans text-amber-900 tracking-wider uppercase">
                            绘本台本
                          </span>
                        </div>
                        <div className="h-[2px] flex-1 bg-amber-950/25 bg-[radial-gradient(#1e1b18_1px,transparent_1px)] bg-[size:5px_5px]" />
                      </div>

                      {/* 2. Interactive scrollable storyboard/captions block at bottom */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 text-left bg-amber-50/40 rounded-xl border border-amber-900/10 z-10 flex flex-col gap-2 relative">
                        {scriptLines.map((line, idx) => {
                          const isCurrent = idx === activeScriptIndex;
                          return (
                            <motion.div
                              key={idx}
                              animate={
                                isCurrent
                                  ? { scale: 1.015, x: 2 }
                                  : { scale: 1, x: 0 }
                              }
                              className={`relative pl-3.5 py-1 rounded transition-all duration-300 ${
                                isCurrent
                                  ? "text-amber-950 font-black"
                                  : "text-stone-500 font-bold"
                              }`}
                            >
                              {/* Pencil bookmark sign */}
                              <div
                                className={`absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-amber-600 shadow-sm" : "bg-stone-300"}`}
                              />

                              {isCurrent && (
                                <motion.div
                                  layoutId="highlighter-marker-stroke"
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{
                                    duration: 0.4,
                                    ease: "easeOut",
                                  }}
                                  className="absolute inset-0 bg-yellow-300/35 rounded-sm z-0 pointer-events-none"
                                />
                              )}
                              <p className="relative z-10 text-[10px] font-sans leading-relaxed">
                                {line}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Details & Info Area (Bottom) */}
                <div
                  className={`w-full flex-grow-0 flex flex-col pt-6 pb-2 border-t-2 ${isDarkMode ? "border-slate-600" : "border-slate-300/50"}`}
                >
                  {/* Brand / Tag & Chat History */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Radio
                        size={18}
                        className={
                          isDarkMode ? "text-indigo-400" : "text-orange-500"
                        }
                      />
                      <span
                        className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-indigo-400" : "text-orange-600"}`}
                      >
                        {episode.type === "video"
                          ? "Video Case"
                          : episode.type === "audio"
                            ? "Audio Station"
                            : "Text Journal"}
                      </span>
                    </div>

                    {/* NotebookLM Style Feature toolbar - Independent buttons layout */}
                    <div className="flex items-center gap-2">
                      {/* 1. 音频概要 */}
                      <motion.button
                        whileHover={{ scale: 1.1, y: -1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => triggerToast('音频概要')}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm border ${
                          isDarkMode 
                            ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30' 
                            : 'bg-white border-[#D5CEA3]/45 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/25'
                        }`}
                        title="音频概要"
                      >
                        <AudioLines size={14} />
                      </motion.button>

                      {/* 2. 知识卡片（闪卡） */}
                      <motion.button
                        whileHover={{ scale: 1.1, y: -1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => triggerToast('知识卡片（闪卡）')}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm border ${
                          isDarkMode 
                            ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30' 
                            : 'bg-white border-[#D5CEA3]/45 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/25'
                        }`}
                        title="知识卡片（闪卡）"
                      >
                        <Layers size={14} />
                      </motion.button>

                      {/* 3. 答题卡（测验） */}
                      <motion.button
                        whileHover={{ scale: 1.1, y: -1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => triggerToast('答题卡（测验）')}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm border ${
                          isDarkMode 
                            ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30' 
                            : 'bg-white border-[#D5CEA3]/45 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/25'
                        }`}
                        title="答题卡（测验）"
                      >
                        <CheckSquare size={14} />
                      </motion.button>

                      {/* 4. 对话 (Active & Highlighted as primary actionable feature) */}
                      <motion.button
                        whileHover={{ scale: 1.1, y: -1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => onAskAether(episode.title)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md border ${
                          isDarkMode 
                            ? 'bg-indigo-950/50 border-indigo-500/40 text-indigo-400 hover:bg-indigo-900/50 hover:text-indigo-300' 
                            : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-750'
                        }`}
                        title="与 Airobot 讨论此播客 (对话)"
                      >
                        <MessageCircle size={14} className="animate-pulse" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Progress (Analog meter style) */}
                  <div className="mb-5">
                    <div className="flex justify-between text-[11px] font-black uppercase mb-3 tracking-wider">
                      <span
                        className={
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }
                      >
                        {Math.floor(((progress || 0) / 100) * 15)}:
                        {Math.floor((((progress || 0) / 100) * 15 * 60) % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                      <span
                        className={
                          isDarkMode ? "text-slate-500" : "text-slate-400"
                        }
                      >
                        15:00
                      </span>
                    </div>
                    {/* Metal Slider Track */}
                    <div
                      className={`h-2.5 rounded-full overflow-hidden shadow-inner relative ${
                        isDarkMode
                          ? "bg-slate-900 border border-slate-700"
                          : "bg-slate-300 border border-slate-400"
                      }`}
                    >
                      <motion.div
                        className={`absolute top-0 left-0 h-full ${
                          isDarkMode ? "bg-indigo-500" : "bg-orange-500"
                        }`}
                        style={{ width: `${progress || 0}%` }}
                      />
                      {/* Knob Indicator on slider */}
                      <motion.div
                        className="absolute top-1/2 -mt-2.5 w-5 h-5 rounded-full bg-slate-200 border border-slate-400 shadow-md flex items-center justify-center transform -translate-x-1/2"
                        style={{ left: `${progress || 0}%` }}
                      >
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Episode Title & Summary */}
                  <div className="flex-1 mt-2">
                    <span
                      className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded mb-3 ${
                        episode.type === "video"
                          ? "bg-pink-500/15 text-pink-500"
                          : episode.type === "audio"
                            ? "bg-sky-500/15 text-sky-500"
                            : "bg-emerald-500/15 text-emerald-500"
                      }`}
                    >
                      {episode.type === "video"
                        ? "视频播客"
                        : episode.type === "audio"
                          ? "音频播客"
                          : "图文播客"}
                    </span>
                    <h2
                      className={`text-2xl font-black mb-3 leading-tight line-clamp-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}
                    >
                      {episode.title}
                    </h2>
                    <p
                      className={`text-sm font-bold leading-relaxed line-clamp-3 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {episode.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Toast Alert Pop-up */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-xl border backdrop-blur-2xl text-[11px] font-black flex items-center justify-center gap-2 tracking-tight text-center max-w-[85%] leading-relaxed"
                    style={{
                      backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)",
                      borderColor: isDarkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(122, 115, 92, 0.3)",
                      color: isDarkMode ? "#e2e8f0" : "#423b2c",
                    }}
                  >
                    <Sparkles size={13} className="text-amber-500 shrink-0 animate-pulse" />
                    <span>{toastMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
