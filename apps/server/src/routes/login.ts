import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prismadb";

export default async function login(req: Request, res: Response) {
  const { username } = req.body;
  const token = jwt.sign({ username }, process.env.JWT_SECRET_TOKEN as string);

  const userExists = await prisma.users.findUnique({
    where: {
      username,
    },
  });

  if (userExists) {
    res.sendStatus(200);
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
}
