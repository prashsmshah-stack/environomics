import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { publicRouter } from "./routes/public.js";

function createCorsOriginMatcher() {
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

  const allowedOrigins = new Set([...fallbackOrigins, ...configuredOrigins]);

  return (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  };
}

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );
  app.use(
    cors({
      origin: createCorsOriginMatcher(),
      credentials: true
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use("/uploads", express.static(env.uploadDir));

  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "Environomics backend is running.",
      docs: "/api/health"
    });
  });

  app.use("/api", publicRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
