import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, Box,
  Grid, Divider, Alert, Autocomplete
} from '@mui/material';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';

const ProductoForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categoriaInput, setCategoriaInput] = useState('');
  const [marcaInput, setMarcaInput] = useState('');
  const [proveedorInput, setProveedorInput] = useState('');

  const [producto, setProducto] = useState({
    codigo: '',
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasSnap, marcasSnap, proveedoresSnap] = await Promise.all([
          getDocs(collection(db, 'categorias')),
          getDocs(collection(db, 'marcas')),
          getDocs(collection(db, 'proveedores'))
        ]);

        setCategorias(categoriasSnap.docs.map(doc => ({ id: doc.id, nombre: doc.data().nombre })));
        setMarcas(marcasSnap.docs.map(doc => ({ id: doc.id, nombre: doc.data().nombre })));
        setProveedores(proveedoresSnap.docs.map(doc => ({ id: doc.id, nombre: doc.data().nombre })));
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(categoriaInput.toLowerCase())
  );

  const marcasFiltradas = marcas.filter(marca =>
    marca.nombre.toLowerCase().includes(marcaInput.toLowerCase())
  );

  const proveedoresFiltrados = proveedores.filter(prov =>
    prov.nombre.toLowerCase().includes(proveedorInput.toLowerCase())
  );

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await addDoc(collection(db, 'productos'), {
        ...producto,
        cantidad: parseInt(producto.cantidad),
        precioCompra: parseFloat(producto.precioCompra),
        precioVenta: parseFloat(producto.precioVenta),
        stockMinimo: parseInt(producto.stockMinimo || 0),
        fechaCreacion: new Date()
      });
      
      setSuccess('Producto agregado con éxito');
      setTimeout(() => navigate('/stock/listado'), 1500);
    } catch (error) {
      setError('Error al guardar el producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Nuevo Producto
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* Primera línea: Código, Nombre, Cantidad, Stock Mínimo */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              name="codigo"
              label="Código"
              value={producto.codigo}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              name="nombre"
              label="Nombre del Producto"
              value={producto.nombre}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              name="cantidad"
              label="Cantidad"
              type="number"
              value={producto.cantidad}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              name="stockMinimo"
              label="Stock Mín"
              type="number"
              value={producto.stockMinimo}
              onChange={handleChange}
              fullWidth
              disabled={loading}
              size="small"
            />
          </Grid>
        </Grid>

        {/* Segunda línea: Precios */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              name="precioCompra"
              label="Precio de Compra"
              type="number"
              value={producto.precioCompra}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              size="small"
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="precioVenta"
              label="Precio de Venta"
              type="number"
              value={producto.precioVenta}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              size="small"
              inputProps={{ step: "0.01" }}
            />
          </Grid>
        </Grid>

        {/* Tercera línea: Categoría, Marca, Proveedor */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={categoriasFiltradas}
              getOptionLabel={(option) => option.nombre}
              inputValue={categoriaInput}
              onInputChange={(_, newValue) => setCategoriaInput(newValue)}
              value={categorias.find(c => c.nombre === producto.categoria) || null}
              onChange={(_, newValue) => setProducto({...producto, categoria: newValue?.nombre || ''})}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categoría"
                  placeholder="Buscar..."
                  required
                  size="small"
                />
              )}
              noOptionsText="No hay coincidencias"
              loading={categorias.length === 0}
              loadingText="Cargando..."
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={marcasFiltradas}
              getOptionLabel={(option) => option.nombre}
              inputValue={marcaInput}
              onInputChange={(_, newValue) => setMarcaInput(newValue)}
              value={marcas.find(m => m.nombre === producto.marca) || null}
              onChange={(_, newValue) => setProducto({...producto, marca: newValue?.nombre || ''})}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Marca"
                  placeholder="Buscar..."
                  required
                  size="small"
                />
              )}
              noOptionsText="No hay coincidencias"
              loading={marcas.length === 0}
              loadingText="Cargando..."
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={proveedoresFiltrados}
              getOptionLabel={(option) => option.nombre}
              inputValue={proveedorInput}
              onInputChange={(_, newValue) => setProveedorInput(newValue)}
              value={proveedores.find(p => p.nombre === producto.proveedor) || null}
              onChange={(_, newValue) => setProducto({...producto, proveedor: newValue?.nombre || ''})}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Proveedor"
                  placeholder="Buscar..."
                  size="small"
                />
              )}
              noOptionsText="No hay coincidencias"
              loading={proveedores.length === 0}
              loadingText="Cargando..."
              disabled={loading}
            />
          </Grid>
        </Grid>

        {/* Cuarta línea: Medida y Observaciones */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <TextField
              name="medida"
              label="Unidad de Medida"
              value={producto.medida}
              onChange={handleChange}
              fullWidth
              disabled={loading}
              size="small"
              placeholder="Ej: kg, unidades..."
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              name="observacion"
              label="Observaciones"
              value={producto.observacion}
              onChange={handleChange}
              fullWidth
              disabled={loading}
              multiline
              rows={3}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/stock/listado')}
            disabled={loading}
            sx={{ px: 4, py: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ px: 4, py: 1 }}
          >
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ProductoForm;