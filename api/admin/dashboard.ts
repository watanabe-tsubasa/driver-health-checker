import { DriverLog } from "~/lib/types"; // Remix側で定義している型を再利用するなら

const driverLog: DriverLog[] = [
  // ダミーデータ (実際はDBなど)
];

export async function handleAdminDashboard(
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  const url = new URL(request.url);
  console.log(env); // for ignore error
  console.log(ctx); // for ignore error

  // GET /api/admin/dashboard?storeName=...
  if (request.method === "GET") {
    const storeName = url.searchParams.get("storeName") || "";
    const filteredData = driverLog.filter((log) => log.storeName.includes(storeName));
    // loginData は本来Cookieやセッションから取得する場合もあるが、ここでは簡略化
    const loginData = { lastName: "dummy", firstName: "dummy", storeName };
    return new Response(JSON.stringify({ filteredData, loginData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST /api/admin/dashboard
  if (request.method === "POST") {
    const body = await request.json();
    // ここでは selectedData が送られてくる想定
    console.log("selectedData:", body);
    // DB 保存などの処理

    return new Response(JSON.stringify({ message: "データ送信完了" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
