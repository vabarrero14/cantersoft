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
  Typography,
  Box,
  Avatar,
  IconButton,
  useTheme,
  styled
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

const drawerWidth = 260;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    borderRight: 'none',
    boxShadow: theme.shadows[3]
  },
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  height: 64,
}));

const MenuItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0, 1.5),
  padding: theme.spacing(1, 2),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    }
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'all 0.2s ease-in-out',
}));

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
    <StyledDrawer
      variant="persistent"
      anchor="left"
      open={open}
    >
      <SidebarHeader>
        <Typography variant="h6" fontWeight="bold">
          Cantersoft
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle} 
          color="inherit"
          size="small"
        >
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </SidebarHeader>

      {/* Perfil del usuario */}
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Avatar
          sx={{ 
            width: 72, 
            height: 72, 
            margin: '0 auto 12px',
            bgcolor: theme.palette.primary.main,
            fontSize: '2rem',
            fontWeight: 'bold'
          }}
        >
          {currentUser?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="medium">
          {currentUser?.email}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {currentUser?.roles?.join(', ') || 'Usuario'}
        </Typography>
      </Box>

      {/* Menú principal */}
      <Box sx={{ p: 1.5, flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => (
            <MenuItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname.startsWith(item.path)}
            >
              <ListItemIcon sx={{ 
                color: location.pathname.startsWith(item.path) 
                  ? theme.palette.primary.main 
                  : 'inherit',
                minWidth: '40px'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname.startsWith(item.path) 
                    ? 'medium' 
                    : 'normal'
                }}
              />
            </MenuItem>
          ))}
        </List>
      </Box>

      {/* Cerrar sesión */}
      <Box sx={{ p: 1.5 }}>
        <MenuItem
          button
          onClick={handleLogout}
          sx={{
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.light,
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Cerrar sesión" 
            primaryTypographyProps={{ fontWeight: 'medium' }}
          />
        </MenuItem>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;