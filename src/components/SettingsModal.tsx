import React from 'react';
import { X, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { state, dispatch } = useApp();

  if (!isOpen) return null;

  const handleDarkModeChange = (value: boolean) => {
    dispatch({ type: 'SET_DARK_MODE', payload: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Theme
            </h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                style={{ backgroundColor: !state.darkMode ? 'rgb(243, 244, 246)' : undefined }}
              >
                <input
                  type="radio"
                  name="theme"
                  checked={!state.darkMode}
                  onChange={() => handleDarkModeChange(false)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                />
                <div className="ml-3 flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Light
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Use light theme
                    </div>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                style={{ backgroundColor: state.darkMode ? 'rgb(55, 65, 81)' : undefined }}
              >
                <input
                  type="radio"
                  name="theme"
                  checked={state.darkMode}
                  onChange={() => handleDarkModeChange(true)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                />
                <div className="ml-3 flex items-center space-x-2">
                  <Moon className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Dark
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Use dark theme
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Theme preference is saved and will persist across sessions.
            </p>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
