const express = require("express");
const router = express.Router();
const ProductosController = require("../controllers/ProductosController.js");
const {autenticarToken, verificarRol, dicciorioRoles} = require("../middleware.js")
const multer = require("multer");

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/'); // Carpeta de destino
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Guardar con el nombre original del archivo
    }
});

const subida = multer({ storage: almacenamiento });


router.post("/productos", subida.single("foto") , autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]), 
ProductosController.crearProductos);
router.put("/productos/:idproductos", subida.single("foto"), autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]),
 ProductosController.actualizarProductos)
router.get("/verproductos/", autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]), 
ProductosController.verProductosActivos)
router.get("/verproductoscategoria/:categoriaproductos_idcategoriaproductos", 
    autenticarToken, verificarRol(dicciorioRoles["Operador administrativo"]),
    ProductosController.VerProductosPorCategoria)
//router.put("/estados/:idestados",EstadoController.actualizarEstado);

module.exports = router;