const { Transaction } = require("sequelize");

const sequelize = require("../config/database").sequelize;


exports.crearOrden= async (req,res) => {
    const { 
        nombre_completo,
        direccion, 
        telefono,
        correo_electronico, 
        fecha_entrega,
        detalles_orden} = req.body;

        const transaccion = await sequelize.transaction();

    try {

        const usuarios_idusuarios = req.datos.datos.idusuario;
        let total_orden = 0;

        for(const detalle of detalles_orden) {
            let subtotal = 0;
            const {productos_idproductos,
                cantidad} = detalle;

            let precio = await sequelize.query(`select precio from productos
                where idproductos = :productos_idproductos`, 
            {
                replacements: {
                    productos_idproductos
                },
                type: sequelize.QueryTypes.SELECT
            });
            subtotal = precio[0].precio * cantidad;
            total_orden += subtotal;
            //console.log(precio);
        }

        const [ResultadoOrden] = await sequelize.query(
            `EXEC InsertarOrdenes
            @usuarios_idusuarios = :usuarios_idusuarios,
            @nombre_completo = :nombre_completo,
            @direccion = :direccion,
            @telefono = :telefono,
            @correo_electronico = :correo_electronico, 
            @fecha_entrega = :fecha_entrega,
            @total_orden = :total_orden` ,
            {
                replacements: { 
                    usuarios_idusuarios, 
                    nombre_completo,
                    direccion,
                    telefono,
                    correo_electronico,
                    fecha_entrega,
                    total_orden},
                type: sequelize.QueryTypes.INSERT,
                transaccion
            }
        );

        const orden_idorden = ResultadoOrden[0].id;
        //console.log(ResultadoOrden);

        for(const detalle of detalles_orden) {
            let subtotal = 0;
            const {
                productos_idproductos,
                cantidad
            } = detalle;

            let precio = await sequelize.query(`select precio from productos
                where idproductos = :productos_idproductos`, 
            {
                replacements: {
                    productos_idproductos
                },
                type: sequelize.QueryTypes.SELECT
            });

            subtotal = precio[0].precio * cantidad;

            await sequelize.query(
                `EXEC InsertarOrdenDetalles
                :orden_idorden,
                :productos_idproductos,
                :cantidad,
                :precio,
                :subtotal`,
                {
                    replacements: {
                        orden_idorden,
                        productos_idproductos,
                        cantidad,
                        precio: precio[0].precio,
                        subtotal
                    },
                    type: sequelize.QueryTypes.INSERT,
                    transaccion
                }
            );
        }

        //console.log(orden_idorden);
        await transaccion.commit();

        res.status(200).json({message: "Orden y detalles de orden agregados correctamente"});
        
    } 
    catch (error) {
        await transaccion.rollback();
        res.status(400).json({message: "Error al crear la orden y detalles de orden"});
        console.log(error);
    }
}

//Actualizacion de Orden
exports.actualizarOrden = async (req, res) => {
    const { idorden } = req.params;
    const campos  = req.body;

    if(!idorden || Object.keys(campos).length === 0) {
        return res.status(400).json({error: "No hay campos para actualizar"})
    }

    try {

        await sequelize.query(
            `EXEC ActualizarOrdernes
            @idorden = :idorden,
            @estados_idestados = :estados_idestados,
            @fecha_creacion = :fecha_creacion,
            @nombre_completo = :nombre_completo,
            @direccion = :direccion,
            @telefono = :telefono,
            @correo_electronico = :correo_electronico, 
            @fecha_entrega = :fecha_entrega` ,
            //":total_orden",
            {
                replacements: { 
                    idorden, 
                    //usuarios_idusuarios: campos.usuarios_idusuarios || null,
                    estados_idestados: campos.estados_idestados || null,
                    fecha_creacion: campos.fecha_creacion || null,
                    nombre_completo: campos.nombre_completo || null,
                    direccion: campos.direccion || null,
                    telefono: campos.telefono || null,
                    correo_electronico: campos.correo_electronico || null,
                    fecha_entrega: campos.fecha_entrega || null
                    //total_orden: campos.total_orden || null
                },
                type: sequelize.QueryTypes.UPDATE
            }
        );
        res.status(200).json({message: "Actualizado correctamente"});
    }
    catch (error) {
        //console.error("Error al actualizar la orden", error)
        res.status(500).json({meesage: "Error al actualizar la orden"});
    }


    
};

exports.verOrdenes = async (req, res) => {

    try {

        const ordenes = await sequelize.query(
            `select * from Ver_Ordenes_Confirmadas` ,
            //":total_orden",
            {
                
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json({ordenes});
    }
    catch (error) {
        console.error("Error al actualizar la orden", error)
        res.status(500).json({meesage: "Error al ver las ordenes confirmadas"});
    }
    
};

exports.verOrdenesDetalles = async (req, res) => {

    const {orden_idorden} = req.params

    try {

        const detallesorden = await sequelize.query(
            `select * from ordendetalles
            where orden_idorden = :orden_idorden` ,
            {
                replacements: {
                    orden_idorden
                },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json({detallesorden});
    }
    catch (error) {
        console.error("Error al ver los detalles de orden", error)
        res.status(500).json({meesage: "Error al ver los detalles de orden"});
    }
    
};

