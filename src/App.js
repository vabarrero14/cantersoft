import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { Box, CssBaseline } from '@mui/material';

const App = () => {
  const [open, setOpen] = useState(true);

  return (
    <AuthProvider>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar open={open} handleDrawerToggle={() => setOpen(!open)} />
        <Content /> {/* Aquí vivirán todas tus rutas */}
      </Box>
    </AuthProvider>
  );
};

export default App;