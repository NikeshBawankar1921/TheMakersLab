import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'btn flex items-center justify-center';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-light text-white';
      case 'secondary':
        return 'bg-transparent text-white';
      case 'outline':
        return 'bg-transparent';
      default:
        return 'bg-primary-light text-white';
    }
  };

  return (
    <motion.button
      className={`${baseClasses} ${getVariantClasses()} ${widthClasses} ${className} ${
        disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button; 