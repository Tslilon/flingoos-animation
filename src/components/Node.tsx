import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NodeProps {
  label: string;
  index: number;
  isActive: boolean;
  isComplete: boolean;
  className?: string;
}

const Node: React.FC<NodeProps> = ({ 
  label, 
  index, 
  isActive, 
  isComplete, 
  className = '' 
}) => {
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

  // Define variants for animation
  const nodeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        delay: 1 + delay // 1s base delay + node-specific delay
      }
    }),
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={delay}
      variants={nodeVariants}
      className={`
        flex items-center p-4 mb-2 rounded-lg w-full
        ${isActive ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-white'}
        ${isComplete ? 'border border-green-300' : 'border border-gray-200'}
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Node number/icon */}
        <div className={`
          flex items-center justify-center
          w-8 h-8 rounded-full
          ${isActive ? 'bg-blue-500 text-white' : 
            isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
          ${isComplete && 'animate-pulse'}
        `}>
          {index + 1}
        </div>
        
        {/* Node label */}
        <div className="text-sm font-medium">{label}</div>
      </div>
    </motion.div>
  );
};

export default Node; 