// src/modules/stock/ProductoForm.js
import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ProductoForm = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    cantidad: '',
    precioCompra: '',
    precioVenta: '',
    stockMinimo: '',
    marca: '',
    medida: '',
    observacion: '',
    categoria: '',
    proveedor: ''
  });

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'productos'), {
        ...producto,
        cantidad: parseInt(producto.cantidad),
        precioCompra: parseFloat(producto.precioCompra),
        precioVenta: parseFloat(producto.precioVenta),
        stockMinimo: parseInt(producto.stockMinimo)
      });
      alert('Producto agregado con éxito');
      setProducto({
        nombre: '',
        cantidad: '',
        precioCompra: '',
        precioVenta: '',
        stockMinimo: '',
        marca: '',
        medida: '',
        observacion: '',
        categoria: '',
        proveedor: ''
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      alert('Error al guardar el producto');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Agregar nuevo producto</Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="nombre" label="Nombre" value={producto.nombre} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="cantidad" label="Cantidad" type="number" value={producto.cantidad} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="precioCompra" label="Precio de Compra" type="number" value={producto.precioCompra} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="precioVenta" label="Precio de Venta" type="number" value={producto.precioVenta} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="stockMinimo" label="Stock Mínimo" type="number" value={producto.stockMinimo} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="marca" label="Marca" value={producto.marca} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="medida" label="Medida" value={producto.medida} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="categoria" label="Categoría" value={producto.categoria} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="proveedor" label="Proveedor" value={producto.proveedor} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="observacion" label="Observación" value={producto.observacion} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
        <Button type="submit" variant="contained" color="primary">Guardar</Button>
      </form>
    </Paper>
  );
};

export default ProductoForm;
