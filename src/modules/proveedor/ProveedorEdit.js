import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, Box,
  Grid, Divider, Alert
} from '@mui/material';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // Añadido deleteDoc aquí
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';

const ProveedorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        setLoading(true);
        const proveedorDoc = await getDoc(doc(db, 'proveedores', id));
        
        if (proveedorDoc.exists()) {
          setProveedor(proveedorDoc.data());
        } else {
          setError('Proveedor no encontrado');
          navigate('/proveedores');
        }
      } catch (err) {
        setError('Error al cargar el proveedor');
        console.error("Error fetching proveedor:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProveedor();
  }, [id, navigate]);

  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await updateDoc(doc(db, 'proveedores', id), proveedor);
      setSuccess('Proveedor actualizado correctamente');
      setTimeout(() => navigate('/proveedores'), 1500);
    } catch (err) {
      setError('Error al actualizar el proveedor');
      console.error("Error updating proveedor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
      try {
        await deleteDoc(doc(db, 'proveedores', id));
        alert('Proveedor eliminado correctamente');
        navigate('/proveedores');
      } catch (err) {
        setError('Error al eliminar el proveedor');
        console.error("Error deleting proveedor:", err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Cargando proveedor...</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Editar Proveedor
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
            Eliminar Proveedor
          </Button>
          
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/proveedores')}
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

export default ProveedorEdit;