import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button
} from '@mui/material';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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

const VentaList = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const ventasSnap = await getDocs(collection(db, 'ventas'));

        const ventasData = await Promise.all(ventasSnap.docs.map(async (ventaDoc) => {
          const data = ventaDoc.data();
          let clienteNombre = 'Desconocido';

          if (data.cliente) {
            try {
              const clienteRef = doc(db, 'clientes', data.cliente);
              const clienteSnap = await getDoc(clienteRef);
              if (clienteSnap.exists()) {
                clienteNombre = clienteSnap.data().nombre || 'Sin nombre';
              }
            } catch (error) {
              console.error('Error al obtener cliente:', error);
            }
          }

          return {
            id: ventaDoc.id,
            ...data,
            clienteNombre,
            fecha: formatDate(data.fecha) // Formateamos la fecha aquí
          };
        }));

        setVentas(ventasData);
      } catch (error) {
        console.error("Error cargando ventas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Listado de Ventas</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/ventas/nueva')}
        sx={{ mb: 2 }}
      >
        Nueva Venta
      </Button>

      {loading ? (
        <Typography>Cargando ventas...</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N° Factura</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell>{venta.numero || 'N/A'}</TableCell>
                  <TableCell>{venta.fecha}</TableCell> {/* Fecha ya formateada */}
                  <TableCell>{venta.clienteNombre}</TableCell>
                  <TableCell>${venta.total?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/ventas/${venta.id}`)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {ventas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No hay ventas registradas.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default VentaList;