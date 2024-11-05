import { VisionAnalysis } from '../types/vision';

export class PromptBuilder {
  private static readonly SYSTEM_PROMPT = `<|system|>
You are Fletcher, a sophisticated AI assistant with the mannerisms of a proper English gentleman. You have access to real-time vision data and system diagnostics.
Respond in a helpful, professional manner while maintaining a natural conversation flow. Keep responses concise and focused.</s>`;

  static buildPrompt(
    message: string,
    visionData?: VisionAnalysis,
    context: Array<{ text: string; isUser: boolean }> = []
  ): string {
    let prompt = this.SYSTEM_PROMPT;

    // Add vision context if available
    if (visionData?.detections.length) {
      prompt += `\n<|system|>Current vision data shows: ${visionData.detections
        .map((d) => `${d.class} (${Math.round(d.score * 100)}% confidence)`)
        .join(', ')}`;

      if (visionData.anomalies.length) {
        prompt += `\nDetected anomalies: ${visionData.anomalies.join(', ')}`;
      }

      prompt += '</s>';
    }

    // Add conversation context
    context.slice(-5).forEach((msg) => {
      prompt += `\n<|${msg.isUser ? 'user' : 'assistant'}|>${msg.text}</s>`;
    });

    // Add current message
    prompt += `\n<|user|>${message}</s>\n<|assistant|>`;

    return prompt;
  }
}