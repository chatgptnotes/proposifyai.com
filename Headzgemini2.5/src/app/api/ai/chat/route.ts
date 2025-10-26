import { NextRequest, NextResponse } from 'next/server';
import { claude } from '@/lib/ai/claude';
import { openaiClient } from '@/lib/ai/openai';
import { streamHandler } from '@/lib/ai/streaming';
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export const runtime = 'edge';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context?: string;
  stream?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, context, stream = true } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const contextMessage = context
      ? `Current proposal context:\n${context}\n\n`
      : '';

    const enrichedMessages = [
      ...messages.slice(0, -1),
      {
        role: 'user' as const,
        content: contextMessage + messages[messages.length - 1].content,
      },
    ];

    if (stream) {
      try {
        const generator = claude.generateStream(enrichedMessages);
        const streamResponse = streamHandler.createStream(generator);

        return new NextResponse(streamResponse, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (claudeError) {
        console.log('Claude unavailable, trying OpenAI for streaming');
        const openaiMessages = [
          { role: 'system' as const, content: SYSTEM_PROMPTS.proposal },
          ...enrichedMessages,
        ];
        const generator = openaiClient.generateStream(openaiMessages);
        const streamResponse = streamHandler.createStream(generator);

        return new NextResponse(streamResponse, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
    }

    let content: string;
    try {
      content = await claude.generate(enrichedMessages);
    } catch (claudeError) {
      console.log('Claude unavailable, falling back to OpenAI');
      const openaiMessages = [
        { role: 'system' as const, content: SYSTEM_PROMPTS.proposal },
        ...enrichedMessages,
      ];
      content = await openaiClient.generate(openaiMessages);
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process chat';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
