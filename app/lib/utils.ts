import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DashboardEndDriverData, DashboardStartDriverData, LoginResponseType, RoleType, Store } from "./types";
import { AppLoadContext, redirect } from "@remix-run/cloudflare";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchStores = async (env: Env): Promise<Store[]> => {
  const { API_BASE_URL } = env;
  console.log(env)
  console.log(API_BASE_URL)
  try {
    const response = await env.API_WORKER.fetch(`${API_BASE_URL}/api/stores`);
    if (!response.ok) throw new Error("店舗の取得に失敗しました");
    const data: Store[] = await response.json();
    return data
  } catch (error) {
    console.error(error);
    return [{
      "label": "取得に失敗しました。リロードしてください",
      "value": "取得に失敗しました。リロードしてください"
    }]
  }
};

export const getLoginDataFromCookie = (request: Request<unknown, CfProperties<unknown>>) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = Object.fromEntries(
    cookieHeader?.split("; ").map((c) => c.split("=")) || []
  );

  return cookies.user ? JSON.parse(decodeURIComponent(cookies.user)) as LoginResponseType : null;
};

export const callEnv = (context: AppLoadContext) => {
  let env: Env;
  try {
    env = context.cloudflare.env as Env; // Cloudflare Pagesはcontext.cloudflare.env
  } catch {
    env = process.env as unknown as Env; // ローカルはnodeなのでprocess.env
  }
  return env;
};

export const roleTransition = (role: RoleType) => {
  switch (role) {
    case 'leader':
      return '配送リーダー'
    case 'ns_manager':
      return 'ネットスーパーマネージャー'
    case 'store_manager':
      return '店長'
    default:
      return '配送リーダー'
  }
};

export const isStartDriverData = (data: DashboardStartDriverData | DashboardEndDriverData): data is DashboardStartDriverData => {
  return "hasIllness" in data && "isTired" in data;
};

export const convertToJSTDate = (date: Date) => {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000);
};

export const commonDashboardLoader = async (
  request: Request<unknown, CfProperties<unknown>>,
  context: AppLoadContext,
  direction: 'start' | 'end'
) => {
  const loginData = getLoginDataFromCookie(request);
  if (!loginData) return redirect("/login");

  const env = callEnv(context);
  const { API_BASE_URL } = env;
  const queryParams = new URLSearchParams({ storeCode: loginData.storeCode, role: loginData.role }).toString();
  const res = await env.API_WORKER.fetch(`${API_BASE_URL}/api/approve/dashboard-${direction}?${queryParams}`);
  const filteredData = direction === 'start' ? 
    await res.json() as DashboardStartDriverData[] :
    await res.json() as DashboardEndDriverData[];

  return Response.json({ filteredData, loginData });
}

export const commonDashboardAciton = async (
  request: Request<unknown, CfProperties<unknown>>,
  context: AppLoadContext,
  direction: string
) => {
  const formData = await request.formData();
  const selectedData = JSON.parse(formData.get("selectedData") as string);
  const managerId = parseInt(formData.get("managerId") as string, 10);
  const role = formData.get("role") as string;

  if (!Array.isArray(selectedData) || selectedData.length === 0 || isNaN(managerId)) {
    return new Response(JSON.stringify({ error: "無効なデータ形式です。" }), { status: 400 });
  }

  const env = callEnv(context);
  const { API_BASE_URL } = env;
  const response = await env.API_WORKER.fetch(`${API_BASE_URL}/api/approve/dashboard-${direction}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selectedData, managerId, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return new Response(JSON.stringify(errorData), { status: response.status });
  }

  return Response.json({ message: "承認が完了しました。" });
}