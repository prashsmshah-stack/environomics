import crypto from "node:crypto";
import { env } from "../config/env.js";
import { createHttpError } from "../lib/http.js";
import { verifyAdminSession } from "../services/authService.js";

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function signPayload(value) {
  return crypto.createHmac("sha256", env.adminTokenSecret).update(value).digest("base64url");
}

export function createAdminToken(user = {}) {
  const payload = {
    sub: String(user.id ?? user.username ?? env.adminUsername),
    adminId: user.id ?? null,
    username: user.username ?? env.adminUsername,
    role: user.role ?? "admin",
    exp: Date.now() + 1000 * 60 * 60 * 12
  };

  const encoded = encodePayload(payload);
  return `${encoded}.${signPayload(encoded)}`;
}

export function verifyAdminToken(token) {
  const [encoded, signature] = String(token ?? "").split(".");

  if (!encoded || !signature) {
    throw createHttpError(401, "Missing or invalid token.");
  }

  const expected = signPayload(encoded);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
    throw createHttpError(401, "Invalid token signature.");
  }

  const payload = decodePayload(encoded);

  if (!payload.exp || payload.exp < Date.now()) {
    throw createHttpError(401, "Token has expired.");
  }

  return payload;
}

export function requireAdminAuth(req, _res, next) {
  Promise.resolve()
    .then(async () => {
      const header = req.headers.authorization ?? "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : "";
      const payload = verifyAdminToken(token);
      req.admin = await verifyAdminSession(token, payload);
      next();
    })
    .catch(next);
}
