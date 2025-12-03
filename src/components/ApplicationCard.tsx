import React from 'react';
import { Calendar, Users, Link2, MoreVertical, Edit, Eye } from 'lucide-react';
import { Application, DOMAIN_COLORS, STATUS_COLORS } from '../types';
import { useApp } from '../context/AppContext';

interface ApplicationCardProps {
  application: Application;
  onEdit?: (app: Application) => void;
}

export default function ApplicationCard({ application, onEdit }: ApplicationCardProps) {
  const { state, dispatch } = useApp();

  const handleViewDetails = () => {
    dispatch({ type: 'SET_SELECTED_APP', payload: application });
  };

  const totalRelatedApps = application.relatedApps.functional.length + application.relatedApps.technical.length;
  const stakeholderCount = Object.values(application.stakeholders).filter(Boolean).length;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02]">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {application.appCode}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {application.name}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[application.status]}`}>
                {application.status}
              </span>
            </div>
          </div>
          
          {state.user?.role === 'admin' && (
            <div className="relative">
              <button
                onClick={() => onEdit?.(application)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="More options"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">
          {application.description}
        </p>
      </div>

      {/* Domains */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-2">
          {application.functionalDomains.slice(0, 3).map((domain, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${DOMAIN_COLORS[domain] || 'bg-gray-500'}`}
            >
              {domain}
            </span>
          ))}
          {application.functionalDomains.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              +{application.functionalDomains.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1">
          {application.technicalStack.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
          {application.technicalStack.length > 4 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              +{application.technicalStack.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 overflow-hidden">
          <div className="flex items-center space-x-4">
            {totalRelatedApps > 0 && (
              <div className="flex items-center space-x-1">
                <Link2 className="w-4 h-4" />
                <span>{totalRelatedApps} related</span>
              </div>
            )}
            {stakeholderCount > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{stakeholderCount} stakeholders</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(application.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <button
          onClick={handleViewDetails}
          className="mt-2 w-full flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs font-medium"
        >
          <Eye className="w-3 h-3" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}