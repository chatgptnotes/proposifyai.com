export class StreamHandler {
  private encoder = new TextEncoder();

  createStream(generator: AsyncGenerator<string>): ReadableStream {
    const encoder = this.encoder;

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generator) {
            const encoded = encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`);
            controller.enqueue(encoded);
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        }
      },
    });
  }

  async *parseStream(response: Response): AsyncGenerator<string> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                yield parsed.content;
              }
            } catch (e) {
              console.error('Failed to parse stream data:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const streamHandler = new StreamHandler();

export interface StreamOptions {
  onStart?: () => void;
  onChunk?: (chunk: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

export async function consumeStream(
  generator: AsyncGenerator<string>,
  options: StreamOptions = {}
): Promise<string> {
  const { onStart, onChunk, onComplete, onError } = options;
  let fullText = '';

  try {
    onStart?.();

    for await (const chunk of generator) {
      fullText += chunk;
      onChunk?.(chunk);
    }

    onComplete?.(fullText);
    return fullText;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    onError?.(err);
    throw err;
  }
}
