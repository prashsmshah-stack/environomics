import { Router } from "express";
import { env } from "../config/env.js";
import { asyncHandler } from "../lib/http.js";
import { checkMysqlConnection, isMysqlStorage } from "../lib/mysql.js";
import {
  createPublicLead,
  getPublicContent,
  getRouteSeo,
  getSingletonSection,
  listCollection
} from "../services/contentService.js";

const publicRouter = Router();

publicRouter.get(
  "/health",
  asyncHandler(async (_req, res) => {
    let database = {
      driver: env.storageDriver,
      connected: true
    };

    if (isMysqlStorage()) {
      await checkMysqlConnection();
    }

    res.json({
      success: true,
      message: "Environomics backend is running.",
      timestamp: new Date().toISOString(),
      database
    });
  })
);

publicRouter.get(
  "/content",
  asyncHandler(async (_req, res) => {
    res.json({
      success: true,
      data: await getPublicContent()
    });
  })
);

publicRouter.get(
  "/projects",
  asyncHandler(async (_req, res) => {
    const content = await getPublicContent();
    res.json({ success: true, data: content.projects ?? [] });
  })
);

publicRouter.get(
  "/clients",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await listCollection("clients") });
  })
);

publicRouter.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await listCollection("testimonials") });
  })
);

publicRouter.get(
  "/contact",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await getSingletonSection("contact") });
  })
);

publicRouter.get(
  "/seo",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await getSingletonSection("seo") });
  })
);

publicRouter.get(
  "/seo/:routeKey",
  asyncHandler(async (req, res) => {
    res.json({ success: true, data: await getRouteSeo(req.params.routeKey) });
  })
);

publicRouter.post(
  "/leads",
  asyncHandler(async (req, res) => {
    const lead = await createPublicLead(req.body ?? {});
    res.status(201).json({
      success: true,
      data: lead,
      message: "Lead created successfully."
    });
  })
);

export { publicRouter };
