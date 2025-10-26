import { NextRequest, NextResponse } from 'next/server';
import { claude } from '@/lib/ai/claude';
import { openaiClient } from '@/lib/ai/openai';
import { streamHandler } from '@/lib/ai/streaming';
import { PROMPT_TEMPLATES, SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export const runtime = 'edge';

interface GenerateRequest {
  brief: string;
  companyInfo?: string;
  tone?: 'formal' | 'casual' | 'persuasive' | 'technical';
  stream?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { brief, companyInfo, tone = 'formal', stream = false } = body;

    if (!brief || brief.trim().length === 0) {
      return NextResponse.json(
        { error: 'Brief is required' },
        { status: 400 }
      );
    }

    const prompt = PROMPT_TEMPLATES.generateProposal(brief, companyInfo);
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
          { role: 'system', content: SYSTEM_PROMPTS.proposal },
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
        { role: 'system', content: SYSTEM_PROMPTS.proposal },
        ...messages,
      ]);
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Generate API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate content';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
