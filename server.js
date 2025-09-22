import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import rotasItens from "./routes/auth.js";
import rotasLogin from "./routes/users.js";

const app = express();

app.use(bodyParser.json());

app.use("/login", auth);
app.use("/itens", users);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});