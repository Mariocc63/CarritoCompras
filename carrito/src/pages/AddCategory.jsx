import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField, Button, Box, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions, Menu, MenuItem, IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AuthContext } from '../context/AuthContext';


const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio'),
});

const AddCategory = () => {
  const {auth, logoutUser} = useContext(AuthContext);  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: '',
    },
  });

  const onSubmit = (data) => {
    setCategoryName(data.nombre);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.post('http://localhost:5000/api/categoriaproductos', 
        {
          nombre: categoryName, 
        }, 
        {
          headers: { Authorization: `Bearer ${auth.token}` }, 
        }
      );
      alert('Categoría creada con éxito');
      navigate('/confirmed-orders'); 
    } catch (error) {
      console.error('Error al crear la categoría:', error);
    } finally {
      setDialogOpen(false);
      reset();  // Reinicia el formulario
    }
  };
  
  const handleClose = () => {
    setDialogOpen(false);
  };

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
  }

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
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Agregar Categoría
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre de la categoría"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
          )}
        />
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Insertar Categoría
          </Button>
        </Box>
      </form>

      {/* Cuadro de diálogo para confirmar la inserción */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Confirmar Inserción</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Está seguro de que desea agregar la categoría: {categoryName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">
            Confirmar
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
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
            style={{ marginLeft: '10px' }}
          >
            Regresar
          </Button>
    </Box>
  );
};

export default AddCategory;
