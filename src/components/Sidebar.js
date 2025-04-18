import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List, ListItemButton, ListItemText, Divider, ListItem,
  Collapse, ListItemIcon
} from '@mui/material';
import {
  ShoppingCart, Inventory, Receipt, CreditCard,
  ExpandLess, ExpandMore, List as ListIcon, AddBox,
  Category, People, Group
} from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation();
  const [openStock, setOpenStock] = useState(false);
  const [openCategorias, setOpenCategorias] = useState(false);
  const [openProveedores, setOpenProveedores] = useState(false);
  const [openCompras, setOpenCompras] = useState(false);
  const [openClientes, setOpenClientes] = useState(false);
  const [openVentas, setOpenVentas] = useState(false);
  const [openMarcas, setOpenMarcas] = useState(false); // NUEVO estado para Marcas

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
            <ListItemButton component={Link} to="/stock/listado" sx={{ pl: 4, ...isActive('/stock/listado') }}>
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton component={Link} to="/stock/nuevo" sx={{ pl: 4, ...isActive('/stock/nuevo') }}>
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary="Agregar producto" />
            </ListItemButton>
            <ListItemButton component={Link} to="/stock/MovimientosProductos" sx={{ pl: 4, ...isActive('/stock/MovimientosProductos') }}>
              <ListItemIcon><Receipt /></ListItemIcon>
              <ListItemText primary="Movimientos" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider />

        {/* Ventas */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenVentas(!openVentas)}>
            <Receipt sx={{ marginRight: 2 }} />
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

        {/* Categorías */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenCategorias(!openCategorias)}>
            <Category sx={{ marginRight: 2 }} />
            <ListItemText primary="Categorías de Productos" />
            {openCategorias ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCategorias} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={Link} to="/categorias" sx={{ pl: 4, ...isActive('/categorias') }}>
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton component={Link} to="/categorias/nueva" sx={{ pl: 4, ...isActive('/categorias/nueva') }}>
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary="Agregar" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider />

        {/* Marcas */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenMarcas(!openMarcas)}>
            <Category sx={{ marginRight: 2 }} />
            <ListItemText primary="Marcas de Productos" />
            {openMarcas ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMarcas} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={Link} to="/marcas" sx={{ pl: 4, ...isActive('/marcas') }}>
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Listado" />
            </ListItemButton>
            <ListItemButton component={Link} to="/marcas/nueva" sx={{ pl: 4, ...isActive('/marcas/nueva') }}>
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
