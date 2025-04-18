import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, Button, TableContainer, Paper, Grid } from '@mui/material';
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
      <Typography variant="h6" gutterBottom>Lista de Productos</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/producto/nuevo')}
        sx={{ mb: 2 }}
      >
        Nuevo Producto
      </Button>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Precio Compra</TableCell>
              <TableCell>Precio Venta</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.codigo}</TableCell>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell>{prod.cantidad}</TableCell>
                <TableCell>${prod.precioCompra}</TableCell>
                <TableCell>${prod.precioVenta}</TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleEdit(prod.id)}
                        size="small"
                      >
                        Editar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(prod.id)}
                        size="small"
                      >
                        Eliminar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => handleMovimientos(prod.id)}
                        size="small"
                      >
                        Movimientos
                      </Button>
                    </Grid>
                  </Grid>
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