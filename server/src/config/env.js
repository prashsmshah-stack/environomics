import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const serverRoot = path.resolve(currentDir, "../..");

dotenv.config({ path: path.join(serverRoot, ".env") });

function resolveServerPath(relativePath) {
  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }

  return path.resolve(serverRoot, relativePath);
}

export const env = {
  serverRoot,
  port: Number(process.env.PORT ?? 4000),
  host: process.env.HOST ?? "127.0.0.1",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  storageDriver: process.env.STORAGE_DRIVER ?? "json",
  adminUsername: process.env.ADMIN_USERNAME ?? "admin",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@environomics.local",
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin@environomics",
  adminTokenSecret: process.env.ADMIN_TOKEN_SECRET ?? "change-this-before-production",
  dataFile: resolveServerPath(process.env.DATA_FILE ?? "./data/content.json"),
  uploadDir: resolveServerPath(process.env.UPLOAD_DIR ?? "./uploads"),
  mysqlHost: process.env.MYSQL_HOST ?? "127.0.0.1",
  mysqlPort: Number(process.env.MYSQL_PORT ?? 3306),
  mysqlUser: process.env.MYSQL_USER ?? "root",
  mysqlPassword: process.env.MYSQL_PASSWORD ?? "",
  mysqlDatabase: process.env.MYSQL_DATABASE ?? "environomics_cms",
  mysqlConnectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10)
};
