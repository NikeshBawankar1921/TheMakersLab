import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const Header: React.FC = () => {
  const { adminSettings, loading } = useAdmin();
  
  // Don't render anything until admin settings are loaded
  if (loading || !adminSettings) {
    return null;
  }
  
  // Don't render if there's no banner message or if site is not in maintenance mode
  if (!adminSettings.bannerMessage && !adminSettings.isMaintenanceMode) {
    return null;
  }
  
  return (
    <header>
      {adminSettings.isMaintenanceMode && (
        <div className="bg-yellow-800 text-white py-2 px-4">
          <div className="container mx-auto text-center">
            <span className="font-bold">⚠️ Maintenance Mode:</span> The site is currently under maintenance. Some features may be unavailable.
          </div>
        </div>
      )}
      
      {adminSettings.bannerMessage && (
        <div className="bg-gradient-to-r from-accent-pink to-accent-red text-white py-2 px-4">
          <div className="container mx-auto text-center">
            {adminSettings.bannerMessage}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 