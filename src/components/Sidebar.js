// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItemButton, ListItemText, Divider, ListItem } from '@mui/material';
import { ShoppingCart, Inventory, Receipt, CreditCard } from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation(); // Hook para obtener la ruta actual

  // Función para resaltar el item activo
  const isActive = (path) => location.pathname === path ? { backgroundColor: '#1976d2', color: '#fff' } : {};

  return (
    <div style={{ width: 250, height: '100vh', backgroundColor: '#fafafa', borderRight: '1px solid #ddd' }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
            <ListItemText primary="CanterSoft" />
          </ListItemButton>
        </ListItem>
        <Divider />
        
        {/* Enlace a Compras */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/compras" sx={isActive('/compras')}>
            <ShoppingCart sx={{ marginRight: 2 }} />
            <ListItemText primary="Compras" />
          </ListItemButton>
        </ListItem>
        <Divider />
        
        {/* Enlace a Stock */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/stock" sx={isActive('/stock')}>
            <Inventory sx={{ marginRight: 2 }} />
            <ListItemText primary="Stock" />
          </ListItemButton>
        </ListItem>
        <Divider />
        
        {/* Enlace a Ventas */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/ventas" sx={isActive('/ventas')}>
            <Receipt sx={{ marginRight: 2 }} />
            <ListItemText primary="Ventas" />
          </ListItemButton>
        </ListItem>
        <Divider />
        
        {/* Enlace a Caja */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/caja" sx={isActive('/caja')}>
            <CreditCard sx={{ marginRight: 2 }} />
            <ListItemText primary="Caja" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
