import { Request, Router } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { buildMenu, resolveRole } from "../services/menuService";

const router = Router();

function extractRoleFromRequest(req: Request): string | undefined {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return undefined;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
    return typeof decoded.role === "string" ? decoded.role : undefined;
  } catch {
    return undefined;
  }
}

router.get("/", (req, res) => {
  const tokenRole = extractRoleFromRequest(req);
  const queryRole =
    typeof req.query.role === "string" ? req.query.role : undefined;

  const role = resolveRole(tokenRole ?? queryRole);
  const menu = buildMenu(role);

  return res.json(menu);
});

export default router;
