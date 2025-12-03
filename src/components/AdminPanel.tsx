import React, { useState } from 'react';
import { Plus, Settings, BarChart3, Download, Upload, Users, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ApplicationForm from './ApplicationForm';
import UserManagement from './UserManagement';
import StakeholderManagement from './StakeholderManagement';
import { applicationService } from '../services/applicationService';

export default function AdminPanel() {
  const { state, dispatch } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isStakeholderManagementOpen, setIsStakeholderManagementOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (state.user?.role !== 'admin') {
    return null;
  }

  const stats = {
    totalApps: state.applications.length,
    activeApps: state.applications.filter(app => app.status === 'Active').length,
    inDevelopment: state.applications.filter(app => app.status === 'Under Development').length,
    deprecated: state.applications.filter(app => app.status === 'Deprecated').length,
    totalDomains: new Set(state.applications.flatMap(app => app.functionalDomains)).size,
    totalTechStack: new Set(state.applications.flatMap(app => app.technicalStack)).size
  };

  const handleCreateNew = () => {
    setEditingApp(null);
    setIsFormOpen(true);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const applicationsArray = Array.isArray(data) ? data : [data];

        for (const app of applicationsArray) {
          try {
            await applicationService.createApplication({
              appCode: app.appCode,
              name: app.name,
              description: app.description,
              functionalDomains: app.functionalDomains || [],
              technicalStack: app.technicalStack || [],
              status: app.status || 'Under Development'
            });
          } catch (err) {
            console.error(`Error importing application ${app.appCode}:`, err);
          }
        }

        const updatedApps = await applicationService.getAllApplications();
        dispatch({ type: 'SET_APPLICATIONS', payload: updatedApps });
      } catch (err) {
        console.error('Error parsing import file:', err);
        alert('Error importing file. Please make sure it is valid JSON.');
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportData = () => {
    const exportData = state.applications.map(app => ({
      ...app,
      // Convert stakeholders object to array for export
      stakeholders: Object.entries(app.stakeholders).map(([role, name]) => ({ role, name }))
    }));
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applications-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Dashboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage applications and system settings
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Apps</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalApps}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Active</span>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.activeApps}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">In Dev</span>
            </div>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {stats.inDevelopment}
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Deprecated</span>
            </div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {stats.deprecated}
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Domains</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.totalDomains}
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Tech Stack</span>
            </div>
            <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              {stats.totalTechStack}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportData}
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Export Data</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Download applications as JSON</div>
            </div>
          </button>

          <button
            onClick={handleImportClick}
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
          >
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Import Data</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Upload applications from file</div>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Import JSON file"
          />

          <button
            onClick={() => setIsUserManagementOpen(true)}
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">User Management</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Manage user roles and permissions</div>
            </div>
          </button>

          <button
            onClick={() => setIsStakeholderManagementOpen(true)}
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
          >
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Stakeholder Management</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Manage organizational stakeholders</div>
            </div>
          </button>
        </div>
      </div>

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingApp={editingApp}
      />

      <UserManagement
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />

      <StakeholderManagement
        isOpen={isStakeholderManagementOpen}
        onClose={() => setIsStakeholderManagementOpen(false)}
      />
    </>
  );
}