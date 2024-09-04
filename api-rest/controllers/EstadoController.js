const sequelize = require("../config/database").sequelize;

exports.crearEstado = async (req,res) => {
    const { estado } = req.body;
    
    const existeestado = await sequelize.query("select * from estados where nombre = :estado",
        {
            replacements: {
                estado
            },
            type: sequelize.QueryTypes.SELECT
        }
    );

    if(existeestado.length > 0) {
        res.status(400).json({message: "El estado a ingresar ya existe"})
    }
    else {
        try {
            await sequelize.query(
                "EXEC InsertarEstado :estado",
                {
                    replacements: { estado },
                    type: sequelize.QueryTypes.INSERT
                }
            );
            res.status(200).json({message: "Estado ingresado correctamente"});
        } 
        catch (error) {
            res.status(400).json({message: "Error al crear el estado"});
        }
    }

    
}

//Actualizacion de Estado
exports.actualizarEstado = async (req, res) => {
    const { idestados } = req.params;
    const { estado } = req.body;

    try {
        await sequelize.query(
            "EXEC ActualizarEstado :idestados, :estado",
            {
                replacements: { idestados, estado },
                type: sequelize.QueryTypes.RAW
            }
        );
        res.status(200).json({message: "Estado actualizado correctamente"});
    }
    catch (error) {
        //console.error("Error al actualizar el estado", error)
        res.status(500).json({message: "Error al actualizar el estado"});
    }
};