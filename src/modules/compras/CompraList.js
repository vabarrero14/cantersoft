import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

// Función para formatear la fecha (maneja Timestamp, Date o string)
const formatDate = (date) => {
  if (!date) return 'Fecha no disponible';
  
  try {
    // Si es un objeto Timestamp de Firebase
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    // Si ya es un objeto Date
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    // Si viene del servidor como {seconds, nanoseconds}
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    // Si es un string ISO
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return 'Formato no reconocido';
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

const ComprasList = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const comprasSnap = await getDocs(collection(db, 'compras'));
        const comprasData = comprasSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          // Aseguramos que la fecha esté formateada
          fecha: formatDate(doc.data().fecha)
        }));
        setCompras(comprasData);
      } catch (error) {
        console.error("Error cargando compras:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompras();
  }, []);

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Listado de Compras</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/compras/nueva')} 
        sx={{ mb: 2 }}
      >
        Nueva Compra
      </Button>
      
      {loading ? (
        <Typography>Cargando compras...</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N° Factura</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compras.map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell>{compra.numero || 'N/A'}</TableCell>
                  <TableCell>{compra.fecha}</TableCell> {/* Ahora formateado */}
                  <TableCell>{compra.proveedor || 'N/A'}</TableCell>
                  <TableCell>${compra.total?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => navigate(`/compras/${compra.id}`)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {compras.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No hay compras registradas.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ComprasList;