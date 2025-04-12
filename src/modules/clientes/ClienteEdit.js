// src/modules/clientes/ClienteEdit.js
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography
} from '@mui/material';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';

const ClienteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      const clienteDoc = await getDoc(doc(db, 'clientes', id));
      if (clienteDoc.exists()) {
        setCliente(clienteDoc.data());
      } else {
        alert('Cliente no encontrado');
        navigate('/clientes');
      }
    };
    fetchCliente();
  }, [id, navigate]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'clientes', id), cliente);
      alert('Cliente actualizado con éxito');
      navigate('/clientes');
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert('Error al actualizar el cliente');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteDoc(doc(db, 'clientes', id));
        alert('Cliente eliminado con éxito');
        navigate('/clientes');
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Editar Cliente</Typography>
      <form onSubmit={handleUpdate}>
        <TextField name="nombre" label="Nombre" value={cliente.nombre} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="ruc" label="RUC" value={cliente.ruc} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="telefono" label="Teléfono" value={cliente.telefono} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="direccion" label="Dirección" value={cliente.direccion} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="email" label="Email" value={cliente.email} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="observacion" label="Observación" value={cliente.observacion} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
        <Button type="submit" variant="contained" color="primary">Actualizar</Button>
        <Button variant="outlined" color="secondary" onClick={handleDelete} style={{ marginLeft: 10 }}>
          Eliminar
        </Button>
      </form>
    </Paper>
  );
};

export default ClienteEdit;
