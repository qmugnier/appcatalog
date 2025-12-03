import React from 'react';
import { X, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FUNCTIONAL_DOMAINS, STATUS_OPTIONS } from '../types';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { state, dispatch } = useApp();

  const handleDomainFilter = (domain: string) => {
    const newDomains = state.filters.domains.includes(domain)
      ? state.filters.domains.filter(d => d !== domain)
      : [...state.filters.domains, domain];
    
    dispatch({
      type: 'SET_FILTERS',
      payload: { ...state.filters, domains: newDomains }
    });
  };

  const handleStatusFilter = (status: string) => {
    const newStatuses = state.filters.statuses.includes(status)
      ? state.filters.statuses.filter(s => s !== status)
      : [...state.filters.statuses, status];
    
    dispatch({
      type: 'SET_FILTERS',
      payload: { ...state.filters, statuses: newStatuses }
    });
  };

  const clearAllFilters = () => {
    dispatch({
      type: 'SET_FILTERS',
      payload: { domains: [], statuses: [], stakeholders: [] }
    });
  };

  const activeFilterCount = state.filters.domains.length + state.filters.statuses.length + state.filters.stakeholders.length;

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Filter panel */}
      <div className={`
        fixed lg:sticky top-0 right-0 lg:right-auto h-full lg:h-auto
        w-80 lg:w-72 bg-white dark:bg-gray-800 shadow-xl lg:shadow-none
        border-l lg:border-l-0 lg:border-r border-gray-200 dark:border-gray-700
        z-50 lg:z-auto transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h2>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clear All Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="w-full mb-6 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          )}

          {/* Functional Domains */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Functional Domains
            </h3>
            <div className="space-y-2">
              {FUNCTIONAL_DOMAINS.map((domain) => (
                <label key={domain} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.filters.domains.includes(domain)}
                    onChange={() => handleDomainFilter(domain)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    {domain}
                  </span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {state.applications.filter(app => app.functionalDomains.includes(domain)).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Status
            </h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.filters.statuses.includes(status)}
                    onChange={() => handleStatusFilter(status)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    {status}
                  </span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {state.applications.filter(app => app.status === status).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Quick Stats
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Total Apps:</span>
                <span className="font-medium">{state.applications.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {state.applications.filter(app => app.status === 'Active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>In Development:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {state.applications.filter(app => app.status === 'Under Development').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}