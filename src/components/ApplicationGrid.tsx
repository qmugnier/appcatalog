import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { searchApplications } from '../utils/searchUtils';
import ApplicationCard from './ApplicationCard';
import ApplicationForm from './ApplicationForm';
import { Application } from '../types';
import { Grid2x2 as Grid, List, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { applicationService } from '../services/applicationService';

interface ApplicationGridProps {
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function ApplicationGrid({ viewMode = 'grid', onViewModeChange }: ApplicationGridProps) {
  const { state, dispatch } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredApplications = useMemo(() => {
    let apps = searchApplications(state.applications, state.searchQuery);

    if (state.filters.domains.length > 0) {
      apps = apps.filter(app =>
        app.functionalDomains.some(domain => state.filters.domains.includes(domain))
      );
    }

    if (state.filters.statuses.length > 0) {
      apps = apps.filter(app => state.filters.statuses.includes(app.status));
    }

    return apps;
  }, [state.applications, state.searchQuery, state.filters]);

  const paginatedApplications = useMemo(() => {
    if (pageSize === 999999) {
      return filteredApplications;
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, currentPage, pageSize]);

  const totalPages = pageSize === 999999 ? 1 : Math.ceil(filteredApplications.length / pageSize);

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingApp(null);
    refreshApplications();
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const refreshApplications = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const applications = await applicationService.getAllApplications();
      dispatch({ type: 'SET_APPLICATIONS', payload: applications });
    } catch (error) {
      console.error('Error refreshing applications:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Applications
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
              {state.searchQuery && (
                <span> for "{state.searchQuery}"</span>
              )}
            </p>
          </div>
          
          {onViewModeChange && (
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Page Size Selector */}
        {filteredApplications.length > 0 && (
          <div className="flex items-center justify-end space-x-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">Items per page:</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={999999}>Unlimited</option>
            </select>
          </div>
        )}

        {/* Applications Grid/List */}
        {filteredApplications.length > 0 ? (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {paginatedApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onEdit={handleEdit}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredApplications.length)} of {filteredApplications.length}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Grid className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No applications found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {state.searchQuery || state.filters.domains.length > 0 || state.filters.statuses.length > 0
                ? 'Try adjusting your search criteria or filters'
                : 'No applications have been added yet'
              }
            </p>
            {state.user?.role === 'admin' && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <span>Create First Application</span>
              </button>
            )}
          </div>
        )}
      </div>

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editingApp={editingApp}
      />
    </>
  );
}