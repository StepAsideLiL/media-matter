import uploadToMinio from "@/lib/uploadToMinio";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

export default async function upload(req: Request, res: Response) {
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
    await Promise.all(files.map(async (file) => await uploadToMinio(file)));
    res.send({ success: true, message: "Upload successful." });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    res.send({ success: false, message: "Upload failed." });
  }
}
