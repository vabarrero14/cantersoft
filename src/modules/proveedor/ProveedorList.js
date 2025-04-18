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
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProveedorList = () => {
  const [proveedores, setProveedores] = useState([]);
  const navigate = useNavigate();

  const cargarProveedores = async () => {
    const snapshot = await getDocs(collection(db, 'proveedores'));
    const docs = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      ruc: doc.data().ruc || 'No especificado',
      razonSocial: doc.data().razonSocial || 'No especificada'
    }));
    setProveedores(docs);
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const handleEdit = (id) => {
    navigate(`/proveedor/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      await deleteDoc(doc(db, 'proveedores', id));
      cargarProveedores();
      alert('Proveedor eliminado con éxito');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Listado de Proveedores</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/proveedor/nuevo')}
        >
          Nuevo Proveedor
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 180px)', overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>Nombre/Razón Social</TableCell>
              <TableCell sx={{ width: '15%' }}>RUC</TableCell>
              <TableCell sx={{ width: '15%' }}>Contacto</TableCell>
              <TableCell sx={{ width: '20%' }}>Dirección</TableCell>
              <TableCell sx={{ width: '20%' }}>Email</TableCell>
              <TableCell sx={{ width: '10%' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((prov) => (
              <TableRow key={prov.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BadgeIcon color="primary" fontSize="small" />
                      {prov.nombre}
                    </Box>
                    {prov.razonSocial && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <BusinessIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {prov.razonSocial}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{prov.ruc}</TableCell>
                <TableCell>
                  {prov.telefono && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon color="action" fontSize="small" />
                      {prov.telefono}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {prov.direccion && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HomeIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {prov.direccion}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {prov.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="action" fontSize="small" />
                      {prov.email}
                    </Box>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(prov.id)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(prov.id)}
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

export default ProveedorList;