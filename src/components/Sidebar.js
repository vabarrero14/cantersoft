import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List, ListItemButton, ListItemText, Divider, ListItem,
  Collapse, ListItemIcon
} from '@mui/material';
import {
  ShoppingCart, Inventory, CreditCard,
  ExpandLess, ExpandMore, List as ListIcon, AddBox,
  Category, People, Group, Sell, Label
} from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation();
  const [openStock, setOpenStock] = useState(false);
  const [openStockSubmenu, setOpenStockSubmenu] = useState({
    productos: false,
    categorias: false,
    marcas: false
  });
  const [openCompras, setOpenCompras] = useState(false);
  const [openClientes, setOpenClientes] = useState(false);
  const [openVentas, setOpenVentas] = useState(false);
  const [openProveedores, setOpenProveedores] = useState(false);

  const isActive = (path) =>
    location.pathname === path ? { backgroundColor: '#d3d3d3' } : {};

  const toggleStockSubmenu = (menu) => {
    setOpenStockSubmenu({
      ...openStockSubmenu,
      [menu]: !openStockSubmenu[menu]
    });
  };

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
          <ListItemButton onClick={() => setOpenCompras(!openCompras)}>
            <ShoppingCart sx={{ marginRight: 2 }} />
            <ListItemText primary="Compras" />
            {openCompras ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCompras} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={Link} to="/compras" sx={{ pl: 4, ...isActive('/compras') }}>
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton component={Link} to="/compras/nueva" sx={{ pl: 4, ...isActive('/compras/nueva') }}>
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary="Agregar" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider />

        {/* Stock - Módulo principal */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenStock(!openStock)}>
            <Inventory sx={{ marginRight: 2 }} />
            <ListItemText primary="Stock" />
            {openStock ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openStock} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            
            {/* Productos */}
            <ListItemButton onClick={() => toggleStockSubmenu('productos')}>
              <ListItemIcon><Inventory /></ListItemIcon>
              <ListItemText primary="Productos" />
              {openStockSubmenu.productos ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStockSubmenu.productos} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton component={Link} to="/stock/listado" sx={{ pl: 6, ...isActive('/stock/listado') }}>
                  <ListItemText primary="Listado" />
                </ListItemButton>
                <ListItemButton component={Link} to="/stock/nuevo" sx={{ pl: 6, ...isActive('/stock/nuevo') }}>
                  <ListItemText primary="Agregar" />
                </ListItemButton>
              </List>
            </Collapse>

            {/* Categorías */}
            <ListItemButton onClick={() => toggleStockSubmenu('categorias')}>
              <ListItemIcon><Category /></ListItemIcon>
              <ListItemText primary="Categorías" />
              {openStockSubmenu.categorias ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStockSubmenu.categorias} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton component={Link} to="/stock/categorias" sx={{ pl: 6, ...isActive('/stock/categorias') }}>
                  <ListItemText primary="Listado" />
                </ListItemButton>
                <ListItemButton component={Link} to="/stock/categorias/nueva" sx={{ pl: 6, ...isActive('/stock/categorias/nueva') }}>
                  <ListItemText primary="Agregar" />
                </ListItemButton>
              </List>
            </Collapse>

            {/* Marcas */}
            <ListItemButton onClick={() => toggleStockSubmenu('marcas')}>
              <ListItemIcon><Label /></ListItemIcon>
              <ListItemText primary="Marcas" />
              {openStockSubmenu.marcas ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStockSubmenu.marcas} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton component={Link} to="/stock/marcas" sx={{ pl: 6, ...isActive('/stock/marcas') }}>
                  <ListItemText primary="Listado" />
                </ListItemButton>
                <ListItemButton component={Link} to="/stock/marcas/nueva" sx={{ pl: 6, ...isActive('/stock/marcas/nueva') }}>
                  <ListItemText primary="Agregar" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Collapse>
        <Divider />

        {/* Ventas */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenVentas(!openVentas)}>
            <Sell sx={{ marginRight: 2 }} />
            <ListItemText primary="Ventas" />
            {openVentas ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openVentas} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={Link} to="/ventas" sx={{ pl: 4, ...isActive('/ventas') }}>
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton component={Link} to="/ventas/nuevo" sx={{ pl: 4, ...isActive('/ventas/nuevo') }}>
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary="Agregar venta" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider />

        {/* Caja */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/caja" sx={isActive('/caja')}>
            <CreditCard sx={{ marginRight: 2 }} />
            <ListItemText primary="Caja" />
          </ListItemButton>
        </ListItem>
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
            <ListItemButton component={Link} to="/proveedores" sx={{ pl: 4, ...isActive('/proveedores') }}>
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton component={Link} to="/proveedores/nuevo" sx={{ pl: 4, ...isActive('/proveedores/nuevo') }}>
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary="Agregar" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider />

        {/* Clientes */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenClientes(!openClientes)}>
            <Group sx={{ marginRight: 2 }} />
            <ListItemText primary="Clientes" />
            {openClientes ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openClientes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={Link} to="/clientes" sx={{ pl: 4, ...isActive('/clientes') }}>
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton component={Link} to="/clientes/nuevo" sx={{ pl: 4, ...isActive('/clientes/nuevo') }}>
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