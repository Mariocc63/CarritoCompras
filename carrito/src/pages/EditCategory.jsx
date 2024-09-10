import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField, Button, Box, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  nombre: yup.string().nullable(),
  estado: yup.string().nullable(),
});

const EditCategory = () => {
  const { auth, logoutUser } = useContext(AuthContext);
  const { idcategoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      estado: ""
    }
  });

  const watchedNombre = watch('nombre');
  const watchedEstado = watch('estado');

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
  }, [idcategoria, auth.token, setValue]);

  useEffect(() => {
    setIsEdited(!!watchedNombre || !!watchedEstado);
  }, [watchedNombre, watchedEstado]);

  const fetchProducts = async (state) => {
    try {
      const fetchProductsUrl = state === 3
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
      const newState = watchedEstado === 'Activo' ? 3 : watchedEstado === 'Inactivo' ? 4 : null;
      let hasEditedNombre = false;
      let hasEditedEstado = false;

      if (watchedNombre && watchedNombre !== categoryName) {
        hasEditedNombre = true;
        await axios.put(`http://localhost:5000/api/categoriaproductos/${idcategoria}`, {
          nombre: watchedNombre
        }, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        //console.log(watchedNombre);
      }

      if (newState !== null && newState !== currentState) {
        hasEditedEstado = true;
        await fetchProducts(newState); // Cargar productos antes de mostrar el diálogo
      }

      let dialogMessage = '';

      if (hasEditedNombre && !hasEditedEstado) {
        dialogMessage = `El nombre de la categoría ha sido actualizado a: ${watchedNombre}`;
      } else if (!hasEditedNombre && hasEditedEstado) {
        const action = newState === 3 ? 'activarán' : 'desactivarán';
        dialogMessage = `Los siguientes productos se ${action}: <br />` +
          productos.map(producto => `${producto.nombre} - código: ${producto.codigo}`).join('<br />');
      } else if (hasEditedNombre && hasEditedEstado) {
        const action = newState === 3 ? 'activarán' : 'desactivarán';
        dialogMessage = `El nombre de la categoría ha sido actualizado a: ${watchedNombre}<br />` +
          `Los siguientes productos se ${action}: <br />` +
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
      const newState = watchedEstado === 'Activo' ? 3 : watchedEstado === 'Inactivo' ? 4 : null;

      if (newState !== null) {
        await axios.put(`http://localhost:5000/api/categoriaproductos/${idcategoria}`, {
          estados_idestados: newState
        }, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        //console.log(newState);

        const updateProductsUrl = newState === 3
          ? `http://localhost:5000/api/activarproductos/${idcategoria}`
          : `http://localhost:5000/api/desactivarproductos/${idcategoria}`;

        await axios.put(updateProductsUrl, {}, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
      }

      alert('Categoría y productos actualizados con éxito');
      navigate('/viewcategories');
    } catch (error) {
      console.error('Error al actualizar la categoría o productos:', error);
    } finally {
      setDialogOpen(false);
    }
  };

  const handleGoBack = () => {
    navigate('/viewcategories');
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Editar Categoría: {categoryName}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nombre de la categoría"
            {...control.register('nombre')}
            multiline
            rows={2}
            variant="outlined"
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
                    fetchProducts(selectedState === 'Activo' ? 3 : 4);
                  }
                }}
              >
                <MenuItem value="">Seleccionar Estado</MenuItem>
                {currentState === 3 && <MenuItem value="Inactivo">Inactivo</MenuItem>}
                {currentState === 4 && <MenuItem value="Activo">Activo</MenuItem>}
              </Select>
            )}
          />
          {errors.estado && (
            <Typography color="error" variant="body2">
              {errors.estado.message}
            </Typography>
          )}
        </FormControl>
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isEdited}
          >
            Continuar
          </Button>
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
      </form>

      {/* Cuadro de diálogo para confirmar productos afectados o cambios */}
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
    </Box>
  );
};

export default EditCategory;
