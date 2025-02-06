import { ApprovalRequestBody } from "~/lib/types";

export async function handleApprooveStartDashboard(
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  return handleApprooveDashboard(request, env, ctx, "start");
}

export async function handleApprooveEndDashboard(
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  return handleApprooveDashboard(request, env, ctx, "end");
}

export async function handleApprooveDashboard(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  tableType: "start" | "end"
) {
  console.log(ctx); // for ignore error

  const url = new URL(request.url);
  const db = env.DB;

  if (request.method === "GET") {
    const storeCode = url.searchParams.get("storeCode");
    const role = url.searchParams.get("role");

    if (!storeCode || !role) {
      return new Response(
        JSON.stringify({ error: "storeCode または role が指定されていません。" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const results = await fetchApprovalData(db, storeCode, role, tableType);
      return new Response(JSON.stringify(results), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
      console.error("DB Query Error:", error);
      return new Response(JSON.stringify({ error: "データベースエラーが発生しました。" }), { status: 500 });
    }
  }

  if (request.method === "POST") {
    const body = await request.json() as ApprovalRequestBody;
    return approveChecks(db, body, tableType);
  }

  return new Response("Method Not Allowed", { status: 405 });
}

async function fetchApprovalData(
  db: D1Database,
  storeCode: string,
  role: string,
  tableType: "start" | "end"
) {
  if (tableType === "start") {
    const query = `
      SELECT sc.id AS start_check_id, s.store_name, sc.store_code, sc.driver_name, sc.delivery_company,
            sc.has_used_alcohol_checker, sc.alcohol_test_first_result,
            sc.alcohol_test_second_result, sc.has_illness, sc.is_tired,
            sc.created_at
      FROM start_checks AS sc
      JOIN sites AS s ON sc.store_code = s.store_code
      LEFT JOIN start_check_approvals AS a 
          ON sc.id = a.start_check_id 
          AND a.approver_role = ?  -- 🔹 role に応じた承認データのみ取得
      WHERE sc.store_code = ? 
      AND (a.id IS NULL OR a.result = 0)  -- 🔹 未承認のデータのみ取得
      ORDER BY sc.created_at DESC;
    `;

    const { results } = await db.prepare(query).bind(role, storeCode).all<{
      start_check_id: number;
      store_code: string;
      store_name: string;
      driver_name: string;
      delivery_company: string;
      has_used_alcohol_checker: boolean;
      alcohol_test_first_result: number;
      alcohol_test_second_result: number | null;
      has_illness: boolean;
      is_tired: boolean;
      created_at: string;
    }>();

    return results.map((row) => ({
      id: row.start_check_id,
      storeCode: row.store_code,
      storeName: row.store_name,
      driverName: row.driver_name,
      deliveryCompany: row.delivery_company,
      hasUsedAlcoholChecker: row.has_used_alcohol_checker,
      alcoholTestFirstResult: row.alcohol_test_first_result,
      alcoholTestSecondResult: row.alcohol_test_second_result,
      hasIllness: row.has_illness,
      isTired: row.is_tired,
      createdAt: row.created_at,
    }));
  } else {
    const query = `
      SELECT ec.id AS end_check_id, s.store_name, sc.store_code, sc.driver_name, sc.delivery_company,
            ec.has_used_alcohol_checker, ec.alcohol_test_first_result,
            ec.alcohol_test_second_result, ec.created_at
      FROM end_checks AS ec
      JOIN start_checks AS sc ON ec.start_check_id = sc.id
      JOIN sites AS s ON sc.store_code = s.store_code
      LEFT JOIN end_check_approvals AS a 
          ON ec.id = a.end_check_id 
          AND a.approver_role = ?  -- 🔹 role に応じた承認データのみ取得
      WHERE sc.store_code = ? 
      AND (a.id IS NULL OR a.result = 0)  -- 🔹 未承認のデータのみ取得
      ORDER BY ec.created_at DESC;
    `;

    const { results } = await db.prepare(query).bind(role, storeCode).all<{
      end_check_id: number;
      store_code: string;
      store_name: string;
      driver_name: string;
      delivery_company: string;
      has_used_alcohol_checker: boolean;
      alcohol_test_first_result: number;
      alcohol_test_second_result: number | null;
      created_at: string;
    }>();

    return results.map((row) => ({
      id: row.end_check_id,
      storeCode: row.store_code,
      storeName: row.store_name,
      driverName: row.driver_name,
      deliveryCompany: row.delivery_company,
      hasUsedAlcoholChecker: row.has_used_alcohol_checker,
      alcoholTestFirstResult: row.alcohol_test_first_result,
      alcoholTestSecondResult: row.alcohol_test_second_result,
      createdAt: row.created_at,
    }));
  }
}

async function approveChecks(
  db: D1Database,
  body: ApprovalRequestBody,
  tableType: "start" | "end"
) {
  if (!body.selectedData || !Array.isArray(body.selectedData) || isNaN(body.managerId)) {
    return new Response(
      JSON.stringify({ error: "無効なデータ形式です。" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const insertQuery = (tableType === "start") ? 
      `INSERT INTO start_check_approvals (start_check_id, manager_id, approver_role, approval_time, result)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)` :
      `INSERT INTO end_check_approvals (end_check_id, manager_id, approver_role, approval_time, result)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`
    ;
    // for (const check of body.selectedData) {
    //   await db.prepare(insertQuery).bind(check.id, body.managerId, body.role, true).run();
    // }
    const statements: D1PreparedStatement[] = body.selectedData.map(check =>
      db.prepare(insertQuery).bind(check.id, body.managerId, body.role, true)
    );

    await db.batch(statements);

    return new Response(
      JSON.stringify({ message: `${tableType === "start" ? "配送開始" : "配送終了"}の承認が完了しました。` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("DB Insert Error:", error);
    return new Response(
      JSON.stringify({ error: "データベースエラーが発生しました。" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
