import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { AppState, Application, User, FilterState } from '../types';
import { applicationService, ApplicationWithRelations } from '../services/applicationService';
import { authService } from '../services/authService';

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_APPLICATION'; payload: Application }
  | { type: 'DELETE_APPLICATION'; payload: string }
  | { type: 'SET_FILTERS'; payload: FilterState }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_SELECTED_APP'; payload: Application | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTER_PANEL_OPEN'; payload: boolean };

const initialState: AppState = {
  user: null,
  applications: [],
  filters: {
    domains: [],
    statuses: [],
    stakeholders: []
  },
  searchQuery: '',
  searchHistory: [],
  darkMode: true,
  selectedApp: null,
  isLoading: false,
  filterPanelOpen: true
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    case 'ADD_APPLICATION':
      return { ...state, applications: [...state.applications, action.payload] };
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id ? action.payload : app
        )
      };
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter(app => app.id !== action.payload)
      };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'ADD_SEARCH_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory.filter(h => h !== action.payload)].slice(0, 10);
      return { ...state, searchHistory: newHistory };
    case 'CLEAR_SEARCH_HISTORY':
      return { ...state, searchHistory: [] };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_SELECTED_APP':
      return { ...state, selectedApp: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FILTER_PANEL_OPEN':
      return { ...state, filterPanelOpen: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Check for current user
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          dispatch({ type: 'SET_USER', payload: currentUser });
        }

        // Load applications from Supabase
        const applications = await applicationService.getAllApplications();
        dispatch({ type: 'SET_APPLICATIONS', payload: applications });

        // Load dark mode preference from cookie (default: true)
        const darkModeCookie = Cookies.get('app_dark_mode');
        const darkModeValue = darkModeCookie !== undefined ? darkModeCookie === 'true' : true;
        dispatch({ type: 'SET_DARK_MODE', payload: darkModeValue });

        // Load filter panel visibility preference from cookie (default: true)
        const filterPanelCookie = Cookies.get('app_filter_panel_open');
        const filterPanelValue = filterPanelCookie !== undefined ? filterPanelCookie === 'true' : true;
        dispatch({ type: 'SET_FILTER_PANEL_OPEN', payload: filterPanelValue });

        // Load search history
        const searchHistory = localStorage.getItem('app_directory_search_history');
        if (searchHistory) {
          dispatch({ type: 'ADD_SEARCH_HISTORY', payload: JSON.parse(searchHistory) });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      dispatch({ type: 'SET_USER', payload: user });
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save dark mode preference to cookie and apply theme
  useEffect(() => {
    Cookies.set('app_dark_mode', String(state.darkMode), { expires: 365 });
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Save filter panel visibility preference to cookie
  useEffect(() => {
    Cookies.set('app_filter_panel_open', String(state.filterPanelOpen), { expires: 365 });
  }, [state.filterPanelOpen]);

  useEffect(() => {
    localStorage.setItem('app_directory_search_history', JSON.stringify(state.searchHistory));
  }, [state.searchHistory]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}