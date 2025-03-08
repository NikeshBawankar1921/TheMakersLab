import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import TextField from '../ui/TextField';

const AdminSettings: React.FC = () => {
  const { adminSettings, loading, error, updateSettings, refreshSettings } = useAdmin();
  
  const [formData, setFormData] = useState({
    siteTitle: '',
    siteDescription: '',
    contactEmail: '',
    bannerMessage: '',
    isMaintenanceMode: false,
    primaryColor: '',
    secondaryColor: '',
    accentColor: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Initialize form with current settings when they load
  useEffect(() => {
    if (adminSettings) {
      setFormData({
        siteTitle: adminSettings.siteTitle || '',
        siteDescription: adminSettings.siteDescription || '',
        contactEmail: adminSettings.contactEmail || '',
        bannerMessage: adminSettings.bannerMessage || '',
        isMaintenanceMode: adminSettings.isMaintenanceMode || false,
        primaryColor: adminSettings.theme?.primaryColor || '',
        secondaryColor: adminSettings.theme?.secondaryColor || '',
        accentColor: adminSettings.theme?.accentColor || '',
        facebook: adminSettings.socialLinks?.facebook || '',
        twitter: adminSettings.socialLinks?.twitter || '',
        instagram: adminSettings.socialLinks?.instagram || '',
        youtube: adminSettings.socialLinks?.youtube || ''
      });
    }
  }, [adminSettings]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error and success message when user makes changes
    setFormError(null);
    setSuccessMessage(null);
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setFormError(null);
      setSuccessMessage(null);
      
      // Format data for Firebase
      const updatedSettings = {
        siteTitle: formData.siteTitle,
        siteDescription: formData.siteDescription,
        contactEmail: formData.contactEmail,
        bannerMessage: formData.bannerMessage,
        isMaintenanceMode: formData.isMaintenanceMode,
        theme: {
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          accentColor: formData.accentColor
        },
        socialLinks: {
          facebook: formData.facebook,
          twitter: formData.twitter,
          instagram: formData.instagram,
          youtube: formData.youtube
        }
      };
      
      // Update settings in Firebase
      await updateSettings(updatedSettings);
      setSuccessMessage('Settings updated successfully!');
      
      // Refresh settings from Firebase
      await refreshSettings();
    } catch (err) {
      console.error('Error saving settings:', err);
      setFormError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading && !adminSettings) {
    return <div className="text-center py-12">Loading settings...</div>;
  }
  
  return (
    <div className="w-full">
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-bold mb-6">Website Settings</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 text-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        {formError && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 text-red-200 rounded-lg">
            {formError}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-20 text-green-200 rounded-lg">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Site Title"
                name="siteTitle"
                value={formData.siteTitle}
                onChange={handleInputChange}
              />
              
              <TextField
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-200 mb-2 text-sm font-medium">
                Site Description
              </label>
              <textarea
                name="siteDescription"
                value={formData.siteDescription}
                onChange={handleInputChange}
                rows={3}
                className="bg-primary-light bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-pink w-full"
              ></textarea>
            </div>
            
            <div className="mt-4">
              <TextField
                label="Banner Message"
                name="bannerMessage"
                value={formData.bannerMessage}
                onChange={handleInputChange}
                placeholder="Special announcement or message to display on the site (optional)"
              />
            </div>
            
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="isMaintenanceMode"
                name="isMaintenanceMode"
                checked={formData.isMaintenanceMode}
                onChange={handleInputChange}
                className="h-4 w-4 mr-2 accent-accent-pink"
              />
              <label htmlFor="isMaintenanceMode" className="text-sm font-medium">
                Enable Maintenance Mode
              </label>
            </div>
          </div>
          
          {/* Theme Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Theme Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <TextField
                  label="Primary Color"
                  name="primaryColor"
                  type="text"
                  value={formData.primaryColor}
                  onChange={handleInputChange}
                  placeholder="#121212"
                />
                <div 
                  className="h-6 w-full rounded mt-1" 
                  style={{ backgroundColor: formData.primaryColor || '#121212' }}
                ></div>
              </div>
              
              <div>
                <TextField
                  label="Secondary Color"
                  name="secondaryColor"
                  type="text"
                  value={formData.secondaryColor}
                  onChange={handleInputChange}
                  placeholder="#1e1e1e"
                />
                <div 
                  className="h-6 w-full rounded mt-1" 
                  style={{ backgroundColor: formData.secondaryColor || '#1e1e1e' }}
                ></div>
              </div>
              
              <div>
                <TextField
                  label="Accent Color"
                  name="accentColor"
                  type="text"
                  value={formData.accentColor}
                  onChange={handleInputChange}
                  placeholder="#ff4081"
                />
                <div 
                  className="h-6 w-full rounded mt-1" 
                  style={{ backgroundColor: formData.accentColor || '#ff4081' }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourpage"
              />
              
              <TextField
                label="Twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourhandle"
              />
              
              <TextField
                label="Instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourprofile"
              />
              
              <TextField
                label="YouTube"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
            >
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminSettings; 