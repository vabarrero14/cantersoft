// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { Box, CssBaseline, Typography } from '@mui/material';

const App = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" >
            
          </Typography>
          <Content />
        </Box>
      </Box>
    </Router>
  );
};

export default App;
