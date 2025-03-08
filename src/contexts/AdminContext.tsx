import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAdminSettings, 
  updateAdminSettings, 
  initializeDefaultAdminSettings,
  AdminSettings
} from '../firebase/adminService';

interface AdminContextType {
  adminSettings: AdminSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<AdminSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize default settings if none exist
      await initializeDefaultAdminSettings();
      
      // Then fetch the settings
      const settings = await getAdminSettings();
      setAdminSettings(settings);
    } catch (err) {
      console.error('Error fetching admin settings:', err);
      setError('Failed to load admin settings. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (settings: Partial<AdminSettings>) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateAdminSettings(settings);
      
      // Update local state with new settings
      setAdminSettings(prev => prev ? { ...prev, ...settings } : settings);
    } catch (err) {
      console.error('Error updating admin settings:', err);
      setError('Failed to update admin settings. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    return fetchSettings();
  };

  const value = {
    adminSettings,
    loading,
    error,
    updateSettings,
    refreshSettings
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider; 