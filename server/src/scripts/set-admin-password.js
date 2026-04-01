import { closeMysqlPool, getMysqlPool, isMysqlStorage } from "../lib/mysql.js";
import { hashPassword } from "../lib/password.js";

async function main() {
  const [identifier, nextPassword] = process.argv.slice(2);

  if (!identifier || !nextPassword) {
    throw new Error(
      "Usage: npm run admin:set-password -- <username-or-email> <new-password>"
    );
  }

  if (!isMysqlStorage()) {
    throw new Error("Admin password rotation requires STORAGE_DRIVER=mysql.");
  }

  const pool = getMysqlPool();
  const passwordHash = await hashPassword(nextPassword);
  const [result] = await pool.query(
    `UPDATE admin_users
     SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
     WHERE username = ? OR email = ?`,
    [passwordHash, identifier, identifier]
  );

  if (!result.affectedRows) {
    throw new Error(`No admin user found for "${identifier}".`);
  }

  console.log(`Updated password for ${identifier}.`);
}

main()
  .catch((error) => {
    console.error("Failed to update admin password:", error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMysqlPool();
  });
