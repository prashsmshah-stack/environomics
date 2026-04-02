import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const serverRoot = path.resolve(currentDir, "../..");
const projectRoot = path.resolve(serverRoot, "..");

dotenv.config({ path: path.join(serverRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env") });

function resolveServerPath(relativePath) {
  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }

  return path.resolve(serverRoot, relativePath);
}

const insecureAdminPasswords = new Set([
  "admin@environomics",
  "change-me-before-production",
  "replace-with-a-strong-admin-password"
]);

const insecureAdminTokenSecrets = new Set([
  "change-this-before-production",
  "generate-a-long-random-secret-before-production",
  "replace-with-a-random-secret-at-least-32-characters-long"
]);

export const env = {
  serverRoot,
  projectRoot,
  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? "0.0.0.0",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  storageDriver: process.env.STORAGE_DRIVER ?? "json",
  adminUsername: process.env.ADMIN_USERNAME ?? "admin",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@environomics.local",
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin@environomics",
  adminTokenSecret: process.env.ADMIN_TOKEN_SECRET ?? "change-this-before-production",
  dataFile: resolveServerPath(process.env.DATA_FILE ?? "./data/content.json"),
  uploadDir: resolveServerPath(process.env.UPLOAD_DIR ?? "./uploads"),
  frontendDistDir: path.resolve(projectRoot, "dist"),
  frontendIndexFile: path.resolve(projectRoot, "dist", "index.html"),
  isProduction: process.env.NODE_ENV === "production",
  mysqlHost: process.env.MYSQL_HOST ?? "localhost",
  mysqlPort: Number(process.env.MYSQL_PORT ?? 3306),
  mysqlUser: process.env.MYSQL_USER ?? "root",
  mysqlPassword: process.env.MYSQL_PASSWORD ?? "",
  mysqlDatabase: process.env.MYSQL_DATABASE ?? "environomics_cms",
  mysqlConnectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10)
};

export function validateRuntimeEnv() {
  const issues = [];

  if (!Number.isFinite(env.port) || env.port <= 0) {
    issues.push("PORT must be a valid positive number.");
  }

  if (env.isProduction) {
    if (insecureAdminPasswords.has(String(env.adminPassword ?? "").trim())) {
      issues.push("ADMIN_PASSWORD still uses a placeholder value.");
    }

    const adminTokenSecret = String(env.adminTokenSecret ?? "").trim();
    if (
      !adminTokenSecret ||
      insecureAdminTokenSecrets.has(adminTokenSecret) ||
      adminTokenSecret.length < 32
    ) {
      issues.push("ADMIN_TOKEN_SECRET must be a real secret with at least 32 characters.");
    }

    if (env.storageDriver === "mysql" && !String(env.mysqlDatabase ?? "").trim()) {
      issues.push("MYSQL_DATABASE is required when STORAGE_DRIVER=mysql.");
    }
  }

  if (issues.length) {
    throw new Error(
      `Invalid runtime configuration:\n${issues.map((issue) => `- ${issue}`).join("\n")}`
    );
  }
}
