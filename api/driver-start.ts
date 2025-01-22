// api/driver-start.ts
export async function handleDriverStart(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  console.log(env); // for ignore error
  console.log(ctx); // for ignore error
  
  if (request.method === "POST") {
    const data = await request.json();
    console.log("POST /driver-start data:", data);
    // DB保存等
    return new Response(JSON.stringify({ message: "OK" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
