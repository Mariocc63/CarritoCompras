import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Options from "../components/Options";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const idusuarios = auth?.user?.data[0]?.idusuarios;
  const navigate = useNavigate();

  useEffect(() => {
    if (idusuarios) {
      const fetchOrderHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/historial/detalles/${idusuarios}`,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
          setOrderHistory(response.data.historial.ordenes);
        } catch (error) {
          console.error("Error al traer el historial de ordenes", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrderHistory();
    } else {
      setLoading(false);
    }
  }, [idusuarios, auth.token]);

  const handleGoBack = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <Box textAlign="center" padding={2}>
        <Typography variant="h6">Cargando historial de órdenes...</Typography>
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom align="center">
        Historial de Órdenes
      </Typography>
      <Grid container spacing={3}>
        {orderHistory.length === 0 ? (
          <Box textAlign="center" width="100%">
            <Typography variant="h6">
              No tienes órdenes en el historial.
            </Typography>
          </Box>
        ) : (
          orderHistory.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.idorden}>
              <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">Orden #{order.idorden}</Typography>
                  <Divider sx={{ marginY: 2 }} />
                  <Typography variant="body1">
                    <strong>Fecha de Creación:</strong>{" "}
                    {moment(order.fecha_creacion).format("DD/MM/YYYY HH:mm:ss")}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Nombre:</strong> {order.nombre_completo}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Dirección:</strong> {order.direccion}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Fecha de Entrega:</strong>{" "}
                    {moment(order.fecha_entrega).format("DD/MM/YYYY")}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total:</strong> Q{order.total_orden.toFixed(2)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Estado:</strong> {order.estado}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Comentarios:</strong> {order.comentarios}
                  </Typography>
                  <Typography variant="h6" marginTop={2}>
                    Detalles:
                  </Typography>
                  <ul>
                    {order.detalles.map((detalle, index) => (
                      <li key={index}>
                        {detalle.producto} - Cantidad: {detalle.cantidad} -
                        Precio Q{detalle.precio.toFixed(2)} - Subtotal: Q
                        {detalle.subtotal.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

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

export default OrderHistory;
