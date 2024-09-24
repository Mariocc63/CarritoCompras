import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Alert,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Options from "../components/Options";

const schema = yup
  .object({
    producto: yup.string().nullable(),
    marca: yup.string().nullable(),
    codigo: yup.string().nullable(),
    stock: yup
      .number()
      .nullable()
      .transform((originalValue) => {
        if (originalValue === "") return null;
        if (isNaN(Number(originalValue))) return null;
        return Number(originalValue);
      })
      .typeError("Ingrese un número válido")
      .min(0, "El stock debe ser un número positivo"),
    precio: yup
      .number()
      .nullable()
      .transform((value, originalValue) => {
        if (originalValue === "") return null;
        const num = parseFloat(originalValue);
        return isNaN(num) ? null : num;
      })
      .typeError("Ingrese un número válido")
      .min(0, "El precio debe ser un número positivo"),
    estado: yup.string().nullable(),
  })
  .required();

const EditProduct = () => {
  const { idproductos } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const ESTADOS = {
    ACTIVO: 5,
    INACTIVO: 6,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      producto: "",
      marca: "",
      codigo: "",
      stock: "",
      precio: "",
      estado: "",
    },
  });

  const watchFields = watch();

  const isFormValid = () => {
    const { producto, marca, codigo, stock, precio, estado } = watchFields;
    const allFieldsEmpty =
      !producto && !marca && !codigo && !stock && !precio && !estado;
    return !allFieldsEmpty || file;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/verproductoindividual/${idproductos}`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        const data = response.data.producto[0][0];
        setProduct(data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProduct();
  }, [idproductos, auth.token, setValue]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setImageName(selectedFile.name);
    } else {
      setImageName("");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImageName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleConfirm = async (data) => {
    const formData = new FormData();
    if (data.producto) formData.append("nombre", data.producto);
    if (data.marca) formData.append("marca", data.marca);
    if (data.codigo) formData.append("codigo", data.codigo);
    if (data.stock) formData.append("stock", data.stock);
    if (data.precio) formData.append("precio", data.precio);
    if (data.estado)
      formData.append(
        "estados_idestados",
        data.estado === "Activo" ? ESTADOS.ACTIVO : ESTADOS.INACTIVO
      );
    if (file) formData.append("foto", file);

    try {
      await axios.put(
        `http://localhost:5000/api/productos/${idproductos}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Producto actualizado con éxito");
      navigate("/viewproducts");
    } catch (error) {
      setError("Error al actualizar el producto");
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleGoBack = () => {
    navigate("/viewproducts");
  };

  return (
    <Box padding={2} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom align="center">
        Editar Producto
      </Typography>

      {product && (
        <Box
          width="100%"
          maxWidth={600}
          padding={3}
          border={1}
          borderColor="grey.400"
          borderRadius={2}
          boxShadow={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            width="100%"
          >
            <Typography variant="h6">Información actual:</Typography>
            <Typography>Poducto: {product.producto}</Typography>
            <Typography>Marca: {product.marca}</Typography>
            <Typography>Codigo: {product.codigo}</Typography>
            <Typography>Stock: {product.stock}</Typography>
            <Typography>
              Precio: Q{parseFloat(product.precio).toFixed(2)}
            </Typography>
            <Typography>
              Estado:{" "}
              {product.estado === ESTADOS.ACTIVO ? "Activo" : "Inactivo"}
            </Typography>
          </Box>

          <form
            onSubmit={handleSubmit(handleDialogOpen)}
            style={{ width: "100%" }}
          >
            <TextField
              label="Producto"
              fullWidth
              margin="normal"
              {...register("producto")}
              error={!!errors.producto}
              helperText={errors.producto?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Marca"
              fullWidth
              margin="normal"
              {...register("marca")}
              error={!!errors.marca}
              helperText={errors.marca?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Código"
              fullWidth
              margin="normal"
              {...register("codigo")}
              error={!!errors.codigo}
              helperText={errors.codigo?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Stock"
              type="number"
              InputProps={{ inputProps: { step: 1 } }}
              fullWidth
              margin="normal"
              defaultValue={""}
              {...register("stock")}
              error={!!errors.stock}
              helperText={errors.stock?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Q Precio"
              type="number"
              InputProps={{ inputProps: { step: 0.01 } }}
              fullWidth
              margin="normal"
              {...register("precio")}
              error={!!errors.precio}
              helperText={errors.precio?.message}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                {...register("estado")}
                value={watchFields.estado || ""}
                error={!!errors.estado}
              >
                <MenuItem value="">Seleccionar Estado</MenuItem>
                {product.estado === ESTADOS.ACTIVO && (
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                )}
                {product.estado === ESTADOS.INACTIVO && (
                  <MenuItem value="Activo">Activo</MenuItem>
                )}
              </Select>
            </FormControl>

            <Typography color="error" sx={{ mb: 2 }}>
              {errors.estado?.message}
            </Typography>

            <Box
              marginTop={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Button
                variant="contained"
                color="secondary"
                component="label"
                sx={{ backgroundColor: "#388E3C" }}
              >
                Cargar foto
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Button>
              {imageName && (
                <Box marginTop={2} display="flex" alignItems="center">
                  <Typography variant="body2">{imageName}</Typography>
                  <IconButton onClick={handleRemoveFile} sx={{ ml: 1 }}>
                    <ClearIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box display="flex" justifyContent="center" marginTop={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isFormValid()}
              >
                Guardar
              </Button>
            </Box>
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}
          </form>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirmar Cambios</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres guardar los cambios realizados en este
            producto?
          </DialogContentText>
          <Typography variant="body1">Producto: {watch("producto")}</Typography>
          <Typography variant="body1">Marca: {watch("marca")}</Typography>
          <Typography variant="body1">Código: {watch("codigo")}</Typography>
          <Typography variant="body1">Stock: {watch("stock")}</Typography>
          <Typography variant="body1">
            Precio: {watch("precio") ? "Q" + watch("precio") : ""}
          </Typography>
          <Typography variant="body1">Estado: {watch("estado")}</Typography>
          <Typography variant="body1">Foto: {imageName}</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              handleDialogClose();
              handleSubmit(handleConfirm)();
            }}
            color="primary"
          >
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
    </Box>
  );
};

export default EditProduct;
