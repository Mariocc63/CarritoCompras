const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("CarritoCompras", "admin","12345", {
    host: "Mario",
    port: 1433,
    dialect: "mssql"
});

async function ConexionBD() {
    try {
        await sequelize.authenticate();
        console.log("Base de datos conectada correctamente")
    }
    catch(error) {
        console.error("No fue posible conectarse a la base de datos")
        process.exit(1);
    }
}

module.exports = {
    sequelize,
    ConexionBD,
};