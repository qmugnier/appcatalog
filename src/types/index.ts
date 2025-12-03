export interface Application {
  id: string;
  appCode: string; // Format: XX9 (e.g., "HR1", "FN3")
  name: string;
  description: string;
  functionalDomains: string[];
  technicalStack: string[];
  status: 'Active' | 'Inactive' | 'Deprecated' | 'Under Development';
  relatedApps: {
    functional: string[]; // App codes of functionally related apps
    technical: string[];  // App codes of technically related apps
  };
  stakeholders: {
    applicationArchitect: string;
    productOwner: string;
    leadDeveloper: string;
    devOpsEngineer: string;
    securityOfficer: string;
    governanceManager: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  roles: StakeholderRole[];
  createdAt: string;
}

export interface StakeholderRole {
  id: string;
  stakeholderId: string;
  applicationId: string;
  applicationCode?: string;
  role: string;
  createdAt: string;
}

export const STAKEHOLDER_ROLES = [
  'Application Architect',
  'Product Owner',
  'Lead Developer',
  'DevOps Engineer',
  'Security Officer',
  'Governance Manager',
  'Business Analyst',
  'QA Lead',
  'UX Designer',
  'Technical Lead'
];

export const DEPARTMENTS = [
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'IT Operations',
  'IT Development',
  'Customer Service',
  'Supply Chain',
  'Analytics',
  'Security',
  'Compliance',
  'Executive',
  'General'
];

export interface FilterState {
  domains: string[];
  statuses: string[];
  stakeholders: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface AppState {
  user: User | null;
  applications: Application[];
  filters: FilterState;
  searchQuery: string;
  searchHistory: string[];
  darkMode: boolean;
  selectedApp: Application | null;
  isLoading: boolean;
}

export const FUNCTIONAL_DOMAINS = [
  'Human Resources', 'Finance', 'Marketing', 'Sales', 'IT Operations',
  'Customer Service', 'Supply Chain', 'Analytics', 'Security', 'Compliance'
];

export const TECHNICAL_STACKS = [
  'React', 'Angular', 'Vue.js', 'Node.js', 'Java', 'Python', 'C#', '.NET',
  'Spring Boot', 'Express.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'GCP', 'Microservices', 'REST API', 'GraphQL'
];

export const STATUS_OPTIONS = ['Active', 'Inactive', 'Deprecated', 'Under Development'] as const;

export const DOMAIN_COLORS: Record<string, string> = {
  'Human Resources': 'bg-pink-500',
  'Finance': 'bg-green-500',
  'Marketing': 'bg-amber-500',
  'Sales': 'bg-purple-500',
  'IT Operations': 'bg-blue-500',
  'Customer Service': 'bg-cyan-500',
  'Supply Chain': 'bg-orange-500',
  'Analytics': 'bg-indigo-500',
  'Security': 'bg-red-500',
  'Compliance': 'bg-teal-500'
};

export const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  'Deprecated': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Under Development': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
};