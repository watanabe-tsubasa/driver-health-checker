import { handleAdminDashboard } from "./admin/dashboard";
import { handleApprooveEndDashboard, handleApprooveStartDashboard } from "./approve/dashboard";
import { handleApproveStoreManagerDashboard } from "./approve/storemanagerBoard";
import { handleAuthLogin } from "./auth/login";
import { handleAuthRegister } from "./auth/register";
import { handleDriverEndStoreSelect } from "./driver-end/store-select";
import { handleDriverEndStoreSelectTable } from "./driver-end/store-select-table";
import { handleDriverEndStoreSelectTableForm } from "./driver-end/store-select-table-form";
import { handleDriverStart } from "./driver-start";
import { handleGetStores } from "./get-stores";
import { handleUpdateStores } from "./update-stores";

export async function handleApi(request: Request, env: Env, ctx: ExecutionContext) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, ""); // "/api" を除去

  try {
    if (path === "/test" && request.method === "GET") {
      return new Response(JSON.stringify({ message: "hello api" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  
  // /api/stores
  if (path === "/stores" && request.method === "GET") {
    return handleGetStores(request, env, ctx)
  }

  // /api/stores/update
  if (path.startsWith("/stores/update")) {
    return handleUpdateStores(request, env)
  }

  // /api/admin/dashboard
  if (path.startsWith("/admin/dashboard")) {
    return handleAdminDashboard(request, env, ctx);
  }

  // /api/approve/dashboard-start
  if (path.startsWith("/approve/dashboard-start")) {
    return handleApprooveStartDashboard(request, env, ctx);
  }
  
  // /api/approve/dashboard-end
  if (path.startsWith("/approve/dashboard-end")) {
    return handleApprooveEndDashboard(request, env, ctx);
  }

  // /api/approve/storemanager-board
  if (path.startsWith("/approve/storemanager-board")) {
    return handleApproveStoreManagerDashboard(request, env, ctx);
  }

  // /api/auth/login
  if (path.startsWith("/auth/login")) {
    return handleAuthLogin(request, env, ctx);
  }
  // /api/auth/logout
  // /api/auth/register
  if (path.startsWith("/auth/register")) {
    return handleAuthRegister(request, env, ctx);
  }

  // /api/driver-end/store-select
  if (path.startsWith("/driver-end/store-select") && !path.includes("table")) {
    return handleDriverEndStoreSelect(request, env, ctx);
  }
  // /api/driver-end/store-select-table
  if (path.startsWith("/driver-end/store-select-table") && !path.endsWith("form")) {
    return handleDriverEndStoreSelectTable(request, env, ctx);
  }
  // /api/driver-end/store-select-table-form
  if (path.includes("store-select-table-form")) {
    return handleDriverEndStoreSelectTableForm(request, env, ctx);
  }

  // /api/driver-start
  if (path.startsWith("/driver-start")) {
    return handleDriverStart(request, env, ctx);
  }

  // 該当しない場合
  return new Response("Not Found", { status: 404 });
}