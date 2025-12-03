import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import ApplicationGrid from './components/ApplicationGrid';
import ApplicationDetail from './components/ApplicationDetail';
import AdminPanel from './components/AdminPanel';
import { useApp } from './context/AppContext';
import Cookies from 'js-cookie';

function AppContent() {
  const { state } = useApp();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Panel */}
        {state.user?.role === 'admin' && <AdminPanel />}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <FilterPanel
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
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