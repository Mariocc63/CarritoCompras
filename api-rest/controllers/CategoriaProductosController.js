const sequelize = require("../config/database").sequelize;

exports.crearCategoriaProductos = async (req,res) => {
    const { 
        nombre} = req.body;

        const existecategoriaproducto = await sequelize.query("select * from categoriaproductos where nombre = :nombre",
            {
                replacements: {
                    nombre
                },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if(existecategoriaproducto.length > 0) {
            res.status(400).json({message: "La categoria de productos a ingresar ya existe"})
        }
        else {
            try {
                const usuarios_idusuarios = req.datos.datos.idusuario;
                await sequelize.query(
                    `EXEC InsertarCategoriaProductos :usuarios_idusuarios,
                    :nombre`,
                    {
                        replacements: { 
                            usuarios_idusuarios, 
                            nombre},
                        type: sequelize.QueryTypes.INSERT
                    }
                );
                res.status(200).json({message: "Categoria de productos agregada correctamente"});
            } 
            catch (error) {
                res.status(400).json({message: "Error al crear la categoria de productos"});
                //console.log(error);
            }
        }

}

//Actualizacion de Categoria de productos
exports.actualizarCategoriaProductos = async (req, res) => {
    const { idcategoriaproductos } = req.params;
    const campos  = req.body;

    if(!idcategoriaproductos || Object.keys(campos).length === 0) {
        return res.status(400).json({message: "No hay campos para actualizar"})
    }

    try {

        await sequelize.query(
            `EXEC ActualizarCategoriasProductos 
            @idcategoriaproductos = :idcategoriaproductos,
            @usuarios_idusuarios = :usuarios_idusuarios,
            @nombre = :nombre,
            @estados_idestados = :estados_idestados,
            @fecha_creacion = :fecha_creacion`,
            {
                replacements: { 
                    idcategoriaproductos,
                    usuarios_idusuarios: campos.usuarios_idusuarios || null,
                    nombre: campos.nombre || null, 
                    estados_idestados: campos.estados_idestados || null,
                    fecha_creacion: campos.fecha_creacion || null
                },
                type: sequelize.QueryTypes.UPDATE
            }
        );
        res.status(200).json({message: "Actualizado correctamente"});
    }
    catch (error) {
        //console.error("Error al actualizar la categoria de productos", error)
        res.status(500).json({message: "Error al actualizar la categoria de productos"});
    }
    
};

exports.verCategoriaProductosActivos = async (req, res) => {
    try {
        const categoriaproductos = await sequelize.query(
            `select * from Ver_Categoria_Productos`, 
            {  type: sequelize.QueryTypes.SELECT }
            )
            res.status(200).json({"Categoria Productos":categoriaproductos})  
        }
        
    catch (error) {
        res.status(400).json({message: "Error al cargar la categoria de productos"});
    }
}