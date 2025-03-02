import prisma from "@/lib/prismadb";
import { Request, Response } from "express";

export default async function getAllFiles(req: Request, res: Response) {
  const { tab, userId } = req.body;

  if (tab === "all") {
    const files = await prisma.files.findMany();

    const filesUrl = files.map(
      (file) => `http://127.0.0.1:9000/media-matter/${file.name}`
    );

    res.json({ filesUrl });
  } else {
    const files = await prisma.files.findMany({
      where: {
        userId,
      },
    });

    const filesUrl = files.map(
      (file) => `http://127.0.0.1:9000/media-matter/${file.name}`
    );

    res.json({ filesUrl });
  }
}
