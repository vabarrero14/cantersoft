import React, { useState } from 'react';
import {
  TextField, Button, Paper, Typography, Box,
  Grid, Divider, Alert
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';

const ClienteForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [cliente, setCliente] = useState({
    nombre: '',
    ruc: '',
    telefono: '',
    direccion: '',
    email: '',
    observacion: ''
  });

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await addDoc(collection(db, 'clientes'), cliente);
      setSuccess('Cliente agregado con éxito');
      setCliente({
        nombre: '',
        ruc: '',
        telefono: '',
        direccion: '',
        email: '',
        observacion: ''
      });
      setTimeout(() => navigate('/clientes'), 1500);
    } catch (error) {
      setError('Error al guardar el cliente');
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Nuevo Cliente
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="nombre"
              label="Nombre"
              value={cliente.nombre}
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
              value={cliente.ruc}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="telefono"
              label="Teléfono"
              value={cliente.telefono}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              value={cliente.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="email"
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="direccion"
              label="Dirección"
              value={cliente.direccion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="observacion"
              label="Observación"
              value={cliente.observacion}
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
            onClick={() => navigate('/clientes')}
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
            {loading ? 'Guardando...' : 'Guardar Cliente'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ClienteForm;