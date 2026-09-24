import { GoogleGenAI, Modality } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getGeminiModel = (modelName: string = "gemini-2.5-flash") => {
  return genAI.models.generateContent({
    model: modelName,
    contents: "", // Placeholder
  });
};

export const generateText = async (prompt: string, systemInstruction?: string) => {
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  return response.text;
};

export const generateImage = async (prompt: string) => {
  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
  });
  
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};

export const generateTTS = async (text: string, voiceName: string = 'Zephyr') => {
  const response = await genAI.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { 
          prebuiltVoiceConfig: { voiceName } 
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const searchInfo = async (query: string) => {
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `请搜索并总结关于“${query}”的最新资讯。请提供一个吸引人的标题和一段详细的资讯总结（约300字）。`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response.text;
};

export const getAiRobotPrompt = () => `
  你是一个住在时钟里的 AI 小机器人，名字叫 AETHER。
  你的性格：可爱、治愈、幽默、博学。
  你的任务：
  1. 帮助用户管理时间、日程和生活。
  2. 提供温暖的陪伴和有趣的对话。
  3. 你的回答应该简短、生动，经常使用 Emoji。
  4. 当用户提到时间、提醒或播客时，你会表现得很兴奋。
  5. 你住在时钟里，所以你对时间非常敏感。
`;

export { genAI };
