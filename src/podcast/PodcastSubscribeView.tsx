import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rss, Plus, Clock, Check, Bell, Book, Newspaper, BookOpen, 
  Folder, FolderOpen, Upload, Edit3, Trash2, Video, Volume2, 
  Settings, Loader2, Sparkles, X, ChevronRight, HelpCircle
} from 'lucide-react';
import { MainCategory, SubCategory, ScheduleItem } from '../types';

interface PodcastSubscribeViewProps {
  isDarkMode: boolean;
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

interface Subscription {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'text';
  time: string;
  description: string;
  isSubscribed: boolean;
  isDIY?: boolean;
  sourceDir?: string;
  filesCount?: number;
}

const defaultSubscriptions: Subscription[] = [
  { id: '1', title: '每日科技速递', type: 'text', time: '每天 08:00', description: '每天早上8点，为你播报最新科技圈动态与深度解析。', isSubscribed: true },
  { id: '2', title: '每日声音电台', type: 'audio', time: '每天 22:00', description: '高音质立体声配音，让你在通勤 and 深夜用耳朵领略自然森林白噪音与人声互动。', isSubscribed: true },
  { id: '4', title: '商业思维日课', type: 'text', time: '工作日 18:00', description: '下班通勤路上的商业认知升级，解析最新商业案例。', isSubscribed: false },
];

export const PodcastSubscribeView: React.FC<PodcastSubscribeViewProps> = ({ 
  isDarkMode, 
  time,
  schedules,
  onNavigate,
  onAddCustomEpisode
}) => {
  const [subs, setSubs] = useState<Subscription[]>([]);

  // Edit Subscription state
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  // Load subscriptions on mount
  useEffect(() => {
    const saved = localStorage.getItem('aether_podcast_subscriptions_v4');
    if (saved) {
      try {
        let loaded: Subscription[] = JSON.parse(saved);
        
        // Deduplicate and filter out any DIY channels to guarantee user only see standard channels in this list
        const filtered = loaded.filter(s => !s.isDIY && s.id !== 'diy_local');
        
        // If empty or missing defaults, initialize
        if (filtered.length === 0) {
          setSubs(defaultSubscriptions);
          localStorage.setItem('aether_podcast_subscriptions_v4', JSON.stringify(defaultSubscriptions));
        } else {
          setSubs(filtered);
          localStorage.setItem('aether_podcast_subscriptions_v4', JSON.stringify(filtered));
        }
      } catch (e) {
        setSubs(defaultSubscriptions);
      }
    } else {
      setSubs(defaultSubscriptions);
      localStorage.setItem('aether_podcast_subscriptions_v4', JSON.stringify(defaultSubscriptions));
    }
  }, []);

  const saveSubs = (updatedSubs: Subscription[]) => {
    setSubs(updatedSubs);
    localStorage.setItem('aether_podcast_subscriptions_v4', JSON.stringify(updatedSubs));
  };

  const toggleSub = (id: string) => {
    const updated = subs.map(s => {
      if (s.id === id) {
        return { ...s, isSubscribed: !s.isSubscribed };
      }
      return s;
    });
    saveSubs(updated);
  };

  const deleteDiySub = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = subs.filter(s => s.id !== id);
    saveSubs(updated);
  };

  const handleEditTitle = (id: string, currentTitle: string) => {
    setEditingSubId(id);
    setEditedTitle(currentTitle);
  };

  const saveEditedTitle = (id: string) => {
    if (!editedTitle.trim()) return;
    const updated = subs.map(s => {
      if (s.id === id) {
        return { ...s, title: editedTitle };
      }
      return s;
    });
    saveSubs(updated);
    setEditingSubId(null);
  };

  const mySubs = subs.filter(s => s.isSubscribed && !s.isDIY);
  const recommendedSubs = subs.filter(s => !s.isSubscribed && !s.isDIY);

  const typeIcons = {
    video: <Video size={14} className="text-pink-500" />,
    audio: <Volume2 size={14} className="text-sky-500" />,
    text: <Book size={14} className="text-emerald-500" />
  };

  const typeLabels = {
    video: '视频',
    audio: '音频',
    text: '图文'
  };

  const renderSubCard = (sub: Subscription) => {
    const isEditing = editingSubId === sub.id;
    return (
      <motion.div 
        key={sub.id}
        layout
        whileHover={{ scale: 1.01 }}
        className={`relative p-5 rounded-[2rem] border-2 transition-all flex flex-col justify-between ${
          isDarkMode 
            ? 'bg-slate-800/60 border-white/5' 
            : 'bg-white border-slate-100 shadow-sm'
        }`}
      >
        <div>
          {/* 1. Title / Name of the channel on the first line */}
          {isEditing ? (
            <div className="mb-2 flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEditedTitle(sub.id)}
                className={`text-sm font-black rounded-lg px-2 py-1 flex-1 border ${
                  isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
                }`}
                autoFocus
              />
              <button 
                onClick={() => saveEditedTitle(sub.id)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
              >
                保存
              </button>
            </div>
          ) : (
            <h4 className={`text-sm font-black mb-1.5 truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {sub.title}
            </h4>
          )}

          {/* 2. Metadata: type and update time on the second line */}
          <div className="flex items-center justify-between mb-3 mt-1 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {typeIcons[sub.type]}
              <span className={`text-[10px] font-black uppercase tracking-wider ${
                sub.type === 'video' ? 'text-pink-500' : 
                sub.type === 'audio' ? 'text-sky-500' : 'text-emerald-500'
              }`}>
                {typeLabels[sub.type]}
              </span>
            </div>
            
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              isDarkMode ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}>
              <Clock size={10} />
              {sub.time}
            </div>
          </div>
          
          <p className={`text-xs font-bold leading-relaxed mb-4 flex-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {sub.description}
          </p>
        </div>
        
        {/* Actions Button */}
        <button 
          onClick={() => toggleSub(sub.id)}
          className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-colors ${
            sub.isSubscribed 
              ? (isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
              : (isDarkMode ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-500')
          }`}
        >
          {sub.isSubscribed ? (
            <>
              <Check size={14} />
              已订阅
            </>
          ) : (
            <>
              <Plus size={14} />
              订阅栏目
            </>
          )}
        </button>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      {/* 1. Top Header */}
      <div className="mb-5 flex-shrink-0 pr-12">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <Rss size={20} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            播客订阅
          </h2>
        </div>
        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          订阅专属频道，定制听你想听
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-6 mb-4">
        
        {/* My Subscriptions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Bell size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
              <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                我的订阅 
              </h3>
            </div>
            <span className={`text-[10px] font-bold ${mySubs.length >= 8 ? 'text-red-500' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {mySubs.length} / 8已订阅
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {mySubs.map(renderSubCard)}
            </AnimatePresence>
          </div>
        </div>

        {/* Recommended Subscriptions */}
        {recommendedSubs.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            <h3 className={`text-xs font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              推荐栏目
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {recommendedSubs.map(renderSubCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
