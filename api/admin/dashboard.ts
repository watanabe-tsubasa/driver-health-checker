import { AdminDashboardData } from "~/lib/types";

export async function handleAdminDashboard(
  request: Request,
  env: Env,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ctx: ExecutionContext
): Promise<Response> {
  let query = `
  -- SQLクエリ
  SELECT
    sc.id AS start_check_id,
    sc.store_code,
    s.store_name,
    sc.driver_name,
    sc.delivery_company,
    sc.has_used_alcohol_checker AS start_has_used_alcohol_checker,
    sc.alcohol_test_first_result AS start_alcohol_test_first_result,
    sc.alcohol_test_second_result AS start_alcohol_test_second_result,
    sc.has_illness,
    sc.is_tired,
    sc.created_at AS start_created_at,

    ec.id AS end_check_id,
    ec.has_used_alcohol_checker AS end_has_used_alcohol_checker,
    ec.alcohol_test_first_result AS end_alcohol_test_first_result,
    ec.alcohol_test_second_result AS end_alcohol_test_second_result,
    ec.created_at AS end_created_at,

    sa_leader.manager_id AS start_leader_id,
    m_start_leader.last_name AS start_leader_last_name,
    m_start_leader.first_name AS start_leader_first_name,
    sa_leader.approval_time AS start_leader_approval_time,

    sa_store_manager.manager_id AS start_store_manager_id,
    m_start_store_manager.last_name AS start_store_manager_last_name,
    m_start_store_manager.first_name AS start_store_manager_first_name,
    sa_store_manager.approval_time AS start_store_manager_approval_time,

    sa_ns_manager.manager_id AS start_ns_manager_id,
    m_start_ns_manager.last_name AS start_ns_manager_last_name,
    m_start_ns_manager.first_name AS start_ns_manager_first_name,
    sa_ns_manager.approval_time AS start_ns_manager_approval_time,

    ea_leader.manager_id AS end_leader_id,
    m_end_leader.last_name AS end_leader_last_name,
    m_end_leader.first_name AS end_leader_first_name,
    ea_leader.approval_time AS end_leader_approval_time,

    ea_store_manager.manager_id AS end_store_manager_id,
    m_end_store_manager.last_name AS end_store_manager_last_name,
    m_end_store_manager.first_name AS end_store_manager_first_name,
    ea_store_manager.approval_time AS end_store_manager_approval_time,

    ea_ns_manager.manager_id AS end_ns_manager_id,
    m_end_ns_manager.last_name AS end_ns_manager_last_name,
    m_end_ns_manager.first_name AS end_ns_manager_first_name,
    ea_ns_manager.approval_time AS end_ns_manager_approval_time

  FROM start_checks AS sc
  JOIN sites AS s ON sc.store_code = s.store_code
  LEFT JOIN end_checks AS ec ON sc.id = ec.start_check_id

  LEFT JOIN start_check_approvals AS sa_leader 
    ON sc.id = sa_leader.start_check_id AND sa_leader.approver_role = 'leader'
  LEFT JOIN managers AS m_start_leader 
    ON sa_leader.manager_id = m_start_leader.id

  LEFT JOIN start_check_approvals AS sa_store_manager 
    ON sc.id = sa_store_manager.start_check_id AND sa_store_manager.approver_role = 'store_manager'
  LEFT JOIN managers AS m_start_store_manager 
    ON sa_store_manager.manager_id = m_start_store_manager.id

  LEFT JOIN start_check_approvals AS sa_ns_manager 
    ON sc.id = sa_ns_manager.start_check_id AND sa_ns_manager.approver_role = 'ns_manager'
  LEFT JOIN managers AS m_start_ns_manager 
    ON sa_ns_manager.manager_id = m_start_ns_manager.id

  LEFT JOIN end_check_approvals AS ea_leader 
    ON ec.id = ea_leader.end_check_id AND ea_leader.approver_role = 'leader'
  LEFT JOIN managers AS m_end_leader 
    ON ea_leader.manager_id = m_end_leader.id

  LEFT JOIN end_check_approvals AS ea_store_manager 
    ON ec.id = ea_store_manager.end_check_id AND ea_store_manager.approver_role = 'store_manager'
  LEFT JOIN managers AS m_end_store_manager 
    ON ea_store_manager.manager_id = m_end_store_manager.id

  LEFT JOIN end_check_approvals AS ea_ns_manager 
    ON ec.id = ea_ns_manager.end_check_id AND ea_ns_manager.approver_role = 'ns_manager'
  LEFT JOIN managers AS m_end_ns_manager 
    ON ea_ns_manager.manager_id = m_end_ns_manager.id

  WHERE sc.created_at BETWEEN ? AND ?
`

  const url = new URL(request.url);
  const storeCode = url.searchParams.get("storeCode");
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (!startDate || !endDate) {
    return new Response(JSON.stringify({ error: "startDate と endDate は必須です。" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const params: (string | number | null)[] = [startDate, endDate ];

  if (storeCode) {
    const storeCodes = storeCode.split(",");
    const placeholders = storeCodes.map(() => "?").join(", ");
    query += ` AND sc.store_code IN (${placeholders})`;
    params.push(...storeCodes);
  }

  query += ` ORDER BY sc.created_at DESC`;

  try {
    const { results } = await env.DB.prepare(query)
      .bind(...params)
      .all();

    const formattedResults: AdminDashboardData[] = results.map((row) => ({
      startCheckId: row.start_check_id as number,
      endCheckId: row.end_check_id as number | null,
      storeCode: row.store_code as string,
      storeName: row.store_name as string,
      driverName: row.driver_name as string,
      deliveryCompany: row.delivery_company as string,
      hasUsedAlcoholCheckerStart: row.start_has_used_alcohol_checker as boolean,
      alcoholTestFirstResultStart: row.start_alcohol_test_first_result as number,
      alcoholTestSecondResultStart: row.start_alcohol_test_second_result as number | null,
      hasIllness: row.has_illness as boolean,
      isTired: row.is_tired as boolean,
      createdAtStart: row.start_created_at as string,
      hasUsedAlcoholCheckerEnd: row.end_has_used_alcohol_checker as boolean | null,
      alcoholTestFirstResultEnd: row.end_alcohol_test_first_result as number | null,
      alcoholTestSecondResultEnd: row.end_alcohol_test_second_result as number | null,
      createdAtEnd: row.end_created_at as string | null,
    
      startLeader: {
        id: row.start_leader_id as number | null,
        lastName: row.start_leader_last_name as string | null,
        firstName: row.start_leader_first_name as string | null,
        approvalTime: row.start_leader_approval_time as string | null,
      },
      startStoreManager: {
        id: row.start_store_manager_id as number | null,
        lastName: row.start_store_manager_last_name as string | null,
        firstName: row.start_store_manager_first_name as string | null,
        approvalTime: row.start_store_manager_approval_time as string | null,
      },
      startNsManager: {
        id: row.start_ns_manager_id as number | null,
        lastName: row.start_ns_manager_last_name as string | null,
        firstName: row.start_ns_manager_first_name as string | null,
        approvalTime: row.start_ns_manager_approval_time as string | null,
      },
    
      endLeader: {
        id: row.end_leader_id as number | null,
        lastName: row.end_leader_last_name as string | null,
        firstName: row.end_leader_first_name as string | null,
        approvalTime: row.end_leader_approval_time as string | null,
      },
      endStoreManager: {
        id: row.end_store_manager_id as number | null,
        lastName: row.end_store_manager_last_name as string | null,
        firstName: row.end_store_manager_first_name as string | null,
        approvalTime: row.end_store_manager_approval_time as string | null,
      },
      endNsManager: {
        id: row.end_ns_manager_id as number | null,
        lastName: row.end_ns_manager_last_name as string | null,
        firstName: row.end_ns_manager_first_name as string | null,
        approvalTime: row.end_ns_manager_approval_time as string | null,
      },
    }));
      
      
    return new Response(JSON.stringify(formattedResults), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DB Query Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}