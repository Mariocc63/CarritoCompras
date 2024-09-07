const express = require("express");
const app = express();
const {ConexionBD} = require("./config/database.js")
const cors = require("cors");
const path = require("path");
const PORT = 5000;

const estadoRoutes = require("./routes/EstadoRoute.js")
const usuarioRoutes = require("./routes/UsuarioRoute.js")
const categoriaproductosRoutes = require("./routes/CategoriaProductosRoute.js")
const productosRoutes = require("./routes/ProductosRoute.js")
const ordenRoutes = require("./routes/OrdenRoute.js")

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));


app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api", estadoRoutes)
app.use("/api", usuarioRoutes)
app.use("/api", categoriaproductosRoutes)
app.use("/api", productosRoutes)
app.use("/api", ordenRoutes)

ConexionBD().then(() => {
    app.listen(PORT, () => {
        console.log(`Escuchando en el puerto ${PORT}...`)
    });
});