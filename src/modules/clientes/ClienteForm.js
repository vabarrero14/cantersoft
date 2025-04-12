// src/modules/clientes/ClienteForm.js
import React, { useState } from 'react';
import {
  TextField, Button, Paper, Typography
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ClienteForm = () => {
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
    try {
      await addDoc(collection(db, 'clientes'), cliente);
      alert('Cliente agregado con éxito');
      setCliente({
        nombre: '',
        ruc: '',
        telefono: '',
        direccion: '',
        email: '',
        observacion: ''
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      alert('Error al guardar el cliente');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Agregar nuevo cliente</Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="nombre" label="Nombre" value={cliente.nombre} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="ruc" label="RUC" value={cliente.ruc} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="telefono" label="Teléfono" value={cliente.telefono} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="direccion" label="Dirección" value={cliente.direccion} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="email" label="Email" value={cliente.email} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="observacion" label="Observación" value={cliente.observacion} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
        <Button type="submit" variant="contained" color="primary">Guardar</Button>
      </form>
    </Paper>
  );
};

export default ClienteForm;
