import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, BookOpen, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { SubCategory } from '../types';

interface KnowledgeQuizWidgetProps {
  subCategory: SubCategory;
  isDarkMode: boolean;
  onQuickAction: () => void;
  infoQuery: string;
  setInfoQuery: (q: string) => void;
  onSearch: (q: string) => void;
  isInfoLoading: boolean;
}

export const KnowledgeQuizWidget: React.FC<KnowledgeQuizWidgetProps> = ({ 
  subCategory, 
  isDarkMode, 
  onQuickAction,
  infoQuery,
  setInfoQuery,
  onSearch,
  isInfoLoading
}) => {
  const getIcon = () => {
    if (subCategory === 'info') return <Newspaper size={40} />;
    if (subCategory === 'knowledge') return <BookOpen size={40} />;
    return <Sparkles size={40} />;
  };

  const getTitle = () => {
    if (subCategory === 'info') return '获取最新AI资讯';
    if (subCategory === 'knowledge') return '探索百科新知';
    return '听一段精彩故事';
  };

  const getPlaceholder = () => {
    if (subCategory === 'info') return "搜搜看最新的AI动态...";
    return "例如：黑洞的奥秘 / 孙悟空的故事";
  };

  const getLabel = () => {
    if (subCategory === 'info') return '搜索资讯';
    return '定制内容';
  };

  const getSubLabel = () => {
    if (subCategory === 'info') return '输入你想查询的任何动态...';
    return '告诉我想听关于什么的知识或故事...';
  };

  const getThemeColor = () => {
    if (subCategory === 'info') return 'bg-cyan-500';
    if (subCategory === 'knowledge') return 'bg-indigo-500';
    return 'bg-pink-500';
  };

  const getBorderColor = () => {
    if (subCategory === 'info') return 'border-cyan-500/20';
    if (subCategory === 'knowledge') return 'border-indigo-500/20';
    return 'border-pink-500/20';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-10">
      {/* Featured Card Placeholder */}
      <motion.div 
        whileHover={{ y: -10, scale: 1.02 }}
        onClick={onQuickAction}
        className={`p-10 rounded-[4rem] border-4 border-dashed cursor-pointer flex flex-col items-center justify-center gap-6 transition-all relative overflow-hidden group ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}
      >
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110 ${getThemeColor()}`}>
          {getIcon()}
        </div>
        <div className="text-center">
          <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {getTitle()}
          </h3>
          <p className="text-slate-400 font-bold text-xs">点击生成专属语音图文卡片</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* Search/Input Area */}
      <div className={`p-8 rounded-[4rem] flex flex-col justify-center gap-6 ${isDarkMode ? 'bg-slate-900/50 border border-white/5' : 'bg-white/80 border border-black/5 shadow-xl'}`}>
        <div className="space-y-2">
          <h4 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {getLabel()}
          </h4>
          <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {getSubLabel()}
          </p>
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder={getPlaceholder()} 
            value={infoQuery}
            onChange={(e) => setInfoQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(infoQuery)}
            className={`w-full p-5 pr-14 rounded-2xl text-base font-bold ${isDarkMode ? 'bg-slate-900/50 text-white border-white/10' : 'bg-white text-slate-800 border-slate-200'} border shadow-inner focus:ring-2 ring-orange-500 outline-none transition-all`}
          />
          <button 
            onClick={() => onSearch(infoQuery)}
            disabled={isInfoLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
          >
            {isInfoLoading ? <Loader2 size={20} className="animate-spin" /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
