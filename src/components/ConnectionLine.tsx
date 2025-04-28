import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConnectionLineProps {
  index: number;
  isActive: boolean;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ index, isActive }) => {
  const [delay, setDelay] = useState(0);
  
  useEffect(() => {
    // Get CSS variables in useEffect to avoid SSR issues
    const nodeInterval = parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--node-appearance-interval')
        .trim() || '0.4s'
    );
    
    setDelay(index * nodeInterval);
  }, [index]);
  
  // Animation variants
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (delay: number) => ({ 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { 
          duration: 0.5,
          delay: 1 + delay + 0.2 // 1s base delay + node delay + 0.2s offset
        },
        opacity: { 
          duration: 0.25,
          delay: 1 + delay + 0.2 
        }
      }
    }),
    exit: { 
      pathLength: 0, 
      opacity: 0,
      transition: { duration: 0.3 } 
    }
  };

  return (
    <motion.div 
      className="h-8 w-1 mx-auto my-0"
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={delay}
    >
      <svg
        width="2"
        height="40"
        viewBox="0 0 2 40"
        className="mx-auto"
      >
        <motion.path
          d="M1 0V40"
          stroke={isActive ? "#3B82F6" : "#CBD5E1"}
          strokeWidth="2"
          fill="none"
          variants={lineVariants}
        />
      </svg>
    </motion.div>
  );
};

export default ConnectionLine; 