const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController.js");
const {autenticarToken, verificarRol, dicciorioRoles} = require("../middleware.js")

router.post("/usuario",
 UsuarioController.crearUsuario);
router.put("/usuario/:idusuarios", UsuarioController.actualizarUsuario);
router.post("/login",UsuarioController.login);
router.get("/verusuario/", autenticarToken, UsuarioController.verUsuario);


module.exports = router;