import prisma from "@/lib/prismadb";
import { Request, Response } from "express";

export default async function profiles(req: Request, res: Response) {
  const users = await prisma.users.findMany();

  res.json(users);
}
