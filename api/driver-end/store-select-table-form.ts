import { EndHealthCheckFormData } from "~/lib/types";

// api/driver-end/store-select-table-form.ts
export async function handleDriverEndStoreSelectTableForm(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  console.log(ctx); // for ignore error
  const url = new URL(request.url);

  const db = env.DB;

  // 🔹 GET: フロントに storeName, driverName, deliveryCompany を返す
  if (request.method === "GET") {
    const storeCode = url.searchParams.get("storeCode") || "";
    const storeName = url.searchParams.get("storeName") || "";
    const driverName = url.searchParams.get("driverName") || "";
    const deliveryCompany = url.searchParams.get("deliveryCompany") || "";

    return new Response(
      JSON.stringify({ storeCode, storeName, driverName, deliveryCompany }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // 🔹 POST: `end_checks` にデータを登録
  if (request.method === "POST") {
    const data = await request.json() as EndHealthCheckFormData;

    // 🔸 バリデーション
    if (
      !data.startCheckId ||
      typeof data.hasUsedAlcoholChecker !== "boolean" ||
      typeof data.alcoholTestFirstResult !== "number" ||
      (data.alcoholTestSecondResult !== null && typeof data.alcoholTestSecondResult !== "number")
    ) {
      return new Response(JSON.stringify({ error: "無効なデータです" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // 🔸 `end_checks` に登録
      const insertQuery = `
        INSERT INTO end_checks (start_check_id, has_used_alcohol_checker, alcohol_test_first_result, alcohol_test_second_result, created_at, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      await db
        .prepare(insertQuery)
        .bind(data.startCheckId, data.hasUsedAlcoholChecker, data.alcoholTestFirstResult, data.alcoholTestSecondResult)
        .run();

      console.log("Registered end_check:", data);

      return new Response(JSON.stringify({ message: "登録成功" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("DB Insert Error:", error);
      return new Response(JSON.stringify({ error: "データベースエラーが発生しました。" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}
