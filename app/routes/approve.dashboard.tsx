import { Outlet } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/server-runtime";
import { Tabs, TabType } from "~/components/FunctionalComponents";
import { getLoginDataFromCookie } from "~/lib/utils";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const loginData = getLoginDataFromCookie(request);
  if(loginData?.role === "store_manager") {
    return redirect("/approve/storemanager-board");
  }
  return Response.json({});
}
export default function ApproveDashboard() {
  const tabs: TabType[] = [
    {"label": "配送開始", "to": "/approve/dashboard/start"},
    {"label": "配送終了", "to": "/approve/dashboard/end"},
  ]
  return (
    <div className="h-screen-header p-2 md:p-4 flex">
      <Tabs tabs={tabs}>
        <div className="">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}
