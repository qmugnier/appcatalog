import { Application } from '../types';
import { MOCK_STAKEHOLDERS } from '../utils/constants';

export const sampleApplications: Application[] = [
  {
    id: '1',
    appCode: 'HR1',
    name: 'Employee Management System',
    description: 'Comprehensive HRMS for employee lifecycle management, from onboarding to offboarding. Includes payroll, benefits, performance reviews, and talent management.',
    functionalDomains: ['Human Resources'],
    technicalStack: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    status: 'Active',
    relatedApps: {
      functional: ['HR2', 'FN1'],
      technical: ['IT1', 'SC1']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[0],
      productOwner: MOCK_STAKEHOLDERS[1],
      leadDeveloper: MOCK_STAKEHOLDERS[2],
      devOpsEngineer: MOCK_STAKEHOLDERS[3],
      securityOfficer: MOCK_STAKEHOLDERS[4],
      governanceManager: MOCK_STAKEHOLDERS[5]
    },
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-12-01T10:30:00Z'
  },
  {
    id: '2',
    appCode: 'FN1',
    name: 'Financial Planning Tool',
    description: 'Advanced budget planning and financial analysis platform with real-time reporting, forecasting, and expense tracking capabilities.',
    functionalDomains: ['Finance', 'Analytics'],
    technicalStack: ['Angular', 'Java', 'Spring Boot', 'MongoDB', 'Azure'],
    status: 'Active',
    relatedApps: {
      functional: ['FN2', 'AN1'],
      technical: ['IT2', 'AN2']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[6],
      productOwner: MOCK_STAKEHOLDERS[7],
      leadDeveloper: MOCK_STAKEHOLDERS[8],
      devOpsEngineer: MOCK_STAKEHOLDERS[9],
      securityOfficer: MOCK_STAKEHOLDERS[10],
      governanceManager: MOCK_STAKEHOLDERS[11]
    },
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2024-11-28T14:20:00Z'
  },
  {
    id: '3',
    appCode: 'MK1',
    name: 'Digital Marketing Hub',
    description: 'Integrated marketing automation platform for campaign management, lead nurturing, social media management, and performance analytics.',
    functionalDomains: ['Marketing', 'Analytics'],
    technicalStack: ['Vue.js', 'Python', 'Django', 'Redis', 'GCP'],
    status: 'Active',
    relatedApps: {
      functional: ['SL1', 'CS1'],
      technical: ['AN1', 'IT3']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[12],
      productOwner: MOCK_STAKEHOLDERS[13],
      leadDeveloper: MOCK_STAKEHOLDERS[14],
      devOpsEngineer: MOCK_STAKEHOLDERS[15],
      securityOfficer: MOCK_STAKEHOLDERS[16],
      governanceManager: MOCK_STAKEHOLDERS[17]
    },
    createdAt: '2023-03-05T11:30:00Z',
    updatedAt: '2024-12-05T16:45:00Z'
  },
  {
    id: '4',
    appCode: 'SL1',
    name: 'Sales Force Automation',
    description: 'CRM and sales automation platform with pipeline management, opportunity tracking, quote generation, and sales analytics.',
    functionalDomains: ['Sales', 'Analytics'],
    technicalStack: ['React', 'C#', '.NET', 'PostgreSQL', 'Kubernetes'],
    status: 'Active',
    relatedApps: {
      functional: ['MK1', 'CS1'],
      technical: ['IT4', 'AN3']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[18],
      productOwner: MOCK_STAKEHOLDERS[19],
      leadDeveloper: MOCK_STAKEHOLDERS[0],
      devOpsEngineer: MOCK_STAKEHOLDERS[1],
      securityOfficer: MOCK_STAKEHOLDERS[2],
      governanceManager: MOCK_STAKEHOLDERS[3]
    },
    createdAt: '2023-04-12T07:45:00Z',
    updatedAt: '2024-11-30T13:10:00Z'
  },
  {
    id: '5',
    appCode: 'IT1',
    name: 'IT Service Management',
    description: 'Comprehensive ITSM platform for incident management, change management, asset tracking, and service catalog management.',
    functionalDomains: ['IT Operations'],
    technicalStack: ['Angular', 'Node.js', 'Express.js', 'MongoDB', 'Docker'],
    status: 'Active',
    relatedApps: {
      functional: ['IT2', 'SC2'],
      technical: ['HR1', 'FN3']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[4],
      productOwner: MOCK_STAKEHOLDERS[5],
      leadDeveloper: MOCK_STAKEHOLDERS[6],
      devOpsEngineer: MOCK_STAKEHOLDERS[7],
      securityOfficer: MOCK_STAKEHOLDERS[8],
      governanceManager: MOCK_STAKEHOLDERS[9]
    },
    createdAt: '2023-05-20T10:00:00Z',
    updatedAt: '2024-12-03T11:25:00Z'
  },
  {
    id: '6',
    appCode: 'CS1',
    name: 'Customer Support Portal',
    description: 'Multi-channel customer support platform with ticketing system, knowledge base, live chat, and customer satisfaction tracking.',
    functionalDomains: ['Customer Service'],
    technicalStack: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'AWS'],
    status: 'Active',
    relatedApps: {
      functional: ['SL1', 'MK1'],
      technical: ['IT5', 'AN4']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[10],
      productOwner: MOCK_STAKEHOLDERS[11],
      leadDeveloper: MOCK_STAKEHOLDERS[12],
      devOpsEngineer: MOCK_STAKEHOLDERS[13],
      securityOfficer: MOCK_STAKEHOLDERS[14],
      governanceManager: MOCK_STAKEHOLDERS[15]
    },
    createdAt: '2023-06-08T12:30:00Z',
    updatedAt: '2024-11-25T09:40:00Z'
  },
  {
    id: '7',
    appCode: 'SC1',
    name: 'Supply Chain Management',
    description: 'End-to-end supply chain visibility platform with inventory management, supplier relationship management, and logistics optimization.',
    functionalDomains: ['Supply Chain'],
    technicalStack: ['Vue.js', 'Java', 'Spring Boot', 'MongoDB', 'Microservices'],
    status: 'Under Development',
    relatedApps: {
      functional: ['SC2', 'FN3'],
      technical: ['IT6', 'AN5']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[16],
      productOwner: MOCK_STAKEHOLDERS[17],
      leadDeveloper: MOCK_STAKEHOLDERS[18],
      devOpsEngineer: MOCK_STAKEHOLDERS[19],
      securityOfficer: MOCK_STAKEHOLDERS[0],
      governanceManager: MOCK_STAKEHOLDERS[1]
    },
    createdAt: '2023-07-15T14:15:00Z',
    updatedAt: '2024-12-06T08:20:00Z'
  },
  {
    id: '8',
    appCode: 'AN1',
    name: 'Business Intelligence Platform',
    description: 'Enterprise-wide business intelligence and data analytics platform with dashboard creation, data visualization, and predictive analytics.',
    functionalDomains: ['Analytics'],
    technicalStack: ['React', 'Python', 'Apache Spark', 'PostgreSQL', 'Kubernetes'],
    status: 'Active',
    relatedApps: {
      functional: ['AN2', 'FN1', 'MK1'],
      technical: ['IT7', 'SC3']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[2],
      productOwner: MOCK_STAKEHOLDERS[3],
      leadDeveloper: MOCK_STAKEHOLDERS[4],
      devOpsEngineer: MOCK_STAKEHOLDERS[5],
      securityOfficer: MOCK_STAKEHOLDERS[6],
      governanceManager: MOCK_STAKEHOLDERS[7]
    },
    createdAt: '2023-08-22T16:00:00Z',
    updatedAt: '2024-12-04T12:15:00Z'
  },
  {
    id: '9',
    appCode: 'SE1',
    name: 'Security Operations Center',
    description: 'Centralized security monitoring and incident response platform with threat detection, vulnerability management, and compliance reporting.',
    functionalDomains: ['Security', 'Compliance'],
    technicalStack: ['Angular', 'C#', '.NET Core', 'Redis', 'Azure'],
    status: 'Active',
    relatedApps: {
      functional: ['SE2', 'CM1'],
      technical: ['IT8', 'AN6']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[8],
      productOwner: MOCK_STAKEHOLDERS[9],
      leadDeveloper: MOCK_STAKEHOLDERS[10],
      devOpsEngineer: MOCK_STAKEHOLDERS[11],
      securityOfficer: MOCK_STAKEHOLDERS[12],
      governanceManager: MOCK_STAKEHOLDERS[13]
    },
    createdAt: '2023-09-10T13:45:00Z',
    updatedAt: '2024-11-29T15:30:00Z'
  },
  {
    id: '10',
    appCode: 'CM1',
    name: 'Compliance Management System',
    description: 'Regulatory compliance tracking and management system with audit trails, policy management, and automated compliance reporting.',
    functionalDomains: ['Compliance'],
    technicalStack: ['Vue.js', 'Node.js', 'MongoDB', 'Docker', 'GCP'],
    status: 'Active',
    relatedApps: {
      functional: ['SE1', 'FN4'],
      technical: ['IT9', 'AN7']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[14],
      productOwner: MOCK_STAKEHOLDERS[15],
      leadDeveloper: MOCK_STAKEHOLDERS[16],
      devOpsEngineer: MOCK_STAKEHOLDERS[17],
      securityOfficer: MOCK_STAKEHOLDERS[18],
      governanceManager: MOCK_STAKEHOLDERS[19]
    },
    createdAt: '2023-10-05T11:20:00Z',
    updatedAt: '2024-12-02T14:50:00Z'
  },
  {
    id: '11',
    appCode: 'HR2',
    name: 'Learning Management System',
    description: 'Corporate learning and development platform with course management, skills tracking, certification management, and learning analytics.',
    functionalDomains: ['Human Resources', 'Analytics'],
    technicalStack: ['React', 'Java', 'Spring Boot', 'PostgreSQL', 'AWS'],
    status: 'Active',
    relatedApps: {
      functional: ['HR1', 'AN8'],
      technical: ['IT3', 'SC4']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[0],
      productOwner: MOCK_STAKEHOLDERS[1],
      leadDeveloper: MOCK_STAKEHOLDERS[2],
      devOpsEngineer: MOCK_STAKEHOLDERS[3],
      securityOfficer: MOCK_STAKEHOLDERS[4],
      governanceManager: MOCK_STAKEHOLDERS[5]
    },
    createdAt: '2023-11-12T09:30:00Z',
    updatedAt: '2024-11-27T16:10:00Z'
  },
  {
    id: '12',
    appCode: 'FN2',
    name: 'Expense Management',
    description: 'Digital expense reporting and reimbursement system with receipt scanning, approval workflows, and expense analytics.',
    functionalDomains: ['Finance', 'Human Resources'],
    technicalStack: ['Angular', 'Python', 'Django', 'Redis', 'Azure'],
    status: 'Active',
    relatedApps: {
      functional: ['FN1', 'HR3'],
      technical: ['IT4', 'AN9']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[6],
      productOwner: MOCK_STAKEHOLDERS[7],
      leadDeveloper: MOCK_STAKEHOLDERS[8],
      devOpsEngineer: MOCK_STAKEHOLDERS[9],
      securityOfficer: MOCK_STAKEHOLDERS[10],
      governanceManager: MOCK_STAKEHOLDERS[11]
    },
    createdAt: '2023-12-01T08:45:00Z',
    updatedAt: '2024-12-07T10:25:00Z'
  },
  {
    id: '13',
    appCode: 'IT2',
    name: 'Asset Management System',
    description: 'IT asset lifecycle management platform with inventory tracking, maintenance scheduling, and depreciation calculations.',
    functionalDomains: ['IT Operations', 'Finance'],
    technicalStack: ['Vue.js', 'C#', 'ASP.NET Core', 'PostgreSQL', 'Docker'],
    status: 'Inactive',
    relatedApps: {
      functional: ['IT1', 'FN5'],
      technical: ['SC5', 'AN1']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[12],
      productOwner: MOCK_STAKEHOLDERS[13],
      leadDeveloper: MOCK_STAKEHOLDERS[14],
      devOpsEngineer: MOCK_STAKEHOLDERS[15],
      securityOfficer: MOCK_STAKEHOLDERS[16],
      governanceManager: MOCK_STAKEHOLDERS[17]
    },
    createdAt: '2022-05-15T14:20:00Z',
    updatedAt: '2024-06-30T12:00:00Z'
  },
  {
    id: '14',
    appCode: 'MK2',
    name: 'Content Management Platform',
    description: 'Digital asset management and content creation platform with brand management, approval workflows, and content distribution.',
    functionalDomains: ['Marketing'],
    technicalStack: ['React', 'Node.js', 'GraphQL', 'MongoDB', 'AWS'],
    status: 'Under Development',
    relatedApps: {
      functional: ['MK1', 'CS2'],
      technical: ['IT5', 'SC6']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[18],
      productOwner: MOCK_STAKEHOLDERS[19],
      leadDeveloper: MOCK_STAKEHOLDERS[0],
      devOpsEngineer: MOCK_STAKEHOLDERS[1],
      securityOfficer: MOCK_STAKEHOLDERS[2],
      governanceManager: MOCK_STAKEHOLDERS[3]
    },
    createdAt: '2024-01-20T10:15:00Z',
    updatedAt: '2024-12-08T09:30:00Z'
  },
  {
    id: '15',
    appCode: 'SL2',
    name: 'Partner Portal',
    description: 'B2B partner management platform with onboarding workflows, performance tracking, commission management, and collaboration tools.',
    functionalDomains: ['Sales', 'Finance'],
    technicalStack: ['Angular', 'Java', 'Microservices', 'PostgreSQL', 'Kubernetes'],
    status: 'Active',
    relatedApps: {
      functional: ['SL1', 'FN6'],
      technical: ['IT6', 'SC7']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[4],
      productOwner: MOCK_STAKEHOLDERS[5],
      leadDeveloper: MOCK_STAKEHOLDERS[6],
      devOpsEngineer: MOCK_STAKEHOLDERS[7],
      securityOfficer: MOCK_STAKEHOLDERS[8],
      governanceManager: MOCK_STAKEHOLDERS[9]
    },
    createdAt: '2024-02-28T13:00:00Z',
    updatedAt: '2024-11-26T11:45:00Z'
  },
  {
    id: '16',
    appCode: 'CS2',
    name: 'Community Forum',
    description: 'Customer community platform with discussion forums, knowledge sharing, gamification, and expert support integration.',
    functionalDomains: ['Customer Service', 'Marketing'],
    technicalStack: ['Vue.js', 'Python', 'FastAPI', 'Redis', 'GCP'],
    status: 'Active',
    relatedApps: {
      functional: ['CS1', 'MK3'],
      technical: ['IT7', 'AN2']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[10],
      productOwner: MOCK_STAKEHOLDERS[11],
      leadDeveloper: MOCK_STAKEHOLDERS[12],
      devOpsEngineer: MOCK_STAKEHOLDERS[13],
      securityOfficer: MOCK_STAKEHOLDERS[14],
      governanceManager: MOCK_STAKEHOLDERS[15]
    },
    createdAt: '2024-03-15T15:30:00Z',
    updatedAt: '2024-12-01T14:20:00Z'
  },
  {
    id: '17',
    appCode: 'SC2',
    name: 'Warehouse Management',
    description: 'Warehouse operations management system with inventory tracking, picking optimization, shipping integration, and performance analytics.',
    functionalDomains: ['Supply Chain', 'Analytics'],
    technicalStack: ['React', 'C#', '.NET', 'MongoDB', 'Azure'],
    status: 'Deprecated',
    relatedApps: {
      functional: ['SC1', 'AN3'],
      technical: ['IT8', 'FN7']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[16],
      productOwner: MOCK_STAKEHOLDERS[17],
      leadDeveloper: MOCK_STAKEHOLDERS[18],
      devOpsEngineer: MOCK_STAKEHOLDERS[19],
      securityOfficer: MOCK_STAKEHOLDERS[0],
      governanceManager: MOCK_STAKEHOLDERS[1]
    },
    createdAt: '2021-08-10T12:00:00Z',
    updatedAt: '2023-12-31T23:59:00Z'
  },
  {
    id: '18',
    appCode: 'AN2',
    name: 'Data Lake Platform',
    description: 'Enterprise data lake with data ingestion pipelines, data cataloging, quality monitoring, and self-service analytics capabilities.',
    functionalDomains: ['Analytics', 'IT Operations'],
    technicalStack: ['Python', 'Apache Spark', 'Kafka', 'Hadoop', 'Kubernetes'],
    status: 'Active',
    relatedApps: {
      functional: ['AN1', 'IT9'],
      technical: ['SC8', 'FN8']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[2],
      productOwner: MOCK_STAKEHOLDERS[3],
      leadDeveloper: MOCK_STAKEHOLDERS[4],
      devOpsEngineer: MOCK_STAKEHOLDERS[5],
      securityOfficer: MOCK_STAKEHOLDERS[6],
      governanceManager: MOCK_STAKEHOLDERS[7]
    },
    createdAt: '2024-04-05T11:15:00Z',
    updatedAt: '2024-12-05T13:40:00Z'
  },
  {
    id: '19',
    appCode: 'SE2',
    name: 'Identity Management',
    description: 'Centralized identity and access management system with single sign-on, multi-factor authentication, and role-based access control.',
    functionalDomains: ['Security', 'IT Operations'],
    technicalStack: ['Angular', 'Java', 'Spring Security', 'LDAP', 'Docker'],
    status: 'Active',
    relatedApps: {
      functional: ['SE1', 'IT3'],
      technical: ['CM2', 'HR4']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[8],
      productOwner: MOCK_STAKEHOLDERS[9],
      leadDeveloper: MOCK_STAKEHOLDERS[10],
      devOpsEngineer: MOCK_STAKEHOLDERS[11],
      securityOfficer: MOCK_STAKEHOLDERS[12],
      governanceManager: MOCK_STAKEHOLDERS[13]
    },
    createdAt: '2024-05-20T09:00:00Z',
    updatedAt: '2024-11-28T16:30:00Z'
  },
  {
    id: '20',
    appCode: 'FN3',
    name: 'Treasury Management',
    description: 'Corporate treasury and cash management system with liquidity forecasting, investment tracking, and risk management capabilities.',
    functionalDomains: ['Finance', 'Analytics'],
    technicalStack: ['Vue.js', 'Python', 'Django REST', 'PostgreSQL', 'AWS'],
    status: 'Under Development',
    relatedApps: {
      functional: ['FN1', 'AN4'],
      technical: ['SE3', 'CM3']
    },
    stakeholders: {
      applicationArchitect: MOCK_STAKEHOLDERS[14],
      productOwner: MOCK_STAKEHOLDERS[15],
      leadDeveloper: MOCK_STAKEHOLDERS[16],
      devOpsEngineer: MOCK_STAKEHOLDERS[17],
      securityOfficer: MOCK_STAKEHOLDERS[18],
      governanceManager: MOCK_STAKEHOLDERS[19]
    },
    createdAt: '2024-06-12T14:45:00Z',
    updatedAt: '2024-12-09T08:15:00Z'
  }
];