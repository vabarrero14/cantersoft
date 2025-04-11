// src/modules/stock/ProductoForm.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Box, Button, TextField, Typography } from '@mui/material';

const ProductoForm = ({ onSave }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('');
  const [proveedor, setProveedor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoProducto = {
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      categoria,
      proveedor
    };

    try {
      await addDoc(collection(db, 'productos'), nuevoProducto);
      onSave?.(); // Para refrescar la lista si es necesario
      setNombre('');
      setPrecio('');
      setStock('');
      setCategoria('');
      setProveedor('');
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Agregar Producto</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth margin="normal" />
        <TextField label="Precio" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} fullWidth margin="normal" />
        <TextField label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} fullWidth margin="normal" />
        <TextField label="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)} fullWidth margin="normal" />
        <TextField label="Proveedor" value={proveedor} onChange={(e) => setProveedor(e.target.value)} fullWidth margin="normal" />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Guardar</Button>
      </form>
    </Box>
  );
};

export default ProductoForm;
