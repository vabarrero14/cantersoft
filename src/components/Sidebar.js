import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List, ListItemButton, ListItemText, Divider, ListItem,
  Collapse, ListItemIcon
} from '@mui/material';
import {
  ShoppingCart, Inventory, Receipt, CreditCard,
  ExpandLess, ExpandMore, List as ListIcon, AddBox, Category, People
} from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation();
  const [openStock, setOpenStock] = useState(true);
  const [openCategorias, setOpenCategorias] = useState(false);
  const [openProveedores, setOpenProveedores] = useState(false);

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

        {/* Stock */}
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
        <Divider />

        {/* Categorías */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenCategorias(!openCategorias)}>
            <Category sx={{ marginRight: 2 }} />
            <ListItemText primary="Categorías" />
            {openCategorias ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCategorias} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/categorias"
              sx={{ pl: 4, ...isActive('/categorias') }}
            >
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/categorias/nueva"
              sx={{ pl: 4, ...isActive('/categorias/nueva') }}
            >
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary="Agregar" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider />

        {/* Proveedores */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenProveedores(!openProveedores)}>
            <People sx={{ marginRight: 2 }} />
            <ListItemText primary="Proveedores" />
            {openProveedores ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openProveedores} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/proveedores"
              sx={{ pl: 4, ...isActive('/proveedores') }}
            >
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/proveedores/nuevo"
              sx={{ pl: 4, ...isActive('/proveedores/nuevo') }}
            >
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary="Agregar" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default Sidebar;
