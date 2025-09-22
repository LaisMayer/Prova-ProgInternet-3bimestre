import fs from "fs";
import jwt from "jwt-simple"
import path from "..db.json";
import SECRET_KEY from process.env.JWT_SECRET;

const lerUsuarios = () => {
  const data = fs.readFileSync(path);
  return JSON.parse(data);
};

const salvarUsuarios = (usuarios) => {
  fs.writeFileSync(path, JSON.stringify(usuarios, null, 2));
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const usuarios = lerUsuarios();
  const usuario = usuarios.find(u => u.username === username && u.password === password);
  
  if (!usuario) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  }
  const payload = { username: usuario.username };
  const token = jwt.encode(payload, SECRET_KEY);

  return res.json({ token });
};