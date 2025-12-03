import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Building2, Mail } from 'lucide-react';
import { Stakeholder, STAKEHOLDER_ROLES, DEPARTMENTS } from '../types';
import { stakeholderService } from '../services/stakeholderService';
import { useApp } from '../context/AppContext';

interface StakeholderManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  id?: string;
  name: string;
  email: string;
  department: string;
  position: string;
}

export default function StakeholderManagement({ isOpen, onClose }: StakeholderManagementProps) {
  const { state } = useApp();
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [departmentGroups, setDepartmentGroups] = useState<Map<string, Stakeholder[]>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    department: 'General',
    position: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchStakeholders();
    }
  }, [isOpen]);

  const fetchStakeholders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const stakeholders = await stakeholderService.getAllStakeholders();
      setStakeholders(stakeholders);

      const groups = await stakeholderService.getStakeholdersByDepartment();
      setDepartmentGroups(groups);
    } catch (err) {
      console.error('Error fetching stakeholders:', err);
      setError('Failed to load stakeholders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (stakeholder?: Stakeholder) => {
    if (stakeholder) {
      setEditingStakeholder(stakeholder);
      setFormData({
        id: stakeholder.id,
        name: stakeholder.name,
        email: stakeholder.email,
        department: stakeholder.department,
        position: stakeholder.position
      });
    } else {
      setEditingStakeholder(null);
      setFormData({
        name: '',
        email: '',
        department: 'General',
        position: ''
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      if (editingStakeholder && formData.id) {
        await stakeholderService.updateStakeholder(
          formData.id,
          formData.name,
          formData.email,
          formData.department,
          formData.position
        );
        setSuccess('Stakeholder updated successfully');
      } else {
        await stakeholderService.createStakeholder(
          formData.name,
          formData.email,
          formData.department,
          formData.position
        );
        setSuccess('Stakeholder created successfully');
      }

      setIsFormOpen(false);
      await fetchStakeholders();
    } catch (err) {
      console.error('Error saving stakeholder:', err);
      setError('Failed to save stakeholder');
    }
  };

  const handleDeleteStakeholder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stakeholder?')) {
      return;
    }

    setError('');
    try {
      await stakeholderService.deleteStakeholder(id);
      setSuccess('Stakeholder deleted successfully');
      await fetchStakeholders();
    } catch (err) {
      console.error('Error deleting stakeholder:', err);
      setError('Failed to delete stakeholder');
    }
  };

  if (!isOpen) return null;

  const departments = Array.from(departmentGroups.keys()).sort();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Stakeholder Management
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stakeholder</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {isFormOpen && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Position/Title
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., Senior Developer"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingStakeholder ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
                <span>Loading stakeholders...</span>
              </div>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No stakeholders yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {departments.map(department => {
                const deptStakeholders = departmentGroups.get(department) || [];
                const uniqueStakeholders = Array.from(
                  new Map(deptStakeholders.map(s => [s.id, s])).values()
                );
                return (
                  <div key={department} className="space-y-3">
                    <div className="flex items-center space-x-2 pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {department}
                      </h3>
                      <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {uniqueStakeholders.length} {uniqueStakeholders.length === 1 ? 'member' : 'members'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uniqueStakeholders.map(stakeholder => (
                        <div
                          key={stakeholder.id}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-white">
                                  {stakeholder.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {stakeholder.name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {stakeholder.position || 'No position'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <button
                                onClick={() => handleOpenForm(stakeholder)}
                                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                aria-label="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStakeholder(stakeholder.id)}
                                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                aria-label="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 mb-3 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${stakeholder.email}`} className="text-blue-600 dark:text-blue-400 hover:underline truncate">
                              {stakeholder.email}
                            </a>
                          </div>

                          {stakeholder.roles.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Roles ({stakeholder.roles.length}):
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {stakeholder.roles.map(role => (
                                  <span
                                    key={role.id}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                                  >
                                    {role.role} {role.applicationCode && `(${role.applicationCode})`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
