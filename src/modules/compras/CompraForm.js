import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Paper, Typography, IconButton, 
  Autocomplete, Box
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { 
  collection, getDocs, addDoc, doc, getDoc, updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const ComprasForm = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [factura, setFactura] = useState({
    numero: '',
    fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    proveedor: '',
    items: [],
    total: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provSnap, prodSnap] = await Promise.all([
          getDocs(collection(db, 'proveedores')),
          getDocs(collection(db, 'productos'))
        ]);
        
        setProveedores(provSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setProductos(prodSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          precioCompra: parseFloat(doc.data().precioCompra) || 0,
          cantidad: parseFloat(doc.data().cantidad) || 0  // Asegúrate de que cantidad esté disponible
        })));
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFactura({ ...factura, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...factura.items];
    updatedItems[index][field] = value;

    if (field === 'cantidad' || field === 'precio') {
      const cantidad = parseFloat(updatedItems[index].cantidad) || 0;
      const precio = parseFloat(updatedItems[index].precio) || 0;
      updatedItems[index].subtotal = cantidad * precio;
    }

    if (field === 'productoId' && value) {
      const producto = productos.find(p => p.id === value);
      if (producto) {
        updatedItems[index].precio = producto.precioCompra;
        updatedItems[index].subtotal = (updatedItems[index].cantidad || 0) * producto.precioCompra;
      }
    }

    const total = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setFactura({ ...factura, items: updatedItems, total });
  };

  const handleAddItem = () => {
    setFactura({
      ...factura,
      items: [...factura.items, { 
        productoId: '', 
        cantidad: 1, 
        precio: 0, 
        subtotal: 0 
      }]
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = factura.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setFactura({ ...factura, items: updatedItems, total });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validaciones
      if (factura.items.length === 0) {
        throw new Error('Debe agregar al menos un producto');
      }

      if (!factura.fecha || isNaN(new Date(factura.fecha).getTime())) {
        throw new Error('Fecha inválida');
      }

      // Preparar datos para Firestore
      const compraData = {
        ...factura,
        fecha: Timestamp.fromDate(new Date(factura.fecha)), // Usamos Timestamp explícito
        total: parseFloat(factura.total.toFixed(2)),
        items: factura.items.map(item => ({
          productoId: item.productoId,
          cantidad: parseFloat(item.cantidad),
          precio: parseFloat(item.precio),
          subtotal: parseFloat(item.subtotal.toFixed(2))
        }))
      };

      // Guardar compra
      const compraRef = await addDoc(collection(db, 'compras'), compraData);
      
      // Procesar cada item
      for (const item of factura.items) {
        if (!item.productoId) continue;
        
        const productoRef = doc(db, 'productos', item.productoId);
        const productoSnap = await getDoc(productoRef);
        
        if (!productoSnap.exists()) {
          console.warn(`Producto ${item.productoId} no encontrado`);
          continue;
        }
        
        const stockActual = parseFloat(productoSnap.data().cantidad) || 0;
        const cantidadComprada = parseFloat(item.cantidad) || 0;
        const nuevoStock = stockActual + cantidadComprada;
        
        // Actualizar stock y precio de compra
        await updateDoc(productoRef, { 
          cantidad: nuevoStock,
          precioCompra: item.precio
        });
        
        // Registrar movimiento con Timestamp
       /* await addDoc(collection(db, 'movimientos'), {
          productoId: item.productoId,
          tipo: 'Compra',
          fecha: Timestamp.now(), // Usamos Timestamp aquí
          cantidadAnterior: stockActual,
          cantidadMovimiento: +cantidadComprada,
          cantidadActual: nuevoStock,
          compraId: compraRef.id,
          proveedor: factura.proveedor,
          precioUnitario: item.precio
        });*/
        // ... (después de guardar la compra)
await addDoc(collection(db, 'movimientos'), {
  productoId: item.productoId,
  tipo: 'Compra',
  fecha: Timestamp.now(),
  cantidadAnterior: stockActual,
  cantidadMovimiento: +cantidadComprada,
  cantidadActual: nuevoStock,
  compraId: compraRef.id,
  proveedor: factura.proveedor,
  precioUnitario: item.precio,
  numeroDocumento: factura.numero, // 🔥 Añadir el número de factura
  documentoId: compraRef.id // Referencia directa al documento
});
      }
      
      alert('✅ Compra registrada con éxito');
      navigate('/compras');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && proveedores.length === 0) {
    return <Typography>Cargando datos...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>Registrar Nueva Compra</Typography>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <TextField
            name="numero"
            label="N° Factura"
            value={factura.numero}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="fecha"
            type="date"
            label="Fecha de Compra"
            value={factura.fecha}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
        </Box>

        <Autocomplete
          options={proveedores}
          getOptionLabel={(option) => option.nombre}
          value={proveedores.find(p => p.nombre === factura.proveedor) || null}
          onChange={(e, newValue) => 
            setFactura({...factura, proveedor: newValue?.nombre || ''})
          }
          renderInput={(params) => (
            <TextField {...params} label="Proveedor" required />
          )}
          fullWidth
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>Productos</Typography>
        
        {factura.items.map((item, index) => (
          <Box key={index} sx={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
            gap: 2,
            alignItems: 'center',
            mb: 2
          }}>
            <Autocomplete
              options={productos}
              getOptionLabel={(option) => `${option.codigo || ''} - ${option.nombre} (Stock: ${option.cantidad || 0})`}
              value={productos.find(p => p.id === item.productoId) || null}
              onChange={(e, newValue) => 
                handleItemChange(index, 'productoId', newValue?.id || '')
              }
              renderInput={(params) => (
                <TextField {...params} label="Producto" required />
              )}
            />
            
            <TextField
              type="number"
              label="Cantidad"
              value={item.cantidad}
              onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
              inputProps={{ min: 1, step: 1 }}
              required
            />
            
            <TextField
              type="number"
              label="Precio Unit."
              value={item.precio}
              onChange={(e) => handleItemChange(index, 'precio', e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
            
            <TextField
              label="Subtotal"
              value={item.subtotal.toFixed(2)}
              disabled
            />
            
            <IconButton 
              color="error" 
              onClick={() => handleRemoveItem(index)}
              disabled={factura.items.length <= 1}
            >
              <RemoveCircle />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<AddCircle />}
          onClick={handleAddItem}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Agregar Producto
        </Button>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          bgcolor: 'grey.100',
          borderRadius: 1
        }}>
          <Typography variant="h6">
            Total: ${factura.total.toFixed(2)}
          </Typography>
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Compra'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ComprasForm;