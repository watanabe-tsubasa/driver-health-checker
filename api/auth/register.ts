// api/auth/register.ts
export async function handleAuthRegister(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  console.log(env, ctx) // for ignore error
  if (request.method === "POST") {
    const data = await request.json();
    console.log("Register data:", data);
    // Basic認証が必要ならここで request.headers.get("Authorization") の検証をする
    // DBに登録など
    return new Response(JSON.stringify({ message: "Registration success" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
