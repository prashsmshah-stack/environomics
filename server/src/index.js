import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { closeMysqlPool } from "./lib/mysql.js";
import { initializeContentStorage } from "./services/contentService.js";

async function start() {
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
  console.error("Failed to start backend:", error);
  process.exit(1);
});
