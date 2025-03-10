import React from 'react';
import { motion } from 'framer-motion';

// Random positioning utilities
const randomPos = () => ({
  top: `${Math.random() * 85}%`,
  left: `${Math.random() * 85}%`,
  delay: Math.random() * 2
});

// Random size utilities
const randomSize = () => ({
  size: 20 + Math.random() * 30,
  duration: 8 + Math.random() * 5
});

interface BubbleProps {
  color: string;
}

const Bubble: React.FC<BubbleProps> = ({ color }) => {
  const pos = randomPos();
  const { size, duration } = randomSize();
  
  return (
    <motion.div
      className="absolute rounded-full opacity-50 z-0 pointer-events-none"
      style={{
        top: pos.top,
        left: pos.left,
        backgroundColor: color,
        width: size,
        height: size
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ 
        y: [0, -50, 0], 
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.7, 0.4]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: duration,
        delay: pos.delay,
        ease: "easeInOut"
      }}
    />
  );
};

const Circuit: React.FC = () => {
  return (
    <div className="absolute w-24 h-24 opacity-20 pointer-events-none">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,50 L40,50 L40,30 L60,30 L60,70 L80,70 L80,50 L90,50" 
              stroke="var(--color-accent-green)" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="150"
              strokeDashoffset="150">
          <animate attributeName="stroke-dashoffset" 
                   from="150" 
                   to="0" 
                   dur="2s" 
                   begin="0s" 
                   fill="freeze" 
                   repeatCount="indefinite" />
        </path>
        <circle cx="10" cy="50" r="3" fill="var(--color-accent-blue)">
          <animate attributeName="r" 
                   values="3;5;3" 
                   dur="2s" 
                   repeatCount="indefinite" />
        </circle>
        <circle cx="90" cy="50" r="3" fill="var(--color-accent-pink)">
          <animate attributeName="r" 
                   values="3;5;3" 
                   dur="2s" 
                   begin="1s"
                   repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

interface Gear {
  size: number;
  top: string;
  left: string;
  color: string;
  duration: number;
  delay: number;
}

const gears: Gear[] = [
  { size: 40, top: '10%', left: '5%', color: 'var(--color-accent-yellow)', duration: 20, delay: 0 },
  { size: 30, top: '15%', left: '90%', color: 'var(--color-accent-blue)', duration: 15, delay: 1 },
  { size: 25, top: '85%', left: '85%', color: 'var(--color-accent-pink)', duration: 25, delay: 0.5 }
];

const Gear: React.FC<{ gear: Gear }> = ({ gear }) => {
  return (
    <motion.div
      className="absolute opacity-20 pointer-events-none"
      style={{
        top: gear.top,
        left: gear.left,
        width: gear.size,
        height: gear.size
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: gear.duration,
        repeat: Infinity,
        ease: "linear",
        delay: gear.delay
      }}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 15L53 30C56 29 59 28 62 28L65 13C61 12 58 12 54 12C52 12 51 13 50 15ZM37 29C34 30 32 32 29 34L18 24C22 20 26 17 31 14L37 29ZM28 62C28 59 29 56 30 53L15 50C13 51 12 52 12 54C12 58 12 61 13 65L28 62ZM71 29L85 34C88 29 91 25 93 20L84 13C82 18 80 22 78 26C76 27 74 28 71 29ZM34 71L29 85C25 82 20 79 17 75L24 66C26 68 30 70 34 71ZM50 85L47 70C44 71 41 72 38 72L35 87C39 88 42 88 46 88C48 88 49 87 50 85ZM63 71C66 70 68 68 71 66L82 76C78 80 74 83 69 86L63 71ZM72 38C72 41 71 44 70 47L85 50C87 49 88 48 88 46C88 42 88 39 87 35L72 38ZM29 29L15 24C13 28 10 35 10 41L25 44C25 39 26 34 29 29ZM71 71L86 76C88 72 90 65 90 59L75 56C75 61 74 66 71 71ZM50 40C45 40 40 45 40 50C40 55 45 60 50 60C55 60 60 55 60 50C60 45 55 40 50 40Z" 
          fill={gear.color}
        />
      </svg>
    </motion.div>
  );
};

interface KidDecorProps {
  type?: 'bubbles' | 'gears' | 'circuits' | 'all';
  density?: 'low' | 'medium' | 'high';
}

const KidDecor: React.FC<KidDecorProps> = ({ 
  type = 'all',
  density = 'medium'
}) => {
  // Determine count based on density
  let count;
  switch (density) {
    case 'low': count = 3; break;
    case 'high': count = 12; break;
    default: count = 6;
  }

  // Colors for bubbles
  const colors = [
    'var(--color-accent-pink)',
    'var(--color-accent-yellow)',
    'var(--color-accent-green)',
    'var(--color-accent-blue)',
    'var(--color-accent-purple)'
  ];

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {(type === 'all' || type === 'bubbles') && 
        Array.from({ length: count }).map((_, i) => (
          <Bubble key={`bubble-${i}`} color={colors[i % colors.length]} />
        ))
      }
      
      {(type === 'all' || type === 'circuits') && 
        Array.from({ length: Math.ceil(count/2) }).map((_, i) => (
          <div key={`circuit-${i}`} style={{ 
            position: 'absolute', 
            top: `${Math.random() * 80}%`, 
            left: `${Math.random() * 80}%` 
          }}>
            <Circuit />
          </div>
        ))
      }

      {(type === 'all' || type === 'gears') && 
        gears.map((gear, i) => (
          <Gear key={`gear-${i}`} gear={gear} />
        ))
      }
    </div>
  );
};

export default KidDecor; 