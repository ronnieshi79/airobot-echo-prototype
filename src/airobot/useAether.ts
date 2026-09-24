import { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '../types';
import { agentService } from '../services/agentService';

export type RobotState = 'sleeping' | 'dozing' | 'bored' | 'dazing' | 'ready' | 'talking' | 'working';

export const useAether = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>('ready');
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '你好呀！我是 AETHER，想听故事还是学习新知识？' }
  ]);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stateChangeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Idle state loop
  useEffect(() => {
    if (conversationState !== 'idle') {
      if (conversationState === 'listening' || conversationState === 'thinking') {
         setRobotState('working');
      } else if (conversationState === 'speaking') {
         setRobotState('talking');
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (stateChangeTimerRef.current) clearTimeout(stateChangeTimerRef.current);
      return;
    }

    // conversationState is idle. We should start cycling idle states
    const resetIdleLoop = () => {
       setRobotState('ready');
       if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
       if (stateChangeTimerRef.current) clearTimeout(stateChangeTimerRef.current);
       
       idleTimerRef.current = setTimeout(() => {
           // randomly pick an idle state
           const idleStates: RobotState[] = ['dazing', 'bored', 'dozing', 'sleeping'];
           const nextState = idleStates[Math.floor(Math.random() * idleStates.length)];
           setRobotState(nextState);

           // change state again after a while
           stateChangeTimerRef.current = setTimeout(() => {
                resetIdleLoop();
           }, 8000 + Math.random() * 8000);
       }, 5000 + Math.random() * 5000); // 5-10 seconds of ready before getting bored/sleepy
    };

    resetIdleLoop();

    return () => {
       if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
       if (stateChangeTimerRef.current) clearTimeout(stateChangeTimerRef.current);
    };
  }, [conversationState]);

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const addBotMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { role: 'bot', text }]);
    setIsChatOpen(true);
  }, []);

  const handleRobotChat = useCallback(async (prompt: string, type: 'general' | 'story' | 'news' | 'knowledge' | 'alarm' | 'hourly_chime' | 'timer' | 'focus' = 'general', systemPromptOverride?: string) => {
    const roleForPrompt = (type === 'alarm' || type === 'hourly_chime' || type === 'timer' || type === 'focus') ? 'system' : 'user';
    let source = undefined;
    if (type === 'alarm') source = '闹钟';
    if (type === 'hourly_chime') source = '准点报时';
    if (type === 'timer') source = '计时器';
    if (type === 'focus') source = '专注时钟';
    
    setMessages(prev => [...prev, { role: roleForPrompt, text: prompt, source }]);
    setConversationState('thinking');
    
    try {
      let systemPrompt = systemPromptOverride || `你是一个可爱的AI机器人助手，名为AETHER。你住在用户的拟物闹钟里。`;
      if (type === 'story') systemPrompt += `你现在是讲故事模式，请为用户讲述一个简短、充满想象力且富有启发性的小故事。`;
      if (type === 'news') systemPrompt += `你现在是资讯播报模式，请为用户简要概括最近的热门资讯或有趣的新闻。`;
      if (type === 'knowledge') systemPrompt += `你现在是知识科普模式，请为用户讲解一个有趣的科学知识或生活常识。`;
      if (type === 'alarm') systemPrompt += `你现在是闹钟唤醒模式，请用拟人化、活泼的语气，结合闹钟的名称和事务，生成一段叫醒用户的语音播报内容。`;
      if (type === 'hourly_chime') systemPrompt += `你现在是整点报时模式，请用简短的语音播报当前时间。可以带上一句简短的鼓励或提示。`;
      
      const aiText = await agentService.generateTextResponse(
        `${systemPrompt} 用户说：${prompt}。请用简短、活泼、拟人化的语气回复（不超过100个字）。`, 
        systemPrompt
      );
      
      addBotMessage(aiText);
      setConversationState('speaking');
      setIsSpeaking(true);

      // Generate TTS
      try {
        const base64Audio = await agentService.generateTTS(aiText);
        const onSpeechEnd = () => {
          setIsSpeaking(false);
          setConversationState('idle');
        };
        if (base64Audio) {
          agentService.playPCM24000(base64Audio, onSpeechEnd);
        } else {
          agentService.playLocalTTSFallback(aiText, onSpeechEnd);
        }
      } catch (ttsError) {
        console.error("TTS Error:", ttsError);
        agentService.playLocalTTSFallback(aiText, () => {
          setIsSpeaking(false);
          setConversationState('idle');
        });
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      const fallbackMsg = "抱歉，我的大脑好像暂时断线了，请稍后再试。";
      addBotMessage(fallbackMsg);
      setConversationState('speaking');
      setIsSpeaking(true);
      agentService.playLocalTTSFallback(fallbackMsg, () => {
        setIsSpeaking(false);
        setConversationState('idle');
      });
    }
  }, [addBotMessage]);

  const invokeHourlyChime = useCallback(async (hour: number, schedules: any[]) => {
    setMessages(prev => [...prev, { role: 'system', text: `现在是 ${hour} 点整。`, source: '准点报时' }]);
    setConversationState('thinking');
    setIsChatOpen(true);
    
    try {
      const { text, base64Audio } = await agentService.processHourlyChime(hour, schedules);
      
      addBotMessage(text);
      setConversationState('speaking');
      setIsSpeaking(true);

      if (base64Audio) {
        agentService.playPCM24000(base64Audio, () => {
          setIsSpeaking(false);
          setConversationState('idle');
        });
      } else {
        agentService.playLocalTTSFallback(text, () => {
          setIsSpeaking(false);
          setConversationState('idle');
        });
      }
    } catch (error) {
      console.error("Hourly Chime Error:", error);
      const fallbackMsg = "抱歉，我的大脑好像暂时断线了，请稍后再试。";
      addBotMessage(fallbackMsg);
      setConversationState('speaking');
      setIsSpeaking(true);
      agentService.playLocalTTSFallback(fallbackMsg, () => {
        setIsSpeaking(false);
        setConversationState('idle');
      });
    }
  }, [addBotMessage]);

  return {
    isChatOpen,
    setIsChatOpen,
    conversationState,
    setConversationState,
    messages,
    setMessages,
    isVoiceActive,
    setIsVoiceActive,
    isSpeaking,
    setIsSpeaking,
    isBlinking,
    robotState,
    setRobotState,
    addBotMessage,
    handleRobotChat,
    invokeHourlyChime
  };
};
