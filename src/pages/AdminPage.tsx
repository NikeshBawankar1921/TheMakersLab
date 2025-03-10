import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProductManager from '../components/admin/ProductManager';
import AdminSettings from '../components/admin/AdminSettings';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SiteLogo from '../components/ui/SiteLogo';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_EMAIL = 'nikeshbawankar1921@gmail.com';

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Tabs configuration
  const tabs = [
    { id: 'products', label: 'Products' },
    { id: 'users', label: 'Users' },
    { id: 'orders', label: 'Orders' },
    { id: 'settings', label: 'Settings' }
  ];
  
  // Check if the current user is the administrator
  useEffect(() => {
    const checkAdminStatus = async () => {
      // Only allow the specific admin email
      setIsAuthorized(currentUser?.email === ADMIN_EMAIL);
    };
    
    checkAdminStatus();
  }, [currentUser]);
  
  // Scroll to top when switching tabs
  const handleTabChange = (tab: string) => {
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Change the active tab
    setActiveTab(tab);
    
    // Close the mobile menu if it's open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Show unauthorized message if not the admin
  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <SiteLogo size="medium" />
        </div>
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
          <p className="text-gray-300 mb-6">
            You don't have permission to access the admin dashboard. This area is restricted to administrators only.
          </p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <SiteLogo size="medium" className="mb-4 md:mb-0" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
      </div>
      
      {/* Admin Navigation Tabs - Desktop */}
      <div className="hidden md:block mb-8 border-b border-gray-700">
        <div className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`py-3 px-6 focus:outline-none ${
                activeTab === tab.id
                  ? 'text-accent-pink border-b-2 border-accent-pink'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Admin Navigation - Mobile */}
      <div className="md:hidden mb-8">
        <div className="relative">
          {/* Current Tab Display + Toggle Button */}
          <div 
            className="flex justify-between items-center p-3 glass-effect rounded-t-lg cursor-pointer"
            onClick={toggleMobileMenu}
          >
            <span className="font-medium text-accent-pink">
              {tabs.find(tab => tab.id === activeTab)?.label || 'Menu'}
            </span>
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </motion.div>
          </div>
          
          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                className="absolute top-full left-0 right-0 z-10 glass-effect shadow-lg rounded-b-lg overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`block w-full text-left py-3 px-4 focus:outline-none ${
                      activeTab === tab.id
                        ? 'bg-primary-light bg-opacity-30 text-accent-pink'
                        : 'text-gray-400 hover:text-white hover:bg-primary-light hover:bg-opacity-20'
                    }`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'users' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-gray-300">User management functionality will be implemented here.</p>
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Order Management</h2>
            <p className="text-gray-300">Order management functionality will be implemented here.</p>
          </div>
        )}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};

export default AdminPage; 