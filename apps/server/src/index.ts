import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import authenticateJwtToken from "./lib/authenticateJwtToken";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/auth/login", (req, res) => {
  const { username } = req.body;

  const token = jwt.sign({ username }, process.env.JWT_SECRET_TOKEN as string);

  res.json({ token });
});

app.post("/auth/current-user", authenticateJwtToken, (req, res) => {
  const { username } = req.body;

  res.json({ username });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
