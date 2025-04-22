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
  Category as CategoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CategoriaList = () => {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  const cargarCategorias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categorias'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        descripcion: doc.data().descripcion || 'No especificado'
      }));
      setCategorias(data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleEdit = (id) => {
    navigate(`/categorias/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await deleteDoc(doc(db, 'categorias', id));
        cargarCategorias();
        alert('Categoría eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert('Error al eliminar la categoría');
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Listado de Categorías</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/categorias/nueva')}
        >
          Nueva Categoría
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
            {categorias.map((categoria) => (
              <TableRow key={categoria.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon color="primary" fontSize="small" />
                    {categoria.nombre}
                  </Box>
                </TableCell>
                <TableCell>{categoria.descripcion}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(categoria.id)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(categoria.id)}
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

export default CategoriaList;