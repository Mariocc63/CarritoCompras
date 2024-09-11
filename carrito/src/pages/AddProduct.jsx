import React, { useState, useEffect, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import {
  TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, InputLabel, Select, MenuItem, FormControl, Typography, IconButton, Box
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';

// Define the validation schema
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
  foto: yup.mixed().required('La foto es requerida')
    .test('fileSize', 'El archivo es muy grande', value => {
      return value && value.size <= 2000000; // Limitar a 2MB
    })
    .test('fileType', 'Solo se permiten imágenes (jpg, png)', value => {
      return value && ['image/jpeg', 'image/png'].includes(value.type);
    })
});

const AddProduct = () => {
  const [categorias, setCategorias] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageName, setImageName] = useState('');
  const { auth } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
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
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImageName('');
    if (fileInputRef.current) {
        fileInputRef.current.value = null;
    }
  };

  const onSubmit = (data) => {
    console.log('Formulario enviado con datos:', data);
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
      console.error('Error al ingresar el producto', error);
    }
  };

  return (
    <Box padding={2}>
      <form onSubmit={handleSubmit(onSubmit)}>

        <Typography variant="h5">Registro de producto</Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Categoría</InputLabel>
          <Select
            {...register("categoria")}
            defaultValue=""
            error={!!errors.categoria}
          >
            {categorias.map(categoria => (
              <MenuItem key={categoria.idcategoria} value={categoria.idcategoria}>
                {categoria.categoria}
              </MenuItem>
            ))}
          </Select>
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
          label="Precio"
          type="number"
          fullWidth
          error={!!errors.precio}
          helperText={errors.precio?.message}
          margin="normal"
        />

        <Button
          variant="contained"
          component="label"
          margin="normal"
        >
          Cargar Foto
          <input
            type="file"
            hidden
            {...register("foto", { required: true })}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Button>

        {selectedFile && (
          <Box mt={2} display="flex" alignItems="center">
            <Typography variant="body2">{imageName}</Typography>
            <IconButton onClick={handleRemoveFile}>
              <ClearIcon />
            </IconButton>
          </Box>
        )}

        <Button type="submit" variant="contained" color="primary" margin="normal">
          Registrar
        </Button>

      </form>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Datos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Deseas confirmar el registro del producto con los siguientes datos?
          </DialogContentText>
          <Box>
            <Typography variant="body2">Categoría: {shippingData.categoria}</Typography>
            <Typography variant="body2">Producto: {shippingData.producto}</Typography>
            <Typography variant="body2">Marca: {shippingData.marca}</Typography>
            <Typography variant="body2">Código: {shippingData.codigo}</Typography>
            <Typography variant="body2">Stock: {shippingData.stock}</Typography>
            <Typography variant="body2">Precio: {shippingData.precio}</Typography>
            <Typography variant="body2">Foto: {shippingData.foto}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} color="primary">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default AddProduct;
