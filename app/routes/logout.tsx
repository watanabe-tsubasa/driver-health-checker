import { redirect } from "@remix-run/cloudflare";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/login"; // デフォルトはログインページ

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": `user=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
};

export const action = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/login"; // デフォルトはログインページ

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": `user=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
};

export default function LogoutPage() {
  return null; // ログアウトページは不要
}
