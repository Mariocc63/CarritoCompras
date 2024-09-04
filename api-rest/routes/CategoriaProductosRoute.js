const express = require("express");
const router = express.Router();
const CategoriaProductosController = require("../controllers/CategoriaProductosController.js");
const {autenticarToken, verificarRol,dicciorioRoles} = require("../middleware.js")

router.post("/categoriaproductos", autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]), 
CategoriaProductosController.crearCategoriaProductos);
router.put("/categoriaproductos/:idcategoriaproductos", autenticarToken, 
    verificarRol(dicciorioRoles["Operador administrativo"]), CategoriaProductosController.actualizarCategoriaProductos)
router.get("/vercategoriaproductos", autenticarToken, 
    verificarRol(dicciorioRoles["Operador administrativo"]), CategoriaProductosController.verCategoriaProductosActivos)

//router.put("/estados/:idestados",EstadoController.actualizarEstado);

module.exports = router;