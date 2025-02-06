import { ApprovalStoremanagerRequestBody } from "~/lib/types";

export async function handleApproveStoreManagerDashboard(
  request: Request,
  env: Env,
  ctx: ExecutionContext
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
      const results = await fetchStoreManagerApprovalData(db, storeCode, role);
      return new Response(JSON.stringify(results), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("DB Query Error:", error);
      return new Response(
        JSON.stringify({ error: "データベースエラーが発生しました。" }),
        { status: 500 }
      );
    }
  }

  if (request.method === "POST") {
    const body = await request.json() as ApprovalStoremanagerRequestBody;
    return approveStoreManagerChecks(db, body);
  }

  return new Response("Method Not Allowed", { status: 405 });
}

async function fetchStoreManagerApprovalData(
  db: D1Database,
  storeCode: string,
  role:  string,
) {
  const query = `
    SELECT 
      sc.id AS start_check_id, 
      ec.id AS end_check_id, 
      s.store_name, sc.store_code, sc.driver_name, sc.delivery_company,
      sc.has_used_alcohol_checker AS start_has_used_alcohol_checker,
      sc.alcohol_test_first_result AS start_alcohol_test_first_result,
      sc.alcohol_test_second_result AS start_alcohol_test_second_result,
      sc.has_illness, sc.is_tired, sc.created_at AS start_created_at,
      ec.has_used_alcohol_checker AS end_has_used_alcohol_checker,
      ec.alcohol_test_first_result AS end_alcohol_test_first_result,
      ec.alcohol_test_second_result AS end_alcohol_test_second_result,
      ec.created_at AS end_created_at
    FROM start_checks AS sc
    JOIN sites AS s ON sc.store_code = s.store_code
    LEFT JOIN end_checks AS ec ON sc.id = ec.start_check_id
    LEFT JOIN start_check_approvals AS sa 
      ON sc.id = sa.start_check_id 
      AND sa.approver_role = ? 
    LEFT JOIN end_check_approvals AS ea 
      ON ec.id = ea.end_check_id 
      AND ea.approver_role = ? 
    WHERE sc.store_code = ?
      AND (sa.id IS NULL OR sa.result = 0 OR ea.id IS NULL OR ea.result = 0) -- 未承認データを取得
    ORDER BY sc.created_at DESC;
  `;

  const { results } = await db.prepare(query)
  .bind(role, role, storeCode)
  .all<{
    start_check_id: number;
    end_check_id: number | null;
    store_name: string;
    store_code: string;
    driver_name: string;
    delivery_company: string;
    start_has_used_alcohol_checker: boolean;
    start_alcohol_test_first_result: number;
    start_alcohol_test_second_result: number | null;
    has_illness: boolean;
    is_tired: boolean;
    start_created_at: string;
    end_has_used_alcohol_checker: boolean | null;
    end_alcohol_test_first_result: number | null;
    end_alcohol_test_second_result: number | null;
    end_created_at: string | null;
  }>();

  return results.map((row) => ({
    startCheckId: row.start_check_id, // 配送開始データの ID (必須)
    endCheckId: row.end_check_id ?? null, // 配送終了データの ID (null あり)
    storeCode: row.store_code,
    storeName: row.store_name,
    driverName: row.driver_name,
    deliveryCompany: row.delivery_company,
    hasUsedAlcoholCheckerStart: row.start_has_used_alcohol_checker !== null ? Boolean(row.start_has_used_alcohol_checker) : null,
    alcoholTestFirstResultStart: row.start_alcohol_test_first_result ?? null,
    alcoholTestSecondResultStart: row.start_alcohol_test_second_result ?? null,
    hasIllness: row.has_illness !== null ? Boolean(row.has_illness) : null,
    isTired: row.is_tired !== null ? Boolean(row.is_tired) : null,
    hasUsedAlcoholCheckerEnd: row.end_has_used_alcohol_checker !== null ? Boolean(row.end_has_used_alcohol_checker) : null,
    alcoholTestFirstResultEnd: row.end_alcohol_test_first_result ?? null,
    alcoholTestSecondResultEnd: row.end_alcohol_test_second_result ?? null,
    createdAtStart: row.start_created_at ?? null,
    createdAtEnd: row.end_created_at ?? null,
  }));  
}

async function approveStoreManagerChecks(db: D1Database, body: ApprovalStoremanagerRequestBody) {
  if (!body.allData || !Array.isArray(body.allData) || isNaN(body.managerId) || !body.role) {
    return new Response(
      JSON.stringify({ error: "無効なデータ形式です。" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const startInsertQuery = `
      INSERT INTO start_check_approvals (start_check_id, manager_id, approver_role, approval_time, result)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)
    `;

    const endInsertQuery = `
      INSERT INTO end_check_approvals (end_check_id, manager_id, approver_role, approval_time, result)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)
    `;

    const statements: D1PreparedStatement[] = [];

    for (const check of body.allData) {
      if (check.startCheckId) {
        statements.push(db.prepare(startInsertQuery).bind(check.startCheckId, body.managerId, body.role, true));
      }
      if (check.endCheckId) {
        statements.push(db.prepare(endInsertQuery).bind(check.endCheckId, body.managerId, body.role, true));
      }
    }

    await db.batch(statements); // 🔹 D1PreparedStatement[] を batch に渡す

    return new Response(
      JSON.stringify({ message: "一括承認が完了しました。" }),
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
