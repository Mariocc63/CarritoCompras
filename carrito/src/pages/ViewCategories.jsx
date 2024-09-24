import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { AuthContext } from "../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Options from "../components/Options";

const ViewCategories = () => {
  const { auth } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/vercategoriaproductos",
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setCategories(response.data["Categoria Productos"]);
      } catch (error) {
        console.error("Error al traer la categoria de productos", error);
      }
    };

    fetchCategories();
  }, [auth.token]);

  const handleGoBack = () => {
    navigate("/confirmed-orders");
  };

  const handleEditClick = (idcategoria) => {
    navigate(`/edit-category/${idcategoria}`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: "center" }}>
        Categorías de Productos
      </Typography>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: "10px", overflow: "hidden" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Agregado por</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Fecha de Creación
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.idcategoria}>
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  {category.idcategoria}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  {category.categoria}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  {category.usuario}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  {category.estado}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  {new Date(category.fecha_creacion).toLocaleDateString()}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(category.idcategoria)}
                    sx={{
                      bgcolor: "#e0f7fa",
                      "&:hover": { bgcolor: "#b2ebf2" },
                      borderRadius: "50%",
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

export default ViewCategories;
