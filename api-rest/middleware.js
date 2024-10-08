const jwt = require("jsonwebtoken");
const SECRET_KEY = "12345";
const dicciorioRoles = { Operador_administrativo: 1, Cliente: 2 };

function generarToken(datos) {
  try {
    return jwt.sign({ datos }, SECRET_KEY, { expiresIn: "24h" });
  } catch (error) {
    return;
  }
}

function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "no se proporcionó un token" });
  }

  jwt.verify(token, SECRET_KEY, (error, decodificado) => {
    if (error) {
      return res.status(403).json({ message: "token inválido o expirado" });
    }
    req.datos = decodificado;
    next();
  });
}

function verificarRol(rol) {
  return (req, res, next) => {
    if (req.datos.datos.rol_idrol !== rol) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
}

module.exports = {
  autenticarToken,
  generarToken,
  verificarRol,
  dicciorioRoles,
};
