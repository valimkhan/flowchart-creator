import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useEdgesState,
  useNodesState,
  MarkerType,
  useNodes 
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css'; // Custom CSS for shapes
import { StartNode, StopNode, ProcessNode, InputOutputNode, DecisionNode } from './Components/CustomNodes';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

let id = 0;
const getId = () => `node_${id++}`;

const style = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  zIndex: 10,
  backgroundColor: '#1976d2', // Primary color
  color: 'white',
  transition: '0.3s', // Transition for hover effect
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Shadow
};

function FlowChartApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [openModal, setOpenModal] = useState(false);

  // Memoize nodeTypes to avoid recreating it on each render
  const nodeTypes = useMemo(() => ({
    Start: StartNode,
    Stop: StopNode,
    Process: ProcessNode,
    InputOutput: InputOutputNode,
    Decision: DecisionNode,
  }), []);

  // Handle adding nodes based on shape type
  const addNode = useCallback((type) => {
    const newNode = {
      id: getId(),
      position: { x: 150, y: 150 },
      data: { label: `${type}`, editable: true, onDelete: handleDeleteNode },  // Editable data
      type,
    };
    setNodes((nds) => [...nds, newNode]);
    setOpenModal(false);  // Close modal after adding node
  }, [setNodes]);


   // Handle deleting nodes
   const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId)); // Remove the node
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)); // Remove related edges
  }, [setNodes, setEdges]);
  

  const onConnect = useCallback(
    (params) => {
      
      let edgeLabel;
  
      // Determine the edge label based on the source handle
      if (params.sourceHandle === 'b-dec') {
        edgeLabel = 'No';
      } else if (params.sourceHandle === 'c-dec') {
        edgeLabel = 'Yes';
      }
      
  
      // Create the edge with the appropriate label if applicable
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            label: edgeLabel, // Set the label
          },
          eds
        )
      );
    },
    [setEdges]
  );
  

  const onEdgeDoubleClick = useCallback((event, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [setEdges]);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* Circular Add Node Button */}
      <IconButton
        style={{
          ...style,
          borderRadius: '50%',  // Circular shape
          width: 56,
          height: 56,
          '&:hover': {
            transform: 'scale(1.05)', // Scale effect on hover
            boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)', // Increased shadow on hover
          },
        }}
        onClick={() => setOpenModal(true)}
        aria-label="add"
      >
        <AddIcon fontSize="large" />
      </IconButton>

      {/* Dialog for node selection */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
          Select Node Type
          <IconButton
            aria-label="close"
            onClick={() => setOpenModal(false)}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Button onClick={() => addNode('Start')} fullWidth variant="outlined" sx={{ mb: 1 }}>
            Start Node
          </Button>
          <Button onClick={() => addNode('Stop')} fullWidth variant="outlined" sx={{ mb: 1 }}>
            Stop Node
          </Button>
          <Button onClick={() => addNode('Process')} fullWidth variant="outlined" sx={{ mb: 1 }}>
            Process Node
          </Button>
          <Button onClick={() => addNode('InputOutput')} fullWidth variant="outlined" sx={{ mb: 1 }}>
            Input/Output Node
          </Button>
          <Button onClick={() => addNode('Decision')} fullWidth variant="outlined">
            Decision Node
          </Button>
        </DialogContent>
      </Dialog>

      {/* React Flow component */}
      <div style={{ height: '100%', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FlowChartApp;
