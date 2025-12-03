import React, { useState } from 'react';
import { X, Calendar, Users, Link2, Code, Shield, Edit, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DOMAIN_COLORS, STATUS_COLORS, Stakeholder } from '../types';
import StakeholderDetailModal from './StakeholderDetailModal';
import { stakeholderService } from '../services/stakeholderService';

interface ApplicationDetailProps {
  onEdit?: () => void;
}

export default function ApplicationDetail({ onEdit }: ApplicationDetailProps) {
  const { state, dispatch } = useApp();
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [isStakeholderModalOpen, setIsStakeholderModalOpen] = useState(false);
  const [allStakeholders, setAllStakeholders] = useState<Map<string, Stakeholder>>(new Map());

  React.useEffect(() => {
    const loadStakeholders = async () => {
      try {
        const stakeholders = await stakeholderService.getAllStakeholders();
        const map = new Map(stakeholders.map(s => [s.id, s]));
        setAllStakeholders(map);
      } catch (err) {
        console.error('Error loading stakeholders:', err);
      }
    };
    loadStakeholders();
  }, []);

  if (!state.selectedApp) return null;

  const app = state.selectedApp;

  const handleClose = () => {
    dispatch({ type: 'SET_SELECTED_APP', payload: null });
  };

  const handleRelatedAppClick = (appCode: string) => {
    const relatedApp = state.applications.find(a => a.appCode === appCode);
    if (relatedApp) {
      dispatch({ type: 'SET_SELECTED_APP', payload: relatedApp });
    }
  };

  const handleStakeholderClick = (stakeholderId: string) => {
    const stakeholder = allStakeholders.get(stakeholderId);
    if (stakeholder) {
      setSelectedStakeholder(stakeholder);
      setIsStakeholderModalOpen(true);
    }
  };

  const stakeholderRoles = {
    applicationArchitect: 'Application Architect',
    productOwner: 'Product Owner',
    leadDeveloper: 'Lead Developer',
    devOpsEngineer: 'DevOps Engineer',
    securityOfficer: 'Security Officer',
    governanceManager: 'Governance Manager'
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                {app.appCode}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {app.name}
                </h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[app.status]}`}>
                  {app.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {state.user?.role === 'admin' && (
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Edit application"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {app.description}
            </p>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Functional Domains */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Functional Domains
              </h2>
              <div className="flex flex-wrap gap-2">
                {app.functionalDomains.map((domain, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white ${DOMAIN_COLORS[domain] || 'bg-gray-500'}`}
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Stack */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Technical Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {app.technicalStack.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stakeholders */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Stakeholders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(app.stakeholders).map(([role, name]) => {
                const matchingStakeholder = Array.from(allStakeholders.values()).find(s => s.name === name);
                return (
                  <button
                    key={role}
                    onClick={() => {
                      if (matchingStakeholder) {
                        handleStakeholderClick(matchingStakeholder.id);
                      }
                    }}
                    disabled={!matchingStakeholder}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-white">
                          {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {stakeholderRoles[role as keyof typeof stakeholderRoles]}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Related Applications */}
          {(app.relatedApps.functional.length > 0 || app.relatedApps.technical.length > 0) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Link2 className="w-5 h-5 mr-2" />
                Related Applications
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Functional Relationships */}
                {app.relatedApps.functional.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Functional Relationships
                    </h3>
                    <div className="space-y-2">
                      {app.relatedApps.functional.map((appCode, index) => {
                        const relatedApp = state.applications.find(a => a.appCode === appCode);
                        return (
                          <button
                            key={index}
                            onClick={() => handleRelatedAppClick(appCode)}
                            className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
                          >
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                              {appCode}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {relatedApp?.name || `Application ${appCode}`}
                              </div>
                              {relatedApp && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {relatedApp.functionalDomains[0]}
                                </div>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Technical Relationships */}
                {app.relatedApps.technical.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Technical Relationships
                    </h3>
                    <div className="space-y-2">
                      {app.relatedApps.technical.map((appCode, index) => {
                        const relatedApp = state.applications.find(a => a.appCode === appCode);
                        return (
                          <button
                            key={index}
                            onClick={() => handleRelatedAppClick(appCode)}
                            className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
                          >
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                              {appCode}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {relatedApp?.name || `Application ${appCode}`}
                              </div>
                              {relatedApp && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {relatedApp.technicalStack.slice(0, 2).join(', ')}
                                </div>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Metadata
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">Created:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">Last Updated:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(app.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <StakeholderDetailModal
        isOpen={isStakeholderModalOpen}
        stakeholder={selectedStakeholder}
        onClose={() => setIsStakeholderModalOpen(false)}
        canEdit={state.user?.role === 'admin'}
        onUpdated={() => {
          setIsStakeholderModalOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}