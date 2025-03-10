import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProductManager from '../components/admin/ProductManager';
import AdminSettings from '../components/admin/AdminSettings';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SiteLogo from '../components/ui/SiteLogo';

const ADMIN_EMAIL = 'nikeshbawankar1921@gmail.com';

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
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
      
      {/* Admin Navigation Tabs */}
      <div className="mb-8 border-b border-gray-700">
        <div className="flex space-x-4">
          <button
            className={`py-3 px-6 focus:outline-none ${
              activeTab === 'products'
                ? 'text-accent-pink border-b-2 border-accent-pink'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('products')}
          >
            Products
          </button>
          <button
            className={`py-3 px-6 focus:outline-none ${
              activeTab === 'users'
                ? 'text-accent-pink border-b-2 border-accent-pink'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('users')}
          >
            Users
          </button>
          <button
            className={`py-3 px-6 focus:outline-none ${
              activeTab === 'orders'
                ? 'text-accent-pink border-b-2 border-accent-pink'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('orders')}
          >
            Orders
          </button>
          <button
            className={`py-3 px-6 focus:outline-none ${
              activeTab === 'settings'
                ? 'text-accent-pink border-b-2 border-accent-pink'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('settings')}
          >
            Settings
          </button>
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