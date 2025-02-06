import { verifyPassword } from "~/lib/auth";
import { LoginData } from "~/lib/types";

export async function handleAuthLogin(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  console.log(ctx); // for ignore error

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { userName, password } = await request.json() as LoginData;

  if (!userName || !password) {
    return new Response(JSON.stringify({ error: "すべてのフィールドを入力してください" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 🔹 Cloudflare D1 データベース接続
  const db = env.DB;

  // 🔹 `userName` から `password_hash`, `salt`, `storeCode`, `lastName`, `firstName` を取得
  const userQuery = `
    SELECT m.id, m.password_hash, m.salt, m.last_name, m.first_name, s.store_name, s.store_code, m.role 
    FROM managers m
    JOIN sites s ON m.store_code = s.store_code
    WHERE m.login_id = ?
  `;
  
  const userResult = await db.prepare(userQuery).bind(userName).first<{
    password_hash: string;
    salt: string;
    id: number;
    last_name: string;
    first_name: string;
    store_name: string;
    store_code: string;
    role: 'leader' | 'ns_manager' | 'store_manager';
  }>();

  if (!userResult) {
    return new Response(
      JSON.stringify({ error: "無効なユーザーネームまたはパスワードです" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  console.log(userResult);

  const { id, password_hash, salt, last_name, first_name, store_name, store_code, role } = userResult;

  // 🔹 パスワードを検証
  const isValid = await verifyPassword(password, password_hash, salt);
  if (!isValid) {
    return new Response(
      JSON.stringify({ error: "無効なユーザーネームまたはパスワードです" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 🔹 認証成功
  return new Response(
    JSON.stringify({
      id: id,
      lastName: last_name,
      firstName: first_name,
      storeCode: store_code,
      storeName: store_name,
      role: role,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}


// import { LoginData } from "~/lib/types";

// // api/auth/login.ts
// const SAMPLE_USERS = [
//   { lastName: "渡邊", password: "password", firstName: "翼", storeName: "イオン東雲店", userName: "shinonome-渡邊" },
//   { lastName: "伊音", password: "password", firstName: "太郎", storeName: "イオン船橋店", userName: "funabashi-伊音" },
//   { lastName: "イオン", password: "password", firstName: "花子", storeName: "イオンスタイル千葉みなと", userName: "chibaminato-イオン" },
// ];

// export interface LoginResponseType {
//   lastName: string;
//   firstName: string;
//   storeName: string;
// }

// export async function handleAuthLogin(
//   request: Request,
//   env: Env,
//   ctx: ExecutionContext
// ): Promise<Response> {
//   console.log(env); // for ignore error
//   console.log(ctx); // for ignore error
//   if (request.method === "POST") {
//     const { userName, password } = await request.json() as LoginData;
//     if (!userName || !password) {
//       return new Response(JSON.stringify({ error: "すべてのフィールドを入力してください" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//     const user = SAMPLE_USERS.find((u) => u.userName === userName && u.password === password);
//     if (!user) {
//       return new Response(JSON.stringify({ error: "無効な氏名またはパスワードです" }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//     // 認証成功
//     return new Response(JSON.stringify({
//       lastName: user.lastName,
//       firstName: user.firstName,
//       storeName: user.storeName,
//     }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
//   return new Response("Method Not Allowed", { status: 405 });
// }
