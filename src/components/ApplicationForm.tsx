import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Application, FUNCTIONAL_DOMAINS, TECHNICAL_STACKS, STATUS_OPTIONS } from '../types';
import { generateAppCode } from '../utils/searchUtils';
import { applicationService } from '../services/applicationService';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingApp?: Application | null;
}

export default function ApplicationForm({ isOpen, onClose, editingApp }: ApplicationFormProps) {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Application>>({
    appCode: '',
    name: '',
    description: '',
    functionalDomains: [],
    technicalStack: [],
    status: 'Under Development',
    relatedApps: { functional: [], technical: [] },
    stakeholders: {
      applicationArchitect: '',
      productOwner: '',
      leadDeveloper: '',
      devOpsEngineer: '',
      securityOfficer: '',
      governanceManager: ''
    }
  });

  useEffect(() => {
    if (editingApp) {
      setFormData(editingApp);
    } else {
      setFormData({
        appCode: generateAppCode(),
        name: '',
        description: '',
        functionalDomains: [],
        technicalStack: [],
        status: 'Under Development',
        relatedApps: { functional: [], technical: [] },
        stakeholders: {
          applicationArchitect: '',
          productOwner: '',
          leadDeveloper: '',
          devOpsEngineer: '',
          securityOfficer: '',
          governanceManager: ''
        }
      });
    }
  }, [editingApp, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim() || !formData.description?.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const applicationData = {
        appCode: formData.appCode || generateAppCode(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        functionalDomains: formData.functionalDomains || [],
        technicalStack: formData.technicalStack || [],
        status: formData.status as Application['status'] || 'Under Development',
        relatedApps: formData.relatedApps || { functional: [], technical: [] },
        stakeholders: formData.stakeholders || {
          applicationArchitect: '',
          productOwner: '',
          leadDeveloper: '',
          devOpsEngineer: '',
          securityOfficer: '',
          governanceManager: ''
        }
      };

      let result;
      if (editingApp) {
        result = await applicationService.updateApplication(editingApp.id, applicationData);
        dispatch({ type: 'UPDATE_APPLICATION', payload: result });
      } else {
        result = await applicationService.createApplication(applicationData);
        dispatch({ type: 'ADD_APPLICATION', payload: result });
      }

      onClose();
    } catch (error) {
      console.error('Error saving application:', error);
      setError('Failed to save application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock stakeholders for the demo
  const MOCK_STAKEHOLDERS = [
    'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
    'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'William Garcia', 'Ashley Rodriguez',
    'Christopher Lee', 'Jessica Miller', 'Matthew Jones', 'Amanda White', 'Daniel Thompson',
    'Stephanie Clark', 'Kevin Lewis', 'Michelle Walker', 'Ryan Hall', 'Nicole Young'
  ];

  const handleDomainChange = (domain: string) => {
    const newDomains = formData.functionalDomains?.includes(domain)
      ? formData.functionalDomains.filter(d => d !== domain)
      : [...(formData.functionalDomains || []), domain];
    
    setFormData({ ...formData, functionalDomains: newDomains });
  };

  const handleTechStackChange = (tech: string) => {
    const newTechStack = formData.technicalStack?.includes(tech)
      ? formData.technicalStack.filter(t => t !== tech)
      : [...(formData.technicalStack || []), tech];
    
    setFormData({ ...formData, technicalStack: newTechStack });
  };

  const handleStakeholderChange = (role: string, value: string) => {
    setFormData({
      ...formData,
      stakeholders: {
        ...formData.stakeholders!,
        [role]: value
      }
    });
  };

  const addRelatedApp = (type: 'functional' | 'technical', appCode: string) => {
    if (!appCode.trim()) return;
    
    const newRelatedApps = {
      ...formData.relatedApps!,
      [type]: [...formData.relatedApps![type], appCode.trim()]
    };
    
    setFormData({ ...formData, relatedApps: newRelatedApps });
  };

  const removeRelatedApp = (type: 'functional' | 'technical', index: number) => {
    const newRelatedApps = {
      ...formData.relatedApps!,
      [type]: formData.relatedApps![type].filter((_, i) => i !== index)
    };
    
    setFormData({ ...formData, relatedApps: newRelatedApps });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingApp ? 'Edit Application' : 'Create New Application'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Application Code
              </label>
              <input
                type="text"
                value={formData.appCode}
                onChange={(e) => setFormData({ ...formData, appCode: e.target.value.toUpperCase() })}
                placeholder="e.g., HR1, FN2"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Application['status'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Application Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter application name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the application's purpose and functionality"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Functional Domains */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Functional Domains
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FUNCTIONAL_DOMAINS.map(domain => (
                <label key={domain} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.functionalDomains?.includes(domain) || false}
                    onChange={() => handleDomainChange(domain)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {domain}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Technical Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Technical Stack
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {TECHNICAL_STACKS.map(tech => (
                <label key={tech} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.technicalStack?.includes(tech) || false}
                    onChange={() => handleTechStackChange(tech)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {tech}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Stakeholders */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Stakeholders
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.stakeholders || {}).map(([role, value]) => (
                <div key={role}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {role.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <select
                    value={value}
                    onChange={(e) => handleStakeholderChange(role, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select stakeholder</option>
                    {MOCK_STAKEHOLDERS.map(stakeholder => (
                      <option key={stakeholder} value={stakeholder}>
                        {stakeholder}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingApp ? 'Update Application' : 'Create Application'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}