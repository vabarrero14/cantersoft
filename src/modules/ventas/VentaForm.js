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

const VentaForm = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [venta, setVenta] = useState({
    numero: '',
    fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    cliente: '',
    items: [],
    total: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesSnap, productosSnap] = await Promise.all([
          getDocs(collection(db, 'clientes')),
          getDocs(collection(db, 'productos'))
        ]);
        
        setClientes(clientesSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })));
        
        setProductos(productosSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          precioVenta: parseFloat(doc.data().precioVenta) || 0,
          cantidad: parseFloat(doc.data().cantidad) || 0  // Cambiado de 'stock' a 'cantidad'
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
    setVenta({ ...venta, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...venta.items];
    updatedItems[index][field] = value;

    if (field === 'cantidad') {
      const cantidad = parseFloat(value) || 0;
      const precio = updatedItems[index].precio || 0;
      updatedItems[index].subtotal = cantidad * precio;
    }

    if (field === 'productoId' && value) {
      const producto = productos.find(p => p.id === value);
      if (producto) {
        updatedItems[index].precio = producto.precioVenta;
        updatedItems[index].subtotal = (updatedItems[index].cantidad || 0) * producto.precioVenta;
      }
    }

    const total = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setVenta({ ...venta, items: updatedItems, total });
  };

  const handleAddItem = () => {
    setVenta({
      ...venta,
      items: [...venta.items, { 
        productoId: '', 
        cantidad: 1, 
        precio: 0, 
        subtotal: 0 
      }]
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = venta.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setVenta({ ...venta, items: updatedItems, total });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validaciones
      if (venta.items.length === 0) {
        throw new Error('Debe agregar al menos un producto');
      }

      if (!venta.fecha || isNaN(new Date(venta.fecha).getTime())) {
        throw new Error('Fecha inválida');
      }

      // Validar stock y preparar datos
      const itemsConErrores = [];
      for (const item of venta.items) {
        if (!item.productoId) continue;
        
        const producto = productos.find(p => p.id === item.productoId);
        if (!producto) {
          itemsConErrores.push(`Producto no encontrado: ${item.productoId}`);
          continue;
        }
        
        if (producto.cantidad < item.cantidad) {  // Cambiado de producto.stock a producto.cantidad
          itemsConErrores.push(`Stock insuficiente para ${producto.nombre} (Stock: ${producto.cantidad}, Pedido: ${item.cantidad})`);
        }
      }

      if (itemsConErrores.length > 0) {
        throw new Error(itemsConErrores.join('\n'));
      }

      // Preparar datos para Firestore
      const ventaData = {
        ...venta,
        fecha: Timestamp.fromDate(new Date(venta.fecha)), // Usamos Timestamp explícito
        total: parseFloat(venta.total.toFixed(2)),
        items: venta.items.map(item => ({
          productoId: item.productoId,
          cantidad: parseFloat(item.cantidad),
          precio: parseFloat(item.precio),
          subtotal: parseFloat(item.subtotal.toFixed(2))
        }))
      };

      // Guardar venta
      const ventaRef = await addDoc(collection(db, 'ventas'), ventaData);
      
      // Actualizar stock y registrar movimientos
      for (const item of venta.items) {
        if (!item.productoId) continue;
        
        const productoRef = doc(db, 'productos', item.productoId);
        const productoSnap = await getDoc(productoRef);
        
        if (!productoSnap.exists()) continue;
        
        const stockActual = parseFloat(productoSnap.data().cantidad) || 0;  // Cambiado de stock a cantidad
        const cantidadVendida = parseFloat(item.cantidad) || 0;
        const nuevoStock = stockActual - cantidadVendida;
        
        // Actualizar stock
        await updateDoc(productoRef, { cantidad: nuevoStock });  // Cambiado de stock a cantidad
        
        // Registrar movimiento con Timestamp
       /* await addDoc(collection(db, 'movimientos'), {
          productoId: item.productoId,
          tipo: 'Venta',
          fecha: Timestamp.now(), // Usamos Timestamp aquí también
          cantidadAnterior: stockActual,
          cantidadMovimiento: -cantidadVendida,
          cantidadActual: nuevoStock,
          ventaId: ventaRef.id,
          cliente: venta.cliente,
          precioUnitario: item.precio
        });*/

        // ... (después de guardar la venta)
await addDoc(collection(db, 'movimientos'), {
  productoId: item.productoId,
  tipo: 'Venta',
  fecha: Timestamp.now(),
  cantidadAnterior: stockActual,
  cantidadMovimiento: -cantidadVendida,
  cantidadActual: nuevoStock,
  ventaId: ventaRef.id,
  cliente: venta.cliente,
  precioUnitario: item.precio,
  numeroDocumento: venta.numero, // 🔥 Añadir el número de factura
  documentoId: ventaRef.id // Referencia directa al documento
});
      }
      
      alert('✅ Venta registrada con éxito');
      navigate('/ventas');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`❌ Error:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && clientes.length === 0) {
    return <Typography>Cargando datos...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>Registrar Nueva Venta</Typography>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <TextField
            name="numero"
            label="N° Factura"
            value={venta.numero}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="fecha"
            type="date"
            label="Fecha de Venta"
            value={venta.fecha}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
        </Box>

        <Autocomplete
          options={clientes}
          getOptionLabel={(option) => option.nombre}
          value={clientes.find(c => c.id === venta.cliente) || null}
          onChange={(e, newValue) => 
            setVenta({...venta, cliente: newValue?.id || ''})
          }
          renderInput={(params) => (
            <TextField {...params} label="Cliente" required />
          )}
          fullWidth
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>Productos Vendidos</Typography>
        
        {venta.items.map((item, index) => (
          <Box key={index} sx={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
            gap: 2,
            alignItems: 'center',
            mb: 2
          }}>
            <Autocomplete
              options={productos.filter(p => p.cantidad > 0)}  // Cambiado de p.stock a p.cantidad
              getOptionLabel={(option) => `${option.codigo || ''} - ${option.nombre} (Stock: ${option.cantidad})`}  // Cambiado de option.stock a option.cantidad
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
              label="Precio Unit."
              value={item.precio.toFixed(2)}
              disabled
            />
            
            <TextField
              label="Subtotal"
              value={item.subtotal.toFixed(2)}
              disabled
            />
            
            <IconButton 
              color="error" 
              onClick={() => handleRemoveItem(index)}
              disabled={venta.items.length <= 1}
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
            Total: ${venta.total.toFixed(2)}
          </Typography>
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Venta'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default VentaForm;