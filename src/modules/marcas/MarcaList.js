import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  Typography, Box, Button, TableContainer, Paper, 
  IconButton, Tooltip 
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Label as LabelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MarcaList = () => {
  const [marcas, setMarcas] = useState([]);
  const navigate = useNavigate();

  const cargarMarcas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'marcas'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        descripcion: doc.data().descripcion || 'No especificado'
      }));
      setMarcas(data);
    } catch (error) {
      console.error('Error al obtener marcas:', error);
    }
  };

  useEffect(() => {
    cargarMarcas();
  }, []);

  const handleEdit = (id) => {
    navigate(`/marca/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta marca?')) {
      await deleteDoc(doc(db, 'marcas', id));
      cargarMarcas();
      alert('Marca eliminada con éxito');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Listado de Marcas</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/marcas/nueva')}
        >
          Nueva Marca
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 180px)', overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '40%' }}>Nombre</TableCell>
              <TableCell sx={{ width: '50%' }}>Descripción</TableCell>
              <TableCell sx={{ width: '10%' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marcas.map((marca) => (
              <TableRow key={marca.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LabelIcon color="primary" fontSize="small" />
                    {marca.nombre}
                  </Box>
                </TableCell>
                <TableCell>{marca.descripcion}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(marca.id)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(marca.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MarcaList;