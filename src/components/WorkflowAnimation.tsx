import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workflows } from '../data/workflows';
import Node from './Node';
import ConnectionLine from './ConnectionLine';

const ANIMATION_TIMING = {
  HEADER_FADE: 0.5,           // seconds
  NODE_APPEARANCE_DELAY: 1,   // seconds
  NODE_APPEARANCE_INTERVAL: 0.4, // seconds
  FULL_DISPLAY: 2,            // seconds
  TRANSITION: 0.8             // seconds
};

const WorkflowAnimation: React.FC = () => {
  const [currentWorkflowIndex, setCurrentWorkflowIndex] = useState(0);
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(true);
  
  const currentWorkflow = workflows[currentWorkflowIndex];
  const intervalRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  
  // Function to handle the workflow animation sequence
  useEffect(() => {
    if (!isVisible) return;
    
    // Clear any existing timers
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    
    // Calculate total animation duration
    const totalNodeDelay = ANIMATION_TIMING.NODE_APPEARANCE_DELAY + 
      (currentWorkflow.steps.length * ANIMATION_TIMING.NODE_APPEARANCE_INTERVAL);
    
    // Start highlighting nodes one by one
    intervalRef.current = window.setInterval(() => {
      setActiveNodeIndex(prev => {
        const next = prev + 1;
        return next < currentWorkflow.steps.length ? next : prev;
      });
    }, ANIMATION_TIMING.NODE_APPEARANCE_INTERVAL * 1000);
    
    // Schedule fade out
    const fadeOutTimeout = window.setTimeout(() => {
      setIsVisible(false);
    }, (totalNodeDelay + ANIMATION_TIMING.FULL_DISPLAY) * 1000);
    
    timeoutsRef.current.push(fadeOutTimeout);
    
    // Schedule switch to next workflow
    const nextWorkflowTimeout = window.setTimeout(() => {
      setCurrentWorkflowIndex(
        (prev) => (prev + 1) % workflows.length
      );
      setActiveNodeIndex(-1);
      setIsVisible(true);
    }, (totalNodeDelay + ANIMATION_TIMING.FULL_DISPLAY + ANIMATION_TIMING.TRANSITION) * 1000);
    
    timeoutsRef.current.push(nextWorkflowTimeout);
    
    // Cleanup timers on component unmount or workflow change
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, [currentWorkflowIndex, isVisible, currentWorkflow.steps.length]);
  
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: ANIMATION_TIMING.HEADER_FADE }
    },
    exit: { 
      opacity: 0,
      transition: { duration: ANIMATION_TIMING.HEADER_FADE }
    }
  };
  
  // Animation variants for the header
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: ANIMATION_TIMING.HEADER_FADE }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: ANIMATION_TIMING.HEADER_FADE * 0.6 }
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-lg shadow-sm">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentWorkflow.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="workflow-container"
          >
            {/* Workflow Header */}
            <motion.h2
              variants={headerVariants}
              className="text-xl font-bold text-center mb-6 text-blue-600"
            >
              {currentWorkflow.header}
            </motion.h2>
            
            {/* Workflow Steps */}
            <div className="flex flex-col items-center w-full">
              {currentWorkflow.steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <Node
                    label={step.label}
                    index={index}
                    isActive={index === activeNodeIndex}
                    isComplete={index < activeNodeIndex}
                  />
                  
                  {/* Don't render connection after the last node */}
                  {index < currentWorkflow.steps.length - 1 && (
                    <ConnectionLine 
                      index={index}
                      isActive={index < activeNodeIndex}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkflowAnimation; 