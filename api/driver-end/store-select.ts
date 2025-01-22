interface TempDataType {
  storeName: string;
}

// api/driver-end/store-select.ts
export async function handleDriverEndStoreSelect(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  console.log(env); // for ignore error
  console.log(ctx); // for ignore error
  // この画面の action は storeName を受け取ってリダイレクトするだけなので、
  // API 側では特に重い処理がない場合が多い。
  // 例として POST された storeName をログ出力するようにしてみる。
  if (request.method === "POST") {
    const data = await request.json() as TempDataType;
    console.log("POST /driver-end/store-select data:", data);
    // storeName が無い場合はエラー
    if (!data.storeName) {
      return new Response(JSON.stringify({ error: "storeName がありません" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
