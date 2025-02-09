import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { AccessDenied } from "~/components/FunctionalComponents";
import { Button } from "~/components/ui/button";
import { getLoginDataFromCookie, requireAuth } from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loginData = getLoginDataFromCookie(request);
  if (!loginData) return requireAuth(request, loginData);
  return { loginData };
}

export default function AdminPage() {
  const data = useLoaderData<typeof loader>();
  if (!data?.loginData) return;
  const { loginData } = data;
  const isNotAllowed = loginData.role === "leader" || loginData.role === "store_manager";
  if (isNotAllowed) {
    return (
      <AccessDenied>
        <div className="flex flex-col justify-center items-center">
          <p>アクセス権限がありません</p>
          <Link to={`/`}>
            <Button variant="link" size="sm" className="mx-2">
              トップに戻る
            </Button>
          </Link>
        </div>
      </AccessDenied>
    );
  }
  return (
    <div className="h-screen-header flex">
      <div className="m-2 px-2 bg-background rounded-lg shadow flex flex-1 min-h-0 overflow-auto">
        <Outlet context={{ loginData }} />
      </div>
    </div>
  )
}