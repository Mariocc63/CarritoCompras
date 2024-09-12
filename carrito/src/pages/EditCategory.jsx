import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField, Button, Box, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Paper, Menu, IconButton
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const schema = yup.object().shape({
  nombre: yup.string().nullable(),
  estado: yup.string().nullable(),
});

const EditCategory = () => {
  const { auth } = useContext(AuthContext);
  const { idcategoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      estado: ""
    }
  });

  const watchedNombre = watch('nombre');
  const watchedEstado = watch('estado');

  const ESTADOS = {
    ACTIVO: 3,
    INACTIVO: 4
  }

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vercategoria/${idcategoria}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setCurrentState(response.data.categoriaproducto[0].estado);
        setCategoryName(response.data.categoriaproducto[0].categoria);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategory();
  }, [idcategoria, auth.token]);

  useEffect(() => {
    setIsEdited(!!watchedNombre || !!watchedEstado);
  }, [watchedNombre, watchedEstado]);

  const fetchProducts = async (state) => {
    try {
      const fetchProductsUrl = state === ESTADOS.ACTIVO
        ? `http://localhost:5000/api/vercatproductosinactivos/${idcategoria}`
        : `http://localhost:5000/api/vercatproductosactivos/${idcategoria}`;

      const productResponse = await axios.get(fetchProductsUrl, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setProductos(productResponse.data.productos);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const newState = watchedEstado === 'Activo' ? ESTADOS.ACTIVO : watchedEstado === 'Inactivo' ? ESTADOS.INACTIVO : null;
      let hasEditedNombre = false;
      let hasEditedEstado = false;

      if (watchedNombre && watchedNombre !== categoryName) {
        hasEditedNombre = true;
        await axios.put(`http://localhost:5000/api/categoriaproductos/${idcategoria}`, {
          nombre: watchedNombre
        }, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
      }

      if (newState !== null && newState !== currentState) {
        hasEditedEstado = true;
        await fetchProducts(newState);
      }

      let dialogMessage = '';

      if (hasEditedNombre && !hasEditedEstado) {
        dialogMessage = `El nombre de la categoría ha sido actualizado a: ${watchedNombre}`;
      } else if (!hasEditedNombre && hasEditedEstado) {
        const action = newState === ESTADOS.ACTIVO ? 'activarán' : 'desactivarán';
        dialogMessage = `La categoria: ${categoryName} y los siguientes productos se ${action}: <br />` +
          productos.map(producto => `${producto.nombre} - código: ${producto.codigo}`).join('<br />');
      } else if (hasEditedNombre && hasEditedEstado) {
        const action = newState === ESTADOS.ACTIVO ? 'activarán' : 'desactivarán';
        dialogMessage = `El nombre de la categoría ha sido actualizado a: ${watchedNombre}<br />` +
          `Y la categoria ${watchedNombre} y los siguientes productos se ${action}: <br />` +
          productos.map(producto => `${producto.nombre} - código: ${producto.codigo}`).join('<br />');
      }

      setDialogContent(dialogMessage);
      setDialogOpen(true);

    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      const newState = watchedEstado === 'Activo' ? ESTADOS.ACTIVO : watchedEstado === 'Inactivo' ? ESTADOS.INACTIVO : null;

      if (newState !== null) {
        await axios.put(`http://localhost:5000/api/categoriaproductos/${idcategoria}`, {
          estados_idestados: newState
        }, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        const updateProductsUrl = newState === ESTADOS.ACTIVO
          ? `http://localhost:5000/api/activarproductos/${idcategoria}`
          : `http://localhost:5000/api/desactivarproductos/${idcategoria}`;

        await axios.put(updateProductsUrl, {}, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
      }

      alert('Categoría actualizada con éxito');
      navigate('/viewcategories');
    } catch (error) {
      alert("Error al actualizar la categoria");
      console.error('Error al actualizar la categoría o productos:', error);
    } finally {
      setDialogOpen(false);
    }
  };

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
  };

  const handleGoBack = () => {
    navigate('/viewcategories');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center" height="100vh">
      <Paper elevation={3} sx={{ padding: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" gutterBottom align="center">
          Editar Categoría: {categoryName}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth margin="normal">
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre de la categoría"
                  multiline
                  rows={2}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Estado"
                  onChange={(event) => {
                    field.onChange(event);
                    const selectedState = event.target.value;
                    if (selectedState) {
                      fetchProducts(selectedState === 'Activo' ? ESTADOS.ACTIVO : ESTADOS.INACTIVO);
                    }
                  }}
                  size="small"
                >
                  <MenuItem value="">Seleccionar Estado</MenuItem>
                  {currentState === ESTADOS.ACTIVO && <MenuItem value="Inactivo">Inactivo</MenuItem>}
                  {currentState === ESTADOS.INACTIVO && <MenuItem value="Activo">Activo</MenuItem>}
                </Select>
              )}
            />
            {errors.estado && (
              <Typography color="error" variant="body2" mt={1}>
                {errors.estado.message}
              </Typography>
            )}
          </FormControl>
          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isEdited}
              size="large"
            >
              Continuar
            </Button>
          </Box>
        </form>
      </Paper>

      <Box display="flex" justifyContent="center" marginTop={2}>
        <Button variant="contained" color="secondary" onClick={handleGoBack}>
          Volver
        </Button>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Confirmar Cambios</DialogTitle>
        <DialogContent>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: dialogContent }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">
            Confirmar
          </Button>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
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
    </Box>
  );
};

export default EditCategory;
