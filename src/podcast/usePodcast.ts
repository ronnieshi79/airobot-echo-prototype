import { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface PodcastEpisode {
  id: string;
  title: string;
  summary: string;
  type: 'video' | 'audio' | 'text';
  channelName: string;
  content: string;
  date: string;
  bgImage: string;
  progress?: number; // 0-100
  played?: boolean;
  favorite?: boolean;
  qnaHistory?: { question: string, answer: string }[];
}

export function usePodcast() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying && activeEpisode && (activeEpisode.progress || 0) < 100) {
      interval = setInterval(() => {
        setEpisodes(prev => {
          const updated = prev.map(ep => {
            if (ep.id === activeEpisode.id) {
              const nextProgress = Math.min((ep.progress || 0) + 0.5, 100);
              const isPlayed = nextProgress >= 95 || ep.played;
              return { ...ep, progress: nextProgress, played: isPlayed };
            }
            return ep;
          });
          // Only save to localStorage every 5 seconds to avoid spamming
          if (Math.floor((activeEpisode.progress || 0)) % 5 === 0) {
            localStorage.setItem('aether_podcast_history_v3', JSON.stringify(updated));
          }
          return updated;
        });
        
        setActiveEpisode(prev => {
          if (!prev) return prev;
          const nextProgress = Math.min((prev.progress || 0) + 0.5, 100);
          return { ...prev, progress: nextProgress, played: nextProgress >= 95 || prev.played };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeEpisode?.id]);

  useEffect(() => {
    const saved = localStorage.getItem('aether_podcast_history_v3');
    if (saved) {
      try {
        let loaded: PodcastEpisode[] = JSON.parse(saved);
        loaded = loaded.map(ep => {
          let updatedTitle = ep.title;
          if (updatedTitle.includes('：')) {
            const parts = updatedTitle.split('：');
            if (parts[0].includes('我的DIY') || parts[0] === ep.channelName) {
              updatedTitle = parts.slice(1).join('：');
            }
          }
          if (updatedTitle.includes(':')) {
            const parts = updatedTitle.split(':');
            if (parts[0].includes('我的DIY') || parts[0] === ep.channelName) {
              updatedTitle = parts.slice(1).join(':');
            }
          }
          let channelName = ep.channelName;
          if (channelName.includes('我的DIY')) {
            channelName = '我的DIY创作';
          }
          return { ...ep, title: updatedTitle, channelName };
        });
        setEpisodes(loaded);
        localStorage.setItem('aether_podcast_history_v3', JSON.stringify(loaded));
      } catch (e) {
        console.error("Failed to parse/migrate podcast history", e);
      }
    } else {
      // Initial data with 4 episodes (2 unplayed)
      const initial: PodcastEpisode[] = [
        {
          id: '1',
          title: '深海探秘：未知的深渊',
          summary: '跟随着深海潜水器的视角，探索地球上最深处的奇妙生物与地质奇观。',
          type: 'video',
          channelName: '未知的深渊',
          content: '【画外音：深沉的声呐声与潜水艇加压轰鸣】\n\n[主持人: AETHER] 欢迎收听本期科技视频节目。在我们身下，是超过一万米深、完全黑暗的马里亚纳海沟。通过我们的前端深海超清摄像机微光夜视系统，我们可以看到前方有一只透明的水母闪烁着极其绚丽的生物荧光...\n\n[AI助手: 小艾] 是的，AETHER！这些发光粒子是由它体内的发光蛋白质与发光素氧化反应产生，用于在永夜中诱捕猎物以及迷惑天敌。在视频画面中，右侧掠过的是长达三米的大王地表蠕虫。',
          date: '2026-06-18',
          bgImage: 'https://picsum.photos/seed/ocean/1024/1024?blur=2',
          progress: 0,
          played: false,
          favorite: true,
          qnaHistory: []
        },
        {
          id: '2',
          title: '商业帝国的崛起：创新法则',
          summary: '深度剖析顶尖科技公司如何在几十年间保持持续创新，成长为全球最具价值的企业。',
          type: 'text',
          channelName: '商业思维日课',
          content: '从最早的车库起家，到如今万亿市值，顶尖科技的成功不仅在于技术本身，更在于他们对人性、设计以及极简主义的深刻理解。\n\n【创新思维核心论点】\n1. 极简主义设计：把复杂功能隐藏到最简界面之下。\n2. 解决底层痛点：不仅是提供工具，更是重构生活方式。\n3. 高频重构迭代：每天进行一小步优化，一年后产生指数级飞跃。\n\n优秀的创作者应该通过对行业本质的理解，直击核心，拒绝无意义的复杂功能堆砌，正如这款 AETHER 智能工具台的拟物物理卡片设计，让功能回归纯粹。',
          date: '2026-06-17',
          bgImage: 'https://picsum.photos/seed/business/1024/1024?blur=2',
          progress: 0,
          played: false,
          favorite: false,
          qnaHistory: []
        },
        {
          id: '3',
          title: '极简舒缓氛围乐：森林晨曦',
          summary: '白噪音白绿背景白噪音合成，清晨森林木屋里的原木柴火燃烧、松针小鸟合鸣，静心冥想解压。',
          type: 'audio',
          channelName: '自然白噪音疗愈馆',
          content: '【白噪音疗愈音频导聆：轻轻的虫鸣与火土柴柴噼啪响】\n\n本专辑由森林原野真实采集的自然声响配以清晨柔和舒缓的合成乐背景混合而成。适合作为您阅读、写作、午后小憩、或者沉静心灵的背景音乐合声。\n\n请戴上高品质立体声耳机。左耳传来晨鸟从湿润枝头展翅的轻盈拍击，右耳则是松风穿过密林的沙沙絮语。',
          date: '2026-06-16',
          bgImage: 'https://picsum.photos/seed/forest/1024/1024?blur=4',
          progress: 100,
          played: true,
          favorite: true,
          qnaHistory: []
        },
        {
          id: '4',
          title: '今日全球科技速递',
          summary: '快速了解今日最重要的科技新闻，从AI突破到量子计算。',
          type: 'text',
          channelName: '每日科技速递',
          content: '今天，科技界迎来了一个重磅消息。某知名实验室宣布在室温超导领域取得了突破性进展。该新型超导结构是在全新的合金高压晶格中实现的，一旦其稳定性和常压表现得到长效验证，人类将迎来输电零损耗与可控核聚变的爆发性跨越。',
          date: '2026-06-15',
          bgImage: 'https://picsum.photos/seed/tech/1024/1024?blur=4',
          progress: 100,
          played: true,
          favorite: false,
          qnaHistory: [{ question: '什么是室温超导？', answer: '室温超导是指在接近室温的条件下，材料的电阻降为零的现象。' }]
        }
      ];
      setEpisodes(initial);
      localStorage.setItem('aether_podcast_history_v3', JSON.stringify(initial));
    }
  }, []);

  const updateEpisodeProgress = useCallback((id: string, progress: number) => {
    setEpisodes(prev => {
      const updated = prev.map(ep => 
        ep.id === id ? { ...ep, progress, played: progress >= 95 || ep.played } : ep
      );
      localStorage.setItem('aether_podcast_history_v3', JSON.stringify(updated));
      return updated;
    });
    
    setActiveEpisode(prev => prev?.id === id ? { ...prev, progress, played: progress >= 95 || prev.played } : prev);
  }, []);

  const addQnA = useCallback((id: string, question: string, answer: string) => {
    setEpisodes(prev => {
      const updated = prev.map(ep => 
        ep.id === id ? { ...ep, qnaHistory: [...(ep.qnaHistory || []), { question, answer }] } : ep
      );
      localStorage.setItem('aether_podcast_history_v3', JSON.stringify(updated));
      return updated;
    });
    
    setActiveEpisode(prev => prev?.id === id ? { ...prev, qnaHistory: [...(prev.qnaHistory || []), { question, answer }] } : prev);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setEpisodes(prev => {
      const updated = prev.map(ep => 
        ep.id === id ? { ...ep, favorite: !ep.favorite } : ep
      );
      localStorage.setItem('aether_podcast_history_v3', JSON.stringify(updated));
      return updated;
    });
    
    setActiveEpisode(prev => prev?.id === id ? { ...prev, favorite: !prev.favorite } : prev);
  }, []);

  const generateEpisode = useCallback(async (type: 'video' | 'audio' | 'text', topic?: string) => {
    setIsGenerating(true);
    try {
      const typeLabelMap = {
        video: '视频',
        audio: '音频',
        text: '图文'
      };
      const textType = typeLabelMap[type] || '图文';
      const prompt = topic 
        ? `生成一期关于“${topic}”的${textType}播客内容。要求：标题吸引人，内容详实且生动，适合5-10分钟的阅读/收听。`
        : `生成一期随机的${textType}播客内容。要求：标题吸引人，内容详实且生动，适合5-10 minutes的阅读/收听。`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "你是一个专业的播客内容创作者。请生成高质量的图文播客内容。输出格式为JSON：{ \"title\": \"...\", \"summary\": \"...\", \"content\": \"...\" }",
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text);
      const channelMap = {
        video: '我的DIY创作',
        audio: '每日声音电台',
        text: '每日科技速递'
      };
      const newEpisode: PodcastEpisode = {
        id: Date.now().toString(),
        title: data.title,
        summary: data.summary,
        type,
        channelName: channelMap[type] || '未分类栏目',
        content: data.content,
        date: new Date().toISOString().split('T')[0],
        bgImage: `https://picsum.photos/seed/${type}${Date.now()}/1920/1080?blur=4`
      };

      setEpisodes(prev => {
        const updated = [newEpisode, ...prev].slice(0, 20);
        localStorage.setItem('aether_podcast_history_v3', JSON.stringify(updated));
        return updated;
      });
      setActiveEpisode(newEpisode);
    } catch (error) {
      console.error("Failed to generate episode:", error);
      // Fallback for when API quota is exhausted
      const fallbackTitle = topic ? `关于${topic}的特别探索` : '随机发现新知';
      const channelMap = {
        video: '我的DIY创作',
        audio: '每日声音电台',
        text: '每日科技速递'
      };
      const typeLabelMap = {
        video: '视频',
        audio: '音频',
        text: '图文'
      };
      const textType = typeLabelMap[type] || '图文';
      const newEpisode: PodcastEpisode = {
        id: Date.now().toString(),
        title: fallbackTitle,
        summary: `这是一期在 AI 生成受限时为您准备的预设 ${textType} 播客节目。受限于 API 额度，当前显示为备用内容。`,
        type,
        channelName: channelMap[type] || '未分类栏目',
        content: `亲爱的听众，\n\n很抱歉，由于当前的 AI 调用额度已被耗尽（Error 429: Resource Exhausted），我们暂时无法为您动态生成全新的播客文章。\n\n但这并不妨碍我们为您播放来自电台的放松白噪音。当额度恢复后，您可以继续获得量身定制的私人播客内容。`,
        date: new Date().toISOString().split('T')[0],
        bgImage: `https://picsum.photos/seed/${type}fallback${Date.now()}/1920/1080?blur=4`
      };
      setEpisodes(prev => {
        const updated = [newEpisode, ...prev].slice(0, 20);
        localStorage.setItem('aether_podcast_history_v3', JSON.stringify(updated));
        return updated;
      });
      setActiveEpisode(newEpisode);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const closeEpisode = useCallback(() => {
    setActiveEpisode(null);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const addCustomEpisode = useCallback((title: string, summary: string, content: string, channelName: string, type: 'video' | 'audio' | 'text') => {
    const newEpisode: PodcastEpisode = {
      id: "diy_" + Date.now().toString(),
      title,
      summary,
      content,
      type,
      channelName: '我的DIY创作',
      date: new Date().toISOString().split('T')[0],
      bgImage: `https://picsum.photos/seed/diy_${Date.now()}/1024/1024?blur=2`,
      progress: 0,
      played: false,
      favorite: false,
      qnaHistory: []
    };
    setEpisodes(prev => {
      const updated = [newEpisode, ...prev].slice(0, 20);
      localStorage.setItem('aether_podcast_history_v3', JSON.stringify(updated));
      return updated;
    });
    setActiveEpisode(newEpisode);
  }, []);

  return {
    episodes,
    activeEpisode,
    isGenerating,
    recommendation,
    isPlaying,
    generateEpisode,
    closeEpisode,
    setActiveEpisode,
    updateEpisodeProgress,
    addQnA,
    toggleFavorite,
    togglePlay,
    setIsPlaying,
    addCustomEpisode
  };
}
