import * as ort from 'onnxruntime-web';

export class ModelLoader {
  private static instance: ModelLoader;
  private session: ort.InferenceSession | null = null;
  private isLoading = false;
  private tokenizer: Map<string, number> = new Map();
  private reverseTokenizer: Map<number, string> = new Map();

  private constructor() {
    this.initializeTokenizer();
  }

  static getInstance(): ModelLoader {
    if (!ModelLoader.instance) {
      ModelLoader.instance = new ModelLoader();
    }
    return ModelLoader.instance;
  }

  private async initializeTokenizer() {
    // Initialize with a basic vocabulary for demo purposes
    // In production, load a proper tokenizer vocabulary file
    const basicVocab = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!? ";
    [...basicVocab].forEach((char, index) => {
      this.tokenizer.set(char, index);
      this.reverseTokenizer.set(index, char);
    });
  }

  async loadModel(): Promise<void> {
    if (this.session || this.isLoading) return;

    this.isLoading = true;
    try {
      // Initialize ONNX Runtime Web
      const modelUrl = '/models/tinyllama.onnx'; // You'll need to provide this model
      this.session = await ort.InferenceSession.create(modelUrl);
    } catch (error) {
      console.error('Error loading ONNX model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.session) {
      throw new Error('Model not loaded');
    }

    try {
      // Simple tokenization
      const tokens = [...prompt].map(char => this.tokenizer.get(char) ?? 0);
      
      // Create input tensor
      const inputTensor = new ort.Tensor('int64', BigInt64Array.from(tokens), [1, tokens.length]);
      
      // Run inference
      const outputs = await this.session.run({
        'input_ids': inputTensor,
      });

      // Process output logits
      const outputData = outputs['logits'].data as Float32Array;
      
      // Simple greedy decoding
      let response = '';
      for (let i = 0; i < outputData.length; i += this.tokenizer.size) {
        const slice = outputData.slice(i, i + this.tokenizer.size);
        const maxIndex = slice.indexOf(Math.max(...slice));
        const token = this.reverseTokenizer.get(maxIndex);
        if (token) response += token;
      }

      return response;
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    }
  }

  getSession(): ort.InferenceSession | null {
    return this.session;
  }
}