import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.auth = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
