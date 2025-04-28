/* eslint-disable import/order */
import { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle, memo } from 'react';
import type { Ref } from 'react';
import { toast } from 'sonner';
import {
  Background,
  Controls,
  Edge,
  Node,
  NodeMouseHandler,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  NodeChange,
  MiniMap,
  useOnSelectionChange,
  applyNodeChanges,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  ArrowRight,
  ArrowRightCircle, 
  Bell,
  Cable, 
  Database, 
  Maximize,
  Plug, 
  RefreshCw,
  RotateCcw, 
  Save,
  Sparkles, 
  Split, 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { 
  extractLayoutData,
  sequenceToReactFlow
} from '@/lib/sequence-converter';
import { connectSequenceNodes } from '@/lib/sequence-utils';
import { getSequenceLayout, saveSequenceLayout, regenerateSequenceLayout } from '@/api/composer';

import CustomNode from './nodes/CustomNode';
import FluidNodesAnimation from './FluidNodesAnimation';

// Wrapper component to manage animation lifecycle
function AnimationWithReset() {
  const [key, setKey] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // Expose reset method to parent
  const resetAnimation = useCallback(() => {
    // First fade out
    setIsVisible(false);
    
    // After fade completes, change key to force remount and fade in
    setTimeout(() => {
      setKey(prev => prev + 1);
      setIsVisible(true);
    }, 800); // Match fade duration
  }, []);
  
  return (
    <div 
      className="transition-opacity duration-800 ease-in-out w-full h-full" 
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <FluidNodesAnimation key={key} />
    </div>
  );
}

// Export FlowEditor methods interface
export interface FlowEditorMethods {
  fitView: () => void;
  autoLayout: () => Promise<void>;
}

interface FlowEditorProps {
  data: any;
  className?: string;
  onEdit?: (updatedData: any) => void;
  readOnly?: boolean;
}

// Define node types
const nodeTypes = {
  custom: CustomNode,
};

// Helper to get step icon based on type
const getStepIcon = (type: string) => {
  switch (type) {
    case 'prompt': return Sparkles;
    case 'tool': return Cable;
    case 'condition': return Split;
    case 'data': return Database;
    case 'loop': return RotateCcw;
    case 'api': return Plug;
    case 'notification': return Bell;
    case 'input': return ArrowRight;
    default: return ArrowRightCircle;
  }
};

// Flow editor internal component
function Flow({ 
  data, 
  onEdit, 
  readOnly = true,
  flowRef
}: FlowEditorProps & { flowRef?: React.Ref<FlowEditorMethods> }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLayoutSaved, setIsLayoutSaved] = useState(true);
  const { setViewport, fitView, zoomIn, zoomOut } = useReactFlow();
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [layoutData, setLayoutData] = useState<{[key: string]: {x: number, y: number}} | null>(null);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);
  const [localLayoutData, setLocalLayoutData] = useState<{[key: string]: {x: number, y: number}} | null>(null);
  const [initialLayoutLoaded, setInitialLayoutLoaded] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const wasLayoutFitted = useRef(false);
  const layoutLoadAttempts = useRef(0);
  const maxLayoutLoadAttempts = 3;
  const previousSequenceId = useRef<string | null>(null);

  // Track selection changes
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length === 1) {
        setSelectedNodeId(nodes[0].id);
      } else {
        setSelectedNodeId(null);
      }
    }
  });

  // Reset state when sequence changes
  useEffect(() => {
    if (data?.metadata?.id && previousSequenceId.current !== data.metadata.id) {
      // Reset all state for new sequence
      setIsLoadingLayout(true);
      setShowPlaceholder(true);
      setLayoutData(null);
      setLocalLayoutData(null);
      setInitialLayoutLoaded(false);
      setIsInitialRender(true);
      wasLayoutFitted.current = false;
      layoutLoadAttempts.current = 0;
      previousSequenceId.current = data.metadata.id;
    }
  }, [data?.metadata?.id]);

  // Load layout data from the API
  useEffect(() => {
    async function loadLayout() {
      if (!data?.metadata?.id || layoutLoadAttempts.current >= maxLayoutLoadAttempts) {
        setIsLoadingLayout(false);
        setShowPlaceholder(false);
        return;
      }
      
      console.log(`[FlowEditor] Loading layout for sequence ${data.metadata.id}, attempt ${layoutLoadAttempts.current + 1}/${maxLayoutLoadAttempts}`);
      setIsLoadingLayout(true);
      
      try {
        const layout = await getSequenceLayout(data.metadata.id);
        
        // Reset attempts counter on success
        layoutLoadAttempts.current = 0;
        
        // Check if layout has data
        if (layout && layout.layout_data && Object.keys(layout.layout_data).length > 0) {
          console.log(`[FlowEditor] Layout loaded successfully with ${Object.keys(layout.layout_data).length} nodes`);
          setLayoutData(layout.layout_data);
          
          // Only update local layout data on initial load
          if (!initialLayoutLoaded) {
            setLocalLayoutData(layout.layout_data);
            setInitialLayoutLoaded(true);
          }
          
          // Short delay to ensure React has time to process state updates
          setTimeout(() => {
            setIsLoadingLayout(false);
            setShowPlaceholder(false);
            setIsInitialRender(false);
          }, 50);
        } else {
          console.log('[FlowEditor] No layout data returned from API or empty layout');
          layoutLoadAttempts.current++;
          
          if (layoutLoadAttempts.current < maxLayoutLoadAttempts) {
            // Wait longer between retries
            console.log(`[FlowEditor] Retrying in 1.5s (${layoutLoadAttempts.current}/${maxLayoutLoadAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            loadLayout();
          } else {
            // Max retries reached, continue without layout
            console.log('[FlowEditor] Max retries reached, continuing without layout');
            setIsLoadingLayout(false);
            setShowPlaceholder(false);
            setIsInitialRender(false);
          }
        }
      } catch (error) {
        console.error('[FlowEditor] Error loading layout:', error);
        layoutLoadAttempts.current++;
        
        if (layoutLoadAttempts.current < maxLayoutLoadAttempts) {
          // Wait and retry on error
          console.log(`[FlowEditor] Retrying after error in 1.5s (${layoutLoadAttempts.current}/${maxLayoutLoadAttempts})...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
          loadLayout();
        } else {
          // Max retries reached, continue without layout
          console.log('[FlowEditor] Max retries reached after errors, continuing without layout');
          setIsLoadingLayout(false);
          setShowPlaceholder(false);
          setIsInitialRender(false);
        }
      }
    }
    
    if (isInitialRender && data?.metadata?.id) {
      loadLayout();
    }
  }, [data?.metadata?.id, initialLayoutLoaded, isInitialRender]);

  // Create a default layout if none is available after loading attempts
  useEffect(() => {
    if (!isLoadingLayout && !layoutData && !localLayoutData && data?.metadata?.id) {
      console.log('[FlowEditor] Creating default layout as no layout data is available');
      
      // Create a basic layout with nodes arranged vertically
      const steps = data.actions || data.steps || [];
      const defaultLayout: {[key: string]: {x: number, y: number}} = {};
      
      steps.forEach((step: any, index: number) => {
        defaultLayout[step.id] = {
          x: 250,
          y: 100 + (index * 150)
        };
      });
      
      setLayoutData(defaultLayout);
      setLocalLayoutData(defaultLayout);
    }
  }, [isLoadingLayout, layoutData, localLayoutData, data]);

  // Handle editing a step
  const handleStepEdit = useCallback((stepId: string, updatedStepData: any) => {
    if (!onEdit) return;
    
    // Create a new sequence with the updated step
    const updatedData = { ...data };
    
    // Determine if we're updating actions or steps
    if (data.actions) {
      updatedData.actions = data.actions.map((step: any) => 
        step.id === stepId ? { ...step, ...updatedStepData } : step
      );
    } else if (data.steps) {
      updatedData.steps = data.steps.map((step: any) => 
        step.id === stepId ? { ...step, ...updatedStepData } : step
      );
    }
    
    // Call the onEdit callback with the updated sequence
    onEdit(updatedData);
  }, [data, onEdit]);

  // Handle node position changes
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Skip changes during loading state
    if (isLoadingLayout || isInitialRender || showPlaceholder) return;

    // Apply the changes to the nodes
    onNodesChange(changes);
    
    // If there are position changes and we're in editable mode, mark as unsaved
    if (onEdit && !readOnly) {
      const positionChanges = changes.filter(change => change.type === 'position');
      
      // Mark as unsaved if we have position changes
      if (positionChanges.length > 0) {
        setIsLayoutSaved(false);
        
        // Batch update local layout data for ALL position changes
        setLocalLayoutData(prevLocalLayout => {
          if (!prevLocalLayout) {
            // If no local layout exists, create one from current nodes
            const newLayout: {[key: string]: {x: number, y: number}} = {};
            nodes.forEach(node => {
              newLayout[node.id] = {
                x: node.position.x,
                y: node.position.y
              };
            });
            return newLayout;
          }
          
          const updatedLayout = { ...prevLocalLayout };
          positionChanges.forEach(change => {
            if (change.type === 'position' && change.position) {
              updatedLayout[change.id] = {
                x: change.position.x,
                y: change.position.y
              };
            }
          });
          
          return updatedLayout;
        });
      }
    }
  }, [onNodesChange, onEdit, readOnly, nodes, isInitialRender, isLoadingLayout, showPlaceholder]);

  // Prevent interaction during loading
  const onNodeDragStart = useCallback(() => {
    if (isInitialRender || isLoadingLayout || showPlaceholder) {
      return false;
    }
    return true;
  }, [isInitialRender, isLoadingLayout, showPlaceholder]);

  // Convert sequence data to React Flow nodes and edges
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Don't render during loading state
    if (isLoadingLayout || showPlaceholder) {
      return;
    }

    console.log('[FlowEditor] Rendering flow with layout:', {
      hasLayoutData: !!layoutData,
      hasLocalLayoutData: !!localLayoutData,
      isLayoutSaved,
      nodesCount: data.actions?.length || data.steps?.length || 0
    });

    // Use local layout data if available and not saved, otherwise use API layout
    const effectiveLayout = (!isLayoutSaved && localLayoutData) ? localLayoutData : layoutData;

    // Create a working copy of the sequence data
    let updatedData = { ...data };
    const steps = updatedData.actions || updatedData.steps || [];
    
    // Only auto-connect if this is an editable flow and there are multiple steps
    if (!readOnly && onEdit && steps.length >= 2) {
      // Use the utility function to check and connect nodes if needed
      const connectedSteps = connectSequenceNodes(steps);
      
      // Check if connections were actually added/modified
      const needsUpdate = JSON.stringify(steps) !== JSON.stringify(connectedSteps);
      
      if (needsUpdate) {
        // Update the sequence data with connected steps
        if (updatedData.actions) {
          updatedData.actions = connectedSteps;
        } else if (updatedData.steps) {
          updatedData.steps = connectedSteps;
        }
        
        // Call the onEdit callback with the updated sequence
        onEdit(updatedData);
        
        // Show a subtle notification about auto-connection
        toast.info("Nodes automatically connected in logical flow");
      }
    }
    
    // Convert sequence to React Flow format with the effective layout
    const { nodes: newNodes, edges: newEdges } = sequenceToReactFlow(updatedData, effectiveLayout || undefined);
    
    // Add icon and onEdit function to each node
    const nodesWithIcons = newNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        name: node.data.title,  // Map title to name for CustomNode
        icon: getStepIcon(node.data.type),
        stepType: node.data.type, // Map type to stepType for CustomNode
        onEdit: readOnly ? undefined : (stepData: any) => {
          if (onEdit) handleStepEdit(node.id, stepData);
        },
      },
      selected: node.id === selectedNodeId,
    }));

    // Set nodes and edges
    setNodes(nodesWithIcons);
    setEdges(newEdges);

    // Only fit view when needed
    if (!wasLayoutFitted.current) {
      // Use a short delay to ensure nodes are properly rendered
      setTimeout(() => {
        fitView({ padding: 0.2 });
        wasLayoutFitted.current = true;
      }, 100);
    }
  }, [
    data, 
    onEdit, 
    readOnly, 
    setNodes, 
    setEdges, 
    fitView, 
    selectedNodeId, 
    handleStepEdit, 
    layoutData, 
    isLoadingLayout, 
    showPlaceholder,
    localLayoutData, 
    isLayoutSaved
  ]);

  const handleNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    
    // Update selected state for nodes
    setNodes((nds) =>
      applyNodeChanges(
        nds.map((n) => ({
          id: n.id,
          type: 'select',
          selected: n.id === node.id,
        })),
        nds
      )
    );
  }, [setNodes]);

  // Save layout explicitly
  const saveLayout = useCallback(async () => {
    if (!readOnly && data?.metadata?.id) {
      try {
        // Extract current layout from nodes
        const currentLayout = extractLayoutData(nodes);
        
        // Save to backend
        await saveSequenceLayout(data.metadata.id, currentLayout);
        
        // Update local state
        setLayoutData(currentLayout);
        setLocalLayoutData(currentLayout);
        setIsLayoutSaved(true);
        
        toast.success("Layout saved successfully");
      } catch (error) {
        console.error("Failed to save layout:", error);
        toast.error("Failed to save layout");
      }
    }
  }, [data?.metadata?.id, nodes, readOnly]);

  // Handle pane click to deselect
  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
    
    // Clear node selection
    setNodes((nds) =>
      applyNodeChanges(
        nds.map((n) => ({
          id: n.id,
          type: 'select',
          selected: false,
        })),
        nds
      )
    );
  }, [setNodes]);
  
  // Handle auto-layout - regenerate layout using the backend algorithm
  const handleAutoLayout = useCallback(async () => {
    if (!data || Object.keys(data).length === 0) return;
    
    // Only proceed if we have a sequence ID
    if (!data?.metadata?.id) {
      toast.error("Cannot regenerate layout - no sequence ID found");
      return;
    }
    
    // Show loading toast
    const loadingToast = toast.loading("Regenerating layout...");
    
    try {
      // Call the API to regenerate the layout
      const newLayout = await regenerateSequenceLayout(data.metadata.id);
      
      if (!newLayout || !newLayout.layout_data) {
        toast.error("Failed to regenerate layout");
        toast.dismiss(loadingToast);
        return;
      }
      
      // Update local state with the new layout
      setLayoutData(newLayout.layout_data);
      setLocalLayoutData(newLayout.layout_data);
      setIsLayoutSaved(true);
      
      // Short delay to ensure the layout is updated
      setTimeout(() => {
        // Fit view to show the new layout
        fitView({ padding: 0.2 });
        
        // Update wasLayoutFitted so it doesn't trigger another fit
        wasLayoutFitted.current = true;
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Layout regenerated successfully");
      }, 100);
    } catch (error) {
      console.error("Failed to regenerate layout:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to regenerate layout");
    }
  }, [data, fitView, setLayoutData, setLocalLayoutData]);

  // Expose fitView and autoLayout methods via ref
  const fitContent = useCallback(() => {
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 200 });
      wasLayoutFitted.current = true;
    });
  }, [fitView]);

  // Expose methods via ref
  useImperativeHandle(flowRef, () => ({
    fitView: fitContent,
    autoLayout: handleAutoLayout
  }), [fitContent, handleAutoLayout]);

  // Add loading placeholder
  if (showPlaceholder || isLoadingLayout) {
    // Only show loading spinner if data is actually present
    if (data && Object.keys(data).length > 0) {
      return (
        <div className="size-full flex items-center justify-center bg-muted/20">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="size-12 text-muted-foreground animate-spin" />
            <p className="text-sm text-muted-foreground">Loading sequence layout...</p>
          </div>
        </div>
      );
    } else {
      // If no data, show the placeholder
      return (
        <div className="size-full flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <div className="mx-auto mb-4">
              <AnimationWithReset />
            </div>
            <h3 className="text-lg font-medium">No Sequence Selected</h3>
            <p className="text-sm">Pick a sequence from the list or create a new one</p>
          </div>
        </div>
      );
    }
  }

  // If data is null/empty after loading checks, also show placeholder
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="size-full flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground">
          <div className="mx-auto mb-4">
            <AnimationWithReset />
          </div>
          <h3 className="text-lg font-medium">No Sequence Selected</h3>
          <p className="text-sm">Pick a sequence from the list or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={1.5}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onNodeDragStart={onNodeDragStart}
        fitView={false}
        fitViewOptions={{ padding: 0.2 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        proOptions={{ 
          hideAttribution: true,
          account: 'paid-pro'
        }}
        className="react-flow-container"
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
          animated: false
        }}
        nodesDraggable={!readOnly}
        nodesConnectable={false}
        elementsSelectable={!readOnly}
        snapToGrid={false}
        snapGrid={[15, 15]}
        deleteKeyCode={null}
      >
        <Controls 
          position="bottom-right" 
          showInteractive={false}
          className="m-2"
        />
        <Background 
          gap={16} 
          size={1} 
          color="currentColor" 
          className="bg-muted/20"
        />
        
        {/* Only render MiniMap when showMiniMap is true */}
        {showMiniMap && (
          <MiniMap
            nodeStrokeWidth={3}
            nodeColor={(node) => {
              if (node.data?.isStartNode) return '#22c55e';
              if (node.data?.isEndNode) return '#a855f7';
              return '#94a3b8';
            }}
            maskColor="rgba(0, 0, 0, 0.05)"
            className="border bg-background rounded-lg shadow-sm"
          />
        )}
        
        <Panel position="top-right" className="flex flex-col gap-2 m-2">
          <TooltipProvider>
            <div className="bg-background border rounded-lg shadow-sm p-1 flex flex-col gap-1 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 w-full flex items-center justify-center gap-1"
                    onClick={() => fitView({ padding: 0.2 })}
                  >
                    <Maximize className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Fit diagram to view</TooltipContent>
              </Tooltip>
              
              <div className="w-full h-px bg-border my-1" />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => zoomIn()}
                    aria-label="Zoom in"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Zoom in</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => zoomOut()}
                    aria-label="Zoom out"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Zoom out</TooltipContent>
              </Tooltip>

              <div className="w-full h-px bg-border my-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`size-8 ${showMiniMap ? 'bg-accent' : ''}`}
                    onClick={() => setShowMiniMap(!showMiniMap)}
                    aria-label="Toggle minimap"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <rect x="8" y="8" width="8" height="8" rx="1" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Toggle minimap</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={handleAutoLayout}
                    aria-label="Auto-layout"
                  >
                    <RefreshCw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Auto-layout (reorganize nodes)</TooltipContent>
              </Tooltip>
              
              {!isLayoutSaved && onEdit && !readOnly && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 w-full flex items-center justify-center gap-1 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700"
                      onClick={saveLayout}
                      aria-label="Save layout"
                    >
                      <Save className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Save current node positions</TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Create memoized component with forwardRef
const MemoizedFlow = memo(forwardRef<FlowEditorMethods, FlowEditorProps>((props, ref) => (
  <Flow {...props} flowRef={ref} />
)));
MemoizedFlow.displayName = 'MemoizedFlow';

// Wrapper component with ReactFlowProvider using forwardRef
export const FlowEditor = forwardRef<FlowEditorMethods, FlowEditorProps>(
  (props, ref) => (
    <div className={`size-full ${props.className}`}>
      <ReactFlowProvider>
        <MemoizedFlow {...props} ref={ref} />
      </ReactFlowProvider>
    </div>
  )
);
FlowEditor.displayName = 'FlowEditor'; 