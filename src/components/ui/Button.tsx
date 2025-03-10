import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import KidButton from './KidButton';

// Define the color type that matches KidButton's accepted colors
type KidButtonColor = 'primary' | 'pink' | 'yellow' | 'green' | 'blue' | 'purple' | 'rainbow';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'pink' | 'yellow' | 'green' | 'blue' | 'purple' | 'rainbow';
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
  // Map our variant to KidButton colors
  const getKidButtonColor = (): KidButtonColor => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'blue';
      case 'outline':
        return 'rainbow';
      case 'pink':
        return 'pink';
      case 'yellow':
        return 'yellow';
      case 'green':
        return 'green';
      case 'blue':
        return 'blue';
      case 'purple':
        return 'purple';
      case 'rainbow':
        return 'rainbow';
      default:
        return 'primary';
    }
  };

  // Use our new KidButton component
  return (
    <KidButton
      color={getKidButtonColor()}
      className={className}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={disabled}
      {...props}
    >
      {children}
    </KidButton>
  );
};

export default Button; 