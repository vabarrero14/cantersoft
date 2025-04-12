import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MarcaForm = () => {
  const [marca, setMarca] = useState({ nombre: '', descripcion: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMarca({ ...marca, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const marcaRef = collection(db, 'marcas');
      await addDoc(marcaRef, marca);
      navigate('/marcas'); // Redirige al listado de marcas
    } catch (error) {
      console.error('Error al guardar la marca:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Agregar Marca</Typography>
      <TextField
        label="Nombre"
        name="nombre"
        fullWidth
        margin="normal"
        value={marca.nombre}
        onChange={handleChange}
        required
      />
      <TextField
        label="Descripción"
        name="descripcion"
        fullWidth
        margin="normal"
        value={marca.descripcion}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" color="primary">
        Guardar
      </Button>
    </Box>
  );
};

export default MarcaForm;
