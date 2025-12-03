import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSearchSuggestions } from '../utils/searchUtils';
import { applicationService } from '../services/applicationService';

interface SearchBarProps {
  onToggleFilters?: () => void;
  showFilterButton?: boolean;
}

export default function SearchBar({ onToggleFilters, showFilterButton = true }: SearchBarProps) {
  const { state, dispatch } = useApp();
  const [localQuery, setLocalQuery] = useState(state.searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: localQuery });
      if (localQuery.trim() && localQuery !== state.searchQuery) {
        const newSuggestions = getSearchSuggestions(state.applications, localQuery);
        setSuggestions(newSuggestions);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, dispatch, state.applications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setLocalQuery(value);
    if (value.trim()) {
      const newSuggestions = getSearchSuggestions(state.applications, value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      setShowHistory(false);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (query: string) => {
    if (query.trim()) {
      dispatch({ type: 'ADD_SEARCH_HISTORY', payload: query.trim() });
      performSearch(query.trim());
    }
    setShowSuggestions(false);
    setShowHistory(false);
    inputRef.current?.blur();
  };

  const performSearch = async (query: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const results = await applicationService.searchApplications(query);
      dispatch({ type: 'SET_APPLICATIONS', payload: results });
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
      setLocalQuery(query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleInputFocus = () => {
    if (!localQuery.trim() && state.searchHistory.length > 0) {
      setShowHistory(true);
    } else if (localQuery.trim()) {
      setShowSuggestions(true);
    }
  };

  const clearSearch = () => {
    setLocalQuery('');
    loadAllApplications();
    setShowSuggestions(false);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const loadAllApplications = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const applications = await applicationService.getAllApplications();
      dispatch({ type: 'SET_APPLICATIONS', payload: applications });
      dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_SEARCH_HISTORY' });
    setShowHistory(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(localQuery);
            }
          }}
          placeholder="Search applications, domains, or stakeholders..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {localQuery && (
            <button
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {showFilterButton && (
            <button
              onClick={onToggleFilters}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2"
              >
                <Search className="h-4 w-4 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search History */}
      {showHistory && state.searchHistory.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Recent searches
              </div>
              <button
                onClick={clearHistory}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Clear all
              </button>
            </div>
            {state.searchHistory.slice(0, 5).map((query, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(query)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2"
              >
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{query}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}