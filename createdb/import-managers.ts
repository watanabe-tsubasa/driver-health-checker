import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { hashPassword } from "../app/lib/auth";

const MASTER_ACCOUNT = [
  { lastName: "本社", password: "password", firstName: "管理1", userName: "master-1" },
  { lastName: "本社", password: "password", firstName: "管理2", userName: "master-2" },
];

async function insertMasters() {
  const hashedUsers = await Promise.all(
    MASTER_ACCOUNT.map(async (user) => {
      const salt = randomUUID();
      const passwordHash = await hashPassword(user.password, salt);
      return { ...user, passwordHash, salt };
    })
  );

  const values = hashedUsers
    .map((u) => {
      const storeCodeQuery = "NULL"; // storeName がない場合は NULL

      return `(${storeCodeQuery}, '${u.userName.replace(/'/g, "''")}', '${u.lastName.replace(/'/g, "''")}', '${u.firstName.replace(/'/g, "''")}', '${u.passwordHash}', '${u.salt}', 'master', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    })
    .join(",\n");

  const sql = `INSERT INTO managers (store_code, login_id, last_name, first_name, password_hash, salt, role, created_at, updated_at) VALUES \n${values};`;

  console.log("実行するSQL:");
  console.log(sql);

  execSync(`bunx wrangler d1 execute driver-health-checker --remote --command="${sql}"`, {
    stdio: "inherit",
  });

  console.log("マスターアカウントを登録しました！");
}

insertMasters();
