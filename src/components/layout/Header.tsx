import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { adminSettings, loading } = useAdmin();
  
  // Don't render anything until admin settings are loaded
  if (loading || !adminSettings) {
    return null;
  }
  
  const hasContactInfo = adminSettings.contactEmail || adminSettings.contactNumber;
  const hasBanner = adminSettings.bannerMessage || adminSettings.isMaintenanceMode;
  
  // Don't render if there's no info to display
  if (!hasBanner && !hasContactInfo) {
    return null;
  }
  
  return (
    <header>
      {/* Contact information bar */}
      {hasContactInfo && (
        <div className="bg-primary-light py-1 px-4 text-sm">
          <div className="container mx-auto flex justify-center md:justify-end items-center space-x-4">
            {adminSettings.contactEmail && (
              <motion.a 
                href={`mailto:${adminSettings.contactEmail}`}
                className="text-gray-200 hover:text-white flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {adminSettings.contactEmail}
              </motion.a>
            )}
            
            {adminSettings.contactNumber && (
              <motion.a 
                href={`tel:${adminSettings.contactNumber}`}
                className="text-gray-200 hover:text-white flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {adminSettings.contactNumber}
              </motion.a>
            )}
          </div>
        </div>
      )}
      
      {/* Maintenance mode banner */}
      {adminSettings.isMaintenanceMode && (
        <div className="bg-yellow-800 text-white py-2 px-4">
          <div className="container mx-auto text-center">
            <span className="font-bold">⚠️ Maintenance Mode:</span> The site is currently under maintenance. Some features may be unavailable.
          </div>
        </div>
      )}
      
      {/* Announcement banner */}
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