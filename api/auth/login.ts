import { DataTypeForLogin } from "~/lib/types";

// api/auth/login.ts
const SAMPLE_USERS = [
  { lastName: "渡邊", password: "password", firstName: "翼", storeName: "イオン東雲店" },
  { lastName: "伊音", password: "password", firstName: "太郎", storeName: "イオン船橋店" },
  { lastName: "イオン", password: "password", firstName: "花子", storeName: "イオンスタイル千葉みなと" },
];

export interface LoginResponseType {
  lastName: string;
  firstName: string;
  storeName: string;
}

export async function handleAuthLogin(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  console.log(env); // for ignore error
  console.log(ctx); // for ignore error
  if (request.method === "POST") {
    const { lastName, password } = await request.json() as DataTypeForLogin;
    if (!lastName || !password) {
      return new Response(JSON.stringify({ error: "すべてのフィールドを入力してください" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const user = SAMPLE_USERS.find((u) => u.lastName === lastName && u.password === password);
    if (!user) {
      return new Response(JSON.stringify({ error: "無効な氏名またはパスワードです" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    // 認証成功
    return new Response(JSON.stringify({
      lastName: user.lastName,
      firstName: user.firstName,
      storeName: user.storeName,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
