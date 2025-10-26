export const SYSTEM_PROMPTS = {
  proposal: `You are an expert business proposal writer with deep knowledge of sales, marketing, and persuasive writing. Your goal is to create compelling, professional proposals that win deals.

Key principles:
- Focus on client benefits and value proposition
- Use clear, professional language
- Structure content logically
- Include concrete details and metrics
- Maintain a confident, consultative tone`,

  research: `You are a business intelligence researcher specializing in company and industry analysis. Provide accurate, relevant insights based on the information available.

Focus areas:
- Company background and mission
- Industry trends and challenges
- Competitive landscape
- Key decision makers
- Pain points and opportunities`,

  improvement: `You are an expert editor focused on improving business writing. Enhance clarity, impact, and professionalism while maintaining the original intent.

Improvement areas:
- Clarity and conciseness
- Persuasive language
- Professional tone
- Logical flow
- Grammar and style`,
};

export const PROMPT_TEMPLATES = {
  generateProposal: (brief: string, companyInfo?: string) => `
Generate a comprehensive business proposal based on this brief:

${brief}

${companyInfo ? `\nClient Information:\n${companyInfo}` : ''}

Create a well-structured proposal with:
1. Executive Summary
2. Problem Statement
3. Proposed Solution
4. Deliverables and Timeline
5. Investment/Pricing
6. Next Steps

Make it compelling, professional, and focused on client value.`,

  improveText: (text: string, tone: string) => `
Improve the following text with a ${tone} tone:

${text}

Enhance clarity, impact, and professionalism while maintaining the core message.`,

  expandBullets: (bullets: string) => `
Expand these bullet points into well-written paragraphs:

${bullets}

Make each point clear, detailed, and compelling.`,

  summarize: (text: string, maxWords: number = 100) => `
Summarize the following text in approximately ${maxWords} words:

${text}

Capture the key points while maintaining professionalism.`,

  generateCTA: (context: string) => `
Create 3 compelling call-to-action statements for this context:

${context}

Make them action-oriented, clear, and persuasive. Provide variations with different approaches.`,

  pricingDescription: (service: string, price: string, features: string[]) => `
Create a compelling pricing description for:

Service: ${service}
Price: ${price}
Features:
${features.map((f) => `- ${f}`).join('\n')}

Make it value-focused and justify the investment.`,

  companyResearch: (companyName: string, industry?: string) => `
Provide a comprehensive analysis of ${companyName}${industry ? ` in the ${industry} industry` : ''}:

Include:
1. Company overview and mission
2. Key products/services
3. Industry position and competitors
4. Recent news and developments
5. Potential pain points and opportunities
6. Decision maker insights

Base your analysis on publicly available information and industry knowledge.`,

  industryAnalysis: (industry: string) => `
Provide an industry analysis for ${industry}:

Include:
1. Current market size and growth trends
2. Key challenges and opportunities
3. Major players and competitive landscape
4. Technology and innovation trends
5. Regulatory environment
6. Future outlook

Focus on actionable insights for business development.`,

  rewriteTone: (text: string, targetTone: 'formal' | 'casual' | 'persuasive' | 'technical') => {
    const toneDescriptions = {
      formal: 'professional, corporate language suitable for C-level executives',
      casual: 'friendly, conversational tone while remaining professional',
      persuasive: 'compelling, benefit-focused language that drives action',
      technical: 'detailed, precise language with technical terminology',
    };

    return `
Rewrite the following text with a ${targetTone} tone (${toneDescriptions[targetTone]}):

${text}

Maintain the core message while adjusting the style and language.`;
  },

  contentSuggestions: (context: string, section: string) => `
Based on this proposal context:

${context}

Suggest 3-5 compelling content ideas for the ${section} section. Each suggestion should:
- Be specific and actionable
- Add value to the proposal
- Align with best practices
- Be easy to implement

Format as a numbered list with brief explanations.`,

  competitorInsights: (company: string, competitors: string[]) => `
Analyze how ${company} compares to these competitors:

${competitors.map((c) => `- ${c}`).join('\n')}

Provide:
1. Key differentiators
2. Strengths and weaknesses
3. Market positioning
4. Competitive advantages to highlight in proposals

Focus on insights useful for proposal writing.`,
};

export const QUICK_PROMPTS = [
  {
    id: 'expand',
    label: 'Expand this section',
    icon: 'ArrowsExpand',
    prompt: (text: string) => `Expand this section with more detail and examples:\n\n${text}`,
  },
  {
    id: 'shorten',
    label: 'Make it shorter',
    icon: 'ArrowsCollapse',
    prompt: (text: string) => `Condense this text while keeping the key points:\n\n${text}`,
  },
  {
    id: 'formal',
    label: 'Make it more formal',
    icon: 'Briefcase',
    prompt: (text: string) => PROMPT_TEMPLATES.rewriteTone(text, 'formal'),
  },
  {
    id: 'persuasive',
    label: 'Make it more persuasive',
    icon: 'Sparkles',
    prompt: (text: string) => PROMPT_TEMPLATES.rewriteTone(text, 'persuasive'),
  },
  {
    id: 'bullets',
    label: 'Convert to bullet points',
    icon: 'List',
    prompt: (text: string) => `Convert this text into clear, concise bullet points:\n\n${text}`,
  },
  {
    id: 'grammar',
    label: 'Fix grammar and style',
    icon: 'Check',
    prompt: (text: string) => `Fix any grammar, spelling, or style issues in this text:\n\n${text}`,
  },
];

export function buildPrompt(
  template: string,
  systemPrompt: string = SYSTEM_PROMPTS.proposal
): { role: 'user' | 'assistant'; content: string }[] {
  return [
    { role: 'user', content: template },
  ];
}

export function buildChatMessages(
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string = SYSTEM_PROMPTS.proposal
): { role: 'user' | 'assistant'; content: string }[] {
  return messages;
}
