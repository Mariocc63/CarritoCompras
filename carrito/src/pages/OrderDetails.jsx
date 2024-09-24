import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Options from "../components/Options";

const ORDER_STATES = {
  ENTREGADO: 8,
  RECHAZADO: 9,
};

const OrderDetails = () => {
  const { idorden } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/verordenes",
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        const orders = response.data.historial.ordenes;
        const selectedOrder = orders.find(
          (order) => order.idorden === parseInt(idorden, 10)
        );
        setOrder(selectedOrder);
      } catch (error) {
        console.error("Error al obtener los datos de la orden:", error);
      }
    };

    fetchOrderDetails();
  }, [idorden]);

  const handleConfirm = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/orden/detalles/${idorden}`,
        {
          estados_idestados: ORDER_STATES.ENTREGADO,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      alert("Orden entregada correctamente");
      navigate("/confirmed-orders");
    } catch (error) {
      alert("Error al entregar la orden");
      console.error("Error al confirmar la orden:", error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/orden/detalles/${idorden}`,
        {
          estados_idestados: ORDER_STATES.RECHAZADO,
          comentarios: rejectComment,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      alert("Orden rechazada correctamente");
      navigate("/confirmed-orders");
    } catch (error) {
      alert("Error al rechazar la orden");
      console.error("Error al rechazar la orden:", error);
    }
  };

  const handleGoBack = () => {
    navigate("/confirmed-orders");
  };

  return (
    <Box padding={2} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Detalles de la Orden
      </Typography>

      {order ? (
        <>
          <Box
            textAlign="left"
            padding={3}
            width="100%"
            maxWidth="600px"
            bgcolor="#f5f5f5"
            borderRadius={2}
            boxShadow={3}
          >
            <Typography variant="subtitle1">
              Orden #: {order.idorden}
            </Typography>
            <Typography>Nombre: {order.nombre}</Typography>
            <Typography>Dirección: {order.direccion}</Typography>
            <Typography>Teléfono: {order.telefono}</Typography>
            <Typography>
              Correo Electrónico: {order.correo_electronico}
            </Typography>
            <Typography>
              Fecha de Entrega:{" "}
              {moment(order.fecha_entrega).format("DD/MM/YYYY")}
            </Typography>
            <Typography>Total: Q{order.total_orden.toFixed(2)}</Typography>
            <Typography>Estado: {order.estado}</Typography>
            {order.estado === "Rechazado" ? (
              <Typography>Comentario: {order.comentarios}</Typography>
            ) : (
              ""
            )}

            <Typography variant="h6" gutterBottom>
              Detalles:
            </Typography>
            <List>
              {order.detalles.map((detail, index) => (
                <ListItem key={index}>
                  • {detail.producto} - Cantidad: {detail.cantidad} - Precio: Q
                  {detail.precio.toFixed(2)} - Subtotal: Q
                  {detail.subtotal.toFixed(2)}
                </ListItem>
              ))}
            </List>

            {order.estado === "Confirmado" ? (
              <Box display="flex" justifyContent="center" marginTop={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenConfirmDialog(true)}
                  style={{ marginRight: "10px" }}
                >
                  Entregar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpenRejectDialog(true)}
                >
                  Rechazar
                </Button>
              </Box>
            ) : (
              ""
            )}
          </Box>

          <Dialog
            open={openConfirmDialog}
            onClose={() => setOpenConfirmDialog(false)}
          >
            <DialogTitle>Entregar Orden</DialogTitle>
            <DialogContent>
              <Typography>
                ¿Estás seguro de que quieres entregar esta orden?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenConfirmDialog(false)}
                color="secondary"
              >
                Cancelar
              </Button>
              <Button onClick={handleConfirm} color="primary">
                Entregar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openRejectDialog}
            onClose={() => setOpenRejectDialog(false)}
          >
            <DialogTitle>Rechazar Orden</DialogTitle>
            <DialogContent>
              <Typography>
                ¿Estás seguro de que quieres rechazar esta orden?
              </Typography>
              <TextField
                label="Comentario"
                multiline
                rows={4}
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenRejectDialog(false)}
                color="secondary"
              >
                Cancelar
              </Button>
              <Button onClick={handleReject} color="primary">
                Rechazar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography>Cargando detalles de la orden...</Typography>
      )}

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

export default OrderDetails;
