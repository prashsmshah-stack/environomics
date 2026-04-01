import mysql from "mysql2/promise";
import { env } from "../config/env.js";

let pool;

export function isMysqlStorage() {
  return env.storageDriver === "mysql";
}

export function getMysqlPool() {
  if (!isMysqlStorage()) {
    throw new Error("MySQL pool requested while STORAGE_DRIVER is not set to mysql.");
  }

  if (!pool) {
    pool = mysql.createPool({
      host: env.mysqlHost,
      port: env.mysqlPort,
      user: env.mysqlUser,
      password: env.mysqlPassword,
      database: env.mysqlDatabase,
      waitForConnections: true,
      connectionLimit: env.mysqlConnectionLimit,
      queueLimit: 0,
      charset: "utf8mb4"
    });
  }

  return pool;
}

export async function checkMysqlConnection() {
  const mysqlPool = getMysqlPool();
  await mysqlPool.query("SELECT 1");
}

export async function closeMysqlPool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
