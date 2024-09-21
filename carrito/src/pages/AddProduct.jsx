import React, { useState, useEffect, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import {
  TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, InputLabel, Select, MenuItem, Menu, FormControl, Typography, IconButton, Box, Paper, Alert
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const schema = yup.object().shape({
  categoria: yup.string().required("La categoría es requerida"),
  producto: yup.string().required("El nombre del producto es requerido"),
  marca: yup.string().required("La marca es requerida"),
  codigo: yup.string().required("El código del producto es requerido"),
  stock: yup.number()
    .transform((originalValue) => {
      if (originalValue === '') return null;
      if (isNaN(Number(originalValue))) return null;
      return Number(originalValue);
    })
    .typeError('Ingrese un número válido')
    .min(0, "El stock debe ser un número positivo")
    .required("El stock es requerido"),
  precio: yup.number().required()
    .transform((value, originalValue) => {
      if (originalValue === '') return null;
      const num = parseFloat(originalValue);
      return isNaN(num) ? null : num;
    })
    .typeError('Ingrese un número válido')
    .min(0, 'El precio debe ser un número positivo')
    .required("El precio es requerido"),
  foto: yup.mixed().required('La foto es requerida'),
});

const AddProduct = () => {
  const [categorias, setCategorias] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageName, setImageName] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const { auth, logoutUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { register, handleSubmit, reset, setValue, formState: { errors }, trigger } = useForm({
    resolver: yupResolver(schema)
  });

  const [shippingData, setShippingData] = useState({
    categoria: '',
    producto: '',
    marca: '',
    codigo: '',
    stock: '',
    precio: '',
    foto: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vercategorias', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setCategorias(response.data.categorias);
      } catch (error) {
        console.error('Error al obtener las categorías', error);
      }
    };
    fetchCategories();
  }, [auth.token]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFile(selectedFile);

    if (selectedFile) {
      setImageName(selectedFile.name);
    } else {
      setImageName('');
    }

    setValue("foto", selectedFile);
    trigger('foto');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImageName('');
    fileInputRef.current.value = null;
    setValue("foto", null);
  };

  const onSubmit = (data) => {
    setShippingData({
      ...data,
      foto: imageName
    });
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append('categoriaproductos_idcategoriaproductos', shippingData.categoria);
    formData.append('nombre', shippingData.producto);
    formData.append('marca', shippingData.marca);
    formData.append('codigo', shippingData.codigo);
    formData.append('stock', shippingData.stock);
    formData.append('precio', shippingData.precio);

    if (selectedFile) formData.append('foto', selectedFile);

    try {
      await axios.post('http://localhost:5000/api/productos', formData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert("Producto ingresado con éxito");
      navigate("/viewproducts");
    } catch (error) {
      
      setError('Error al crear el producto');
    }
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
    <Box padding={2} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Registro de Producto
      </Typography>
      
      <Paper elevation={3} sx={{ padding: 3, width: '100%', maxWidth: 600 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select
              {...register("categoria")}
              defaultValue=""
              error={!!errors.categoria}
              onChange={(event) => {
                const selectedCategoryId = event.target.value;
                const selectedCategory = categorias.find(categoria => categoria.idcategoria === selectedCategoryId);
                
                setValue("categoria", selectedCategoryId);
                setSelectedCategoryName(selectedCategory ? selectedCategory.categoria : '');
                trigger('categoria');
              }}
            >
              {categorias.map(categoria => (
                <MenuItem key={categoria.idcategoria} value={categoria.idcategoria}>
                  {categoria.categoria}
                </MenuItem>
              ))}
            </Select>
            {errors.categoria && <Typography color="error">{errors.categoria.message}</Typography>}
            
          </FormControl>

          <TextField
            {...register("producto")}
            label="Producto"
            fullWidth
            error={!!errors.producto}
            helperText={errors.producto?.message}
            margin="normal"
          />

          <TextField
            {...register("marca")}
            label="Marca"
            fullWidth
            error={!!errors.marca}
            helperText={errors.marca?.message}
            margin="normal"
          />

          <TextField
            {...register("codigo")}
            label="Código"
            fullWidth
            error={!!errors.codigo}
            helperText={errors.codigo?.message}
            margin="normal"
          />

          <TextField
            {...register("stock")}
            label="Stock"
            type="number"
            fullWidth
            error={!!errors.stock}
            helperText={errors.stock?.message}
            margin="normal"
          />

          <TextField
            {...register("precio")}
            label="Q Precio"
            type="number"
            fullWidth
            error={!!errors.precio}
            helperText={errors.precio?.message}
            margin="normal"
          />

            <Box marginTop={2} display="flex" flexDirection="column" alignItems="center">
            <Button variant="contained" color="secondary" component="label" sx={{ backgroundColor: '#388E3C'}}>
                Cargar Foto
                <input
                  type="file"
                  hidden
                  {...register("foto")} 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Button>

              {errors.foto && <Typography color="error">{errors.foto.message}</Typography>}

          {selectedFile && (
            <Box mt={2} display="flex" alignItems="center" justifyContent="center">
              <Typography variant="body2" sx={{ marginRight: 1 }}>{imageName}</Typography>
              <IconButton onClick={handleRemoveFile}>
                <ClearIcon />
              </IconButton>
            </Box>
          )}
            </Box>
              


          <Box display="flex" justifyContent="center" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Registrar
            </Button>
          </Box>
          {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
          )}
        </form>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Datos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Deseas confirmar el registro del producto con los siguientes datos?
          </DialogContentText>
          <Box>
            <Typography variant="body2">Categoría: {selectedCategoryName}</Typography>
            <Typography variant="body2">Producto: {shippingData.producto}</Typography>
            <Typography variant="body2">Marca: {shippingData.marca}</Typography>
            <Typography variant="body2">Código: {shippingData.codigo}</Typography>
            <Typography variant="body2">Stock: {shippingData.stock}</Typography>
            <Typography variant="body2">Precio: Q{parseFloat(shippingData.precio).toFixed(2)}</Typography>
            <Typography variant="body2">Foto: {shippingData.foto}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

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

      <IconButton onClick={handleMenuOpen} color="inherit" sx={{ position: 'absolute', top: 16, right: 16 }}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={CerrarSesion}>Cerrar sesión</MenuItem>
      </Menu>
    </Box>
  );
};

export default AddProduct;
