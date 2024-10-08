const express = require("express");
const router = express.Router();
const OrdenController = require("../controllers/OrdenController.js");
const {
  autenticarToken,
  verificarRol,
  dicciorioRoles,
} = require("../middleware.js");

router.post("/orden/detalles", autenticarToken, OrdenController.crearOrden);
router.put(
  "/orden/detalles/:idorden",
  autenticarToken,
  verificarRol(dicciorioRoles.Operador_administrativo),
  OrdenController.actualizarOrden
);
router.get(
  "/verordenes",
  autenticarToken,
  verificarRol(dicciorioRoles.Operador_administrativo),
  OrdenController.verOrdenes
);
router.get(
  "/verordenes/detalles/:orden_idorden",
  autenticarToken,
  verificarRol(dicciorioRoles.Operador_administrativo),
  OrdenController.verOrdenesDetalles
);
router.get(
  "/historial/detalles/:usuarios_idusuarios",
  autenticarToken,
  OrdenController.HistorialOrdenesUsuario
);

module.exports = router;
