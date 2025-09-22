import fs  from "fs";
import jwt from "jwt-simple";
import path from "./server/data/usuarios.json";
import SECRET_KEY from process.env.JWT_SECRET;


exports.criarUsuario = (req, res) => {
  const { username, password } = req.body;
  const usuarios = lerUsuarios();
  const novoUsuario = { username, password };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  res.status(201).json({ message: 'Usuário criado com sucesso!' });
};

exports.listarUsuarios = (req, res) => {
  const usuarios = lerUsuarios();
  res.json(usuarios);
};

exports.editarUsuario = (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  let usuarios = lerUsuarios();

  const usuarioIndex = usuarios.findIndex(u => u.username === id);

  if (usuarioIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  usuarios[usuarioIndex] = { username, password };
  salvarUsuarios(usuarios);

  res.json({ message: 'Usuário editado com sucesso!' });
};

exports.deletarUsuario = (req, res) => {
  const { id } = req.params;
  let usuarios = lerUsuarios();

  usuarios = usuarios.filter(u => u.username !== id);
  salvarUsuarios(usuarios);

  res.json({ message: 'Usuário deletado com sucesso!' });
};