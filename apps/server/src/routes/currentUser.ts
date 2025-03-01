import { Request, Response } from "express";

export default async function currentUser(req: Request, res: Response) {
  const { username } = req.body;

  res.json({ username });
}
