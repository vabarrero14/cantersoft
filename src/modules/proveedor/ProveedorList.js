// src/modules/proveedor/ProveedorList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

const ProveedorList = () => {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'proveedores'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProveedores(data);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };

    fetchProveedores();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Listado de Proveedores
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Razón Social</TableCell>
              <TableCell>RUC</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((prov) => (
              <TableRow key={prov.id}>
                <TableCell>{prov.nombre}</TableCell>
                <TableCell>{prov.razonSocial || '-'}</TableCell>
                <TableCell>{prov.ruc || '-'}</TableCell>
                <TableCell>{prov.telefono || '-'}</TableCell>
                <TableCell>{prov.direccion || '-'}</TableCell>
                <TableCell>{prov.email || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProveedorList;
