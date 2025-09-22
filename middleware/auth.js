import jwt from "jsonwebtoken";

export default function verificarToken(SECRET) {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Token não fornecido" });

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Token inválido" });
      req.user = decoded.username;
      next();
    });
  };
}