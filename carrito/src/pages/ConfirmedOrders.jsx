import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Container,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ConfirmedOrders = () => {
  const [orders, setOrders] = useState([]);
  const { auth, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [productAnchorEl, setProductAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();

  const logOut = () => {
    logoutUser();
    navigate("/login");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/verordenes",
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setOrders(response.data.historial.ordenes);
      } catch (error) {
        console.error("Error al obtener los datos de las ordenes:", error);
      }
    };

    fetchOrders();
  }, [auth.token]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCategoryAnchorEl(null);
  };

  const handleCategoryMenuOpen = (event) => {
    setCategoryAnchorEl(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryAnchorEl(null);
  };

  const handleProductMenuOpen = (event) => {
    setProductAnchorEl(event.currentTarget);
  };

  const handleProductMenuClose = () => {
    setProductAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const filterOrders = () => {
    if (selectedStatus === "all") {
      return orders;
    }
    return orders.filter((order) => order.estado === selectedStatus);
  };

  const filteredOrders = filterOrders();

  return (
    <Container maxWidth="lg">
      <Box padding={3}>
        <Typography variant="h4" gutterBottom align="center">
          Órdenes Confirmadas
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="status-select-label">Filtrar por Estado</InputLabel>
          <Select
            labelId="status-select-label"
            value={selectedStatus}
            label="Filtrar por Estado"
            onChange={handleStatusChange}
          >
            <MenuItem value="all">Todas las Órdenes</MenuItem>
            <MenuItem value="Confirmado">Confirmadas</MenuItem>
            <MenuItem value="Rechazado">Rechazadas</MenuItem>
            <MenuItem value="Entregado">Entregadas</MenuItem>
          </Select>
        </FormControl>

        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.idorden} sx={{ marginBottom: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Orden #{order.idorden}</Typography>
                <Typography variant="body1">Nombre: {order.nombre}</Typography>
                <Typography variant="body1">
                  Fecha de Creación:{" "}
                  {new Date(order.fecha_creacion).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  Total: Q{order.total_orden.toFixed(2)}
                </Typography>
                <Typography variant="body1">Estado: {order.estado}</Typography>
                <Box mt={2}>
                  <Link to={`/order-details/${order.idorden}`}>
                    <Button variant="contained" color="primary">
                      Ver Detalles
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">
            No hay órdenes en este estado.
          </Typography>
        )}
      </Box>

      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        sx={{ position: "fixed", top: 20, right: 20 }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
      >
        <MenuItem onClick={handleCategoryMenuOpen} aria-haspopup="true">
          Categoría de Productos
        </MenuItem>

        <MenuItem onClick={handleProductMenuOpen} aria-haspopup="true">
          Productos
        </MenuItem>
        <MenuItem onClick={logOut}>Cerrar Sesión</MenuItem>
      </Menu>

      <Menu
        id="category-menu"
        anchorEl={categoryAnchorEl}
        open={Boolean(categoryAnchorEl)}
        onClose={handleCategoryMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleNavigate("/viewcategories")}>
          Ver Categorías
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleNavigate("/addcategory")}>
          Agregar Categorías
        </MenuItem>
      </Menu>
      <Menu
        id="product-menu"
        anchorEl={productAnchorEl}
        open={Boolean(productAnchorEl)}
        onClose={handleProductMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleNavigate("/viewproducts")}>
          Ver Productos
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleNavigate("/addproduct")}>
          Agregar Productos
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default ConfirmedOrders;
