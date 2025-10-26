export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'currency' | 'textarea';
  required: boolean;
  defaultValue?: string;
  placeholder?: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  content: string;
  isConditional: boolean;
  conditionVariable?: string;
  order: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail?: string;
  variables: TemplateVariable[];
  sections: TemplateSection[];
  createdAt: string;
  updatedAt: string;
  version: number;
  isPublic: boolean;
  tags: string[];
  author?: string;
}

export type TemplateCategory =
  | 'consulting'
  | 'agency'
  | 'saas'
  | 'marketing'
  | 'it-services'
  | 'custom';

export interface ContentBlock {
  id: string;
  title: string;
  type: ContentBlockType;
  content: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export type ContentBlockType =
  | 'case-study'
  | 'testimonial'
  | 'team-bio'
  | 'service-description'
  | 'pricing-table'
  | 'terms-conditions'
  | 'methodology'
  | 'portfolio-item';

export interface TemplateVersion {
  id: string;
  templateId: string;
  version: number;
  content: Template;
  createdAt: string;
  createdBy: string;
  changeLog: string;
}

export interface TemplateFilters {
  category?: TemplateCategory;
  searchQuery?: string;
  tags?: string[];
  isPublic?: boolean;
}
