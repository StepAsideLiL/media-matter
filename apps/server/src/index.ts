import "dotenv/config";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import authenticateJwtToken from "./lib/authenticateJwtToken";
import prisma from "./lib/prismadb";
import fileUpload, { UploadedFile } from "express-fileupload";
import cors from "cors";
import path from "path";
import uploadToFTP from "./lib/uploadToFtp";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    preflightContinue: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"), // Ensure this path exists
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

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
    return;
  }

  const user = await prisma.users.create({
    data: {
      username,
    },
  });

  if (!user) {
    res.sendStatus(401);
    res.json({ token: null });
    return;
  }

  res.json({ token });
});

app.post("/auth/current-user", authenticateJwtToken, (req, res) => {
  const { username } = req.body;

  res.json({ username });
});

app.get("/profiles", async (req: Request, res: Response) => {
  const users = await prisma.users.findMany();

  res.json(users);
});

app.post(
  "/upload",
  authenticateJwtToken,
  async (req: Request, res: Response) => {
    if (!req.files) {
      res.sendStatus(400);
      res.send({ success: false, message: "No files uploaded." });
      return;
    }

    const files: UploadedFile[] = [];

    if (Array.isArray(req.files.files)) {
      files.push(...req.files.files);
    } else {
      files.push(req.files.files);
    }

    try {
      await Promise.all(files.map(async (file) => await uploadToFTP(file)));
      res.send({ success: true, message: "Upload successful." });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
      res.send({ success: false, message: "Upload failed." });
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
