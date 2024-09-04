const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController.js");
const {autenticarToken, verificarRol, dicciorioRoles} = require("../middleware.js")

router.post("/usuario",autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]),
 UsuarioController.crearUsuario);
router.put("/usuario/:idusuarios", UsuarioController.actualizarUsuario);
router.post("/login",UsuarioController.login);
//router.put("/estados/:idestados",EstadoController.actualizarEstado);

module.exports = router;