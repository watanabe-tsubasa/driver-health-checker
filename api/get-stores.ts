export async function handleGetStores(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  console.log(ctx); // for ignore error

  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // 🔹 Cloudflare D1 から店舗一覧を取得
  const db = env.DB;
  const storeQuery = `SELECT store_code, store_name FROM sites ORDER BY store_name ASC`;
  const stores = await db.prepare(storeQuery).all<{ store_code: string; store_name: string }>();

  return new Response(
    JSON.stringify(
      stores.results.map((store) => ({
        value: store.store_code, // store_code を value にする
        label: store.store_name, // store_name を label にする
      }))
    ),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
