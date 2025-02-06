import { StartHealthCheckFormData } from "~/lib/types";

// api/driver-start.ts
export async function handleDriverStart(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  console.log(ctx); //for ignore erorr
  const data = await request.json() as StartHealthCheckFormData;

  // 🔹 必須項目のバリデーション
  if (
    !data.storeCode || !data.driverName || !data.deliveryCompany ||
    typeof data.hasUsedAlcoholChecker !== "boolean" ||
    typeof data.alcoholTestFirstResult !== "number" ||
    (data.alcoholTestSecondResult !== null && typeof data.alcoholTestSecondResult !== "number") ||
    typeof data.hasIllness !== "boolean" ||
    typeof data.isTired !== "boolean"
  ) {
    return new Response(
      JSON.stringify({ error: "無効な入力データです" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const db = env.DB;

  // 🔹 D1 に登録
  try {
    const query = `
      INSERT INTO start_checks (
        store_code, driver_name, delivery_company, has_used_alcohol_checker,
        alcohol_test_first_result, alcohol_test_second_result, has_illness, is_tired,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    await db.prepare(query).bind(
      data.storeCode,
      data.driverName,
      data.deliveryCompany,
      data.hasUsedAlcoholChecker,
      data.alcoholTestFirstResult,
      data.alcoholTestSecondResult,
      data.hasIllness,
      data.isTired
    ).run();

    return new Response(
      JSON.stringify({ message: "登録が完了しました" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("DB Insert Error:", error);
    return new Response(
      JSON.stringify({ error: "データベースエラーが発生しました" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
