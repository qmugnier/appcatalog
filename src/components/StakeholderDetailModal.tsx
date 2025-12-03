import React, { useState } from 'react';
import { X, Mail, MapPin, Briefcase, Edit2, Save, Check } from 'lucide-react';
import { Stakeholder, DEPARTMENTS, STAKEHOLDER_ROLES } from '../types';
import { stakeholderService } from '../services/stakeholderService';

interface StakeholderDetailModalProps {
  isOpen: boolean;
  stakeholder: Stakeholder | null;
  onClose: () => void;
  canEdit?: boolean;
  onUpdated?: () => void;
}

export default function StakeholderDetailModal({
  isOpen,
  stakeholder,
  onClose,
  canEdit = true,
  onUpdated
}: StakeholderDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: stakeholder?.name || '',
    email: stakeholder?.email || '',
    department: stakeholder?.department || 'General',
    position: stakeholder?.position || ''
  });

  React.useEffect(() => {
    if (stakeholder) {
      setFormData({
        name: stakeholder.name,
        email: stakeholder.email,
        department: stakeholder.department,
        position: stakeholder.position
      });
      setIsEditing(false);
    }
  }, [stakeholder, isOpen]);

  const handleSave = async () => {
    if (!stakeholder) return;
    setIsSaving(true);
    setError('');

    try {
      await stakeholderService.updateStakeholder(
        stakeholder.id,
        formData.name,
        formData.email,
        formData.department,
        formData.position
      );
      setIsEditing(false);
      onUpdated?.();
    } catch (err) {
      console.error('Error updating stakeholder:', err);
      setError('Failed to update stakeholder');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !stakeholder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Stakeholder Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {/* Avatar and Name */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-medium text-white">
                  {stakeholder.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold"
                  />
                ) : (
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stakeholder.name}
                  </h3>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${stakeholder.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {stakeholder.email}
                    </a>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{stakeholder.department}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position/Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., Senior Developer"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {stakeholder.position || 'Not specified'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Roles */}
            {stakeholder.roles.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Applications & Roles
                </h4>
                <div className="space-y-2">
                  {stakeholder.roles.map(role => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {role.applicationCode}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {role.role}
                        </p>
                      </div>
                      <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>Created: {new Date(stakeholder.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          {canEdit && (
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
