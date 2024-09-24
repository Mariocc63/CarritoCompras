import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProducts } from "../api/products";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CartContext } from "../context/CartContext";

const ProductList = ({ token }) => {
  const { auth, logoutUser } = useContext(AuthContext);
  const { cart, addToCart, clearCart } = useContext(CartContext);
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
          setError("No se pudo cargar la lista de productos.");
        }
      };
      fetchProducts();
    } else {
      navigate("/login");
    }
  }, [token, auth.token, navigate]);

  if (products === null) {
    return <Typography variant="h5">Cargando productos...</Typography>;
  }

  if (products.length === 0) {
    return <Typography variant="h5">No hay productos disponibles.</Typography>;
  }

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
    clearCart();
  };

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

  const uniqueProductsCount = cart.length;

  return (
    <Box sx={{ paddingTop: "70px" }}>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            aria-label="carrito"
            color="inherit"
            onClick={() => handleNavigate("/cart")}
          >
            <Badge badgeContent={uniqueProductsCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => handleNavigate("/historial")}>
              Historial de Órdenes
            </MenuItem>
            <MenuItem onClick={CerrarSesion}>Cerrar Sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" align="center">
        Lista de Productos
      </Typography>
      <Grid container spacing={3}>
        {products.productos.map((product) => (
          <Grid item key={product.codigo} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardMedia
                component="img"
                sx={{ height: 200, objectFit: "contain", padding: "10px" }}
                image={`http://localhost:5000/${product.foto}`}
                alt={product.producto}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.producto}
                </Typography>
                <Typography variant="body2">
                  Código: {product.codigo}
                </Typography>
                <Typography variant="body2">Marca: {product.marca}</Typography>
                <Typography variant="body1">
                  Precio: Q{product.precio.toFixed(2)}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "10px" }}
                onClick={() => addToCart(product)}
              >
                Añadir al carrito
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
