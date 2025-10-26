import { claude } from './claude';
import { openaiClient } from './openai';
import { PROMPT_TEMPLATES, SYSTEM_PROMPTS } from './prompts';

export interface CompanyResearchResult {
  overview: string;
  industry: string;
  keyServices: string[];
  competitors: string[];
  painPoints: string[];
  opportunities: string[];
  decisionMakers?: string[];
  recentNews?: string[];
}

export interface IndustryAnalysisResult {
  marketSize: string;
  growthTrends: string[];
  challenges: string[];
  opportunities: string[];
  majorPlayers: string[];
  innovations: string[];
  futureOutlook: string;
}

export class ResearchAgent {
  private static instance: ResearchAgent;
  private useOpenAI = false;

  private constructor() {}

  static getInstance(): ResearchAgent {
    if (!ResearchAgent.instance) {
      ResearchAgent.instance = new ResearchAgent();
    }
    return ResearchAgent.instance;
  }

  async researchCompany(
    companyName: string,
    industry?: string
  ): Promise<CompanyResearchResult> {
    try {
      const prompt = PROMPT_TEMPLATES.companyResearch(companyName, industry);
      const messages = [{ role: 'user' as const, content: prompt }];

      let response: string;
      if (this.useOpenAI) {
        response = await openaiClient.generate([
          { role: 'system', content: SYSTEM_PROMPTS.research },
          ...messages,
        ]);
      } else {
        try {
          response = await claude.generate(messages);
        } catch (error) {
          console.log('Claude unavailable, falling back to OpenAI');
          this.useOpenAI = true;
          response = await openaiClient.generate([
            { role: 'system', content: SYSTEM_PROMPTS.research },
            ...messages,
          ]);
        }
      }

      return this.parseCompanyResearch(response);
    } catch (error) {
      console.error('Company research error:', error);
      throw new Error('Failed to research company. Please try again.');
    }
  }

  async analyzeIndustry(industry: string): Promise<IndustryAnalysisResult> {
    try {
      const prompt = PROMPT_TEMPLATES.industryAnalysis(industry);
      const messages = [{ role: 'user' as const, content: prompt }];

      let response: string;
      if (this.useOpenAI) {
        response = await openaiClient.generate([
          { role: 'system', content: SYSTEM_PROMPTS.research },
          ...messages,
        ]);
      } else {
        try {
          response = await claude.generate(messages);
        } catch (error) {
          console.log('Claude unavailable, falling back to OpenAI');
          this.useOpenAI = true;
          response = await openaiClient.generate([
            { role: 'system', content: SYSTEM_PROMPTS.research },
            ...messages,
          ]);
        }
      }

      return this.parseIndustryAnalysis(response);
    } catch (error) {
      console.error('Industry analysis error:', error);
      throw new Error('Failed to analyze industry. Please try again.');
    }
  }

  async getCompetitorInsights(
    company: string,
    competitors: string[]
  ): Promise<string> {
    try {
      const prompt = PROMPT_TEMPLATES.competitorInsights(company, competitors);
      const messages = [{ role: 'user' as const, content: prompt }];

      if (this.useOpenAI) {
        return await openaiClient.generate([
          { role: 'system', content: SYSTEM_PROMPTS.research },
          ...messages,
        ]);
      }

      try {
        return await claude.generate(messages);
      } catch (error) {
        console.log('Claude unavailable, falling back to OpenAI');
        this.useOpenAI = true;
        return await openaiClient.generate([
          { role: 'system', content: SYSTEM_PROMPTS.research },
          ...messages,
        ]);
      }
    } catch (error) {
      console.error('Competitor insights error:', error);
      throw new Error('Failed to get competitor insights. Please try again.');
    }
  }

  private parseCompanyResearch(response: string): CompanyResearchResult {
    const sections = this.extractSections(response);

    return {
      overview: sections.overview || sections['company overview'] || '',
      industry: sections.industry || '',
      keyServices: this.extractList(
        sections['key products/services'] || sections['products/services'] || ''
      ),
      competitors: this.extractList(sections.competitors || sections['competitive landscape'] || ''),
      painPoints: this.extractList(sections['pain points'] || sections.challenges || ''),
      opportunities: this.extractList(sections.opportunities || ''),
      decisionMakers: this.extractList(sections['decision makers'] || ''),
      recentNews: this.extractList(sections['recent news'] || sections.news || ''),
    };
  }

  private parseIndustryAnalysis(response: string): IndustryAnalysisResult {
    const sections = this.extractSections(response);

    return {
      marketSize: sections['market size'] || sections.market || '',
      growthTrends: this.extractList(
        sections['growth trends'] || sections.trends || ''
      ),
      challenges: this.extractList(sections.challenges || ''),
      opportunities: this.extractList(sections.opportunities || ''),
      majorPlayers: this.extractList(
        sections['major players'] || sections.players || sections.competitors || ''
      ),
      innovations: this.extractList(
        sections.innovations || sections.technology || sections['technology trends'] || ''
      ),
      futureOutlook: sections['future outlook'] || sections.outlook || '',
    };
  }

  private extractSections(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = text.split('\n');
    let currentSection = 'overview';
    let currentContent: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (/^\d+\.|^#+|^[A-Z][^a-z]*:/.test(trimmed)) {
        if (currentContent.length > 0) {
          sections[currentSection.toLowerCase()] = currentContent.join('\n').trim();
        }
        currentSection = trimmed
          .replace(/^\d+\./, '')
          .replace(/^#+/, '')
          .replace(/:$/, '')
          .trim();
        currentContent = [];
      } else if (trimmed) {
        currentContent.push(trimmed);
      }
    }

    if (currentContent.length > 0) {
      sections[currentSection.toLowerCase()] = currentContent.join('\n').trim();
    }

    return sections;
  }

  private extractList(text: string): string[] {
    if (!text) return [];

    return text
      .split('\n')
      .map((line) => line.replace(/^[-*•]\s*/, '').trim())
      .filter((line) => line.length > 0);
  }
}

export const researchAgent = ResearchAgent.getInstance();
