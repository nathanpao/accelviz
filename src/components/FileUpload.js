/**
 * File Upload Component
 * Handles .txt file upload and triggers data parsing
 */

import React, { useRef } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

function FileUpload({ onFileLoaded }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.txt')) {
      alert('Please upload a .txt file');
      return;
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      onFileLoaded({
        fileName: file.name,
        content: content,
        size: file.size,
        lastModified: new Date(file.lastModified)
      });
    };
    reader.onerror = () => {
      alert('Error reading file');
    };
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Paper
      sx={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f7f9fc',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#e8f0fe',
          borderColor: '#0072BD'
        }
      }}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt"
        style={{ display: 'none' }}
      />
      <UploadFileIcon sx={{ fontSize: 60, color: '#0072BD', marginBottom: '10px' }} />
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Upload Accelerometer Data File
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '20px' }}>
        Click to browse or drag and drop a .txt file
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
        onClick={(e) => {
          e.stopPropagation();
          handleButtonClick();
        }}
      >
        Select File
      </Button>
    </Paper>
  );
}

export default FileUpload;
