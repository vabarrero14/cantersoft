// src/modules/compras/CompraDetail.js
import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const CompraDetail = () => {
  const { compraId } = useParams(); // Obtiene el ID de la compra desde la URL
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const fetchCompra = async () => {
      const compraDoc = await getDoc(doc(db, 'compras', compraId));
      if (compraDoc.exists()) {
        setCompra({ id: compraDoc.id, ...compraDoc.data() });
      } else {
        console.error('No se encontró la compra');
      }
    };
    fetchCompra();
  }, [compraId]);

  if (!compra) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Detalles de Compra</Typography>
      <Typography variant="subtitle1">N° Factura: {compra.numero}</Typography>
      <Typography variant="subtitle1">Fecha: {compra.fecha}</Typography>
      <Typography variant="subtitle1">Proveedor: {compra.proveedor}</Typography>
      <Typography variant="subtitle1">Total: {compra.total.toFixed(2)}</Typography>

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
            {compra.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productoId}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>{item.precio}</TableCell>
                <TableCell>{item.subtotal.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="outlined" color="primary" onClick={() => navigate('/compras')}>
        Volver
      </Button>
    </Paper>
  );
};

export default CompraDetail;
