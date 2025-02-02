import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import authenticateJwtToken from "./lib/authenticateJwtToken";
import prisma from "./lib/prismadb";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/auth/login", async (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, process.env.JWT_SECRET_TOKEN as string);

  const userExists = await prisma.users.findUnique({
    where: {
      username,
    },
  });

  if (userExists) {
    res.json({ token: token });
  }

  const user = await prisma.users.create({
    data: {
      username,
    },
  });

  if (!user) {
    res.sendStatus(401);
    res.json({ token: null });
  }

  res.json({ token });
});

app.post("/auth/current-user", authenticateJwtToken, (req, res) => {
  const { username } = req.body;

  res.json({ username });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
