import { Router } from "express";
import { asyncHandler } from "../lib/http.js";
import { requireAdminAuth, createAdminToken } from "../middleware/auth.js";
import {
  authenticateAdmin,
  recordAdminSession,
} from "../services/authService.js";

const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username = "", password = "" } = req.body ?? {};
    const user = await authenticateAdmin({ username, password });
    const token = createAdminToken(user);
    await recordAdminSession(user, token, req);

    res.json({
      success: true,
      token,
      user: {
        id: user.id ?? null,
        name: user.name ?? "",
        email: user.email ?? "",
        username: user.username,
        role: user.role ?? "admin"
      }
    });
  })
);

authRouter.get(
  "/me",
  requireAdminAuth,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      user: {
        id: req.admin?.adminId ?? req.admin?.id ?? null,
        name: req.admin?.name ?? "",
        email: req.admin?.email ?? "",
        username: req.admin?.username ?? "",
        role: req.admin?.role ?? "admin"
      }
    });
  })
);

export { authRouter };
