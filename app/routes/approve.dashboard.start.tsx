import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { ApproveTable } from "~/components/ApproveTable/ApproveTable";
import { DashboardStartDriverData, LoginResponseType } from "~/lib/types";
import { commonDashboardAciton, commonDashboardLoader, roleTransition } from "~/lib/utils";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return commonDashboardLoader(request, context, 'start');
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  return commonDashboardAciton(request, context, 'start')
};

export default function ApproveDashboardStart() {
  const { loginData, filteredData } = useLoaderData<{ loginData: LoginResponseType; filteredData: DashboardStartDriverData[] }>();

  return (
    <div className="container mx-auto py-2 px-2">
      <p className="mb-4">氏名: {loginData.lastName} {loginData.firstName}（{roleTransition(loginData.role)}）</p>
      <p className="mb-4">店舗名: {loginData.storeName}（{loginData.storeCode}）</p>
      <ApproveTable filteredData={filteredData} loginData={loginData} />
    </div>
  );
}
