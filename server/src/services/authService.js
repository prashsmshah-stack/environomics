import crypto from "node:crypto";
import { env } from "../config/env.js";
import { createHttpError } from "../lib/http.js";
import { isMysqlStorage, getMysqlPool } from "../lib/mysql.js";
import { verifyPassword } from "../lib/password.js";

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token ?? "")).digest("hex");
}

export async function authenticateAdmin({ username, password }) {
  const safeUsername = String(username ?? "").trim();
  const safePassword = String(password ?? "");

  if (!isMysqlStorage()) {
    if (safeUsername !== env.adminUsername || safePassword !== env.adminPassword) {
      throw createHttpError(401, "Invalid username or password.");
    }

    return {
      id: null,
      name: "Admin",
      username: env.adminUsername,
      email: env.adminEmail,
      role: "admin"
    };
  }

  const pool = getMysqlPool();
  const [rows] = await pool.query(
    `SELECT id, name, username, email, password_hash, role, is_active
     FROM admin_users
     WHERE username = ? OR email = ?
     LIMIT 1`,
    [safeUsername, safeUsername]
  );
  const user = rows[0];

  if (!user || !user.is_active) {
    throw createHttpError(401, "Invalid username or password.");
  }

  const passwordMatches = await verifyPassword(safePassword, user.password_hash);

  if (!passwordMatches) {
    throw createHttpError(401, "Invalid username or password.");
  }

  await pool.query("UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?", [user.id]);

  return {
    id: user.id,
    name: user.name ?? "",
    username: user.username,
    email: user.email,
    role: user.role ?? "admin"
  };
}

export async function recordAdminSession(user, token, req) {
  if (!isMysqlStorage() || !user?.id) {
    return;
  }

  const pool = getMysqlPool();
  const tokenHash = hashToken(token);
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 12);

  await pool.query(
    `INSERT INTO admin_sessions
     (admin_user_id, token_hash, user_agent, ip_address, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      user.id,
      tokenHash,
      String(req?.headers["user-agent"] ?? "").slice(0, 255) || null,
      req?.ip ?? null,
      expiryDate.toISOString().slice(0, 19).replace("T", " ")
    ]
  );
}

export async function verifyAdminSession(token, payload) {
  if (!isMysqlStorage() || !payload?.adminId) {
    return payload;
  }

  const pool = getMysqlPool();
  const tokenHash = hashToken(token);
  const [rows] = await pool.query(
    `SELECT s.id, u.id AS admin_id, u.name, u.email, u.username, u.role, u.is_active
     FROM admin_sessions s
     INNER JOIN admin_users u ON u.id = s.admin_user_id
     WHERE s.token_hash = ?
       AND s.admin_user_id = ?
       AND s.revoked_at IS NULL
       AND s.expires_at > CURRENT_TIMESTAMP
     LIMIT 1`,
    [tokenHash, payload.adminId]
  );
  const session = rows[0];

  if (!session || !session.is_active) {
    throw createHttpError(401, "Session is invalid or has expired.");
  }

  return {
    ...payload,
    sub: String(session.admin_id),
    adminId: session.admin_id,
    id: session.admin_id,
    name: session.name ?? "",
    email: session.email ?? "",
    username: session.username,
    role: session.role ?? "admin"
  };
}
