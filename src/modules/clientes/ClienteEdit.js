import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, Box,
  Grid, Divider, Alert
} from '@mui/material';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';

const ClienteEdit = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);
        const clienteDoc = await getDoc(doc(db, 'clientes', id));
        
        if (clienteDoc.exists()) {
          setCliente(clienteDoc.data());
        } else {
          setError('Cliente no encontrado');
          setTimeout(() => navigate('/clientes'), 1500);
        }
      } catch (err) {
        setError('Error al cargar el cliente');
        console.error("Error fetching cliente:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCliente();
  }, [id, navigate]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await updateDoc(doc(db, 'clientes', id), cliente);
      setSuccess('Cliente actualizado con éxito');
      setTimeout(() => navigate('/clientes'), 1500);
    } catch (error) {
      setError('Error al actualizar el cliente');
      console.error("Error al actualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteDoc(doc(db, 'clientes', id));
        alert('Cliente eliminado con éxito');
        navigate('/clientes');
      } catch (error) {
        setError('Error al eliminar el cliente');
        console.error("Error al eliminar:", error);
      }
    }
  };

  if (loading && !cliente.nombre) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Cargando cliente...</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Editar Cliente
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleUpdate}>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
          >
            Eliminar Cliente
          </Button>
          
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/clientes')}
              sx={{ mr: 2 }}
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default ClienteEdit;