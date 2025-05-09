import React, { useState } from 'react';
import {
  TextField, Button, Paper, Typography, Box,
  Grid, Divider, Alert
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';

const ProveedorForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [proveedor, setProveedor] = useState({
    nombre: '',
    razonSocial: '',
    ruc: '',
    telefono: '',
    direccion: '',
    email: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!proveedor.nombre || !proveedor.razonSocial || !proveedor.ruc) {
      setError('Nombre, Razón Social y RUC son campos obligatorios');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'proveedores'), proveedor);
      setSuccess('Proveedor agregado con éxito');
      setTimeout(() => navigate('/proveedores'), 1500);
    } catch (error) {
      setError('Error al guardar el proveedor');
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Nuevo Proveedor
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="nombre"
              label="Nombre"
              value={proveedor.nombre}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="razonSocial"
              label="Razón Social"
              value={proveedor.razonSocial}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="ruc"
              label="RUC"
              value={proveedor.ruc}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="telefono"
              label="Teléfono"
              value={proveedor.telefono}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="direccion"
              label="Dirección"
              value={proveedor.direccion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              value={proveedor.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="email"
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="observaciones"
              label="Observaciones"
              value={proveedor.observaciones}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/proveedores')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Proveedor'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ProveedorForm;