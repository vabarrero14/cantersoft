import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Table, TableHead, TableRow, TableCell, 
  TableBody, Paper, TableContainer, Button, CircularProgress,
  Chip, Link
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const MovimientosProducto = () => {
  const navigate = useNavigate();
  const { productoId } = useParams();
  const [movimientos, setMovimientos] = useState([]);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return 'Fecha inválida';
    }
  };

  const obtenerNumeroDocumento = async (movimiento) => {
    try {
      // Si ya tiene número de documento directo
      if (movimiento.numeroDocumento) {
        return {
          numero: movimiento.numeroDocumento,
          id: movimiento.compraId || movimiento.ventaId,
          tipo: movimiento.tipo.toLowerCase()
        };
      }
      
      // Para compras
      if (movimiento.tipo === 'Compra' && movimiento.compraId) {
        const compraRef = doc(db, 'compras', movimiento.compraId);
        const compraSnap = await getDoc(compraRef);
        return {
          numero: compraSnap.exists() ? compraSnap.data().numero : 'Sin número',
          id: movimiento.compraId,
          tipo: 'compra'
        };
      }
      
      // Para ventas
      if (movimiento.tipo === 'Venta' && movimiento.ventaId) {
        const ventaRef = doc(db, 'ventas', movimiento.ventaId);
        const ventaSnap = await getDoc(ventaRef);
        return {
          numero: ventaSnap.exists() ? ventaSnap.data().numero : 'Sin número',
          id: movimiento.ventaId,
          tipo: 'venta'
        };
      }
      
      return {
        numero: 'N/A',
        id: null,
        tipo: null
      };
    } catch (error) {
      console.error("Error obteniendo número de documento:", error);
      return {
        numero: 'Error',
        id: null,
        tipo: null
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener información del producto
        const productoRef = doc(db, 'productos', productoId);
        const productoSnap = await getDoc(productoRef);
        if (productoSnap.exists()) {
          setProducto({
            id: productoSnap.id,
            ...productoSnap.data(),
            cantidad: productoSnap.data().cantidad || 0
          });
        }

        // Obtener movimientos del producto
        const q = query(
          collection(db, 'movimientos'),
          where('productoId', '==', productoId),
          orderBy('fecha', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const movs = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const documentoInfo = await obtenerNumeroDocumento(data);
          
          return {
            id: doc.id,
            ...data,
            fecha: formatDate(data.fecha),
            cantidadMovimiento: data.tipo === 'Compra' ? 
              `+${data.cantidadMovimiento}` : 
              `-${Math.abs(data.cantidadMovimiento)}`,
            numeroDocumento: documentoInfo.numero,
            documentoId: documentoInfo.id,
            documentoTipo: documentoInfo.tipo
          };
        }));
        
        setMovimientos(movs);
      } catch (error) {
        console.error("Error al obtener movimientos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productoId]);

  const handleDocumentoClick = (tipo, id) => {
    if (tipo && id) {
      navigate(`/${tipo}s/${id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">
          Movimientos: {producto?.nombre || 'Producto no encontrado'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Stock actual: <strong>{producto?.cantidad || 0}</strong>
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Movimiento</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>N° Documento</TableCell>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Cantidad Anterior</TableCell>
              <TableCell>Movimiento</TableCell>
              <TableCell>Cantidad Actual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimientos.length > 0 ? (
              movimientos.map((mov) => (
                <TableRow key={mov.id} hover>
                  <TableCell>{mov.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <Chip 
                      label={mov.tipo} 
                      color={mov.tipo === 'Compra' ? 'success' : 'error'} 
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>
                    {mov.documentoId ? (
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleDocumentoClick(mov.documentoTipo, mov.documentoId)}
                        sx={{
                          fontWeight: 'bold',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          color: mov.tipo === 'Compra' ? 'success.main' : 'error.main'
                        }}
                      >
                        {mov.numeroDocumento}
                      </Link>
                    ) : (
                      <Typography>{mov.numeroDocumento}</Typography>
                    )}
                  </TableCell>
                  <TableCell>{mov.fecha}</TableCell>
                  <TableCell>{mov.cantidadAnterior}</TableCell>
                  <TableCell>
                    <Chip 
                      label={mov.cantidadMovimiento} 
                      color={mov.tipo === 'Compra' ? 'success' : 'error'} 
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>{mov.cantidadActual}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay movimientos registrados para este producto
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MovimientosProducto;