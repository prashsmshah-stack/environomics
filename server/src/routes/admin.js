import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { asyncHandler, createHttpError } from "../lib/http.js";
import { requireAdminAuth } from "../middleware/auth.js";
import {
  createCollectionItem,
  createSocialLink,
  deleteCollectionItem,
  deleteSocialLink,
  getContent,
  getDashboardSummary,
  getSingletonSection,
  listCollection,
  listSocialLinks,
  reorderCollection,
  reorderSocialLinks,
  resetContent,
  updateCollectionItem,
  updateSingletonSection,
  updateSocialLink
} from "../services/contentService.js";
import { createEntityId, createSlug } from "../utils/id.js";

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, env.uploadDir);
  },
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname ?? "") || ".bin";
    const baseName = createSlug(path.basename(file.originalname ?? "upload", ext)) || "upload";
    callback(null, `${baseName}-${createEntityId("file")}${ext}`);
  }
});

const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

function buildCollectionRoutes(router, section) {
  router.get(
    `/${section}`,
    asyncHandler(async (_req, res) => {
      res.json({ success: true, data: await listCollection(section) });
    })
  );

  router.post(
    `/${section}`,
    asyncHandler(async (req, res) => {
      const item = await createCollectionItem(section, req.body ?? {});
      res.status(201).json({ success: true, data: item });
    })
  );

  router.patch(
    `/${section}/:id`,
    asyncHandler(async (req, res) => {
      const item = await updateCollectionItem(section, req.params.id, req.body ?? {});
      res.json({ success: true, data: item });
    })
  );

  router.delete(
    `/${section}/:id`,
    asyncHandler(async (req, res) => {
      const result = await deleteCollectionItem(section, req.params.id);
      res.json({ success: true, data: result });
    })
  );

  router.post(
    `/${section}/reorder`,
    asyncHandler(async (req, res) => {
      const data = await reorderCollection(section, req.body ?? {});
      res.json({ success: true, data });
    })
  );
}

const adminRouter = Router();

adminRouter.use(requireAdminAuth);

adminRouter.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await getDashboardSummary() });
  })
);

adminRouter.get(
  "/content",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await getContent() });
  })
);

adminRouter.post(
  "/content/reset",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await resetContent() });
  })
);

buildCollectionRoutes(adminRouter, "projects");
buildCollectionRoutes(adminRouter, "clients");
buildCollectionRoutes(adminRouter, "testimonials");
buildCollectionRoutes(adminRouter, "leads");

["home", "contact", "seo", "settings"].forEach((section) => {
  adminRouter.get(
    `/${section}`,
    asyncHandler(async (_req, res) => {
      res.json({ success: true, data: await getSingletonSection(section) });
    })
  );

  adminRouter.put(
    `/${section}`,
    asyncHandler(async (req, res) => {
      res.json({ success: true, data: await updateSingletonSection(section, req.body ?? {}) });
    })
  );
});

adminRouter.get(
  "/contact/socials",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await listSocialLinks() });
  })
);

adminRouter.post(
  "/contact/socials",
  asyncHandler(async (req, res) => {
    const social = await createSocialLink(req.body ?? {});
    res.status(201).json({ success: true, data: social });
  })
);

adminRouter.patch(
  "/contact/socials/:id",
  asyncHandler(async (req, res) => {
    const social = await updateSocialLink(req.params.id, req.body ?? {});
    res.json({ success: true, data: social });
  })
);

adminRouter.delete(
  "/contact/socials/:id",
  asyncHandler(async (req, res) => {
    const result = await deleteSocialLink(req.params.id);
    res.json({ success: true, data: result });
  })
);

adminRouter.post(
  "/contact/socials/reorder",
  asyncHandler(async (req, res) => {
    const socials = await reorderSocialLinks(req.body ?? {});
    res.json({ success: true, data: socials });
  })
);

adminRouter.post(
  "/uploads",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw createHttpError(400, "No file uploaded.");
    }

    res.status(201).json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`
      }
    });
  })
);

export { adminRouter };
