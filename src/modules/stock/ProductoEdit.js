import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { getDoc, doc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useParams, useNavigate } from 'react-router-dom';

const ProductoEdit = () => {
  const { id } = useParams(); // Obtener el ID del producto de la URL
  const navigate = useNavigate(); // Navegación

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
    // Cargar las categorías, marcas y proveedores
    const fetchData = async () => {
      const categoriasSnap = await getDocs(collection(db, 'categorias'));
      const marcasSnap = await getDocs(collection(db, 'marcas'));
      const proveedoresSnap = await getDocs(collection(db, 'proveedores'));

      setCategorias(categoriasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMarcas(marcasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setProveedores(proveedoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    // Cargar el producto a editar
    const fetchProducto = async () => {
      const productoSnap = await getDoc(doc(db, 'productos', id));
      if (productoSnap.exists()) {
        setProducto(productoSnap.data());
      } else {
        console.log('Producto no encontrado');
      }
    };

    fetchData();
    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'productos', id), {
        ...producto,
        cantidad: parseInt(producto.cantidad),
        precioCompra: parseFloat(producto.precioCompra),
        precioVenta: parseFloat(producto.precioVenta),
        stockMinimo: parseInt(producto.stockMinimo)
      });
      alert('Producto actualizado con éxito');
      navigate('/stock/listado'); // Redirigir a la lista de productos
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert('Error al actualizar el producto');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Editar producto</Typography>
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

export default ProductoEdit;
