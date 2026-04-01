import { hashPassword } from "../lib/password.js";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run auth:hash -- <password>");
  process.exit(1);
}

const passwordHash = await hashPassword(password);
console.log(passwordHash);
