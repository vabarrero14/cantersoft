// src/modules/compras/ComprasForm.js
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, MenuItem, FormControl, Select, InputLabel, IconButton
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const ComprasForm = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [factura, setFactura] = useState({
    numero: '',
    fecha: '',
    proveedor: '',
    items: [],
    total: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const provSnap = await getDocs(collection(db, 'proveedores'));
      const prodSnap = await getDocs(collection(db, 'productos'));
      setProveedores(provSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setProductos(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFactura({ ...factura, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...factura.items];
    updatedItems[index][field] = value;

    // Si cambió cantidad o precio, actualizamos total por ítem
    if (field === 'cantidad' || field === 'precio') {
      const cantidad = parseFloat(updatedItems[index].cantidad) || 0;
      const precio = parseFloat(updatedItems[index].precio) || 0;
      updatedItems[index].subtotal = cantidad * precio;
    }

    const total = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setFactura({ ...factura, items: updatedItems, total });
  };

  const handleAddItem = () => {
    setFactura({
      ...factura,
      items: [...factura.items, { productoId: '', cantidad: 0, precio: 0, subtotal: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = factura.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setFactura({ ...factura, items: updatedItems, total });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'compras'), factura);
      alert('Compra guardada con éxito');
      navigate('/compras');
    } catch (error) {
      console.error('Error al guardar la compra:', error);
      alert('Error al guardar');
    }
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6">Registrar Compra</Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="numero" label="N° Factura" value={factura.numero} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="fecha" type="date" label="Fecha" value={factura.fecha} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />

        {/* Proveedor */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Proveedor</InputLabel>
          <Select name="proveedor" value={factura.proveedor} onChange={handleChange} required>
            {proveedores.map((p) => (
              <MenuItem key={p.id} value={p.nombre}>{p.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>Productos</Typography>
        {factura.items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <FormControl style={{ flex: 2 }}>
              <InputLabel>Producto</InputLabel>
              <Select
                value={item.productoId}
                onChange={(e) => handleItemChange(index, 'productoId', e.target.value)}
                required
              >
                {productos.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="number"
              label="Cantidad"
              value={item.cantidad}
              onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
              style={{ flex: 1 }}
              required
            />
            <TextField
              type="number"
              label="Precio"
              value={item.precio}
              onChange={(e) => handleItemChange(index, 'precio', e.target.value)}
              style={{ flex: 1 }}
              required
            />
            <TextField
              type="number"
              label="Subtotal"
              value={item.subtotal}
              style={{ flex: 1 }}
              disabled
            />
            <IconButton color="error" onClick={() => handleRemoveItem(index)}>
              <RemoveCircle />
            </IconButton>
          </div>
        ))}

        <Button
          startIcon={<AddCircle />}
          onClick={handleAddItem}
          variant="outlined"
          color="primary"
        >
          Agregar Producto
        </Button>

        <Typography variant="h6" sx={{ mt: 3 }}>Total: {factura.total.toFixed(2)}</Typography>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Guardar Compra</Button>
      </form>
    </Paper>
  );
};

export default ComprasForm;
