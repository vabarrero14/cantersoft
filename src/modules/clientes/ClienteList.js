import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  Typography, Box, Button, TableContainer, Paper, 
  IconButton, Tooltip, TextField, InputAdornment,
  Pagination, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const cargarClientes = async () => {
    const snapshot = await getDocs(collection(db, 'clientes'));
    const docs = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      ruc: doc.data().ruc || 'No especificado'
    }));
    setClientes(docs);
    setFilteredClientes(docs);
    setPage(1); // Resetear a la primera página al cargar/recargar datos
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Filtrado de clientes
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredClientes(clientes);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(term) ||
        cliente.ruc.toLowerCase().includes(term) ||
        (cliente.telefono && cliente.telefono.toLowerCase().includes(term)) ||
        (cliente.email && cliente.email.toLowerCase().includes(term))
      );
      setFilteredClientes(filtered);
    }
    setPage(1); // Resetear a la primera página al cambiar el filtro
  }, [searchTerm, clientes]);

  // Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Calcular clientes paginados
  const paginatedClientes = filteredClientes.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredClientes.length / rowsPerPage);

  const handleEdit = (id) => {
    navigate(`/cliente/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      await deleteDoc(doc(db, 'clientes', id));
      cargarClientes();
      alert('Cliente eliminado con éxito');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const exportToExcel = () => {
    const data = filteredClientes.map(cliente => ({
      'Nombre': cliente.nombre,
      'RUC': cliente.ruc,
      'Teléfono': cliente.telefono || 'No especificado',
      'Email': cliente.email || 'No especificado',
      'Dirección': cliente.direccion || 'No especificado'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "Clientes.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Listado de Clientes', 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${date}`, 14, 22);
    doc.text(`Filtro aplicado: ${searchTerm || 'Ninguno'}`, 14, 28);
    
    const tableData = filteredClientes.map(cliente => [
      cliente.nombre,
      cliente.ruc,
      cliente.telefono || 'N/A',
      cliente.email || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Nombre', 'RUC', 'Teléfono', 'Email']],
      body: tableData,
      startY: 35,
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 50 }
      }
    });

    doc.save(`clientes_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        gap: 2,
        flexWrap: 'wrap' 
      }}>
        <Typography variant="h6">Lista de Clientes</Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexWrap: 'wrap' 
        }}>
          <Button 
            variant="outlined" 
            startIcon={<ExcelIcon />}
            onClick={exportToExcel}
            color="success"
            sx={{ minWidth: '120px' }}
            disabled={filteredClientes.length === 0}
          >
            Exportar Excel
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<PdfIcon />}
            onClick={exportToPDF}
            color="error"
            sx={{ minWidth: '120px' }}
            disabled={filteredClientes.length === 0}
          >
            Exportar PDF
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/clientes/nuevo')}
            sx={{ minWidth: '150px' }}
          >
            Nuevo Cliente
          </Button>
        </Box>
      </Box>

      {/* Barra de búsqueda */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar clientes por nombre, RUC, teléfono o email..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {searchTerm && (
                <IconButton onClick={clearSearch} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          )
        }}
      />

      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '30%' }}>Nombre</TableCell>
              <TableCell sx={{ width: '20%' }}>RUC</TableCell>
              <TableCell sx={{ width: '20%' }}>Contacto</TableCell>
              <TableCell sx={{ width: '20%' }}>Email</TableCell>
              <TableCell sx={{ width: '10%' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClientes.length > 0 ? (
              paginatedClientes.map((cliente) => (
                <TableRow key={cliente.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BadgeIcon color="primary" fontSize="small" />
                      {cliente.nombre}
                    </Box>
                  </TableCell>
                  <TableCell>{cliente.ruc}</TableCell>
                  <TableCell>
                    {cliente.telefono && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon color="action" fontSize="small" />
                        {cliente.telefono}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {cliente.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="action" fontSize="small" />
                        {cliente.email}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(cliente.id)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(cliente.id)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {searchTerm ? 'No se encontraron clientes con ese criterio' : 'No hay clientes registrados'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación y controles */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            Mostrando {paginatedClientes.length} de {filteredClientes.length} clientes
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Por página</InputLabel>
            <Select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              label="Por página"
            >
              {[5, 10, 20, 50].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ClienteList;