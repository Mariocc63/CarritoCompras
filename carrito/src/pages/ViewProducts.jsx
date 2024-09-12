import React, { useState, useEffect, useContext } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, IconButton, Typography, Menu, MenuItem, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const { auth, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/verproductoscompletos', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setProducts(response.data.productos);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();
  }, [auth.token]);

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
  };

  const handleGoBack = () => {
    navigate('/confirmed-orders');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box padding={3}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ mb: 4, textAlign: 'center'}}
      >
        Lista de Productos
      </Typography>
      <TableContainer 
        component={Paper} 
        elevation={3} 
        sx={{ borderRadius: '10px', overflow: 'hidden' }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Marca</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Agregado por</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.idproductos} 
                sx={{
                  '&:hover': { backgroundColor: '#f9f9f9' }, 
                  transition: 'background-color 0.3s ease',
                }}
              >
                <TableCell>{product.idproductos}</TableCell>
                <TableCell>{product.producto}</TableCell>
                <TableCell>{product.marca}</TableCell>
                <TableCell>{product.codigo}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>Q{product.precio.toFixed(2)}</TableCell>
                <TableCell>{product.estado}</TableCell>
                <TableCell>{product.categoria}</TableCell>
                <TableCell>{product.agregado_por}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(product.idproductos)}
                    sx={{ bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' }, borderRadius: '50%' }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
        <MenuItem onClick={CerrarSesion}>Cerrar Sesión</MenuItem>
      </Menu>

      <Button
        type="button"
        variant="contained"
        color="secondary"
        onClick={handleGoBack}
        sx={{
          mt: 3,
          display: 'block',
          mx: 'auto'
        }}
      >
        Regresar
      </Button>
    </Box>
  );
};

export default ViewProducts;
