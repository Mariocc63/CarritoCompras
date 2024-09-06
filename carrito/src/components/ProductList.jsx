import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/products';
import { Box, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';

const ProductList = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(token);
        setProducts(data);
      } catch (err) {
        setError('No se pudo cargar la lista de productos.');
      }
    };

    fetchProducts();
  }, [token]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Lista de Productos</Typography>
      <Grid container spacing={2}>
        {products.map(product => (
          <Grid item key={product.codigo} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:5000/${product.foto}`}
                alt={product.nombre}
              />
              <CardContent>
                <Typography variant="h6">{product.nombre}</Typography>
                <Typography variant="body2">Código: {product.codigo}</Typography>
                <Typography variant="body2">Marca: {product.marca}</Typography>
                <Typography variant="body2">Precio: ${product.precio}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
