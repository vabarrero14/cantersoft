// src/components/Content.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StockPage from '../modules/stock'; // Importamos el componente StockPage

const Compras = () => <div>Vista de Compras</div>;
const Ventas = () => <div>Vista de Ventas</div>;
const Caja = () => <div>Vista de Caja</div>;

const Content = () => {
  return (
    <div style={{ padding: 20, flexGrow: 1 }}>
      <Routes>
        <Route path="/compras" element={<Compras />} />
        <Route path="/stock" element={<StockPage />} /> {/* Ruta del módulo Stock */}
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/caja" element={<Caja />} />
        {/* Puedes agregar otras rutas si es necesario */}
      </Routes>
    </div>
  );
};

export default Content;
