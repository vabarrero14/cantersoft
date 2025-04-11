// src/modules/stock/ProductoList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box } from '@mui/material';

const ProductoList = () => {
  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    const snapshot = await getDocs(collection(db, 'productos'));
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProductos(docs);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Lista de Productos</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Proveedor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.map((prod) => (
            <TableRow key={prod.id}>
              <TableCell>{prod.nombre}</TableCell>
              <TableCell>{prod.precio}</TableCell>
              <TableCell>{prod.stock}</TableCell>
              <TableCell>{prod.categoria}</TableCell>
              <TableCell>{prod.proveedor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ProductoList;
