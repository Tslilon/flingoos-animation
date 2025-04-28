import { motion } from 'framer-motion';
import { WorkflowNode as WorkflowNodeType } from '../types/workflow';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isActive: boolean;
  isComplete: boolean;
  index: number;
}

export const WorkflowNode = ({ node, isActive, isComplete, index }: WorkflowNodeProps) => {
  return (
    <motion.div
      className={`relative flex items-center p-4 mb-4 rounded-lg shadow-sm border 
        ${isActive ? 'bg-white border-blue-300 shadow-blue-100' : 'bg-white border-gray-200'}
        ${isComplete ? 'border-green-200' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        boxShadow: isActive ? '0 2px 10px rgba(147, 197, 253, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ 
        duration: 0.4,
        delay: 1.0 + (index * 0.4)
      }}
    >
      {isComplete && (
        <motion.div 
          className="absolute inset-0 rounded-lg"
          animate={{
            boxShadow: ['0 0 0 rgba(147, 197, 253, 0)', '0 0 8px rgba(147, 197, 253, 0.4)', '0 0 0 rgba(147, 197, 253, 0)']
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
      )}
      <div className="mr-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center
          ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
          ${isComplete ? 'bg-green-100 text-green-600' : ''}`}>
          {index + 1}
        </div>
      </div>
      <div className="text-sm font-medium text-gray-700">{node.label}</div>
    </motion.div>
  );
}; 