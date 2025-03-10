import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import { motion, AnimatePresence } from 'framer-motion';
import userService from '../firebase/userService';

// Define user profile type
interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt?: string;
  photoURL?: string;
}

// Mock order type (to be replaced with actual order data)
interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: string;
  }>;
}

// Mock enrolled course type
interface EnrolledCourse {
  id: string;
  name: string;
  progress: number;
  enrolledDate: string;
  image?: string;
  nextLesson?: string;
}

const UserDashboardPage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    }
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Mock orders (to be replaced with actual data from Firebase)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-12345',
      date: '2023-05-15',
      status: 'Delivered',
      total: '₹4,500',
      items: [
        { id: 'PROD-1', name: 'Arduino Starter Kit', quantity: 1, price: '₹2,500' },
        { id: 'PROD-2', name: 'Sensor Pack', quantity: 2, price: '₹1,000' }
      ]
    },
    {
      id: 'ORD-12346',
      date: '2023-06-20',
      status: 'Processing',
      total: '₹8,999',
      items: [
        { id: 'PROD-3', name: 'Project Pathshala Course', quantity: 1, price: '₹8,999' }
      ]
    }
  ]);

  // Mock enrolled courses (to be replaced with actual data from Firebase)
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([
    {
      id: 'CRS-001',
      name: 'The Adventure of Arduino',
      progress: 65,
      enrolledDate: '2023-04-10',
      nextLesson: 'Advanced Sensors',
    },
    {
      id: 'CRS-002',
      name: 'Fun with IoT',
      progress: 30,
      enrolledDate: '2023-06-15',
      nextLesson: 'Cloud Integration',
    }
  ]);
  
  // Tabs configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'courses', label: 'My Courses', icon: '📚' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];
  
  // Load user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userProfile = await userService.getUserProfile(currentUser.uid);
        
        if (userProfile) {
          setProfile({
            displayName: userProfile.displayName || currentUser.displayName || '',
            email: currentUser.email || '',
            phoneNumber: userProfile.phoneNumber || '',
            address: userProfile.address || {
              street: '',
              city: '',
              state: '',
              postalCode: '',
              country: '',
            },
            createdAt: userProfile.createdAt,
            photoURL: userProfile.photoURL || currentUser.photoURL || '',
          });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load your profile information.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
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
    
    // Clear messages
    setError('');
    setSuccess('');
    
    // Close the mobile menu if it's open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Handle profile form input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties like address.city
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserProfile] as Record<string, any>,
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save profile information
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (!currentUser) {
        setError('You must be logged in to update your profile.');
        return;
      }
      
      // Update profile in Firebase (through auth context)
      await updateProfile({
        displayName: profile.displayName,
        phoneNumber: profile.phoneNumber,
        address: profile.address
      });
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Validate password
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      
      // Here you would implement the actual password change functionality
      // For now, we'll just show a success message
      setSuccess('Password changed successfully! Please log in again with your new password.');
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
          My Dashboard
        </h1>
      </div>
      
      {/* Dashboard Navigation Tabs - Desktop */}
      <div className="hidden md:block mb-8 border-b border-gray-700">
        <div className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`py-3 px-6 focus:outline-none flex items-center ${
                activeTab === tab.id
                  ? 'text-accent-pink border-b-2 border-accent-pink'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Dashboard Navigation - Mobile */}
      <div className="md:hidden mb-8">
        <div className="relative">
          {/* Current Tab Display + Toggle Button */}
          <div 
            className="flex justify-between items-center p-3 glass-effect rounded-t-lg cursor-pointer"
            onClick={toggleMobileMenu}
          >
            <span className="font-medium text-accent-pink flex items-center">
              <span className="mr-2">{tabs.find(tab => tab.id === activeTab)?.icon}</span>
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
                    className={`block w-full text-left py-3 px-4 focus:outline-none flex items-center ${
                      activeTab === tab.id
                        ? 'bg-primary-light bg-opacity-30 text-accent-pink'
                        : 'text-gray-400 hover:text-white hover:bg-primary-light hover:bg-opacity-20'
                    }`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-500 bg-opacity-20 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-500 bg-opacity-20 text-black rounded-lg">
          {success}
        </div>
      )}
      
      {/* Tab Content */}
      <div>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 bg-primary-light">
                  {profile.photoURL ? (
                    <img 
                      src={profile.photoURL} 
                      alt={profile.displayName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      👤
                    </div>
                  )}
                </div>
                
                <p className="text-center mb-2">{profile.email}</p>
                
                <p className="text-xs text-gray-400">
                  Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              
              {/* Profile Form */}
              <div className="w-full md:w-2/3">
                <form onSubmit={handleSaveProfile}>
                  <TextField
                    label="Full Name"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleProfileChange}
                  />
                  
                  <TextField
                    label="Email"
                    name="email"
                    value={profile.email}
                    readOnly
                    disabled
                  />
                  
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleProfileChange}
                  />
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Address</h3>
                    
                    <TextField
                      label="Street Address"
                      name="address.street"
                      value={profile.address.street}
                      onChange={handleProfileChange}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField
                        label="City"
                        name="address.city"
                        value={profile.address.city}
                        onChange={handleProfileChange}
                      />
                      
                      <TextField
                        label="State/Province"
                        name="address.state"
                        value={profile.address.state}
                        onChange={handleProfileChange}
                      />
                      
                      <TextField
                        label="Postal Code"
                        name="address.postalCode"
                        value={profile.address.postalCode}
                        onChange={handleProfileChange}
                      />
                      
                      <TextField
                        label="Country"
                        name="address.country"
                        value={profile.address.country}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      isLoading={loading}
                      disabled={loading}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        )}
        
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl">You don't have any orders yet.</p>
                <p className="text-gray-400 mt-2">Shop for components, kits, or courses to get started!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-700 rounded-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-primary-light bg-opacity-30 p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <h3 className="font-bold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-400">Placed on {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex items-center mt-2 md:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                        <span className="ml-4 font-bold">{order.total}</span>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">Items:</h4>
                      <ul className="space-y-2">
                        {order.items.map(item => (
                          <li key={item.id} className="flex justify-between">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>{item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Order Actions */}
                    <div className="p-4 border-t border-gray-700 flex justify-end">
                      <Button
                        variant="secondary"
                        size="small"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
        
        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
            
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl">You're not enrolled in any courses yet.</p>
                <p className="text-gray-400 mt-2">Browse our courses and start learning today!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="border border-gray-700 rounded-lg overflow-hidden">
                    {/* Course Header */}
                    <div className="aspect-video bg-primary-light relative overflow-hidden">
                      {course.image ? (
                        <img 
                          src={course.image}
                          alt={course.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          📚
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-4 py-2">
                        <div className="flex justify-between text-xs text-white mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-accent-pink h-2.5 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{course.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">Enrolled on {new Date(course.enrolledDate).toLocaleDateString()}</p>
                      
                      {course.nextLesson && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold">Next Lesson:</p>
                          <p>{course.nextLesson}</p>
                        </div>
                      )}
                      
                      <Button fullWidth>
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            
            <div className="space-y-8">
              {/* Change Password */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                
                <form onSubmit={handleChangePassword}>
                  <TextField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  
                  <TextField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      type="submit" 
                      isLoading={loading}
                      disabled={loading}
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </div>
              
              {/* Notification Preferences (placeholder) */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notif-orders"
                      className="h-4 w-4 mr-2 accent-accent-pink"
                      defaultChecked
                    />
                    <label htmlFor="notif-orders">
                      Order updates
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notif-courses"
                      className="h-4 w-4 mr-2 accent-accent-pink"
                      defaultChecked
                    />
                    <label htmlFor="notif-courses">
                      Course announcements
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notif-promos"
                      className="h-4 w-4 mr-2 accent-accent-pink"
                      defaultChecked
                    />
                    <label htmlFor="notif-promos">
                      Promotions and discounts
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="mt-12">
                <h3 className="text-lg text-red-500 font-semibold mb-4">Danger Zone</h3>
                
                <div className="border border-red-500 rounded-lg p-4">
                  <p className="mb-4">
                    Deleting your account is permanent. All of your data will be permanently removed.
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="text-red-500 border-red-500 hover:bg-red-500 hover:bg-opacity-20"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage; 