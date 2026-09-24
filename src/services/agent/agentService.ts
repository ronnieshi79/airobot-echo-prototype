import { GoogleGenAI, Modality } from "@google/genai";
import { genAI } from '../geminiService';
import { 
  ContextType, 
  ContextComputationParams, 
  ContextComputationResult, 
  AgentAction, 
  AgentIntentResult, 
  CardDriverDelegate,
  CardOverlayType,
  ServiceSlice
} from './types';
import { detectAutoContext, computeContextSlices } from './contextReasoning';
import { cardDriver } from './cardDriver';

let sharedAudioContext: AudioContext | null = null;

function getSharedAudioContext() {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

/**
 * AgentService
 * 核心智能体服务（AIRobot ECHO+ 智能大脑）：
 * 1. 情境感知与切片计算 (Context Perception & Recommendation Engine)
 * 2. 驱动底层功能卡片服务 (Driving Functional Card Services: Focus, Timer, Alarm, Calendar, Podcast, Logbook)
 * 3. 意图理解与自主决策 (Natural Language Intent & Autonomous Action Execution)
 * 4. 实时语音与大模型对话能力 (Gemini Live API, TTS, Hourly Chime)
 */
export class AgentService {
  private session: any = null;
  private currentAudioSource: AudioBufferSourceNode | null = null;
  private ttsWarmed = false;
  private liveCallbacks: any = {};
  private isConnecting: boolean = false;

  constructor() {}

  // ==========================================
  // 1. 情境计算与推荐服务 (Context Reasoning)
  // ==========================================

  /**
   * 自动感知情境类型
   */
  public detectContext(now: Date): ContextType {
    return detectAutoContext(now);
  }

  /**
   * 计算当前情境下的智能服务切片队列
   */
  public computeContext(params: ContextComputationParams): ContextComputationResult {
    return computeContextSlices(params);
  }

  /**
   * 调用 AI 大脑进行实时情境洞察推演
   */
  public async reasonContextInsight(context: ContextType, slice?: ServiceSlice): Promise<string> {
    try {
      const prompt = `当前情境模式为：${context}，推荐的服务切片是：${slice?.title || '专注心流'}。
请作为陪伴型AI机器人AETHER，生成一句话（不超过30字）情境洞察与建议。语气拟人、温暖、高效。`;

      const response = await this.generateTextResponse(
        prompt,
        "你是AETHER，一个住在拟物桌面设备里的AI机器人，专注于提供按需情境感知与功能服务卡片协助。"
      );
      return response;
    } catch (e) {
      console.error("[AgentService] Context insight reasoning error:", e);
      return slice?.recommendationReason || "基于当前情境，为你推荐最适合的服务。";
    }
  }

  // ==========================================
  // 2. 驱动功能卡片服务 (Driving Functional Cards)
  // ==========================================

  /**
   * 注册底层功能卡片代理 (React Hooks & State 接口)
   */
  public registerCardDriver(delegate: CardDriverDelegate) {
    cardDriver.registerDelegate(delegate);
  }

  public unregisterCardDriver() {
    cardDriver.unregisterDelegate();
  }

  /**
   * 智能体直接调度驱动卡片服务
   */
  public driveCardService(action: AgentAction): boolean {
    return cardDriver.executeAction(action);
  }

  /**
   * 自然语言意图理解并自动执行卡片服务驱动
   */
  public processUserIntent(text: string, activeOverlay: CardOverlayType): AgentIntentResult {
    return cardDriver.parseAndDriveIntent(text, activeOverlay);
  }

  // ==========================================
  // 3. 语音与音频基础能力 (Audio & TTS)
  // ==========================================

  public initAudio() {
    getSharedAudioContext();
    if (!this.ttsWarmed) {
      this.ttsWarmed = true;
      this.generateTTS('哈').catch(() => {});
    }
  }

  public async playPCM24000(base64Audio: string, onEnded?: () => void) {
    try {
      const audioContext = getSharedAudioContext();
      const binaryString = window.atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len % 2 === 0 ? len : len + 1);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const int16Array = new Int16Array(bytes.buffer);
      const audioBuffer = audioContext.createBuffer(1, int16Array.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < int16Array.length; i++) {
        channelData[i] = int16Array[i] / 32768.0;
      }
      
      if (this.currentAudioSource) {
        this.currentAudioSource.stop();
        this.currentAudioSource.disconnect();
      }
      
      const source = audioContext.createBufferSource();
      this.currentAudioSource = source;
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        if (onEnded) onEnded();
      };
      source.start();
    } catch (e) {
      console.error("PCM Playback Error:", e);
      if (onEnded) onEnded();
    }
  }

  public async generateTextResponse(prompt: string, systemInstruction: string) {
    try {
      const response = await Promise.race([
        genAI.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
          }
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("LLM Request Timeout")), 15000);
        })
      ]);
      
      return response.text || "我在这里陪着你！";
    } catch (e) {
      console.error("AgentService Text Generation Failed/Timeout:", e);
      return "抱歉，网络出了点状况，请稍后再试～";
    }
  }

  public async generateTTS(text: string) {
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (e) {
      console.error("AgentService TTS Generation Failed/Timeout:", e);
      return null;
    }
  }

  public playLocalTTSFallback(text: string, onEnded?: () => void) {
    console.log("Using Browser Fallback TTS for:", text);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      if (onEnded) {
        utterance.onend = onEnded;
        utterance.onerror = onEnded;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnded) onEnded();
    }
  }

  // ==========================================
  // 4. Live API 实时双工语音
  // ==========================================

  public setLiveVoiceCallbacks(callbacks: {
    onMessage?: (msg: any) => void;
    onOpen?: () => void;
    onClose?: (event?: any) => void;
    onError?: (error?: any) => void;
  }) {
    this.liveCallbacks = { ...this.liveCallbacks, ...callbacks };
  }

  public async ensureLiveVoice(
    systemInstruction: string,
    callbacks?: {
      onMessage?: (msg: any) => void;
      onOpen?: () => void;
      onClose?: (event?: any) => void;
      onError?: (error?: any) => void;
    }
  ) {
    if (callbacks) {
      this.setLiveVoiceCallbacks(callbacks);
    }
    if (this.session) {
      return this.session;
    }
    if (this.isConnecting) {
      while(this.isConnecting) {
        await new Promise(r => setTimeout(r, 100));
      }
      return this.session;
    }
    
    this.isConnecting = true;
    try {
      this.session = await genAI.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } } },
          systemInstruction,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => this.liveCallbacks.onOpen?.(),
          onmessage: (msg: any) => this.liveCallbacks.onMessage?.(msg),
          onclose: (e: any) => {
             this.session = null;
             this.liveCallbacks.onClose?.(e);
          },
          onerror: (e: any) => {
             this.session = null;
             this.liveCallbacks.onError?.(e);
          },
        }
      });
    } catch (error: any) {
      if (error?.message === 'Network error') {
         console.log("Live API Connection failed (safe to ignore in preview):", error);
      } else {
         console.error("Live API Connection failed:", error);
      }
      throw error;
    } finally {
      this.isConnecting = false;
    }
    return this.session;
  }

  public async disconnectLiveVoice() {
    if (this.session) {
      this.session.close && this.session.close();
      this.session = null;
    }
  }

  public async sendText(text: string) {
    if (this.session) {
       try {
         this.session.sendClientContent({
           turns: [{ role: 'user', parts: [{ text }] }],
           turnComplete: true
         });
       } catch (error) {
         console.error('Failed to send text to Live API:', error);
       }
    }
  }

  public async sendAudio(base64Audio: string) {
    if (this.session) {
      this.session.sendRealtimeInput([{
        mimeType: "audio/pcm;rate=16000",
        data: base64Audio,
      }]);
    }
  }

  // ==========================================
  // 5. 场景化主动报时服务 (Hourly Chime)
  // ==========================================

  public async processHourlyChime(hour: number, schedules: any[]) {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySchedules = schedules.filter(s => s.date === todayStr);
    
    const mockWeather = "天气晴朗，气温24度";
    let scheduleInfo = '';
    if (todaySchedules.length > 0) {
      scheduleInfo = `主人今天的日程有：${todaySchedules.map(s => s.title).join('、')}。`;
    } else {
      scheduleInfo = `主人今天暂时没有安排日程。`;
    }
    
    const systemPrompt = `你是一个可爱的AI机器人助手，名为AETHER。你住在用户的拟物闹钟里。你现在是体验极佳的陪伴助理，正在进行整点报时。
当前环境信息：时间是 ${hour} 点整。天气情况：${mockWeather}。
日程信息：${scheduleInfo}

请用非常简短、活泼、拟人化的一两句话向用户报时，并自然地把部分日程情况和天气带进去，不要像在读列表，要像朋友一样提醒。字数不超过80个字。`;

    const userPrompt = `现在是 ${hour} 点整。`;

    const aiText = await this.generateTextResponse(
      `用户说：${userPrompt}。`, 
      systemPrompt
    );

    const base64Audio = await this.generateTTS(aiText);

    return {
      text: aiText,
      base64Audio
    };
  }
}

export const agentService = new AgentService();
