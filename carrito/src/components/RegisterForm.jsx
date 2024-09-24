import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Container,
  Alert,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const schema = yup.object().shape({
  rol_idrol: yup.string().required("El rol es obligatorio"),
  nombre_completo: yup.string().required("El nombre es obligatorio"),
  correo_electronico: yup
    .string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  contrasenia: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  telefono: yup
    .string()
    .length(8, "El telefono debe tener 8 caracteres")
    .required("Teléfono es requerido")
    .matches(/^[0-9]+$/, "Teléfono solo debe contener números"),
  fecha_nacimiento: yup
    .date()
    .max(
      new Date(),
      "La fecha de de nacimiento no puede ser posterior a la fecha actual"
    )
    .required("La fecha de nacimiento es obligatoria")
    .typeError("La fecha de nacimiento debe ser válida"),
});

const RegisterForm = () => {
  const { registerUser, setAuth } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [registerError, setRegisterError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setRegisterError(null);

    const fecha = new Date(data.fecha_nacimiento);
    const fechaFormatoCorrecto = fecha.toISOString().split("T")[0];
    const rolNumero = data.rol_idrol === "Operador Administrativo" ? 1 : 2;

    const nueva_data = {
      rol_idrol: rolNumero,
      nombre_completo: data.nombre_completo,
      correo_electronico: data.correo_electronico,
      contrasenia: data.contrasenia,
      telefono: data.telefono,
      fecha_nacimiento: fechaFormatoCorrecto,
    };

    try {
      const user = await registerUser(nueva_data);
      setAuth(user);
      alert("Usuario registrado con éxito");
      navigate("/login");
    } catch (error) {
      setRegisterError("Ocurrió un error al registrar el usuario");
    }
  };

  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" align="center">
        Registro de Usuario
      </Typography>

      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ padding: "30px", borderRadius: "15px" }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select
                {...register("rol_idrol")}
                error={!!errors.rol_idrol}
                defaultValue=""
              >
                <MenuItem value="Operador Administrativo">
                  Operador Administrativo
                </MenuItem>
                <MenuItem value="Cliente">Cliente</MenuItem>
              </Select>
              {errors.rol_idrol && (
                <Typography color="error">
                  {errors.rol_idrol.message}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Nombre"
              {...register("nombre_completo")}
              error={!!errors.nombre_completo}
              helperText={errors.nombre_completo?.message}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Correo electrónico"
              {...register("correo_electronico")}
              error={!!errors.correo_electronico}
              helperText={errors.correo_electronico?.message}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contraseña"
              type="password"
              {...register("contrasenia")}
              error={!!errors.contrasenia}
              helperText={errors.contrasenia?.message}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Teléfono"
              {...register("telefono")}
              error={!!errors.telefono}
              helperText={errors.telefono?.message}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fecha de nacimiento"
              type="date"
              {...register("fecha_nacimiento")}
              error={!!errors.fecha_nacimiento}
              helperText={errors.fecha_nacimiento?.message}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            {registerError && (
              <Alert severity="error" onClose={() => setRegisterError("")}>
                {registerError}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Registrarse
            </Button>
            <Box position="absolute" top={10} left={10}>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleGoBack}
                startIcon={<ArrowBackIcon />}
              ></Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterForm;
