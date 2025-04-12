// src/components/Content.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductoList from '../modules/stock/ProductoList';
import ProductoForm from '../modules/stock/ProductoForm';
import CategoriaForm from '../modules/categorias/CategoriaForm';
import CategoriaList from '../modules/categorias/CategoriaList';
import ProveedorForm from '../modules/proveedor/ProveedorForm';
import ProveedorList from '../modules/proveedor/ProveedorList';
import MarcaForm from '../modules/marcas/MarcaForm';
import MarcaList from '../modules/marcas/MarcaList';

const Compras = () => <div>Vista de Compras</div>;
const Ventas = () => <div>Vista de Ventas</div>;
const Caja = () => <div>Vista de Caja</div>;

const Content = () => {
  return (
    <div style={{ padding: 20, flexGrow: 1 }}>
      <Routes>
        <Route path="/compras" element={<Compras />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/caja" element={<Caja />} />
        <Route path="/stock/listado" element={<ProductoList />} />
        <Route path="/stock/nuevo" element={<ProductoForm />} />
        <Route path="/categorias" element={<CategoriaList />} />
        <Route path="/categorias/nueva" element={<CategoriaForm />} />
        <Route path="/proveedores" element={<ProveedorList />} />
        <Route path="/proveedores/nuevo" element={<ProveedorForm />} />
        <Route path="/marcas" element={<MarcaList />} />
        <Route path="/marcas/nueva" element={<MarcaForm />} />
      </Routes>
    </div>
  );
};

export default Content;
