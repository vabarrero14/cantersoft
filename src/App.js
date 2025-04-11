// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { Box, CssBaseline, Typography } from '@mui/material';
import app from './firebase/config';

const App = () => {
  useEffect(() => {
    console.log("🔥 Firebase conectado:", app.name);
  }, []);

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">
            {/* Título del módulo activo o general */}
          </Typography>
          <Content />
        </Box>
      </Box>
    </Router>
  );
};

export default App;
