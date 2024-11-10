import React, { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useEdgesState,
  useNodesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css'; // Custom CSS for shapes
import { StartNode, StopNode, ProcessNode, InputOutputNode, DecisionNode } from './Components/CustomNodes';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { toPng } from 'html-to-image';
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
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [chartName, setChartName] = useState('');
  const [loadMenuOpen, setLoadMenuOpen] = useState(false);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [availableCharts, setAvailableCharts] = useState([]);

  const nodeTypes = useMemo(() => ({
    Start: StartNode,
    Stop: StopNode,
    Process: ProcessNode,
    InputOutput: InputOutputNode,
    Decision: DecisionNode,
  }), []);
  useEffect(() => {
    updateAvailableCharts(); // Load available charts when component mounts
  }, []);
  const addNode = useCallback((type) => {
    const newNode = {
      id: getId(),
      position: { x: 150, y: 150 },
      data: { label: `${type}`, editable: true, onDelete: handleDeleteNode },
      type,
    };
    setNodes((nds) => [...nds, newNode]);
    setOpenModal(false);
  }, [setNodes]);

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const onConnect = useCallback((params) => {
    let edgeLabel;
    if (params.sourceHandle === 'b-dec') edgeLabel = 'No';
    else if (params.sourceHandle === 'c-dec') edgeLabel = 'Yes';

    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed },
          label: edgeLabel,
        },
        eds
      )
    );
  }, [setEdges]);

  const onEdgeDoubleClick = useCallback((event, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [setEdges]);

  // Save the flowchart to local storage
  const handleSave = () => {
    if (!chartName) {
      alert('Please enter a chart name.');
      return;
    }
    const flow = { nodes, edges };
    localStorage.setItem(chartName, JSON.stringify(flow));

    //setChartName(''); // Clear chart name after saving
    updateAvailableCharts(); // Update available charts list
    setSaveMenuOpen(false);

    alert(`Flowchart '${chartName}' saved successfully!`);
  };

  // Load the flowchart from local storage
  const handleLoad = (name) => {
    const loadedFlow = JSON.parse(localStorage.getItem(name));
    if (loadedFlow) {
      setNodes(loadedFlow.nodes);
      setEdges(loadedFlow.edges);
      alert(`Flowchart '${name}' loaded!`);
      setLoadMenuOpen(false); // Close the load menu after loading
      setChartName(name);
    } else {
      alert('No saved flowchart found!');
    }
  };


  const handleLoadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedFlow = JSON.parse(e.target.result);
          if (loadedFlow.nodes && loadedFlow.edges) {
            setNodes(loadedFlow.nodes);
            setEdges(loadedFlow.edges);
            alert("Flowchart loaded from file!");
            setLoadMenuOpen(false); // Close the load menu after loading
          } else {
            alert("Invalid file format: JSON must contain nodes and edges.");
          }
        } catch (error) {
          alert("Failed to load file: Invalid JSON format.");
        }
      };
      reader.readAsText(file);
    } else {
      alert("No file selected.");
    }
  };

  // Update available charts list from local storage
  const updateAvailableCharts = () => {
    const keys = Object.keys(localStorage);
    setAvailableCharts(keys);
  };

  // Open/close the menu
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Create a new chart
  const handleNewChart = () => {
    setNodes([]);
    setEdges([]);
    setChartName(''); // Clear chart name
    alert('New chart created successfully!');
    handleMenuClose();
  };
  // Export the flowchart as JSON
  const handleExportJSON = () => {
    const flow = { nodes, edges };
    const json = JSON.stringify(flow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowchart.json';
    a.click();
    URL.revokeObjectURL(url);
  };


  function exportChartAsImage() {
    toPng(document.querySelector('.react-flow__viewport'), {backgroundColor: '#ffffff',})
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        const fileName = chartName ? `${chartName}.png` : 'flowchart.png';
        link.download = fileName;
        link.click();
      })
      .catch((err) => {
        console.error('Error exporting chart as image:', err);
      });
  }

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* Menu Button */}
      <IconButton onClick={handleMenuClick} style={{ position: 'absolute', top: 20, right: 20, zIndex: 500 }}>
        <MenuIcon />
      </IconButton>

      {/* Menu for options */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleNewChart}>New Chart</MenuItem>
        <MenuItem onClick={() => { setLoadMenuOpen(true); handleMenuClose(); }}>Load</MenuItem>
        <MenuItem onClick={() => { setSaveMenuOpen(true); handleMenuClose(); }}>Save</MenuItem>
        <MenuItem onClick={() => {exportChartAsImage(); handleMenuClose();}}>Export as Image</MenuItem>
        <MenuItem onClick={() => { handleExportJSON(); handleMenuClose(); }}>Export JSON</MenuItem>
      </Menu>

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

      {/* Load Chart Dialog */}
      <Dialog open={loadMenuOpen} onClose={() => setLoadMenuOpen(false)}>
        <DialogTitle>Load Chart</DialogTitle>
        <DialogContent>
          <div>
            <strong>Available Charts:</strong>
            <ul>
              {availableCharts.map((name) => (
                <li key={name}>
                  <Button onClick={() => handleLoad(name)}>{name}</Button>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleLoad} color="primary">
            Load JSON
          </Button> */}
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleLoadFromFile}
              style={{
                opacity: 0,             // Hide the actual file input
                position: "absolute",    // Remove it from the flow of the document
                width: 115,           // Full width for accessibility
                height: 35,          // Full height for accessibility
                zIndex: 1,               // Ensure it's on top to capture clicks
              }}
            />

            <button style={{
              padding: "8px 16px",
              fontSize: "16px",
              backgroundColor: "#007bff", // Button color
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              position: "relative",       // Ensures button and input align
            }}>
              Load JSON
            </button>

          </div>
          {/* <input type="file" accept=".json" onChange={handleLoadFromFile} /> */}
          <Button onClick={() => setLoadMenuOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>



      {/* Save Chart Dialog */}
      <Dialog open={saveMenuOpen} onClose={() => setSaveMenuOpen(false)}>
        <DialogTitle>Save Chart</DialogTitle>
        <DialogContent>
          <TextField
            label="Chart Name"
            value={chartName}
            onChange={(e) => setChartName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
          <Button onClick={() => setSaveMenuOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
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
