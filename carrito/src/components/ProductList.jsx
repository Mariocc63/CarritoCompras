import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProducts } from '../api/products';
import { Box, Typography, Card, CardContent, CardMedia, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
//import { useCart } from '../context/CartContext';

const ProductList = ({ token }) => {
  const { auth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  //const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if(auth.token) {
      const fetchProducts = async () => {
      
        try {
          //setLoading(true);
          const data = await getProducts(token);
          setProducts(data);
          //console.log(data.productos);
        } catch (err) {
          setError('No se pudo cargar la lista de productos.');
        }
      };
      fetchProducts();
    }
    else {
      navigate('/login');
    }

  }, [token]);

  if (products === null) {
    return <Typography variant="h5">Cargando productos...</Typography>;
  }

  // Si no hay productos después de la carga
  if (products.length === 0) {
    return <Typography variant="h5">No hay productos disponibles.</Typography>;
  }

  const addToCart = (producto) => {
    setCart([...cart, producto]);
    setSubtotal(subtotal + producto.precio);
  };

  // Confirmar compra y limpiar carrito
  const confirmPurchase = () => {
    alert('Compra confirmada');
    setCart([]);
    setSubtotal(0);
  };


  return (
    <Box>
      <Typography variant="h4" gutterBottom>Lista de Productos</Typography>
      <Grid container spacing={2}>
        {products.productos.map(product => (
          <Grid item key={product.codigo} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:5000/${product.foto}`}
                alt={product.producto}
              />
              <CardContent>
                <Typography variant="h6">{product.producto}</Typography>
                <Typography variant="body2">Código: {product.codigo}</Typography>
                <Typography variant="body2">Marca: {product.marca}</Typography>
                <Typography variant="body2">Precio: Q{product.precio}</Typography>
                <Button variant="contained" color="primary" onClick={() => addToCart(product)}>
                  Añadir al carrito
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div>
        <h2>Carrito</h2>
        {cart.length > 0 ? (
          <div>
            {cart.map((item, index) => (
              <div key={index}>
                <p>{item.producto} - Q{item.precio}</p>
              </div>
            ))}
            <h3>Subtotal: Q{subtotal}</h3>
            <button onClick={confirmPurchase}>Confirmar compra</button>
          </div>
        ) : (
          <p>El carrito está vacío</p>
        )}
      </div>
    </Box>

    
  );
};

export default ProductList;
