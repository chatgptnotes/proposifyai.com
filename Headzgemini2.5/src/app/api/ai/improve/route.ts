import { NextRequest, NextResponse } from 'next/server';
import { claude } from '@/lib/ai/claude';
import { openaiClient } from '@/lib/ai/openai';
import { streamHandler } from '@/lib/ai/streaming';
import { PROMPT_TEMPLATES, SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export const runtime = 'edge';

interface ImproveRequest {
  text: string;
  action:
    | 'improve'
    | 'expand'
    | 'shorten'
    | 'bullets'
    | 'formal'
    | 'casual'
    | 'persuasive'
    | 'technical'
    | 'grammar';
  stream?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: ImproveRequest = await req.json();
    const { text, action, stream = false } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const prompt = buildPromptForAction(text, action);
    const messages = [{ role: 'user' as const, content: prompt }];

    if (stream) {
      try {
        const generator = claude.generateStream(messages);
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
        const generator = openaiClient.generateStream([
          { role: 'system', content: SYSTEM_PROMPTS.improvement },
          ...messages,
        ]);
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
      content = await claude.generate(messages);
    } catch (claudeError) {
      console.log('Claude unavailable, falling back to OpenAI');
      content = await openaiClient.generate([
        { role: 'system', content: SYSTEM_PROMPTS.improvement },
        ...messages,
      ]);
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Improve API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to improve content';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

function buildPromptForAction(text: string, action: ImproveRequest['action']): string {
  switch (action) {
    case 'improve':
      return PROMPT_TEMPLATES.improveText(text, 'professional');
    case 'expand':
      return `Expand this text with more detail, examples, and depth:\n\n${text}`;
    case 'shorten':
      return `Make this text more concise while keeping the key points:\n\n${text}`;
    case 'bullets':
      return `Convert this text into clear, well-organized bullet points:\n\n${text}`;
    case 'formal':
      return PROMPT_TEMPLATES.rewriteTone(text, 'formal');
    case 'casual':
      return PROMPT_TEMPLATES.rewriteTone(text, 'casual');
    case 'persuasive':
      return PROMPT_TEMPLATES.rewriteTone(text, 'persuasive');
    case 'technical':
      return PROMPT_TEMPLATES.rewriteTone(text, 'technical');
    case 'grammar':
      return `Fix any grammar, spelling, punctuation, or style issues in this text:\n\n${text}`;
    default:
      return PROMPT_TEMPLATES.improveText(text, 'professional');
  }
}
