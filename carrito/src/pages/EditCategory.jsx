import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Menu,
  Box,
  Paper,
  Alert
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const schema = yup.object().shape({
  nombre: yup.string().nullable(),
  estado: yup.string().nullable(),
});

const EditCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productosActivos, setProductosActivos] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { idcategoria } = useParams();
  const { auth, logoutUser } = useContext(AuthContext);
  const [ error, setError] = useState(null);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      estado: ""
    }
  });

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
        const { categoria, estado } = response.data.categoriaproducto[0];
        setCategoryName(categoria);
        setCurrentState(estado === ESTADOS.ACTIVO ? 'Activo' : 'Inactivo');
      } catch (error) {
        console.error('Error al seleccionar la categoria', error);
      }
    };

    const fetchProductosActivos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vercatproductosactivos/${idcategoria}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setProductosActivos(response.data.productos.length > 0);
      } catch (error) {
        console.error('Error al verificar productos activos:', error);
      }
    };

    fetchCategory();
    fetchProductosActivos();
  }, [idcategoria, auth.token]);

  const onSubmit = (data) => {
    if (productosActivos && data.estado === 'Inactivo') {
      setError('No puedes desactivar la categoría, hay productos activos');
      return;
    }
    setDialogOpen(true);
  };

  const confirmarCambios = async (formData) => {
    const payload = {};
    if (formData.nombre !== categoryName && formData.nombre.trim() !== '') payload.nombre = formData.nombre;
    if (formData.estado !== currentState && formData.estado.trim() !== '') payload.estados_idestados = formData.estado === 'Activo' ? ESTADOS.ACTIVO : ESTADOS.INACTIVO;

    try {
      await axios.put(`http://localhost:5000/api/categoriaproductos/${idcategoria}`, payload, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setDialogOpen(false);
      alert('Categoría actualizada correctamente');
      navigate('/viewcategories');
    } catch (error) {
      setError('Error al actualiza la categoria');
    }
  };

  useEffect(() => {
    const subscription = watch((data) => {
      const nombreModificado = data.nombre && data.nombre.trim() !== '' && data.nombre !== categoryName;
      const estadoModificado = data.estado && data.estado.trim() !== '' && data.estado !== currentState;
      setFormChanged(nombreModificado || estadoModificado);
    });
    return () => subscription.unsubscribe();
  }, [watch, categoryName, currentState]);

  const CerrarSesion = () => {
    logoutUser();
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGoBack = () => {
    navigate('/viewcategories');
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
      <Typography variant="h4" align="center" style={{ marginBottom: '20px', width: '400px' }}>
        Editar Categoría
      </Typography>

      <Paper elevation={3} style={{ padding: '20px', width: '400px', marginBottom: '20px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <Typography variant="h6">Información actual:</Typography>
            <Typography>Nombre: {categoryName}</Typography>
            <Typography>Estado: {currentState}</Typography>
          </Box>

          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre"
                fullWidth
                margin="normal"
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
            )}
          />

          <Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Estado"
                fullWidth
                margin="normal"
                error={!!errors.estado}
                helperText={errors.estado?.message}
              >
                <MenuItem value="">
                  <em>Seleccionar Estado</em>
                </MenuItem>
                {currentState === 'Activo' ? (
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                ) : (
                  <MenuItem value="Activo">Activo</MenuItem>
                )}
              </TextField>
            )}
          />

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formChanged}
              style={{ width: '150px' }}
            >
              Guardar
            </Button>
          </Box>

          {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        </form>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirmar Cambios</DialogTitle>
          <DialogContent>
            <Typography>¿Estás seguro de que quieres realizar los siguientes cambios?</Typography>
            <Typography>Nombre: {watch('nombre')}</Typography>
            <Typography>Estado: {watch('estado')}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit(confirmarCambios)} color="primary">
              Confirmar
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
      </Paper>

      <Box position="absolute" top={10} left={10}>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleGoBack}
          startIcon={<ArrowBackIcon />}
        >
        </Button>
      </Box>
    </Box>
  );
};

export default EditCategory;
