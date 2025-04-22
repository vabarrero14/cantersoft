import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, Box,
  Grid, Divider, Alert
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';

const MarcaEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [marca, setMarca] = useState({
    nombre: '',
    descripcion: ''
  });

  // Cargar los datos de la marca a editar
  useEffect(() => {
    const fetchMarca = async () => {
      try {
        const docRef = doc(db, 'marcas', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setMarca(docSnap.data());
        } else {
          setError('No se encontró la marca');
        }
      } catch (error) {
        console.error("Error al cargar la marca:", error);
        setError('Error al cargar los datos de la marca');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchMarca();
    } else {
      setInitialLoading(false);
      navigate('/marcas');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setMarca({ ...marca, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await updateDoc(doc(db, 'marcas', id), marca);
      setSuccess('Marca actualizada con éxito');
      setTimeout(() => navigate('/marcas'), 1500);
    } catch (error) {
      setError('Error al actualizar la marca');
      console.error("Error al actualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Cargando datos de la marca...</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Editar Marca
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="nombre"
              label="Nombre"
              value={marca.nombre || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="descripcion"
              label="Descripción"
              value={marca.descripcion || ''}
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
            onClick={() => navigate('/marcas')}
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
            {loading ? 'Actualizando...' : 'Actualizar Marca'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default MarcaEdit;