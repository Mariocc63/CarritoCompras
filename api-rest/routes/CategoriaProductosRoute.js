const express = require("express");
const router = express.Router();
const CategoriaProductosController = require("../controllers/CategoriaProductosController.js");
const {autenticarToken, verificarRol,dicciorioRoles} = require("../middleware.js")

router.post("/categoriaproductos", autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]), 
CategoriaProductosController.crearCategoriaProductos);
router.put("/categoriaproductos/:idcategoria", autenticarToken, 
    verificarRol(dicciorioRoles["Operador administrativo"]), CategoriaProductosController.actualizarCategoriaProductos)
router.get("/vercategoriaproductos", autenticarToken, 
    verificarRol(dicciorioRoles["Operador administrativo"]), CategoriaProductosController.verCategoriaProductos)
router.get("/vercategoria/:idcategoria", autenticarToken, 
    verificarRol(dicciorioRoles["Operador administrativo"]), CategoriaProductosController.verCategoriaProducto)

router.get("/vercatproductosactivos/:idcategoria", autenticarToken, 
    verificarRol(dicciorioRoles["Operador administrativo"]), CategoriaProductosController.verCategoriaProductoActivo)
router.get("/vercatproductosinactivos/:idcategoria", autenticarToken, 
    verificarRol(dicciorioRoles["Operador administrativo"]), CategoriaProductosController.verCategoriaProductoInactivo)

router.get("/vercategorias", autenticarToken, 
    verificarRol(dicciorioRoles["Operador administrativo"]), CategoriaProductosController.verCategoriaActiva)        
    

//router.put("/estados/:idestados",EstadoController.actualizarEstado);

module.exports = router;