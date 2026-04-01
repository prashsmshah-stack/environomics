import bcrypt from "bcryptjs";

const ROUNDS = 12;

export function hashPassword(password) {
  return bcrypt.hash(String(password ?? ""), ROUNDS);
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compare(String(password ?? ""), String(passwordHash ?? ""));
}
