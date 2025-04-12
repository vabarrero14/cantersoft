import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const categoriasSnap = await getDocs(collection(db, 'categorias'));
      const marcasSnap = await getDocs(collection(db, 'marcas'));
      const proveedoresSnap = await getDocs(collection(db, 'proveedores'));

      setCategorias(categoriasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMarcas(marcasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setProveedores(proveedoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

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

        {/* Marca */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Marca</InputLabel>
          <Select name="marca" value={producto.marca} onChange={handleChange}>
            {marcas.map((marca) => (
              <MenuItem key={marca.id} value={marca.nombre}>{marca.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField name="medida" label="Medida" value={producto.medida} onChange={handleChange} fullWidth margin="normal" />

        {/* Categoría */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Categoría</InputLabel>
          <Select name="categoria" value={producto.categoria} onChange={handleChange}>
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.nombre}>{cat.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Proveedor */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Proveedor</InputLabel>
          <Select name="proveedor" value={producto.proveedor} onChange={handleChange}>
            {proveedores.map((prov) => (
              <MenuItem key={prov.id} value={prov.nombre}>{prov.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField name="observacion" label="Observación" value={producto.observacion} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
        <Button type="submit" variant="contained" color="primary">Guardar</Button>
      </form>
    </Paper>
  );
};

export default ProductoForm;
