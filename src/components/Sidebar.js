import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Avatar,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalOffer as BrandIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  PointOfSale as PointOfSaleIcon,
  Receipt as ReceiptIcon,
  ExitToApp as ExitToAppIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();
  const { currentUser } = useAuth();

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Productos', path: '/stock/listado', icon: <InventoryIcon /> },
    { text: 'Categorías', path: '/categorias', icon: <CategoryIcon /> },
    { text: 'Marcas', path: '/marcas', icon: <BrandIcon /> },
    { text: 'Proveedores', path: '/proveedores', icon: <PeopleIcon /> },
    { text: 'Compras', path: '/compras', icon: <ShoppingCartIcon /> },
    { text: 'Clientes', path: '/clientes', icon: <PeopleIcon /> },
    { text: 'Ventas', path: '/ventas', icon: <ReceiptIcon /> },
    { text: 'Caja', path: '/caja', icon: <PointOfSaleIcon /> }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar,
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Cantersoft
        </Typography>
        <IconButton onClick={handleDrawerToggle} color="inherit">
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
      <Divider />

      {/* Perfil del usuario */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar
          sx={{ 
            width: 64, 
            height: 64, 
            margin: '0 auto 8px',
            bgcolor: theme.palette.secondary.main 
          }}
        >
          {currentUser?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1">
          {currentUser?.email}
        </Typography>
        <Typography variant="caption">
          {currentUser?.roles?.join(', ') || 'Usuario'}
        </Typography>
      </Box>
      <Divider />

      {/* Menú principal */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname.includes(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />

      {/* Cerrar sesión */}
      <List>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;