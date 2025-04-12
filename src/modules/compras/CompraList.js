// src/modules/compras/ComprasList.js
import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const ComprasList = () => {
  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompras = async () => {
      const comprasSnap = await getDocs(collection(db, 'compras'));
      const comprasData = comprasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompras(comprasData);
    };
    fetchCompras();
  }, []);

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>Listado de Compras</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/compras/nueva')} sx={{ mb: 2 }}>
        Nueva Compra
      </Button>
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
                <TableCell>{compra.numero}</TableCell>
                <TableCell>{compra.fecha}</TableCell>
                <TableCell>{compra.proveedor}</TableCell>
                <TableCell>{compra.total.toFixed(2)}</TableCell>
                <TableCell>
                  {/* Si después querés ver más detalles o editar */}
                  <Button variant="outlined" size="small">Ver</Button>
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
    </Paper>
  );
};

export default ComprasList;
