import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button
} from '@mui/material';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const VentaList = () => {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentas = async () => {
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
        };
      }));

      setVentas(ventasData);
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
                <TableCell>{venta.numero}</TableCell>
                <TableCell>{venta.fecha}</TableCell>
                <TableCell>{venta.clienteNombre}</TableCell>
                <TableCell>{venta.total.toFixed(2)}</TableCell>
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
    </Paper>
  );
};

export default VentaList;
