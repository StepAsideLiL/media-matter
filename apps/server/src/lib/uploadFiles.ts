import { UploadedFile } from "express-fileupload";
import * as Minio from "minio";
import prisma from "@/lib/prismadb";

const minioClient = new Minio.Client({
  endPoint: "host.docker.internal",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = "media-matter";

export default async function uploadFiles(
  files: UploadedFile[],
  userId: string
) {
  if (!(await minioClient.bucketExists(bucketName))) {
    return;
  }

  await Promise.all(
    files.map(
      async (file) =>
        await minioClient
          .fPutObject(bucketName, file.name, file.tempFilePath)
          .then(async () => {
            await prisma.files.create({
              data: {
                name: file.name,
                fileType: file.mimetype,
                fileExtension: file.name.split(".").pop() || "",
                user: {
                  connect: {
                    id: userId,
                  },
                },
              },
            });
          })
    )
  );
}
