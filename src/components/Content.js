import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box } from '@mui/material';

// Componentes de Stock
import ProductoList from '../modules/stock/ProductoList';
import ProductoForm from '../modules/stock/ProductoForm';
import ProductoEdit from '../modules/stock/ProductoEdit';
import MovimientosProducto from '../modules/stock/MovimientoProductos';

// Componentes de Categorías
import CategoriaList from '../modules/categorias/CategoriaList';
import CategoriaForm from '../modules/categorias/CategoriaForm';

// Componentes de Marcas
import MarcaList from '../modules/marcas/MarcaList';
import MarcaForm from '../modules/marcas/MarcaForm';
import MarcaEdit from '../modules/marcas/MarcaEdit';

// Componentes de Proveedores
import ProveedorList from '../modules/proveedor/ProveedorList';
import ProveedorForm from '../modules/proveedor/ProveedorForm';
import ProveedorEdit from '../modules/proveedor/ProveedorEdit';

// Componentes de Compras
import ComprasList from '../modules/compras/CompraList';
import ComprasForm from '../modules/compras/CompraForm';
import CompraDetail from '../modules/compras/CompraDetail';

// Componentes de Clientes
import ClienteList from '../modules/clientes/ClienteList';
import ClienteForm from '../modules/clientes/ClienteForm';
import ClienteEdit from '../modules/clientes/ClienteEdit';

// Componentes de Ventas
import VentaList from '../modules/ventas/VentaList';
import VentaForm from '../modules/ventas/VentaForm';
import VentaDetail from '../modules/ventas/VentaDetail';

// Componentes de Autenticación
import Login from '../modules/login/Login';
import Register from '../modules/login/Register';

// Componentes adicionales
import Dashboard from '../modules/dashboard/Dashboard';
import Caja from '../modules/caja/Caja';

const Content = () => {
  const { currentUser } = useAuth();

  // Función para proteger rutas
  const ProtectedRoute = ({ element }) => {
    return currentUser ? element : <Navigate to="/login" replace />;
  };

  return (
    <Box component="main" sx={{ 
      flexGrow: 1, 
      p: 3,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <Register />} />

        {/* --- Rutas Protegidas --- */}
        {/* Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />

        {/* Stock */}
        <Route path="/stock/listado" element={<ProtectedRoute element={<ProductoList />} />} />
        <Route path="/stock/nuevo" element={<ProtectedRoute element={<ProductoForm />} />} />
        <Route path="/producto/editar/:id" element={<ProtectedRoute element={<ProductoEdit />} />} />
        <Route path="/productos/:productoId/movimientos" element={<ProtectedRoute element={<MovimientosProducto />} />} />

        {/* Categorías */}
        <Route path="/categorias" element={<ProtectedRoute element={<CategoriaList />} />} />
        <Route path="/categorias/nueva" element={<ProtectedRoute element={<CategoriaForm />} />} />

        {/* Marcas */}
        <Route path="/marcas" element={<ProtectedRoute element={<MarcaList />} />} />
        <Route path="/marcas/nueva" element={<ProtectedRoute element={<MarcaForm />} />} />
        <Route path="/marca/editar/:id" element={<ProtectedRoute element={<MarcaEdit />} />} />

        {/* Proveedores */}
        <Route path="/proveedores" element={<ProtectedRoute element={<ProveedorList />} />} />
        <Route path="/proveedores/nuevo" element={<ProtectedRoute element={<ProveedorForm />} />} />
        <Route path="/proveedor/editar/:id" element={<ProtectedRoute element={<ProveedorEdit />} />} />

        {/* Compras */}
        <Route path="/compras" element={<ProtectedRoute element={<ComprasList />} />} />
        <Route path="/compras/nueva" element={<ProtectedRoute element={<ComprasForm />} />} />
        <Route path="/compras/:compraId" element={<ProtectedRoute element={<CompraDetail />} />} />

        {/* Clientes */}
        <Route path="/clientes" element={<ProtectedRoute element={<ClienteList />} />} />
        <Route path="/clientes/nuevo" element={<ProtectedRoute element={<ClienteForm />} />} />
        <Route path="/cliente/editar/:id" element={<ProtectedRoute element={<ClienteEdit />} />} />

        {/* Ventas */}
        <Route path="/ventas" element={<ProtectedRoute element={<VentaList />} />} />
        <Route path="/ventas/nuevo" element={<ProtectedRoute element={<VentaForm />} />} />
        <Route path="/ventas/:ventaId" element={<ProtectedRoute element={<VentaDetail />} />} />

        {/* Caja */}
        <Route path="/caja" element={<ProtectedRoute element={<Caja />} />} />

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Box>
  );
};

export default Content;