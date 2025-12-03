import { Application } from '../types';

export function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match
  if (textLower.includes(queryLower)) return true;
  
  // Fuzzy matching for typos
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === queryLower.length;
}

export function searchApplications(applications: Application[], query: string): Application[] {
  if (!query.trim()) return applications;
  
  return applications.filter(app => {
    // Search in app code, name, description
    const searchableText = [
      app.appCode,
      app.name,
      app.description,
      ...app.functionalDomains,
      ...app.technicalStack,
      app.status,
      ...Object.values(app.stakeholders)
    ].join(' ');
    
    return fuzzyMatch(searchableText, query);
  });
}

export function getSearchSuggestions(applications: Application[], query: string): string[] {
  if (!query.trim()) return [];
  
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  applications.forEach(app => {
    // App codes
    if (app.appCode.toLowerCase().includes(queryLower)) {
      suggestions.add(app.appCode);
    }
    
    // App names
    if (app.name.toLowerCase().includes(queryLower)) {
      suggestions.add(app.name);
    }
    
    // Domains
    app.functionalDomains.forEach(domain => {
      if (domain.toLowerCase().includes(queryLower)) {
        suggestions.add(domain);
      }
    });
    
    // Technical stack
    app.technicalStack.forEach(tech => {
      if (tech.toLowerCase().includes(queryLower)) {
        suggestions.add(tech);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5);
}

export function generateAppCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${letter1}${letter2}${number}`;
}