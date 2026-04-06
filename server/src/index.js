import fs from "node:fs";
import { createApp } from "./app.js";
import { env, validateRuntimeEnv } from "./config/env.js";
import { closeMysqlPool } from "./lib/mysql.js";
import { initializeContentStorage } from "./services/contentService.js";

function getStartupSummary() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "undefined",
    host: env.host,
    port: env.port,
    storageDriver: env.storageDriver,
    frontendBuilt: fs.existsSync(env.frontendIndexFile),
    mysqlHost: env.storageDriver === "mysql" ? env.mysqlHost : null,
    mysqlPort: env.storageDriver === "mysql" ? env.mysqlPort : null,
    mysqlDatabase: env.storageDriver === "mysql" ? env.mysqlDatabase : null,
    adminUsername: env.adminUsername
  };
}

function getStartupHint(error) {
  switch (error?.code) {
    case "ER_ACCESS_DENIED_ERROR":
      return "MySQL rejected the username/password. Check MYSQL_USER and MYSQL_PASSWORD in Hostinger.";
    case "ER_BAD_DB_ERROR":
      return "The configured MySQL database does not exist. Check MYSQL_DATABASE in Hostinger.";
    case "ER_NO_SUCH_TABLE":
      return "MySQL tables are missing. Import server/database/mysql/schema.sql into the selected database.";
    case "ECONNREFUSED":
      return "The MySQL server refused the connection. Check MYSQL_HOST and MYSQL_PORT in Hostinger.";
    case "ENOTFOUND":
      return "The MySQL host name could not be resolved. Check MYSQL_HOST in Hostinger.";
    default:
      return null;
  }
}

async function start() {
  validateRuntimeEnv();
  await initializeContentStorage();

  const app = createApp();

  const server = app.listen(env.port, env.host, () => {
    console.log(`Environomics backend running at http://${env.host}:${env.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await closeMysqlPool();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((error) => {
  const hint = getStartupHint(error);

  console.error("Failed to start backend:", error);
  console.error("Startup summary:", getStartupSummary());
  if (hint) {
    console.error("Startup hint:", hint);
  }
  process.exit(1);
});
