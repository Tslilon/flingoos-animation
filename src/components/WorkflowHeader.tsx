import { motion } from 'framer-motion';

interface WorkflowHeaderProps {
  title: string;
  isVisible: boolean;
}

export const WorkflowHeader = ({ title, isVisible }: WorkflowHeaderProps) => {
  return (
    <motion.div
      className="text-2xl font-semibold text-center mb-8 text-slate-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -10
      }}
      transition={{ duration: 0.5 }}
    >
      {title}
    </motion.div>
  );
}; 