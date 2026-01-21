import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import ApplicationGrid from './components/ApplicationGrid';
import ApplicationDetail from './components/ApplicationDetail';
import AdminPanel from './components/AdminPanel';
import { useApp } from './context/AppContext';

function AppContent() {
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleToggleFilters = () => {
    dispatch({ type: 'SET_FILTER_PANEL_OPEN', payload: !state.filterPanelOpen });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header onToggleFilters={handleToggleFilters} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Panel */}
        {state.user?.role === 'admin' && <AdminPanel />}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {state.filterPanelOpen && (
            <div className="lg:w-72 flex-shrink-0">
              <FilterPanel
                isOpen={true}
                onClose={() => dispatch({ type: 'SET_FILTER_PANEL_OPEN', payload: false })}
              />
            </div>
          )}
          
          {/* Main Content - Expands to fill space when filter panel is hidden */}
          <div className={`flex-1 min-w-0 transition-all duration-300 ${!state.filterPanelOpen ? 'w-full' : ''}`}>
            <ApplicationGrid
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {state.selectedApp && (
        <ApplicationDetail />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}