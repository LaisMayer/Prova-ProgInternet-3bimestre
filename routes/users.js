import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = "lais-mayer-senha";

const user = {
  username: "lais",
  password: bcrypt.hashSync("123", 8), 
};

router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Usuário ou senha inválidos" });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

export default router;
export { SECRET };