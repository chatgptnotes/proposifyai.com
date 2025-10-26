import { NextRequest, NextResponse } from 'next/server';
import { researchAgent } from '@/lib/ai/research';

export const runtime = 'edge';

interface ResearchRequest {
  type: 'company' | 'industry' | 'competitor';
  companyName?: string;
  industry?: string;
  competitors?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: ResearchRequest = await req.json();
    const { type, companyName, industry, competitors } = body;

    if (type === 'company') {
      if (!companyName) {
        return NextResponse.json(
          { error: 'Company name is required' },
          { status: 400 }
        );
      }

      const result = await researchAgent.researchCompany(companyName, industry);
      return NextResponse.json(result);
    }

    if (type === 'industry') {
      if (!industry) {
        return NextResponse.json(
          { error: 'Industry is required' },
          { status: 400 }
        );
      }

      const result = await researchAgent.analyzeIndustry(industry);
      return NextResponse.json(result);
    }

    if (type === 'competitor') {
      if (!companyName || !competitors || competitors.length === 0) {
        return NextResponse.json(
          { error: 'Company name and competitors are required' },
          { status: 400 }
        );
      }

      const result = await researchAgent.getCompetitorInsights(
        companyName,
        competitors
      );
      return NextResponse.json({ insights: result });
    }

    return NextResponse.json(
      { error: 'Invalid research type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Research API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to complete research';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
