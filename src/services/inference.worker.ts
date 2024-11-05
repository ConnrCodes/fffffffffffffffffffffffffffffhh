import { expose } from 'comlink';
import * as ort from 'onnxruntime-web';
import { ModelLoader } from './modelLoader';

export interface InferenceWorker {
  generateResponse(prompt: string): Promise<string>;
}

const worker: InferenceWorker = {
  async generateResponse(prompt: string): Promise<string> {
    try {
      const modelLoader = ModelLoader.getInstance();
      await modelLoader.loadModel();
      return await modelLoader.generateResponse(prompt);
    } catch (error) {
      console.error('Worker inference error:', error);
      throw error;
    }
  },
};

expose(worker);