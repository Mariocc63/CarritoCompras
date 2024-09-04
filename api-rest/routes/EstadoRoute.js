const express = require("express");
const router = express.Router();
const EstadoController = require("../controllers/EstadoController.js");
const {autenticarToken, verificarRol, dicciorioRoles} = require("../middleware.js");


router.post("/estados", autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]), EstadoController.crearEstado);
router.put("/estados/:idestados", autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]), EstadoController.actualizarEstado);

module.exports = router;