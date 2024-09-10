import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    IconButton, Typography, Paper, Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../context/AuthContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ViewCategories = () => {
  const {auth, logoutUser} = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vercategoriaproductos', {
            headers: { Authorization: `Bearer ${auth.token}` }
          });
        setCategories(response.data['Categoria Productos']);
      } catch (error) {
        console.error('Error al traer la categoria de productos', error);
      }
    };

    fetchCategories();
  }, []);

  const handleGoBackTo = () => {
    navigate("/confirmed-orders");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
  }


  const handleEditClick = (idcategoria) => {
    navigate(`/edit-category/${idcategoria}`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Categorías de Productos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.idcategoria}>
                <TableCell>{category.idcategoria}</TableCell>
                <TableCell>{category.categoria}</TableCell>
                <TableCell>{category.usuario}</TableCell>
                <TableCell>{category.estado}</TableCell>
                <TableCell>{new Date(category.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(category.idcategoria)}
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
          type="submit"
          variant="contained"
          color="secondary"
          onClick={handleGoBackTo}
        >
          Regresar
        </Button>
    </Box>
  );
};

export default ViewCategories;
