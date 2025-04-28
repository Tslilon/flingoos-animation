import { motion } from 'framer-motion';

interface ConnectionLineProps {
  index: number;
  isVisible: boolean;
}

export const ConnectionLine = ({ index, isVisible }: ConnectionLineProps) => {
  return (
    <motion.div 
      className="relative h-4 w-0.5 mx-auto bg-slate-200 my-1"
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: isVisible ? 16 : 0, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ 
        duration: 0.3,
        delay: 1.0 + (index * 0.4) + 0.2 // Slightly delayed after node appears
      }}
    />
  );
}; 