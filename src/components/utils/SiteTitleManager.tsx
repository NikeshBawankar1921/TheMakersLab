import React, { useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

/**
 * Component that manages site title globally based on admin settings
 * This component doesn't render anything but manages the document title
 */
const SiteTitleManager: React.FC = () => {
  const { adminSettings } = useAdmin();
  
  useEffect(() => {
    // Update document title when admin settings change
    if (adminSettings?.siteTitle) {
      document.title = adminSettings.siteTitle;
    }
  }, [adminSettings]);
  
  // This component doesn't render anything
  return null;
};

export default SiteTitleManager; 