import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Función para formatear la fecha (maneja Timestamp, Date o string)
const formatDate = (date) => {
  if (!date) return 'Fecha no disponible';
  
  try {
    // Si es un objeto Timestamp de Firebase
    if (date.toDate) {
      return date.toDate().toLocaleString();
    }
    // Si ya es un objeto Date
    if (date instanceof Date) {
      return date.toLocaleString();
    }
    // Si viene del servidor como {seconds, nanoseconds}
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleString();
    }
    // Si es un string ISO
    if (typeof date === 'string') {
      return new Date(date).toLocaleString();
    }
    return 'Formato no reconocido';
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

const VentaDetail = () => {
  const { ventaId } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventaDoc = await getDoc(doc(db, 'ventas', ventaId));
        const productosSnap = await getDocs(collection(db, 'productos'));

        const productosMap = {};
        productosSnap.forEach(doc => {
          productosMap[doc.id] = doc.data(); // Cambiado a usar id en lugar de codigo
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
            const codigo = prod ? prod.codigo || '' : '';
            return {
              ...item,
              productoCompleto: `${codigo} - ${nombre}`,
              precio: item.precio?.toFixed(2) || '0.00',
              subtotal: item.subtotal?.toFixed(2) || '0.00'
            };
          });

          setVenta({
            id: ventaDoc.id,
            ...data,
            fecha: formatDate(data.fecha), // Formateamos la fecha aquí
            clienteNombre,
            items: itemsConNombre,
            total: data.total?.toFixed(2) || '0.00'
          });
        } else {
          console.error('No se encontró la venta');
          navigate('/ventas', { replace: true });
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        navigate('/ventas', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ventaId, navigate]);

  if (loading) return <Typography>Cargando...</Typography>;
  if (!venta) return <Typography>No se encontró la venta</Typography>;

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Detalles de Venta</Typography>
      <Typography variant="subtitle1">N° Factura: {venta.numero || 'N/A'}</Typography>
      <Typography variant="subtitle1">Fecha: {venta.fecha}</Typography>
      <Typography variant="subtitle1">Cliente: {venta.clienteNombre}</Typography>
      <Typography variant="subtitle1">Total: ${venta.total}</Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>Productos</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venta.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productoCompleto}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>${item.precio}</TableCell>
                <TableCell>${item.subtotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => navigate('/ventas')}
        sx={{ mt: 2 }}
      >
        Volver al listado
      </Button>
    </Paper>
  );
};

export default VentaDetail;