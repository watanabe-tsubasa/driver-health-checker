import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { StoremanagerTable } from "~/components/StoremanagerTable/StoremanagerTable";
import { DashboardStoreManagerData, LoginResponseType } from "~/lib/types";
import { getLoginDataFromCookie, callEnv, roleTransition } from "~/lib/utils";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const loginData = getLoginDataFromCookie(request);
  if (!loginData) return redirect("/login");

  if (loginData.role !== "store_manager") {
    return redirect("/approve/dashboard/start");
  }

  const env = callEnv(context);
  const { API_BASE_URL } = env;
  const queryParams = new URLSearchParams({
    storeCode: loginData.storeCode,
    role: loginData.role,
  }).toString();
  
  const res = await fetch(`${API_BASE_URL}/api/approve/storemanager-board?${queryParams}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const allData = await res.json() as DashboardStoreManagerData[];
  const filteredData = allData.filter(data => 
    !data.hasUsedAlcoholCheckerStart ||
    (data.alcoholTestFirstResultStart !== 0 && (data.alcoholTestSecondResultStart === null || data.alcoholTestSecondResultStart !== 0)) ||
    (data.alcoholTestFirstResultStart === 0 && data.alcoholTestSecondResultStart !== null && data.alcoholTestSecondResultStart !== 0) ||
    !data.hasUsedAlcoholCheckerEnd ||
    (data.alcoholTestFirstResultEnd !== 0 && (data.alcoholTestSecondResultEnd === null || data.alcoholTestSecondResultEnd !== 0)) ||
    (data.alcoholTestFirstResultEnd === 0 && data.alcoholTestSecondResultEnd !== null && data.alcoholTestSecondResultEnd !== 0)
  );
  
  return Response.json({ allData, filteredData, loginData });
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const allData = JSON.parse(formData.get("allData") as string);
  const managerId = parseInt(formData.get("managerId") as string, 10);
  const role = formData.get("role") as string;

  if (!Array.isArray(allData) || allData.length === 0 || isNaN(managerId)) {
    return new Response(JSON.stringify({ error: "無効なデータ形式です。" }), { status: 400 });
  }

  const env = callEnv(context);
  const { API_BASE_URL } = env;
  const response = await fetch(`${API_BASE_URL}/api/approve/storemanager-board`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ allData, managerId, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return new Response(JSON.stringify(errorData), { status: response.status });
  }

  return Response.json({ message: "承認が完了しました。" });
}

export default function StoreManagerBoard() {
  const { allData, filteredData, loginData } = useLoaderData<{
    allData: DashboardStoreManagerData[]
    filteredData: DashboardStoreManagerData[];
    loginData: LoginResponseType
  }>();
  return(
    <div className="min-h-screen-header flex">
      <div className="m-4 p-4 bg-background rounded-lg shadow flex-1 min-h-0 overflow-auto">
        <div className="container mx-auto py-2 px-2">
          <p className="mb-4">氏名: {loginData.lastName} {loginData.firstName}（{roleTransition(loginData.role)}）</p>
          <p className="mb-4">店舗名: {loginData.storeName}（{loginData.storeCode}）</p>
          <StoremanagerTable
            allData={allData}
            filteredData={filteredData}
            loginData={loginData}
          />
        </div>
    </div>
  </div>
  )
}