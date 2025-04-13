import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, FormControl, IconButton, Autocomplete
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const VentaForm = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [venta, setVenta] = useState({
    numero: '',
    fecha: '',
    cliente: '',
    items: [],
    total: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const clientesSnap = await getDocs(collection(db, 'clientes'));
      const productosSnap = await getDocs(collection(db, 'productos'));
      setClientes(clientesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setProductos(productosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setVenta({ ...venta, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...venta.items];
    updatedItems[index][field] = value;

    // Si cambió cantidad o producto, actualizamos el subtotal
    if (field === 'cantidad' || field === 'productoId') {
      const cantidad = parseFloat(updatedItems[index].cantidad) || 0;
      const producto = productos.find(p => p.codigo === updatedItems[index].productoId);
      const precio = producto ? parseFloat(producto.precioVenta) : 0;
      updatedItems[index].precio = precio;
      updatedItems[index].subtotal = cantidad * precio;
    }

    // Recalculamos el total de la venta
    const total = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setVenta({ ...venta, items: updatedItems, total });
  };

  const handleAddItem = () => {
    setVenta({
      ...venta,
      items: [...venta.items, { productoId: '', cantidad: 0, precio: 0, subtotal: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = venta.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setVenta({ ...venta, items: updatedItems, total });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'ventas'), venta);
      alert('Venta guardada con éxito');
      navigate('/ventas');
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      alert('Error al guardar');
    }
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6">Registrar Venta</Typography>
      <form onSubmit={handleSubmit}>
        {/* Número de Factura y Fecha de Factura */}
        <TextField
          name="numero"
          label="N° Factura"
          value={venta.numero}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="fecha"
          type="date"
          label="Fecha"
          value={venta.fecha}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* Cliente */}
        <Autocomplete
          name="cliente"
          value={clientes.find(c => c.id === venta.cliente) || null}
          onChange={(e, newValue) => setVenta({ ...venta, cliente: newValue ? newValue.id : '' })}
          options={clientes}
          getOptionLabel={(option) => option.nombre}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label="Cliente" />}
          fullWidth
          margin="normal"
          required
        />

        <Typography variant="subtitle1" sx={{ mt: 2 }}>Productos</Typography>
        {venta.items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <FormControl style={{ flex: 2 }}>
              {/* Autocomplete para productos */}
              <Autocomplete
                value={productos.find(p => p.codigo === item.productoId) || null}
                onChange={(e, newValue) => handleItemChange(index, 'productoId', newValue ? newValue.codigo : '')}
                options={productos}
                getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
                isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                renderInput={(params) => <TextField {...params} label="Producto" />}
              />
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
              disabled
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

        <Typography variant="h6" sx={{ mt: 3 }}>Total: {venta.total.toFixed(2)}</Typography>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Guardar Venta</Button>
      </form>
    </Paper>
  );
};

export default VentaForm;
