import { useActionData, useLoaderData, useOutletContext } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/server-runtime";
import { AdminTable } from "~/components/AdminTable/AdminTable";
import { AdminDashboardData, LoginResponseType } from "~/lib/types";
import { callEnv, fetchStores, innerFetch } from "~/lib/utils";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = callEnv(context);
  return { storesPromise: fetchStores(env)};
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const storeCode = formData.get("storeCode") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  if (!startDate || !endDate) {
    return Response.json({ error: "開始日と終了日は必須です。" }, { status: 400 });
  }

  const env = callEnv(context);
  const queryParams = new URLSearchParams({
    startDate,
    endDate,
  });

  if (storeCode) {
    queryParams.append("storeCode", storeCode);
  }

  try {
    const response = await innerFetch(env, `/api/admin/dashboard?${queryParams.toString()}` );

    if (!response.ok) {
      throw new Error("API からのデータ取得に失敗しました。");
    }

    const data = await response.json() as AdminDashboardData[];
    return Response.json(data);
  } catch (error) {
    const err = error as Error;
    console.error("DB Query Error:", err);  // ✅ エラー詳細を表示
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }  
};

interface OutletContext {
  loginData: LoginResponseType;
}
export default function AdminDashboard() {
  const { loginData } = useOutletContext<OutletContext>();
  const { storesPromise } = useLoaderData<typeof loader>();
  const data = useActionData<AdminDashboardData[]>();
  return (
    <AdminTable
     data={data || []}
     loginData={loginData}
     storesPromise={storesPromise}
    />
  )
}