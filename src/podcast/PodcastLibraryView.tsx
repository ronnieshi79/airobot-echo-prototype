import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Play, Video, Volume2, FileText, CheckCircle2, Clock, Filter, Plus, Star, Rss, MessageSquare, Sparkles, X, Folder, FolderOpen, Loader2, Check } from 'lucide-react';
import { PodcastEpisode } from './usePodcast';
import { MainCategory, SubCategory, ScheduleItem } from '../types';

interface PodcastLibraryViewProps {
  isDarkMode: boolean;
  episodes: PodcastEpisode[];
  onSelectEpisode: (episode: PodcastEpisode) => void;
  onGenerate: (type: 'video' | 'audio' | 'text') => void;
  time: Date;
  schedules: ScheduleItem[];
  onNavigate: (cat: MainCategory, sub: SubCategory) => void;
  onAddCustomEpisode?: (
    title: string, 
    summary: string, 
    content: string, 
    channelName: string, 
    type: 'video' | 'audio' | 'text'
  ) => void;
}

export const PodcastLibraryView: React.FC<PodcastLibraryViewProps> = ({ 
  isDarkMode, 
  episodes, 
  onSelectEpisode,
  onGenerate,
  time,
  schedules,
  onNavigate,
  onAddCustomEpisode
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // DIY Form States
  const [showDiyModal, setShowDiyModal] = useState(false);
  const [diyTitle, setDiyTitle] = useState('我的DIY创作');
  const [diyType, setDiyType] = useState<'video' | 'audio' | 'text'>('text');
  const [diyDir, setDiyDir] = useState('D:/Documents/AudioLectures');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: idle, 1: scanning, 2: scan complete
  const [scannedFiles, setScannedFiles] = useState<{ name: string; size: string; type: 'audio' | 'video' }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [genProgress, setGenProgress] = useState(0);

  const startScan = () => {
    if (!diyDir.trim()) return;
    setIsScanning(true);
    setScanStep(1);
    
    // Simulate scan steps
    setTimeout(() => {
      setScannedFiles([
        { name: '01_生成式人工智能大模型介绍.mp3', size: '15.4 MB', type: 'audio' },
        { name: '02_强化学习与推荐系统前沿.mp4', size: '42.8 MB', type: 'video' },
        { name: '03_硅谷创业访谈录.wav', size: '28.1 MB', type: 'audio' },
      ]);
      setScanStep(2);
      setIsScanning(false);
    }, 1800);
  };

  const handleCreateDiy = () => {
    if (!diyTitle.trim()) return;
    setIsGenerating(true);
    setGenProgress(5);
    setGenerationStep('正在上传并加载导入的媒体内容...');

    // Simulate multi-step AI creation process
    const steps = [
      { progress: 20, text: '提取音轨中，过滤环境背景杂音...' },
      { progress: 45, text: 'Whisper 语音自动转换为精确文本并提炼大纲要点...' },
      { progress: 70, text: '由专属智能体 Airobot 自主生成具备学术专业度的单人播客脚本...' },
      { progress: 90, text: 'Airobot 独白高保真语音朗读与语调连贯性精细校准中...' },
      { progress: 100, text: '完成！单人全息音轨无缝合成，极速生成专属于您的播客栏目！' }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const next = steps[currentStepIdx];
        setGenProgress(next.progress);
        setGenerationStep(next.text);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        
        // Generate matching detailed episode content
        if (onAddCustomEpisode) {
          const filesString = scannedFiles.map(f => f.name).join(' 和 ');
          const title = diyTitle;
          const summary = `本期播客由您导入的本地文件夹媒体资源智能生成，主要提炼了 ${diyTitle} 中的核心理念，由 Airobot 单人主播专业呈现。`;
          const content = `[主持人: Airobot] 欢迎收听本期专属定制的 AI 播客节目！今天我是你们的单人智能体 Airobot 主播。我们今天探讨的内容，是基于您导入的本地文件夹媒体资源——《${filesString}》智能生成的。\n\n大模型时代已经来临，我们每天都会面临数以万计的信息茧房。许多珍贵的教学音视频、专家讲座在下载到本地磁盘后，往往都处于落灰状态。现在，借助 Airobot 播客重构技术，我们可以把这些沉重的音视频一键消化，提炼出关键脉络。在本次内容中，我们重点对关键技术、理论模型以及垂直场景进行了高水准的音频重塑，让您可以像听普通电台节目一样高效倾听学识。\n\n你可以把这个当成一个24小时在线的私人讲堂。配合下方的Q&A智能体提问，能做到随时追踪溯源，用最轻松的方式，获取最硬核的私域知识。感谢您的收听，这就是智能体给内容消费带来的彻底变革！`;

          onAddCustomEpisode(title, summary, content, diyTitle, diyType);
        }

        // Reset & Close
        setIsGenerating(false);
        setShowDiyModal(false);
        setScanStep(0);
        setScannedFiles([]);
        setDiyTitle('我的DIY创作');
        setDiyDir('D:/Documents/AudioLectures');
      }
    }, 1800);
  };

  const typeIcons = {
    video: <Video size={16} className="text-pink-500" />,
    audio: <Volume2 size={16} className="text-sky-500" />,
    text: <FileText size={16} className="text-emerald-500" />
  };

  const typeLabels = {
    video: '视频',
    audio: '音频',
    text: '图文'
  };

  const unplayedEpisodes = episodes.filter(e => !e.played);
  
  // Extract unique channels
  const channels = Array.from(new Set(episodes.map(e => e.channelName))).filter(Boolean) as string[];
  
  // Filter episodes for "All Programs" section
  let filteredEpisodes = [...episodes];
  if (activeFilter === 'favorite') {
    filteredEpisodes = filteredEpisodes.filter(e => e.favorite);
  } else if (['video', 'audio', 'text'].includes(activeFilter)) {
    filteredEpisodes = filteredEpisodes.filter(e => e.type === activeFilter);
  } else if (activeFilter !== 'all') {
    filteredEpisodes = filteredEpisodes.filter(e => e.channelName === activeFilter);
  }

  const renderEpisodeCard = (episode: PodcastEpisode, showChannel: boolean = false, index?: number) => (
    <motion.div 
      key={episode.id || `ep-${index}-${Math.random()}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectEpisode(episode)}
      className={`relative p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col h-full ${
        isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'
      }`}
    >
      {/* 标题放在第一行，最多单行显示 */}
      <h4 className={`text-sm font-black mb-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        {episode.title}
      </h4>

      {/* 其次才是所属栏目，类型，状态等信息 */}
      <div className="flex items-center justify-between mb-3 mt-1 underline-offset-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {typeIcons[episode.type]}
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            episode.type === 'video' ? 'text-pink-500' : 
            episode.type === 'audio' ? 'text-sky-500' : 'text-emerald-500'
          }`}>
            {typeLabels[episode.type]}
          </span>
          {showChannel && episode.channelName && (
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              · {episode.channelName}
            </span>
          )}
        </div>
        
        {episode.played ? (
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
        ) : episode.progress && episode.progress > 0 ? (
          <div className="flex items-center gap-1 text-blue-500 shrink-0">
            <Clock size={12} />
            <span className="text-[10px] font-bold">{Math.round(episode.progress)}%</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-500">未播放</span>
          </div>
        )}
      </div>
      
      <p className={`text-xs font-bold leading-relaxed line-clamp-2 mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {episode.summary}
      </p>
      
      {/* Progress Bar */}
      {episode.progress !== undefined && episode.progress > 0 && !episode.played && (
        <div className="w-full h-1 bg-slate-200/50 rounded-full overflow-hidden mb-2 mt-auto">
          <div className="h-full bg-blue-500" style={{ width: `${episode.progress}%` }} />
        </div>
      )}
      
      <div className={`flex items-center justify-between pt-2 border-t border-slate-200/10 ${episode.progress && episode.progress > 0 && !episode.played ? '' : 'mt-auto'}`}>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {episode.date}
          </span>
          {episode.qnaHistory && episode.qnaHistory.length > 0 && (
            <div className="flex items-center gap-1 text-indigo-500">
              <MessageSquare size={10} />
              <span className="text-[10px] font-bold">{episode.qnaHistory.length}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {episode.favorite && <Star size={12} className="text-yellow-500" fill="currentColor" />}
          <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Play size={12} fill="currentColor" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* 1. Top Header */}
      <div className="mb-4 flex-shrink-0 pr-12">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <History size={20} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            播客库
          </h2>
        </div>
        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          定制生成的播客记录与收藏
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-6 pb-6">
        
        {/* Latest Podcasts Section */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Rss size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />
              <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                最新播客及个人创作
              </h3>
            </div>
            
            {/* Minimalist DIY Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDiyModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-indigo-950/40 border-indigo-500/30 hover:bg-indigo-950/70 text-indigo-400 shadow-lg shadow-indigo-950/40' 
                  : 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100 text-indigo-600 shadow-sm'
              }`}
            >
              <Sparkles size={11} className="text-indigo-400 animate-pulse" />
              <span>新节目 DIY</span>
            </motion.button>
          </div>
          
          {unplayedEpisodes.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
              {unplayedEpisodes.map((episode, index) => (
                <div key={episode.id || `unplayed-${index}`} className="w-64 flex-shrink-0">
                  {renderEpisodeCard(episode, true, index)}
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-6 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-800/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                暂无未播放的最新播客，点击右上角 “新节目 DIY” 一键生成专属内容吧！
              </p>
            </div>
          )}
        </div>

        {/* All Programs with Filter Bar */}
        <div className="flex flex-col gap-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-1">
              <Rss size={16} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} />
              <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                全部节目
              </h3>
            </div>
          </div>
          
          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
            <Filter size={14} className={`flex-shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
                  activeFilter === 'all' 
                    ? (isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white')
                    : (isDarkMode ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setActiveFilter('favorite')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeFilter === 'favorite' 
                    ? (isDarkMode ? 'bg-yellow-500 text-slate-900' : 'bg-yellow-400 text-yellow-900')
                    : (isDarkMode ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                }`}
              >
                <Star size={10} fill={activeFilter === 'favorite' ? 'currentColor' : 'none'} />
                收藏
              </button>
              
              <div className={`w-px h-4 mx-1 self-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
              
              {['video', 'audio', 'text'].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
                    activeFilter === type 
                      ? (isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white')
                      : (isDarkMode ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                  }`}
                >
                  {typeLabels[type as keyof typeof typeLabels]}
                </button>
              ))}
              
              <div className={`w-px h-4 mx-1 self-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
              
              {channels.map(channel => (
                <button
                  key={channel}
                  onClick={() => setActiveFilter(channel)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
                    activeFilter === channel 
                      ? (isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white')
                      : (isDarkMode ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filtered Grid */}
          {filteredEpisodes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredEpisodes.map((ep, index) => renderEpisodeCard(ep, true, index))}
            </div>
          ) : (
            <div className={`p-8 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center h-full ${isDarkMode ? 'bg-slate-800/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <History size={32} className={`mb-4 opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-800'}`} />
              <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                没有找到符合条件的播客
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DIY Program Modal / Overlay */}
      <AnimatePresence>
        {showDiyModal && (
          <div className="absolute -top-10 -bottom-10 -left-10 -right-10 bg-black/65 backdrop-blur-md z-50 rounded-[4.9rem] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className={`w-full max-w-[500px] h-[92%] flex flex-col rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden border-2 ${
                isDarkMode ? 'bg-slate-900 border-indigo-500/20 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {/* Background gradient flare */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => {
                  if (!isGenerating && !isScanning) setShowDiyModal(false);
                }}
                disabled={isGenerating || isScanning}
                className={`absolute top-5 right-5 p-2 rounded-full border transition-all ${
                  isDarkMode 
                    ? 'border-white/10 hover:bg-white/5 text-slate-400' 
                    : 'border-slate-100 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <X size={16} />
              </button>

              {/* Header Title */}
              <div className="flex items-center gap-2.5 mb-5 flex-shrink-0">
                <Sparkles className="text-indigo-500" size={18} />
                <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  DIY 新节目创作
                </h3>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4 space-y-4">
                
                {/* 1. Style/Type Selector */}
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                     1. 选择节目类型
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'text', label: '📝 提炼图文', desc: '简练直观的图文大纲' },
                      { type: 'audio', label: '🎙️ 朗读音频', desc: '单播说书及高保真朗读' },
                      { type: 'video', label: '🎥 章节视频', desc: '大纲与可视化视频合成' },
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setDiyType(item.type as any)}
                        disabled={isGenerating}
                        className={`p-3 rounded-2xl text-left border-2 flex flex-col gap-1 transition-all ${
                          diyType === item.type
                            ? (isDarkMode ? 'bg-indigo-950/20 border-indigo-500/80' : 'bg-indigo-50 border-indigo-600')
                            : (isDarkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')
                        }`}
                      >
                        <span className={`text-[11px] font-black block ${diyType === item.type ? 'text-indigo-500' : isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {item.label}
                        </span>
                        <span className={`text-[9px] font-bold block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} leading-snug`}>
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Configure Program Name */}
                <div className="space-y-1">
                  <label className={`text-[10px] font-black uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                     2. 确认节目名称
                  </label>
                  <input 
                    type="text"
                    value={diyTitle}
                    disabled={isGenerating}
                    onChange={(e) => setDiyTitle(e.target.value)}
                    placeholder="例如：高级系统架构设计分享"
                    className={`text-xs font-black rounded-2xl px-4 py-3.5 w-full border outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600'
                    }`}
                  />
                  <p className={`text-[9.5px] font-bold block mt-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    * 创作完成后即立刻呈现在主界面。
                  </p>
                </div>

                {/* 3. Folder Directory Configuration */}
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                     3. 设定本地媒体路径
                  </label>
                  <p className={`text-[10px] leading-relaxed block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                     自动扫描并提取对应目录下的音视频文件。
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Folder className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} size={16} />
                      <input 
                        type="text"
                        value={diyDir}
                        disabled={isScanning || isGenerating}
                        onChange={(e) => {
                          setDiyDir(e.target.value);
                          setScanStep(0);
                        }}
                        placeholder="输入本地媒体文件夹路径..."
                        className={`text-xs font-black rounded-2xl pl-10 pr-4 py-3.5 w-full border outline-none transition-all ${
                          isDarkMode 
                            ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600'
                        }`}
                      />
                    </div>
                    
                    <button
                      onClick={startScan}
                      disabled={isScanning || isGenerating || !diyDir.trim()}
                      className={`px-4 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-black shadow-md transition-colors ${
                        isScanning 
                          ? 'bg-slate-400 text-slate-200 cursor-not-allowed' 
                          : (isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white')
                      }`}
                    >
                      {isScanning ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        '开始扫描'
                      )}
                    </button>
                  </div>
                </div>

                {/* Scanning Progress & Scanned Files results */}
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 ${
                      isDarkMode ? 'bg-slate-950/40 border-indigo-500/10' : 'bg-indigo-50/50 border-indigo-200/50'
                    }`}
                  >
                    <Loader2 size={18} className="text-indigo-500 animate-spin" />
                    <p className="text-[11px] font-bold text-indigo-500 animate-pulse">正在扫描媒体文件...</p>
                  </motion.div>
                )}

                {scanStep === 2 && scannedFiles.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border ${
                      isDarkMode ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        已发现可导入的多媒体列表 ({scannedFiles.length})
                      </span>
                      <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1">
                        <Check size={10} />
                        解析成功
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                      {scannedFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between py-1 text-[11px] font-bold">
                          <div className="flex items-center gap-1.5 truncate pr-2">
                            {file.type === 'video' ? <Video size={12} className="text-pink-500 flex-shrink-0" /> : <Volume2 size={12} className="text-sky-500 flex-shrink-0" />}
                            <span className={`truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{file.name}</span>
                          </div>
                          <span className={`text-[9px] flex-shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{file.size}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. Playback parameters (Defaults to Airobot single-person) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-2xl border flex flex-col justify-center leading-snug ${
                    isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                       🎙️ 智能主播
                     </span>
                    <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Airobot 单人主播
                    </span>
                    <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-0.5`}>
                      大模型合成，无需额外配置。
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className={`text-[9px] font-black uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                       环境背景音
                    </span>
                    <select 
                      disabled={isGenerating}
                      className={`text-xs font-black rounded-xl p-3 w-full border ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <option value="none">安静无底噪</option>
                      <option value="jazz">Lofi 爵士乐 (推荐)</option>
                      <option value="coffee">咖啡厅白噪音</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Progress and status loading when generating */}
              {isGenerating && (
                <div className={`p-4 rounded-3xl border mb-3 flex flex-col gap-2 flex-shrink-0 animate-pulse ${
                  isDarkMode ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
                }`}>
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-indigo-500 flex items-center gap-1.5">
                      <Loader2 className="animate-spin" size={12} />
                      AI 智能体专属创作中...
                    </span>
                    <span className="text-indigo-600">{genProgress}%</span>
                  </div>
                  
                  {/* Real progress bar */}
                  <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${genProgress}%` }} />
                  </div>

                  <p className={`text-[10px] font-bold leading-normal ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {generationStep}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/10 flex gap-3 flex-shrink-0">
                <button
                  type="button"
                  disabled={isGenerating || isScanning}
                  onClick={() => setShowDiyModal(false)}
                  className={`flex-1 py-3.5 rounded-2xl text-xs font-black transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={isGenerating || isScanning || scanStep !== 2 || !diyTitle.trim()}
                  onClick={handleCreateDiy}
                  className={`flex-[1.5] py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 font-black shadow-md transition-all ${
                    scanStep !== 2 
                      ? 'bg-slate-400 text-slate-200 cursor-not-allowed opacity-50 shadow-none'
                      : (isDarkMode 
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white' 
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 text-white')
                  }`}
                >
                  <Sparkles size={14} />
                  开始 AI 创作
                </button>
              </div>

              {/* Tips */}
              {scanStep !== 2 && (
                <p className={`text-[9.5px] font-bold text-center mt-3 animate-pulse ${isDarkMode ? 'text-amber-500/80' : 'text-amber-600'}`}>
                  ⚠️ 请先设置目录并扫描成功
                </p>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
