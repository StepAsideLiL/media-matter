import uploadFiles from "@/lib/uploadFiles";
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

  await uploadFiles(files, req.body.userId)
    .then(() => {
      res.status(200);
      res.json({ success: true, message: "Upload successful." });
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
      res.json({ success: false, message: "Upload failed." });
    });
}
