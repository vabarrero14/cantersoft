// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List, ListItemButton, ListItemText, Divider, ListItem,
  Collapse, ListItemIcon
} from '@mui/material';
import {
  ShoppingCart, Inventory, Receipt, CreditCard,
  ExpandLess, ExpandMore, List as ListIcon, AddBox
} from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation();
  const [openStock, setOpenStock] = useState(true);

  const isActive = (path) =>
    location.pathname === path ? { backgroundColor: '#d3d3d3' } : {};

  return (
    <div style={{ width: 250, height: '100vh', backgroundColor: '#fafafa' }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
            <ListItemText primary="CanterSoft" />
          </ListItemButton>
        </ListItem>
        <Divider />

        {/* Compras */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/compras" sx={isActive('/compras')}>
            <ShoppingCart sx={{ marginRight: 2 }} />
            <ListItemText primary="Compras" />
          </ListItemButton>
        </ListItem>
        <Divider />

        {/* Stock (menú desplegable) */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenStock(!openStock)}>
            <Inventory sx={{ marginRight: 2 }} />
            <ListItemText primary="Stock" />
            {openStock ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openStock} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/stock/listado"
              sx={{ pl: 4, ...isActive('/stock/listado') }}
            >
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/stock/nuevo"
              sx={{ pl: 4, ...isActive('/stock/nuevo') }}
            >
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary="Agregar producto" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider />

        {/* Ventas */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/ventas" sx={isActive('/ventas')}>
            <Receipt sx={{ marginRight: 2 }} />
            <ListItemText primary="Ventas" />
          </ListItemButton>
        </ListItem>
        <Divider />

        {/* Caja */}
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
