import { Template, TemplateVariable, TemplateSection } from '../types/proposify';

/**
 * Variable substitution engine for templates
 */
export class TemplateEngine {
  /**
   * Replace variables in text with actual values
   * Supports {variable_name} syntax
   */
  static substituteVariables(
    text: string,
    variables: Record<string, string>
  ): string {
    let result = text;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(regex, value || `{${key}}`);
    });

    return result;
  }

  /**
   * Extract all variable keys from text
   */
  static extractVariables(text: string): string[] {
    const regex = /\{([^}]+)\}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => match[1]);
  }

  /**
   * Evaluate conditional sections
   */
  static evaluateCondition(
    conditionVariable: string,
    variables: Record<string, string>
  ): boolean {
    // Simple boolean check - if variable exists and is truthy
    const value = variables[conditionVariable];
    return Boolean(value && value !== 'false' && value !== '0');
  }

  /**
   * Process a complete template with variables
   */
  static processTemplate(
    template: Template,
    variables: Record<string, string>
  ): string {
    const sections = template.sections
      .sort((a, b) => a.order - b.order)
      .filter(section => {
        if (!section.isConditional) return true;
        if (!section.conditionVariable) return true;
        return this.evaluateCondition(section.conditionVariable, variables);
      })
      .map(section => {
        const title = this.substituteVariables(section.title, variables);
        const content = this.substituteVariables(section.content, variables);
        return `<section class="proposal-section">
  <h2>${title}</h2>
  <div class="section-content">${content}</div>
</section>`;
      })
      .join('\n\n');

    return sections;
  }

  /**
   * Validate required variables are filled
   */
  static validateVariables(
    template: Template,
    variables: Record<string, string>
  ): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    template.variables.forEach(variable => {
      if (variable.required) {
        const value = variables[variable.key];
        if (!value || value.trim() === '') {
          missingFields.push(variable.label);
        }
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Get all variables used in a template
   */
  static getAllTemplateVariables(template: Template): string[] {
    const variableKeys = new Set<string>();

    // Add defined variables
    template.variables.forEach(v => variableKeys.add(v.key));

    // Extract variables from sections
    template.sections.forEach(section => {
      const titleVars = this.extractVariables(section.title);
      const contentVars = this.extractVariables(section.content);
      [...titleVars, ...contentVars].forEach(v => variableKeys.add(v));
    });

    return Array.from(variableKeys);
  }

  /**
   * Format currency values
   */
  static formatCurrency(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return value.toString();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  }

  /**
   * Format date values
   */
  static formatDate(value: string): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  /**
   * Apply formatting based on variable type
   */
  static formatVariable(value: string, type: TemplateVariable['type']): string {
    switch (type) {
      case 'currency':
        return this.formatCurrency(value);
      case 'date':
        return this.formatDate(value);
      case 'phone':
        return this.formatPhone(value);
      default:
        return value;
    }
  }

  /**
   * Format phone numbers
   */
  static formatPhone(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return value;
  }
}
