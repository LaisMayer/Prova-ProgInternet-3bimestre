import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import verificarToken from "../middleware/auth.js";
import { SECRET } from "../routes/users.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../db.json");

function lerDados() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([]));
  }
  const dados = fs.readFileSync(dataPath);
  return JSON.parse(dados);
}

function salvarDados(dados) {
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
}

router.get("/", verificarToken(SECRET), (req, res) => {
  const dados = lerDados();
  res.json(dados);
});

router.post("/", verificarToken(SECRET), (req, res) => {
  const dados = lerDados();
  const novo = req.body;
  novo.id = Date.now();
  dados.push(novo);
  salvarDados(dados);
  res.json({ message: "Item criado com sucesso", item: novo });
});

router.put("/:id", verificarToken(SECRET), (req, res) => {
  const dados = lerDados();
  const id = parseInt(req.params.id);
  const index = dados.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ message: "Item não encontrado" });
  dados[index] = { ...dados[index], ...req.body };
  salvarDados(dados);
  res.json({ message: "Item atualizado com sucesso" });
});

router.delete("/:id", verificarToken(SECRET), (req, res) => {
  const dados = lerDados();
  const id = parseInt(req.params.id);
  const novosDados = dados.filter((item) => item.id !== id);
  salvarDados(novosDados);
  res.json({ message: "Item deletado com sucesso" });
});

export default router;