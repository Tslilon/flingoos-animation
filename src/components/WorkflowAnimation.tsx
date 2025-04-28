import { useState, useEffect } from 'react';
import { Workflow } from '../types/workflow';
import { WorkflowNode } from './WorkflowNode';
import { ConnectionLine } from './ConnectionLine';
import { WorkflowHeader } from './WorkflowHeader';

interface WorkflowAnimationProps {
  workflows: Workflow[];
  cycleTime?: number; // Time for each complete workflow cycle in seconds
  nodeDelay?: number; // Delay between node appearances in seconds
}

export const WorkflowAnimation = ({ 
  workflows, 
  cycleTime = 6, 
  nodeDelay = 0.4 
}: WorkflowAnimationProps) => {
  const [currentWorkflowIndex, setCurrentWorkflowIndex] = useState(0);
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
  const isAnimating = true; // Changed from state to constant since we're not toggling it
  const currentWorkflow = workflows[currentWorkflowIndex];

  useEffect(() => {
    if (!isAnimating) return;

    // Reset active node on workflow change
    setActiveNodeIndex(-1);

    // Animate header in
    const headerTimer = setTimeout(() => {
      // Animate nodes in sequence
      let nodeCount = 0;
      const nodeAnimationInterval = setInterval(() => {
        setActiveNodeIndex(prev => {
          const newIndex = prev + 1;
          if (newIndex >= currentWorkflow.nodes.length - 1) {
            clearInterval(nodeAnimationInterval);
          }
          return newIndex;
        });
        nodeCount++;
      }, nodeDelay * 1000);

      // Set timeout to change workflow
      const workflowTimeout = setTimeout(() => {
        setCurrentWorkflowIndex(prev => (prev + 1) % workflows.length);
      }, cycleTime * 1000);

      return () => {
        clearInterval(nodeAnimationInterval);
        clearTimeout(workflowTimeout);
      };
    }, 1000); // Header animation time

    return () => {
      clearTimeout(headerTimer);
    };
  }, [currentWorkflowIndex, workflows, cycleTime, nodeDelay, isAnimating, currentWorkflow.nodes.length]);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <WorkflowHeader 
        title={currentWorkflow.header} 
        isVisible={isAnimating} 
      />
      
      <div className="relative">
        {currentWorkflow.nodes.map((node, index) => (
          <div key={node.id}>
            <WorkflowNode 
              node={node}
              index={index}
              isActive={activeNodeIndex === index}
              isComplete={index < activeNodeIndex}
            />
            {index < currentWorkflow.nodes.length - 1 && (
              <ConnectionLine 
                index={index}
                isVisible={index <= activeNodeIndex}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 