import "dotenv/config";
import express from "express";
import authenticateJwtToken from "./lib/authenticateJwtToken";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";
import login from "@/routes/login";
import currentUser from "@/routes/currentUser";
import upload from "@/routes/upload";
import profiles from "@/routes/profiles";

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

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// /auth/login route
app.post("/auth/login", login);

// /auth/current-user route
app.post("/auth/current-user", authenticateJwtToken, currentUser);

// /profiles route
app.get("/profiles", profiles);

// /upload route to upload files to FTP
app.post("/upload", authenticateJwtToken, upload);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
