import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SiteLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const SiteLogo: React.FC<SiteLogoProps> = ({ 
  size = 'medium',
  className = '' 
}) => {
  // Size classes mapping
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl'
  };

  // Animation for the gear icon
  const gearAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear"
    }
  };

  // Animation for the logo hover
  const logoHoverAnimation = {
    scale: 1.05,
    transition: { duration: 0.3 }
  };

  return (
    <Link to="/">
      <motion.div 
        className={`flex items-center justify-center gap-2 ${className}`}
        whileHover={logoHoverAnimation}
      >
        <motion.div
          animate={gearAnimation}
          className="text-accent-yellow"
        >
          ⚙️
        </motion.div>
        <h1 className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-accent-pink to-blue-500 bg-clip-text text-transparent`}>
          The Makers Lab 
        </h1>
        <motion.div
          animate={{
            ...gearAnimation,
            rotate: [0, -360] // Counter-rotate this gear
          }}
          className="text-accent-blue"
        >
          ⚙️
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default SiteLogo; 