// src/components/Content.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Compras = () => <div>Vista de Compras</div>;
const Stock = () => <div>Vista de Stock</div>;
const Ventas = () => <div>Vista de Ventas</div>;
const Caja = () => <div>Vista de Caja</div>;

const Content = () => {
  return (
    <div style={{ padding: 20, flexGrow: 1 }}>
      <Routes>
        <Route path="/compras" element={<Compras />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/caja" element={<Caja />} />
      </Routes>
    </div>
  );
};

export default Content;
