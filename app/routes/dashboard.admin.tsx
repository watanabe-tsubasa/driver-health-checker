import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { AdminTable } from "~/components/AdminTable";
import { DriverLog, LoginData } from "~/lib/types";

const driverLog = [
  { id: 1, storeName: "イオン東雲店", driverName: "山田太郎", deliveryCompany: "ヤマト運輸" },
  { id: 2, storeName: "イオン船橋店", driverName: "佐藤花子", deliveryCompany: "佐川急便" },
];


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = Object.fromEntries(
    cookieHeader
      ?.split("; ")
      .map((cookie) => cookie.split("=")) || []
  );

  const loginData = cookies.user ? JSON.parse(decodeURIComponent(cookies.user)) as LoginData : null;

  if (!loginData) {
    return redirect("/login");
  }

  const filteredData = driverLog.filter((log) =>
    log.storeName.includes(loginData.storeName)
  );

  return Response.json({ filteredData, loginData });
};

interface AdminDashboardLoader {
  loginData: LoginData;
  filteredData: DriverLog[]
}

export default function AdminDashboard() {
  const { loginData, filteredData } = useLoaderData<AdminDashboardLoader>();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">管理者ダッシュボード</h1>
      <p className="mb-4">氏名: {loginData.lastName} {loginData.firstName}</p>
      <p className="mb-4">店舗名: {loginData.storeName}</p>
      <AdminTable filteredData={filteredData} />
    </div>
  );
}
