// src/modules/stock/index.js
import React from 'react';
import ProductoForm from './ProductoForm';
import ProductoList from './ProductoList';
import { Grid } from '@mui/material';

const StockPage = () => {
  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      <Grid item xs={12} md={4}>
        <ProductoForm />
      </Grid>
      <Grid item xs={12} md={8}>
        <ProductoList />
      </Grid>
    </Grid>
  );
};

export default StockPage;
