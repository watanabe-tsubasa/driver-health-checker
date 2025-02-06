import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { hashPassword } from "../app/lib/auth";

const SAMPLE_USERS = [
  { lastName: "渡邊", password: "password", firstName: "翼", storeName: "イオン東雲店", userName: "shinonome-渡邊" },
  { lastName: "伊音", password: "password", firstName: "太郎", storeName: "イオン船橋店", userName: "funabashi-伊音" },
  { lastName: "イオン", password: "password", firstName: "花子", storeName: "イオンスタイル千葉みなと", userName: "chibaminato-イオン" },
];

async function insertManagers() {
  const hashedUsers = await Promise.all(
    SAMPLE_USERS.map(async (user) => {
      const salt = randomUUID(); // ランダムな salt を生成
      const passwordHash = await hashPassword(user.password, salt);
      return { ...user, passwordHash, salt };
    })
  );

  const values = hashedUsers
    .map(
      (u) =>
        `((SELECT store_code FROM sites WHERE store_name = '${u.storeName}'), '${u.userName}', '${u.lastName}', '${u.firstName}', '${u.passwordHash}', '${u.salt}', 'leader', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    )
    .join(",\n");

  const sql = `INSERT INTO managers (store_code, login_id, last_name, first_name, password_hash, salt, role, created_at, updated_at) VALUES \n${values};`;

  console.log("実行するSQL:");
  console.log(sql);

  execSync(`bunx wrangler d1 execute driver-health-checker --local --command="${sql}"`, {
    stdio: "inherit",
  });

  console.log("管理者データを登録しました！");
}

insertManagers();
