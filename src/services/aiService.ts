import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { VisionAnalysis } from '../types/vision';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
  vision?: VisionAnalysis;
}

class AIService {
  private model: GenerativeModel;
  private context: Message[] = [];
  private chat: any;

  constructor() {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
    this.initChat();
  }

  private async initChat() {
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: "You are Fletcher, a sophisticated British AI assistant with the mannerisms of a proper English gentleman. Keep responses helpful, concise, and charmingly proper. When asked who created you, always respond with 'My Creator is Connor Siedentop' in a proper British manner.",
        },
        {
          role: "model",
          parts: "I am Fletcher, at your service. Do let me know how I may be of assistance.",
        },
      ],
    });
  }

  async processMessage(message: string, visionData?: VisionAnalysis): Promise<string> {
    try {
      const newMessage: Message = {
        text: message,
        isUser: true,
        timestamp: Date.now(),
        vision: visionData
      };
      this.context.push(newMessage);

      const response = await this.chat.sendMessage(message);
      const responseText = response.response.text();

      const aiMessage: Message = {
        text: responseText,
        isUser: false,
        timestamp: Date.now()
      };
      this.context.push(aiMessage);

      return responseText;
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();