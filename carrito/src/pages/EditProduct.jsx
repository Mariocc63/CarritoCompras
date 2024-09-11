import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, Button, TextField, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, FormControl, InputLabel, Select, IconButton, Menu
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Definir el esquema de validación con yup
const schema = yup.object({
  producto: yup.string().nullable(),
  marca: yup.string().nullable(),
  codigo: yup.string().nullable(),
  stock: yup.number()
    .nullable()
    .transform((originalValue) => {
      if (originalValue === '') return null; // Convierte vacío a null
      if (isNaN(Number(originalValue))) return null; // Convierte NaN a null
      return Number(originalValue); // Asegura que sea un número
    })
    .typeError('Ingrese un número válido')
    .min(0, "El stock debe ser un número positivo"),
    precio: yup.number()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '') return null; // Convierte vacío a null
      const num = parseFloat(originalValue);
      return isNaN(num) ? null : num; // Convierte NaN a null
    })
    .typeError('Ingrese un número válido')
    .min(0, 'El precio debe ser un número positivo'),
  estado: yup.string().nullable()
}).required();

const EditProduct = () => {
  const { idproductos } = useParams();
  const navigate = useNavigate();
  const { auth, logoutUser } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const fileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      producto: '',
      marca: '',
      codigo: '',
      stock: '',
      precio: '',
      estado: ''
    },
  });

  const watchFields = watch(); // Monitorea todos los campos del formulario

  // Función para verificar si el formulario ha cambiado o si hay un archivo seleccionado
  const isFormValid = () => {
    const { producto, marca, codigo, stock, precio, estado } = watchFields;
    // Verificar si todos los campos están vacíos
    const allFieldsEmpty =
      !producto && !marca && !codigo && !stock && !precio && !estado;
    // El botón se habilita si hay algún campo cambiado o si hay un archivo seleccionado
    return !allFieldsEmpty || file;
  };

  //const watchEstado = watch('estado'); // Monitorea el estado actual

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/verproductoindividual/${idproductos}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const data = response.data.producto[0][0];
        setProduct(data);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    fetchProduct();
  }, [idproductos, auth.token, setValue]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Mostrar el nombre del archivo seleccionado
    if (selectedFile) {
      setImageName(selectedFile.name);
    } else {
      setImageName('');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImageName('');
    if (fileInputRef.current) {
        fileInputRef.current.value = null; // Resetear el valor del input de archivo
      }
  };

  const handleConfirm = async (data) => {
    const formData = new FormData();
    if(data.producto) formData.append('nombre', data.producto);
    if(data.marca) formData.append('marca', data.marca);
    if(data.codigo) formData.append('codigo', data.codigo);
    if(data.stock) formData.append('stock', data.stock);
    if(data.precio) formData.append('precio', data.precio);
    if(data.estado) formData.append('estados_idestados', data.estado === 'Activo' ? 5 : 6);
    if (file) formData.append('foto', file);

    try {
      await axios.put(`http://localhost:5000/api/productos/${idproductos}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Producto actualizado con éxito');
      navigate('/viewproducts');
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Error al actualizar el producto');
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
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
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Editar Producto: {product ? product.producto : 'Cargando...'}
      </Typography>

      {product && (
        <form onSubmit={handleSubmit(handleDialogOpen)}>
          <TextField
            label="Producto"
            fullWidth
            margin="normal"
            {...register('producto')}
            error={!!errors.producto}
            helperText={errors.producto?.message}
          />
          <TextField
            label="Marca"
            fullWidth
            margin="normal"
            {...register('marca')}
            error={!!errors.marca}
            helperText={errors.marca?.message}
          />
          <TextField
            label="Código"
            fullWidth
            margin="normal"
            {...register('codigo')}
            error={!!errors.codigo}
            helperText={errors.codigo?.message}
          />
          <TextField
            label="Stock"
            type="number"
            InputProps={{ inputProps: { step: 1 } }}
            fullWidth
            margin="normal"
            defaultValue={''}
            {...register('stock')}
            error={!!errors.stock}
            helperText={errors.stock?.message}
          />
          <TextField
            label="Precio"
            type="number"
            InputProps={{ inputProps: { step: 0.01 } }}
            fullWidth
            margin="normal"
            {...register('precio')}
            error={!!errors.precio}
            helperText={errors.precio?.message}
          />

          {/* Estado del producto */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              {...register('estado')}
              value={watchFields.estado || ''}
              error={!!errors.estado}
            >
              <MenuItem value="">Seleccionar Estado</MenuItem>
                {product.estado === 5 && <MenuItem value="Inactivo">Inactivo</MenuItem>}
                {product.estado === 6 && <MenuItem value="Activo">Activo</MenuItem>}
            </Select>
          </FormControl>

          <Typography color="error">{errors.estado?.message}</Typography>

          {/* Seleccionador de archivos */}
          <Box marginTop={2}>
            <Button variant="contained" component="label">
              Subir Foto del Producto
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {imageName && (
              <Box marginTop={2} display="flex" alignItems="center">
                <Typography variant="body1" marginRight={2}>
                  Imagen seleccionada: {imageName}
                </Typography>
                <IconButton onClick={handleRemoveFile} color="error">
                  <ClearIcon />
                </IconButton>
              </Box>
            )}
            {!file && !imageName && (
              <Typography color="textSecondary">No se ha seleccionado ninguna imagen</Typography>
            )}
          </Box>

          <Box marginTop={2}>
            <Button type="submit" variant="contained" color="primary" disabled={!isFormValid()}>
              Guardar
            </Button>
          </Box>
        </form>
      )}

      {/* Cuadro de diálogo de confirmación */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirmar Actualización</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas actualizar los siguientes datos del producto?
          </DialogContentText>
          <Typography>Producto: {watch('producto')}</Typography>
          <Typography>Marca: {watch('marca')}</Typography>
          <Typography>Código: {watch('codigo')}</Typography>
          <Typography>Stock: {watch('stock')}</Typography>
          <Typography>Precio: {watch("precio") ? "Q" + watch("precio") : ""}</Typography>
          <Typography>Estado: {watch('estado')}</Typography>
          <Typography>Foto: {imageName}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(handleConfirm)}
            color="primary"
          >
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

export default EditProduct;
