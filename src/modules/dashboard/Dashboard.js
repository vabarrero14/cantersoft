import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Button, useTheme } from '@mui/material';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Inventory as ProductosIcon,
  Receipt as VentasIcon,
  ShoppingCart as ComprasIcon,
  People as ClientesIcon,
  LocalShipping as ProveedoresIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ icon, title, count, color, onClick }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        borderLeft: `4px solid ${theme.palette[color].main}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{
          backgroundColor: theme.palette[color].light,
          color: theme.palette[color].main,
          p: 1.5,
          borderRadius: '50%',
          mr: 2
        }}>
          {icon}
        </Box>
        <Typography variant="h6" color="text.secondary">{title}</Typography>
      </Box>
      
      <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        {count}
      </Typography>
      
      <Button 
        variant="outlined" 
        size="small" 
        onClick={onClick}
        sx={{ 
          alignSelf: 'flex-start',
          mt: 2,
          color: theme.palette[color].main,
          borderColor: theme.palette[color].main,
          '&:hover': {
            backgroundColor: theme.palette[color].light,
            borderColor: theme.palette[color].main
          }
        }}
      >
        Ver más
      </Button>
    </Paper>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    productos: 0,
    ventas: 0,
    compras: 0,
    clientes: 0,
    proveedores: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener conteos iniciales
        const [
          productosSnap, 
          ventasSnap, 
          comprasSnap,
          clientesSnap,
          proveedoresSnap
        ] = await Promise.all([
          getDocs(collection(db, 'productos')),
          getDocs(collection(db, 'ventas')),
          getDocs(collection(db, 'compras')),
          getDocs(collection(db, 'clientes')),
          getDocs(collection(db, 'proveedores'))
        ]);

        setStats({
          productos: productosSnap.size,
          ventas: ventasSnap.size,
          compras: comprasSnap.size,
          clientes: clientesSnap.size,
          proveedores: proveedoresSnap.size
        });

        // Escuchar cambios en tiempo real
        const unsubscribes = [
          onSnapshot(collection(db, 'productos'), snap => {
            setStats(prev => ({ ...prev, productos: snap.size }));
          }),
          onSnapshot(collection(db, 'ventas'), snap => {
            setStats(prev => ({ ...prev, ventas: snap.size }));
          }),
          onSnapshot(collection(db, 'compras'), snap => {
            setStats(prev => ({ ...prev, compras: snap.size }));
          }),
          onSnapshot(collection(db, 'clientes'), snap => {
            setStats(prev => ({ ...prev, clientes: snap.size }));
          }),
          onSnapshot(collection(db, 'proveedores'), snap => {
            setStats(prev => ({ ...prev, proveedores: snap.size }));
          })
        ];

        return () => unsubscribes.forEach(unsub => unsub());
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Cargando datos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Panel de Control
      </Typography>
      
      <Grid container spacing={3}>
        {/* Productos */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DashboardCard
            icon={<ProductosIcon fontSize="medium" />}
            title="Productos"
            count={stats.productos}
            color="primary"
            onClick={() => navigate('/stock/listado')}
          />
        </Grid>
        
        {/* Ventas */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DashboardCard
            icon={<VentasIcon fontSize="medium" />}
            title="Ventas"
            count={stats.ventas}
            color="success"
            onClick={() => navigate('/ventas')}
          />
        </Grid>
        
        {/* Compras */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DashboardCard
            icon={<ComprasIcon fontSize="medium" />}
            title="Compras"
            count={stats.compras}
            color="warning"
            onClick={() => navigate('/compras')}
          />
        </Grid>
        
        {/* Clientes */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DashboardCard
            icon={<ClientesIcon fontSize="medium" />}
            title="Clientes"
            count={stats.clientes}
            color="info"
            onClick={() => navigate('/clientes')}
          />
        </Grid>
        
        {/* Proveedores */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DashboardCard
            icon={<ProveedoresIcon fontSize="medium" />}
            title="Proveedores"
            count={stats.proveedores}
            color="secondary"
            onClick={() => navigate('/proveedores')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;