import fs from "node:fs";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { publicRouter } from "./routes/public.js";

function normalizeOrigin(value = "") {
  return String(value).trim().replace(/\/+$/, "").toLowerCase();
}

function getRequestHost(req) {
  return String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "")
    .split(",")[0]
    .trim();
}

function getRequestProtocol(req) {
  return String(req.headers["x-forwarded-proto"] ?? req.protocol ?? "http")
    .split(",")[0]
    .trim()
    .toLowerCase();
}

function createCorsOptionsDelegate() {
  const configuredOrigins = String(env.corsOrigin ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const fallbackOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ];

  const allowedOrigins = new Set(
    [...fallbackOrigins, ...configuredOrigins].map((origin) => normalizeOrigin(origin))
  );

  return (req, callback) => {
    const requestOrigin = normalizeOrigin(req.headers.origin);

    if (!requestOrigin) {
      callback(null, { origin: true, credentials: true });
      return;
    }

    const requestHost = getRequestHost(req);
    const requestProtocol = getRequestProtocol(req);
    const sameOrigin = requestHost
      ? normalizeOrigin(`${requestProtocol}://${requestHost}`)
      : "";

    if (allowedOrigins.has(requestOrigin) || (sameOrigin && requestOrigin === sameOrigin)) {
      callback(null, { origin: true, credentials: true });
      return;
    }

    callback(new Error(`Origin ${requestOrigin} is not allowed by CORS.`));
  };
}

export function createApp() {
  const app = express();
  const hasBuiltFrontend = fs.existsSync(env.frontendIndexFile);

  app.set("trust proxy", true);

  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );
  app.use(cors(createCorsOptionsDelegate()));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use("/uploads", express.static(env.uploadDir));

  app.get("/", (_req, res) => {
    if (hasBuiltFrontend) {
      res.sendFile(env.frontendIndexFile);
      return;
    }

    res.json({
      success: true,
      message: "Environomics backend is running.",
      docs: "/api/health"
    });
  });

  app.use("/api", publicRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);

  if (hasBuiltFrontend) {
    app.use(express.static(env.frontendDistDir, { index: false }));

    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
        next();
        return;
      }

      res.sendFile(env.frontendIndexFile);
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
