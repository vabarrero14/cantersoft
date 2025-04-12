import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CategoriaForm = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre) {
      alert('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      await addDoc(collection(db, 'categorias'), {
        nombre,
        descripcion
      });
      alert('Categoría agregada con éxito');
      navigate('/categorias');  // Redirige al listado de categorías
    } catch (error) {
      console.error('Error al agregar la categoría:', error);
      alert('Hubo un error al agregar la categoría');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Nueva Categoría
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
          />
          <Button variant="contained" type="submit">
            Guardar Categoría
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default CategoriaForm;
