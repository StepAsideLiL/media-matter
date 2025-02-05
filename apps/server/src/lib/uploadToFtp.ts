import { UploadedFile } from "express-fileupload";
import * as ftp from "basic-ftp";

export default async function uploadToFTP(file: UploadedFile) {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client
      .access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS,
        port: parseInt(process.env.FTP_PORT as string) || 21,
        secure: false,
      })
      .then(() => {
        console.log("Connected to FTP server.");
      })
      .catch((error) => {
        console.log("Failed to connect to FTP server.");
        console.log(error);
      });

    console.log(`Uploading ${file.name}...`);
    await client.uploadFrom(file.tempFilePath, file.name).then(() => {
      console.log(`${file.name} uploaded successfully.`);
    });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
}
