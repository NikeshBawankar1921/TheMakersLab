import React from 'react';
import { motion } from 'framer-motion';

interface KidButtonProps {
  children: React.ReactNode;
  color?: 'primary' | 'pink' | 'yellow' | 'green' | 'blue' | 'purple' | 'rainbow';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

// Define the sparkle animation in a component-level stylesheet
const sparkleStyle = `
  @keyframes kidButtonSparkle {
    0%, 100% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1); opacity: 0.5; }
  }
`;

const KidButton: React.FC<KidButtonProps> = ({
  children,
  color = 'primary',
  size = 'medium',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon,
  fullWidth = false,
  isLoading = false
}) => {
  // Color mapping
  const colorClasses = {
    primary: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    pink: 'bg-gradient-to-br from-pink-500 to-pink-600',
    yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
    green: 'bg-gradient-to-br from-green-400 to-green-500',
    blue: 'bg-gradient-to-br from-blue-400 to-blue-500',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    rainbow: 'bg-gradient-to-r from-pink-500 via-blue-500 to-green-500'
  };

  // Size mapping
  const sizeClasses = {
    small: 'text-sm px-4 py-1.5',
    medium: 'text-base px-6 py-2.5',
    large: 'text-lg px-8 py-3.5'
  };

  // Width
  const widthClass = fullWidth ? 'w-full' : '';

  // Base button classes
  const buttonClasses = `
    relative
    font-bold
    text-white
    rounded-full
    ${colorClasses[color]}
    ${sizeClasses[size]}
    ${widthClass}
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
    transform transition-all duration-200
    shadow-lg hover:shadow-xl focus:outline-none
    ${className}
  `;

  // Add the sparkle animation keyframes once when component renders
  React.useEffect(() => {
    // Check if the style already exists to avoid duplicates
    if (!document.getElementById('kid-button-sparkle-style')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'kid-button-sparkle-style';
      styleElement.innerHTML = sparkleStyle;
      document.head.appendChild(styleElement);
    }
    
    // Clean up when component unmounts
    return () => {
      // Only remove if this is the last KidButton
      if (document.querySelectorAll('button.kid-button').length <= 1) {
        const styleElement = document.getElementById('kid-button-sparkle-style');
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      }
    };
  }, []);

  return (
    <motion.button
      type={type}
      className={`${buttonClasses} kid-button`}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      initial={{ y: 0 }}
      animate={isLoading ? { y: [0, -5, 0] } : {}}
      transition={{
        y: { repeat: Infinity, duration: 1 },
        default: { duration: 0.2 }
      }}
    >
      {/* Inner sparkle effect */}
      <span className="absolute inset-0 overflow-hidden rounded-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white opacity-0"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animation: `kidButtonSparkle ${Math.random() * 2 + 1}s ease-in-out ${Math.random() * 2}s infinite`
            }}
          />
        ))}
      </span>

      {/* Button content */}
      <span className="relative flex items-center justify-center">
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : icon ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
      </span>
    </motion.button>
  );
};

export default KidButton; 