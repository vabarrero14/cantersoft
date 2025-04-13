import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const VentaDetail = () => {
  const { ventaId } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventaDoc = await getDoc(doc(db, 'ventas', ventaId));
        const productosSnap = await getDocs(collection(db, 'productos'));

        const productosMap = {};
        productosSnap.forEach(doc => {
          productosMap[doc.data().codigo] = doc.data();
        });

        if (ventaDoc.exists()) {
          const data = ventaDoc.data();

          // Obtener el nombre del cliente
          let clienteNombre = 'Desconocido';
          if (data.cliente) {
            const clienteRef = doc(db, 'clientes', data.cliente);
            const clienteSnap = await getDoc(clienteRef);
            if (clienteSnap.exists()) {
              clienteNombre = clienteSnap.data().nombre || 'Sin nombre';
            }
          }

          // Agregar nombres de productos a los ítems
          const itemsConNombre = data.items.map(item => {
            const prod = productosMap[item.productoId];
            const nombre = prod ? prod.nombre : 'Desconocido';
            return {
              ...item,
              productoCompleto: `${item.productoId} - ${nombre}`
            };
          });

          setVenta({
            id: ventaDoc.id,
            ...data,
            clienteNombre,
            items: itemsConNombre
          });
        } else {
          console.error('No se encontró la venta');
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [ventaId]);

  if (!venta) return <Typography>Cargando...</Typography>;

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Detalles de Venta</Typography>
      <Typography variant="subtitle1">N° Factura: {venta.numero}</Typography>
      <Typography variant="subtitle1">Fecha: {venta.fecha}</Typography>
      <Typography variant="subtitle1">Cliente: {venta.clienteNombre}</Typography>
      <Typography variant="subtitle1">Total: {venta.total.toFixed(2)}</Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>Productos</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venta.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productoCompleto}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>{item.precio}</TableCell>
                <TableCell>{item.subtotal.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="outlined" color="primary" onClick={() => navigate('/ventas')}>
        Volver
      </Button>
    </Paper>
  );
};

export default VentaDetail;
