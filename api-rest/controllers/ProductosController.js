const sequelize = require("../config/database").sequelize;
const path = require("path");
const fs = require("fs");
const { query } = require("express");


exports.crearProductos = async (req,res) => {
    const { 
        categoriaproductos_idcategoriaproductos, 
        nombre,
        marca,
        codigo,
        stock,
        precio} = req.body;

        const pcategoriaproductos_idcategoriaproductos = parseInt(categoriaproductos_idcategoriaproductos);
        const pstock = parseInt(stock);
        const pprecio = parseFloat(precio);

        const existeproducto = await sequelize.query("select * from productos where codigo = :codigo",
            {
                replacements: {
                    codigo
                },
                type: sequelize.QueryTypes.SELECT
            }
        );
    
        if(existeproducto.length > 0) {
            res.status(400).json({message: "El producto a ingresar ya existe"})
        }
        else {
            if(!req.file) {
                //console.log(req.file);
                res.status(400).json({message: "No se proporcionó una imagen"});
            }
            else {
                const filename = req.file.originalname;
                //console.log(req.file);
                const foto = path.join("images",filename);

                try {
                    const usuarios_idusuarios = req.datos.datos.idusuario;
                    await sequelize.query(`
                        EXEC InsertarProductos
                        :categoriaproductos_idcategoriaproductos,
                        :usuarios_idusuarios,
                         :nombre,
                         :marca,
                         :codigo,
                         :stock,
                         :precio,
                         :foto` ,
                        {
                            replacements: { 
                                categoriaproductos_idcategoriaproductos: 
                                pcategoriaproductos_idcategoriaproductos, 
                                usuarios_idusuarios,
                                nombre,
                                marca,
                                codigo,
                                stock: pstock,
                                precio: pprecio,
                                foto},
                            type: sequelize.QueryTypes.INSERT
                        }
                    );
                    res.status(200).json({message: "Producto agregado correctamente"});
                } 
                catch (error) {
                    res.status(400).json({error: "Error al crear el producto"});
                    console.log(error);
                }
            }
            
        }
}

//Actualizacion de Productos
exports.actualizarProductos = async (req, res) => {
    const { idproductos } = req.params;
    const campos  = req.body;

    if(!idproductos || Object.keys(campos).length === 0) {
        return res.status(400).json({error: "No hay campos para actualizar"})
    }

    try {
        const query1 = `EXEC ActualizarProductos @idproductos = :idproductos, 
            @categoriaproductos_idcategoriaproductos = :categoriaproductos_idcategoriaproductos, 
            @usuarios_idusuarios = :usuarios_idusuarios,
            @nombre = :nombre,
            @marca = :marca,
            @codigo = :codigo, 
            @stock = :stock,
            @estados_idestados = :estados_idestados,
            @precio = :precio,
            @fecha_creacion = :fecha_creacion`.toString();
        if(!req.file) {
            
            await sequelize.query(query1,
            {
                replacements: { 
                    idproductos,
                    categoriaproductos_idcategoriaproductos: campos.categoriaproductos_idcategoriaproductos || null, 
                    usuarios_idusuarios: campos.usuarios_idusuarios || null, 
                    nombre: campos.nombre || null,
                    marca: campos.marca || null, 
                    codigo: campos.codigo || null,
                    stock: campos.stock || null, 
                    estados_idestados: campos.estados_idestados || null,
                    precio: campos.precio || null,
                    fecha_creacion: campos.fecha_creacion || null,
                    //foto: campos.foto || null
                },
                type: sequelize.QueryTypes.UPDATE
            });
             return res.status(200).json({message: "Actualizado correctamente"});
            
        }

        
        else {

            const nuevaImagen = req.file.originalname;
            const nuevaruta = path.join("images", nuevaImagen);

            const [producto] = await sequelize.query(`Select foto 
                from productos where idproductos = :idproductos`,
            {
                replacements: {
                    idproductos
                },
                type: sequelize.QueryTypes.UPDATE
            });

            if(!producto) {
                return res.status(404).json({message: "Producto no encontrado"});

            }

            if(producto.foto) {
                const rutaImagenAntigua = path.join(__dirname, "..", "images", producto.foto)
                fs.unlink(rutaImagenAntigua, (error) => {
                    if(error) {
                        return res.status(400).json({message: "Error al actualizar la imagen"})
                    }
                });
            }

            await sequelize.query(query1 + ` , @foto = :foto`,
            {
                replacements: { 
                    idproductos,
                    categoriaproductos_idcategoriaproductos: campos.categoriaproductos_idcategoriaproductos || null, 
                    usuarios_idusuarios: campos.usuarios_idusuarios || null, 
                    nombre: campos.nombre || null,
                    marca: campos.marca || null, 
                    codigo: campos.codigo || null,
                    stock: campos.stock || null, 
                    estados_idestados: campos.estados_idestados || null,
                    precio: campos.precio || null,
                    fecha_creacion: campos.fecha_creacion || null,
                    foto: nuevaruta || null
                },
                type: sequelize.QueryTypes.UPDATE
            }
        );
            return res.status(200).json({message: "Actualizado correctamente"});
        }
        
    }
    catch (error) {
        console.error("Error al actualizar el producto", error)
        return res.status(500).json({message: "Error al actualizar el producto"});
    }
    
};

exports.verProductosActivos = async (req, res) => {
    try {
        const productos = await sequelize.query(
            `select * from Ver_Productos_Activos`, 
            {  type: sequelize.QueryTypes.SELECT }
            )
            res.status(200).json({productos})  
        }
        
    catch (error) {
        res.status(400).json({message: "Error al cargar los productos"});
    }
}

exports.VerProductosPorCategoria = async (req, res) => {
    const { categoriaproductos_idcategoriaproductos } = req.params;

    try {
        
          const productos =  await sequelize.query(
                `EXEC Ver_Productos_por_categoria
                @categoriaproductos_idcategoriaproductos = :categoriaproductos_idcategoriaproductos`,
            {
                replacements: { 
                    categoriaproductos_idcategoriaproductos
                },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json({productos});
        
        
    }
    catch (error) {
        //console.error("Error al actualizar el producto", error)
        res.status(500).json({message: "Error al ver los productos"});
    }
    
};