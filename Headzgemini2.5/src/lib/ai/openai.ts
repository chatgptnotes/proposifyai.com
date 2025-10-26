import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenAIOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export class OpenAIClient {
  private static instance: OpenAIClient;

  private constructor() {}

  static getInstance(): OpenAIClient {
    if (!OpenAIClient.instance) {
      OpenAIClient.instance = new OpenAIClient();
    }
    return OpenAIClient.instance;
  }

  async generate(
    messages: OpenAIMessage[],
    options: OpenAIOptions = {}
  ): Promise<string> {
    const {
      model = 'gpt-4-turbo-preview',
      maxTokens = 4096,
      temperature = 0.7,
    } = options;

    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw this.handleError(error);
    }
  }

  async *generateStream(
    messages: OpenAIMessage[],
    options: OpenAIOptions = {}
  ): AsyncGenerator<string> {
    const {
      model = 'gpt-4-turbo-preview',
      maxTokens = 4096,
      temperature = 0.7,
    } = options;

    try {
      const stream = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('OpenAI streaming error:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return new Error(
          'Rate limit exceeded. Please try again in a moment.'
        );
      }
      if (error.status === 401) {
        return new Error('Invalid API key. Please check your configuration.');
      }
      if (error.status === 500) {
        return new Error('OpenAI API is temporarily unavailable.');
      }
      return new Error(`OpenAI API error: ${error.message}`);
    }
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.generate(
        [{ role: 'user', content: 'Hi' }],
        { maxTokens: 10 }
      );
      return true;
    } catch {
      return false;
    }
  }
}

export const openaiClient = OpenAIClient.getInstance();
