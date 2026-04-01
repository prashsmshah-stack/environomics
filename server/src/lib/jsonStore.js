import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";
import { buildDefaultContent } from "../data/defaultContent.js";

let writeQueue = Promise.resolve();

async function ensureDirectory(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

export async function ensureStore() {
  await ensureDirectory(env.dataFile);
  await fs.mkdir(env.uploadDir, { recursive: true });

  try {
    await fs.access(env.dataFile);
  } catch {
    const initialContent = buildDefaultContent();
    await fs.writeFile(env.dataFile, JSON.stringify(initialContent, null, 2), "utf8");
  }
}

export async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(env.dataFile, "utf8");
  return JSON.parse(raw);
}

export async function writeStore(content) {
  await ensureStore();

  writeQueue = writeQueue.then(() =>
    fs.writeFile(env.dataFile, JSON.stringify(content, null, 2), "utf8")
  );

  await writeQueue;
  return content;
}
