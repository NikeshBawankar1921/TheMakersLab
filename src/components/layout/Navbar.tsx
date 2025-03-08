import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Learning Kits', path: '/learning-kits' },
    { name: 'Electronic Components', path: '/components' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  // Check if current user is the admin
  const isAdmin = currentUser && currentUser.email === 'nikeshbawankar1921@gmail.com';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 glass-effect">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-accent-pink to-accent-red bg-clip-text text-transparent">
            The Makers Lab
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-white hover:text-accent-pink transition-colors ${
                isActive(link.path) ? 'text-accent-pink' : ''
              }`}
            >
              {isActive(link.path) && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-gradient-to-r from-accent-pink to-accent-red"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              {link.name}
            </Link>
          ))}

          {currentUser ? (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-white hover:text-accent-pink transition-colors"
                >
                  Admin
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="btn"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn">
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect mt-2 py-4 px-2 rounded-lg">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md hover:bg-primary-light ${
                  isActive(link.path) ? 'text-accent-pink gradient-border' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-md hover:bg-primary-light"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            {currentUser ? (
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="btn mx-4"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="btn mx-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 