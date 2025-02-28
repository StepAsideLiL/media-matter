import { UploadedFile } from "express-fileupload";
import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: "host.docker.internal",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = "media-matter";

export default async function uploadToMinio(file: UploadedFile) {
  const isBucketExist = await minioClient.bucketExists(bucketName);

  if (!isBucketExist) {
    return;
  }

  await minioClient.fPutObject(bucketName, file.name, file.tempFilePath);
}
