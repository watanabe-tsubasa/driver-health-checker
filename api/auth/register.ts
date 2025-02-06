import { hashPassword } from "~/lib/auth";
import { RegisterRequestData } from "~/lib/types";

export async function handleAuthRegister(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  console.log(ctx); // for ignore error

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const data = (await request.json()) as RegisterRequestData;
  console.log("Register data:", data);

  // 🔹 Cloudflare D1 データベース接続
  const db = env.DB;

  // 🔹 パスワードのハッシュ化
  const salt = crypto.randomUUID(); // ランダムな salt を生成
  const hashedPassword = await hashPassword(data.password, salt);

  try {
    // 🔹 `managers` テーブルにユーザーを登録
    const insertQuery = `
      INSERT INTO managers (store_code, login_id, last_name, first_name, password_hash, salt, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    await db.prepare(insertQuery).bind(
      data.storeCode,
      data.userName,
      data.lastName,
      data.firstName,
      hashedPassword,
      salt,
      data.role
    ).run();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed: managers.login_id")) {
      return new Response(
        JSON.stringify({
          error: "このユーザーネームは既に使用されています。他の名前を試してください。",
          suggestion: `${data.userName}-${Math.floor(Math.random() * 10)}`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.error("DB Insert Error:", error);
    return new Response(JSON.stringify({ error: "サーバーエラーが発生しました。" }), { status: 500 });
  }

  console.log("Registered new user:", data);

  return new Response(
    JSON.stringify({ message: "Registration success", user: data }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}