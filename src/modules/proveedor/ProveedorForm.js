// src/modules/proveedor/ProveedorForm.js
import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProveedorForm = () => {
  const [nombre, setNombre] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [ruc, setRuc] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre || !razonSocial || !ruc) {
      alert('El nombre, razón social y RUC son obligatorios');
      return;
    }

    try {
      await addDoc(collection(db, 'proveedores'), {
        nombre,
        razonSocial,
        ruc,
        telefono,
        direccion,
        email
      });
      alert('Proveedor agregado con éxito');
      navigate('/proveedores');  // Redirige al listado de proveedores
    } catch (error) {
      console.error('Error al agregar el proveedor:', error);
      alert('Hubo un error al agregar el proveedor');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Nuevo Proveedor
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
            label="Razón Social"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="RUC"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            fullWidth
          />
          <TextField
            label="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button variant="contained" type="submit">
            Guardar Proveedor
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default ProveedorForm;
