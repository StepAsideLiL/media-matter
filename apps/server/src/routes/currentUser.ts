import prisma from "@/lib/prismadb";
import { Request, Response } from "express";

export default async function currentUser(req: Request, res: Response) {
  const { username } = req.body;

  const user = await prisma.users.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    res.json({ userId: null, username: null });
    return;
  }

  res.json({ userId: user.id, username: user.username });
}
