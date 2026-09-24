import { GoogleGenAI, Modality } from "@google/genai";
import { genAI } from './geminiService';

/**
 * AgentService
 * 负责 Airobot 的意图理解、功能模块的上下文调度、以及语音控制流的抽象。
 * 将这层从 App.tsx 和 useAether 中抽离出来，使 UI 逻辑和 AI 调用解耦。
 */
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

export class AgentService {
  private session: any = null;
  private currentAudioSource: AudioBufferSourceNode | null = null;
  
  constructor() {}

  private ttsWarmed = false;

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
          setTimeout(() => reject(new Error("LLM Request Timeout")), 15000); // 15 second timeout
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
      // Cancel any ongoing speech
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

  public setLiveVoiceCallbacks(callbacks: {
    onMessage?: (msg: any) => void;
    onOpen?: () => void;
    onClose?: (event?: any) => void;
    onError?: (error?: any) => void;
  }) {
    this.liveCallbacks = { ...this.liveCallbacks, ...callbacks };
  }

  private liveCallbacks: any = {};

  private isConnecting: boolean = false;

  // 初始化语音模式 (Live API) - 保证只有一次连接
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
      return this.session; // Already connected
    }
    if (this.isConnecting) {
      // Very simple poll to wait if connecting
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
      // close connection
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

  // 意图与服务集成包装：一键处理整点报时
  public async processHourlyChime(hour: number, schedules: any[]) {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySchedules = schedules.filter(s => s.date === todayStr);
    
    // 模拟获取天气等外部环境信息
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

    // 1. 生成播报文字
    const aiText = await this.generateTextResponse(
      `用户说：${userPrompt}。`, 
      systemPrompt
    );

    // 2. 将文字生成TTS语音
    const base64Audio = await this.generateTTS(aiText);

    return {
      text: aiText,
      base64Audio
    };
  }
}

export const agentService = new AgentService();
