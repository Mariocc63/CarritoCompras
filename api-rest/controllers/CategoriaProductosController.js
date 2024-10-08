const sequelize = require("../config/database").sequelize;

//Creacion de categoria de productos
exports.crearCategoriaProductos = async (req, res) => {
  const { nombre } = req.body;

  const existecategoriaproducto = await sequelize.query(
    "select * from categoriaproductos where nombre = :nombre",
    {
      replacements: {
        nombre,
      },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  if (existecategoriaproducto.length > 0) {
    res
      .status(400)
      .json({ message: "La categoria de productos a ingresar ya existe" });
  } else {
    try {
      const usuarios_idusuarios = req.datos.datos.idusuario;
      await sequelize.query(
        `EXEC InsertarCategoriaProductos :usuarios_idusuarios,
                    :nombre`,
        {
          replacements: {
            usuarios_idusuarios,
            nombre,
          },
          type: sequelize.QueryTypes.INSERT,
        }
      );
      res
        .status(200)
        .json({ message: "Categoria de productos agregada correctamente" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error al crear la categoria de productos" });
    }
  }
};

//Actualizacion de Categoria de productos
exports.actualizarCategoriaProductos = async (req, res) => {
  const { idcategoria } = req.params;
  const campos = req.body;

  if (!idcategoria || Object.keys(campos).length === 0) {
    return res.status(400).json({ message: "No hay campos para actualizar" });
  }

  try {
    await sequelize.query(
      `EXEC ActualizarCategoriasProductos 
            @idcategoriaproductos = :idcategoria,
            @usuarios_idusuarios = :usuarios_idusuarios,
            @nombre = :nombre,
            @estados_idestados = :estados_idestados,
            @fecha_creacion = :fecha_creacion`,
      {
        replacements: {
          idcategoria,
          usuarios_idusuarios: campos.usuarios_idusuarios || null,
          nombre: campos.nombre || null,
          estados_idestados: campos.estados_idestados || null,
          fecha_creacion: campos.fecha_creacion || null,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    res.status(200).json({ message: "Actualizado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la categoria de productos" });
  }
};

exports.verCategoriaProductos = async (req, res) => {
  try {
    const categoriaproductos = await sequelize.query(
      `select * from Ver_Categoria_Productos`,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.status(200).json({ "Categoria Productos": categoriaproductos });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al cargar la categoria de productos" });
  }
};

exports.verCategoriaProducto = async (req, res) => {
  const { idcategoria } = req.params;
  try {
    const categoriaproducto = await sequelize.query(
      `EXEC Ver_Categoria
            @idcategoria = :idcategoria`,

      {
        replacements: {
          idcategoria,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return res.status(200).json({ categoriaproducto });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error al cargar la categoria" });
  }
};

//ver productos de una categoria activa
exports.verCategoriaProductoActivo = async (req, res) => {
  const { idcategoria } = req.params;
  try {
    const productos = await sequelize.query(
      `EXEC Productos_CategoriaActiva
            @idcategoria = :idcategoria`,

      {
        replacements: {
          idcategoria,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return res.status(200).json({ productos });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error al cargar los productos" });
  }
};

//ver productos de una categoria inactiva
exports.verCategoriaProductoInactivo = async (req, res) => {
  const { idcategoria } = req.params;
  try {
    const productos = await sequelize.query(
      `EXEC Productos_CategoriaInactiva
            @idcategoria = :idcategoria`,

      {
        replacements: {
          idcategoria,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return res.status(200).json({ productos });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error al cargar los productos" });
  }
};

//Ver todas las categorias activas
exports.verCategoriaActiva = async (req, res) => {
  try {
    const categorias = await sequelize.query(
      `select * from Categorias_Activas`,

      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return res.status(200).json({ categorias });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error al cargar las categorias" });
  }
};
