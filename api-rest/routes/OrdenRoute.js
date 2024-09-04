const express = require("express");
const router = express.Router();
const OrdenController = require("../controllers/OrdenController.js");
const {autenticarToken,verificarRol,dicciorioRoles} = require("../middleware.js")

router.post("/orden/detalles", autenticarToken, OrdenController.crearOrden);
router.put("/orden/detalles/:idorden", autenticarToken, OrdenController.actualizarOrden)
router.get("/verordenes", autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]),
 OrdenController.verOrdenes)
router.get("/verordenes/detalles/:orden_idorden", autenticarToken, 
    verificarRol(dicciorioRoles["Operador administrativo"]), OrdenController.verOrdenesDetalles)


module.exports = router;