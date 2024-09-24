import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Container,
  Alert,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Options from "../components/Options";

const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
});

const AddCategory = () => {
  const { auth } = useContext(AuthContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
    },
  });

  const onSubmit = (data) => {
    setCategoryName(data.nombre);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/categoriaproductos",
        {
          nombre: categoryName,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      alert("Categoría creada con éxito");
      navigate("/confirmed-orders");
    } catch (error) {
      setError("Error al actualiza la categoria");
    } finally {
      setDialogOpen(false);
      reset();
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleGoBack = () => {
    navigate("/confirmed-orders");
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Agregar Categoría
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
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
          <Box mt={2} display="flex" justifyContent="center">
            <Button type="submit" variant="contained" color="primary">
              Registrar
            </Button>
          </Box>
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}
        </form>
      </Paper>

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
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Options></Options>

      <Box position="absolute" top={10} left={10}>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleGoBack}
          startIcon={<ArrowBackIcon />}
        ></Button>
      </Box>
    </Container>
  );
};

export default AddCategory;
