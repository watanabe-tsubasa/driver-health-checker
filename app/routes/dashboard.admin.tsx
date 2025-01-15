import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { AdminTable } from "~/components/AdminTable/AdminTable";
import { DriverLog, LoginData } from "~/lib/types";

const driverLog = [
  {
    id: 0,
    storeName: "イオン東雲店",
    driverName: "山田一郎",
    deliveryCompany: "ヤマト運輸",
    hasUsedAlcoholChecker: true,     
    alcoholTestFirstResult: 0.0,     
    alcoholTestSecondResult: null,    
    hasIllness: false,               
    isTired: false                   
  },
  {
    id: 1,
    storeName: "イオン船橋店",
    driverName: "鈴木花子",
    deliveryCompany: "佐川急便",
    hasUsedAlcoholChecker: true,
    alcoholTestFirstResult: 0.0,
    alcoholTestSecondResult: null,
    hasIllness: false,
    isTired: false
  },
  {
    id: 2,
    storeName: "イオン東雲店",
    driverName: "高橋健太",
    deliveryCompany: "ヤマト運輸",
    hasUsedAlcoholChecker: true,
    alcoholTestFirstResult: 0.1,
    alcoholTestSecondResult: 0.0,
    hasIllness: false,
    isTired: false
  },
  {
    id: 3,
    storeName: "イオン船橋店",
    driverName: "田中美咲",
    deliveryCompany: "佐川急便",
    hasUsedAlcoholChecker: true,
    alcoholTestFirstResult: 0.0,
    alcoholTestSecondResult: null,
    hasIllness: false,
    isTired: false
  },
  {
    id: 4,
    storeName: "イオン東雲店",
    driverName: "佐々木悠斗",
    deliveryCompany: "ヤマト運輸",
    hasUsedAlcoholChecker: true,
    alcoholTestFirstResult: 0.0,
    alcoholTestSecondResult: null,
    hasIllness: false,
    isTired: true
  },
  {
    id: 5,
    storeName: "イオン船橋店",
    driverName: "伊藤彩花",
    deliveryCompany: "佐川急便",
    hasUsedAlcoholChecker: true,
    alcoholTestFirstResult: 0.0,
    alcoholTestSecondResult: null,
    hasIllness: false,
    isTired: false
  },
  {
    id: 6,
    storeName: "イオン東雲店",
    driverName: "佐倉綾音",
    deliveryCompany: "ヤマト運輸",
    hasUsedAlcoholChecker: true,
    alcoholTestFirstResult: 0.1,
    alcoholTestSecondResult: null,
    hasIllness: false,
    isTired: false
  },
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const selectedData = JSON.parse(formData.get("selectedData") as string) as DriverLog[];

  console.log("受信したデータ:", selectedData);

  return Response.json({ message: "データ送信完了" });
};

export default function AdminDashboard() {
  const { loginData, filteredData } = useLoaderData<AdminDashboardLoader>();

  return (
    <div className="container mx-auto py-10 px-2">
      <h1 className="text-3xl font-bold mb-6">健康記録承認</h1>
      <p className="mb-4">氏名: {loginData.lastName} {loginData.firstName}</p>
      <p className="mb-4">店舗名: {loginData.storeName}</p>
      <AdminTable filteredData={filteredData} />
    </div>
  );
}
