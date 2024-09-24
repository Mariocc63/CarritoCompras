const express = require("express");
const router = express.Router();
const ProductosController = require("../controllers/ProductosController.js");
const {
  autenticarToken,
  verificarRol,
  dicciorioRoles,
} = require("../middleware.js");
const multer = require("multer");

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const subida = multer({ storage: almacenamiento });

router.post(
  "/productos",
  subida.single("foto"),
  autenticarToken,
  verificarRol(dicciorioRoles["Operador administrativo"]),
  ProductosController.crearProductos
);
router.put(
  "/productos/:idproductos",
  subida.single("foto"),
  autenticarToken,
  verificarRol(dicciorioRoles["Operador administrativo"]),
  ProductosController.actualizarProductos
);
router.get(
  "/verproductos/",
  autenticarToken,
  verificarRol(dicciorioRoles["Cliente"]),
  ProductosController.verProductosActivos
);
router.get(
  "/verproductoscompletos/",
  autenticarToken,
  verificarRol(dicciorioRoles["Operador administrativo"]),
  ProductosController.verProductosCompletos
);
router.get(
  "/verproductoindividual/:idproductos",
  autenticarToken,
  verificarRol(dicciorioRoles["Operador administrativo"]),
  ProductosController.verProductoIndividual
);

router.get(
  "/verproductoscategoria/:categoriaproductos_idcategoriaproductos",
  autenticarToken,
  verificarRol(dicciorioRoles["Operador administrativo"]),
  ProductosController.VerProductosPorCategoria
);

router.put(
  "/activarproductos/:idcategoria",
  autenticarToken,
  verificarRol(dicciorioRoles["Operador administrativo"]),
  ProductosController.ActivarProductos
);
router.put(
  "/desactivarproductos/:idcategoria",
  autenticarToken,
  verificarRol(dicciorioRoles["Operador administrativo"]),
  ProductosController.DesactivarProductos
);

module.exports = router;
