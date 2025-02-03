import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * This function authenticate the jwt token and set the username or null in the request body.
 * @param req Express Request Object
 * @param res Express Response Object
 * @param next Express Next Function
 */
export default function authenticateJwtToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    res.sendStatus(401);
    req.body.username = null;
    next();
  }

  jwt.verify(
    token as string,
    process.env.JWT_SECRET_TOKEN as string,
    (err, payload) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }

      if (typeof payload !== "object" || typeof payload.username !== "string") {
        return res.sendStatus(403);
      }

      req.body.username = payload.username;

      next();
    }
  );
}
