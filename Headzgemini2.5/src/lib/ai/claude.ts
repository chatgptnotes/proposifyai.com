import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export class ClaudeClient {
  private static instance: ClaudeClient;

  private constructor() {}

  static getInstance(): ClaudeClient {
    if (!ClaudeClient.instance) {
      ClaudeClient.instance = new ClaudeClient();
    }
    return ClaudeClient.instance;
  }

  async generate(
    messages: ClaudeMessage[],
    options: ClaudeOptions = {}
  ): Promise<string> {
    const {
      model = 'claude-3-5-sonnet-20241022',
      maxTokens = 4096,
      temperature = 0.7,
    } = options;

    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Claude API error:', error);
      throw this.handleError(error);
    }
  }

  async *generateStream(
    messages: ClaudeMessage[],
    options: ClaudeOptions = {}
  ): AsyncGenerator<string> {
    const {
      model = 'claude-3-5-sonnet-20241022',
      maxTokens = 4096,
      temperature = 0.7,
    } = options;

    try {
      const stream = await anthropic.messages.stream({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          yield chunk.delta.text;
        }
      }
    } catch (error) {
      console.error('Claude streaming error:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return new Error(
          'Rate limit exceeded. Please try again in a moment.'
        );
      }
      if (error.status === 401) {
        return new Error('Invalid API key. Please check your configuration.');
      }
      if (error.status === 500) {
        return new Error('Claude API is temporarily unavailable.');
      }
      return new Error(`Claude API error: ${error.message}`);
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

export const claude = ClaudeClient.getInstance();
