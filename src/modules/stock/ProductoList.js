import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  Typography, Box, Button, TableContainer, Paper, 
  IconButton, Tooltip 
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  List as ListIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const cargarProductos = async () => {
    const snapshot = await getDocs(collection(db, 'productos'));
    const docs = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      cantidad: doc.data().cantidad || 0,
      precioCompra: doc.data().precioCompra?.toFixed(2) || '0.00',
      precioVenta: doc.data().precioVenta?.toFixed(2) || '0.00'
    }));
    setProductos(docs);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEdit = (id) => {
    navigate(`/producto/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await deleteDoc(doc(db, 'productos', id));
      cargarProductos();
      alert('Producto eliminado con éxito');
    }
  };

  const handleMovimientos = (id) => {
    navigate(`/productos/${id}/movimientos`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Lista de Productos</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/producto/nuevo')}
        >
          Nuevo
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 180px)', overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '80px' }}>Código</TableCell>
              <TableCell sx={{ minWidth: '120px' }}>Nombre</TableCell>
              <TableCell sx={{ width: '70px' }} align="right">Stock</TableCell>
              <TableCell sx={{ width: '90px' }} align="right">Compra</TableCell>
              <TableCell sx={{ width: '90px' }} align="right">Venta</TableCell>
              <TableCell sx={{ width: '90px' }} align="right">Mínimo</TableCell>
              <TableCell sx={{ minWidth: '120px' }}>Proveedor</TableCell>
              <TableCell sx={{ width: '140px' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <TableRow key={prod.id} hover>
                <TableCell>{prod.codigo}</TableCell>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell align="right">{prod.cantidad}</TableCell>
                <TableCell align="right">${prod.precioCompra}</TableCell>
                <TableCell align="right">${prod.precioVenta}</TableCell>
                <TableCell align="right">{prod.stockMinimo || '-'}</TableCell>
                <TableCell>{prod.proveedor || '-'}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(prod.id)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(prod.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Movimientos">
                      <IconButton
                        color="info"
                        onClick={() => handleMovimientos(prod.id)}
                        size="small"
                      >
                        <ListIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductoList;