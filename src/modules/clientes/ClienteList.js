import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, Button, TableContainer, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();  // Para navegar a la página de edición

  const cargarClientes = async () => {
    const snapshot = await getDocs(collection(db, 'clientes'));
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClientes(docs);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Función para manejar la edición de un cliente
  const handleEdit = (id) => {
    navigate(`/cliente/editar/${id}`);  // Redirige al formulario de edición
  };

  // Función para eliminar un cliente
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      await deleteDoc(doc(db, 'clientes', id));
      cargarClientes();  // Vuelve a cargar los clientes después de eliminar
      alert('Cliente eliminado con éxito');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Lista de Clientes</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>RUC</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.ruc}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>
                  <Grid container spacing={0.5} justifyContent="flex-start">
                    <Grid item>
                      <Button
                        variant="contained"
                        color="warning"  // Amarillo para editar
                        onClick={() => handleEdit(cliente.id)}
                        size="small"
                        style={{
                          minWidth: 40,  // Reducido a 40
                          padding: '2px 4px',  // Menos padding
                          fontSize: '0.7rem'  // Tamaño de fuente aún más pequeño
                        }}
                      >
                        Editar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"  // Rojo para eliminar
                        onClick={() => handleDelete(cliente.id)}
                        size="small"
                        style={{
                          minWidth: 40,  // Reducido a 40
                          padding: '2px 4px',  // Menos padding
                          fontSize: '0.7rem'  // Tamaño de fuente aún más pequeño
                        }}
                      >
                        Eliminar
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClienteList;
