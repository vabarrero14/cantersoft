import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, Box,
  Grid, Divider, Alert
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { Category as CategoryIcon } from '@mui/icons-material';

const CategoriaEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [categoria, setCategoria] = useState({
    nombre: '',
    descripcion: ''
  });

  // Cargar los datos de la categoría a editar
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const docRef = doc(db, 'categorias', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCategoria(docSnap.data());
        } else {
          setError('No se encontró la categoría');
        }
      } catch (error) {
        console.error("Error al cargar la categoría:", error);
        setError('Error al cargar los datos de la categoría');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchCategoria();
    } else {
      setInitialLoading(false);
      navigate('/categorias');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await updateDoc(doc(db, 'categorias', id), categoria);
      setSuccess('Categoría actualizada con éxito');
      setTimeout(() => navigate('/categorias'), 1500);
    } catch (error) {
      setError('Error al actualizar la categoría');
      console.error("Error al actualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Cargando datos de la categoría...</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <CategoryIcon color="primary" fontSize="large" />
        <Typography variant="h5">Editar Categoría</Typography>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="nombre"
              label="Nombre"
              value={categoria.nombre || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <CategoryIcon color="action" sx={{ mr: 1 }} />
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="descripcion"
              label="Descripción"
              value={categoria.descripcion || ''}
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
            onClick={() => navigate('/categorias')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={<CategoryIcon />}
          >
            {loading ? 'Actualizando...' : 'Actualizar Categoría'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CategoriaEdit;