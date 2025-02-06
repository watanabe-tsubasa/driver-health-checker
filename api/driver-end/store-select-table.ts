// api/driver-end/store-select-table.ts
export async function handleDriverEndStoreSelectTable(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  console.log(ctx); // for ignore error
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const storeCode = url.searchParams.get("storeCode");

  if (!storeCode) {
    return new Response(
      JSON.stringify({ error: "storeCode が指定されていません。" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const db = env.DB;
  try {
    const query = `
      SELECT s.store_name, sc.id, sc.store_code, sc.driver_name, sc.delivery_company
      FROM start_checks AS sc
      JOIN sites AS s ON sc.store_code = s.store_code
      LEFT JOIN end_checks AS ec ON sc.id = ec.start_check_id
      WHERE sc.store_code = ? AND ec.start_check_id IS NULL
      ORDER BY sc.created_at DESC
    `;
    const { results } = await db.prepare(query).bind(storeCode).all<{
      id: number;
      store_code: string;
      store_name: string;
      driver_name: string;
      delivery_company: string;
    }>();

    return new Response(
      JSON.stringify(
        results.map((row) => ({
          id: row.id,
          storeCode: row.store_code,
          storeName: row.store_name,
          driverName: row.driver_name,
          deliveryCompany: row.delivery_company,
        }))
      ),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("DB Query Error:", error);
    return new Response(
      JSON.stringify({ error: "データベースエラーが発生しました。" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
