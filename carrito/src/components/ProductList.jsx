import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProducts } from '../api/products';
import { Box, Typography, Card, CardContent, CardMedia, Grid, Button, IconButton, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import '../styles/style.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CartContext } from '../context/CartContext'; // Importar el CartContext


const ProductList = ({ token }) => {
  const { auth, logoutUser } = useContext(AuthContext);
  const { cart, subtotal, addToCart, decreaseQuantity, removeFromCart, clearCart } = useContext(CartContext); // Usar el contexto del carrito
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) {
      const fetchProducts = async () => {
        try {
          const data = await getProducts(token);
          setProducts(data);
        } catch (err) {
          setError('No se pudo cargar la lista de productos.');
        }
      };
      fetchProducts();
    } else {
      navigate('/login');
    }
  }, [token, auth.token, navigate]);

  if (products === null) {
    return <Typography variant="h5">Cargando productos...</Typography>;
  }

  if (products.length === 0) {
    return <Typography variant="h5">No hay productos disponibles.</Typography>;
  }

  const handleConfirmPurchase = () => {
    // Implementar la lógica para confirmar la compra
    navigate("/order");
  };

  const isCartEmpty = cart.length === 0;

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
    clearCart();
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
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
      

      <AppBar>
        <Toolbar>
          <Typography variant="h6">Carrito</Typography>
          {cart.length > 0 ? (
            <div className='cart-container'>
              {cart.map((item, index) => (
                <div key={index} className='cart-item'>
                  <p>{item.producto.producto} - Q{item.producto.precio} x {item.cantidad} unidades</p>
                  <IconButton 
                    color="primary" 
                    onClick={() => addToCart(item.producto)} 
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton 
                    color="primary" 
                    onClick={() => decreaseQuantity(item.producto.codigo)} 
                    disabled={item.cantidad === 1}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <IconButton 
                    color="secondary" 
                    onClick={() => removeFromCart(item.producto.codigo)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
              <Typography variant="h6">Subtotal: Q{subtotal}</Typography>
              
            </div>
          ) : (
            <p>El carrito está vacío</p>
          )}
            <Button variant="contained" color="primary" onClick={handleConfirmPurchase} size='small' disabled={isCartEmpty}>
              Confirmar Compra
            </Button>
            <Button variant="contained" color="secondary" onClick={clearCart} size='small'>
              Cancelar Compra
            </Button>
        </Toolbar>
        <IconButton 
        aria-controls="simple-menu" 
        aria-haspopup="true" 
        onClick={handleMenuOpen}
        style={{ position: 'absolute', top: 10, right: 10 }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleNavigate('/historial')}>Historial de Órdenes</MenuItem>
        <MenuItem onClick={CerrarSesion}>Cerrar Sesión</MenuItem>
      </Menu>
      
      </AppBar>
      {/* <Button variant="contained" 
            color="secondary" 
            onClick={CerrarSesion}
      >
            Cerrar sesión
    </Button>
     */}
    </Box>
  );
};

export default ProductList;
