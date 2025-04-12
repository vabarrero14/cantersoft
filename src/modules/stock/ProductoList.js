// src/modules/stock/ProductoList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, Button, TableContainer, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();  // Para navegar a la página de edición

  const cargarProductos = async () => {
    const snapshot = await getDocs(collection(db, 'productos'));
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProductos(docs);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Función para manejar la edición de un producto
  const handleEdit = (id) => {
    navigate(`/producto/editar/${id}`);  // Redirige al formulario de edición
  };

  // Función para eliminar un producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await deleteDoc(doc(db, 'productos', id));
      cargarProductos();  // Vuelve a cargar los productos después de eliminar
      alert('Producto eliminado con éxito');
    }
  };

  // Función para manejar los movimientos (luego se implementará)
  const handleMovimientos = (id) => {
    console.log('Ver movimientos del producto con ID:', id);
    // Aquí puedes implementar la lógica para mostrar los movimientos del producto más adelante
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Lista de Productos</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Codigo</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Compra</TableCell>
              <TableCell>Precio Venta</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Stock Mínimo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.codigo}</TableCell>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell>{prod.cantidad}</TableCell>
                <TableCell>{prod.precioCompra}</TableCell>
                <TableCell>{prod.precioVenta}</TableCell>
                <TableCell>{prod.marca}</TableCell>
                <TableCell>{prod.proveedor}</TableCell>
                <TableCell>{prod.categoria}</TableCell>
                <TableCell>{prod.stockMinimo}</TableCell>
                <TableCell>
                  <Grid container spacing={0.5} justifyContent="flex-start">
                    <Grid item>
                      <Button
                        variant="contained"
                        color="warning"  // Amarillo para editar
                        onClick={() => handleEdit(prod.id)}
                        size="small"
                        style={{
                          minWidth: 40,  // Reducido a 40
                          padding: '2px 4px',  // Menos padding
                          fontSize: '0.7rem'  // Tamaño de fuente aún más pequeño
                        }}
                      >
                        Editar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"  // Rojo para eliminar
                        onClick={() => handleDelete(prod.id)}
                        size="small"
                        style={{
                          minWidth: 40,  // Reducido a 40
                          padding: '2px 4px',  // Menos padding
                          fontSize: '0.7rem'  // Tamaño de fuente aún más pequeño
                        }}
                      >
                        Eliminar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="success"  // Verde para movimientos
                        onClick={() => handleMovimientos(prod.id)}
                        size="small"
                        style={{
                          minWidth: 40,  // Reducido a 40
                          padding: '2px 4px',  // Menos padding
                          fontSize: '0.7rem'  // Tamaño de fuente aún más pequeño
                        }}
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
