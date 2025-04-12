import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

const MarcaList = () => {
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'marcas'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMarcas(data);
      } catch (error) {
        console.error('Error al obtener marcas:', error);
      }
    };

    fetchMarcas();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Listado de Marcas
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marcas.map((marca) => (
              <TableRow key={marca.id}>
                <TableCell>{marca.nombre}</TableCell>
                <TableCell>{marca.descripcion || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MarcaList;
