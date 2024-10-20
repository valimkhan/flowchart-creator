import React, { useState } from 'react';
import TextField from '@mui/material/TextField'; // Importing TextField from Material UI
import { Handle } from 'reactflow';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import delete icon
import '../App.css'; // The same CSS for custom node shapes

// Custom Start Node (only source handle at the bottom)
export function StartNode({ id, data }) {
  const [label, setLabel] = useState(data.label);
  const [open, setOpen] = useState(false);

  const handleLabelClick = () => {
    setOpen(true);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleClose = () => {
    // console.error(onDelete)s
    setOpen(false);

  };

  const handleDelete = () => {
    data.onDelete(id); // Call the delete function with the node ID
    handleClose(); // Close the modal after deletion
  };

  return (
    
    <div className="start-node">
      <div
        onClick={handleLabelClick} // Open modal on label click
        style={{ textAlign: 'center', padding: '5px', cursor: 'pointer' }} // Optional styling for better UX
      >
        {label}
      </div>
      <Handle type="source" position="bottom" id="a" />

      {/* Modal for editing the label */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Label</DialogTitle>
        <DialogContent>
          <TextField
            value={label}
            onChange={handleLabelChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </DialogContent>
        <DialogActions  style={{ justifyContent: 'space-between' }}>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Custom Stop Node (only target handle at the top)
export function StopNode({ id, data }) {
  const [label, setLabel] = useState(data.label);
  const [open, setOpen] = useState(false);

  const handleLabelClick = () => {
    setOpen(true);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    data.onDelete(id);
    handleClose();
  };

  return (
    <div className="stop-node">
      <div
        onClick={handleLabelClick}
        style={{ cursor: 'pointer' }}
      >
        {label}
      </div>
      <Handle type="target" position="top" id="b" />

      {/* Modal for editing the label */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Label</DialogTitle>
        <DialogContent>
          <TextField
            value={label}
            onChange={handleLabelChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-between' }}>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Process Node (Editable label)
export function ProcessNode({ id, data }) {
  const [label, setLabel] = useState(data.label);
  const [open, setOpen] = useState(false);

  const handleLabelClick = () => {
    setOpen(true);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    data.onDelete(id);
    handleClose();
  };

  return (
    <div className="process-node">
      <div
        onClick={handleLabelClick}
        style={{ cursor: 'pointer' }}
      >
        {label}
      </div>
      <Handle type="source" position="bottom" id="a" />
      <Handle type="target" position="top" id="b" />

      {/* Modal for editing the label */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Label</DialogTitle>
        <DialogContent>
          <TextField
            value={label}
            onChange={handleLabelChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-between' }}>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Custom Input/Output Node (Parallelogram)
export function InputOutputNode({ id, data }) {
  const [label, setLabel] = useState(data.label);
  const [open, setOpen] = useState(false);

  const handleLabelClick = () => {
    setOpen(true);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    data.onDelete(id);
    handleClose();
  };

  return (
    <div className="input-output-node">
      <div
        onClick={handleLabelClick}
        style={{ cursor: 'pointer' }}
      >
        {label}
      </div>
      <Handle type="source" position="bottom" id="a" />
      <Handle type="target" position="top" id="b" />

      {/* Modal for editing the label */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Label</DialogTitle>
        <DialogContent>
          <TextField
            value={label}
            onChange={handleLabelChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-between' }}>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Custom Decision Node (Diamond with three handles)
export function DecisionNode({ id, data }) {
  const [label, setLabel] = useState(data.label);
  const [open, setOpen] = useState(false);

  const handleLabelClick = () => {
    setOpen(true);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    data.onDelete(id);
    handleClose();
  };

  return (
    <div className="decision-node">
      <div
        onClick={handleLabelClick}
        style={{ cursor: 'pointer' }}
      >
        {label}
      </div>
      <Handle type="target" position="top" id="a" style={{ top: '-5%', left: '-5%' }} />
      <Handle type="source" position="left" id="b-dec" style={{ left: '-5%', top: '96%' }} />
      <Handle type="source" position="right" id="c-dec" style={{ right: '-4%', top: '-5%' }} />

      {/* Modal for editing the label */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Label</DialogTitle>
        <DialogContent>
          <TextField
            value={label}
            onChange={handleLabelChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-between' }}>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
