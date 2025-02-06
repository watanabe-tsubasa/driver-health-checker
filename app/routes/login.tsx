import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Form, Link, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { LoginData, LoginResponseType } from "~/lib/types";
import { callEnv, getLoginDataFromCookie } from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loginData = getLoginDataFromCookie(request);
  if(loginData) {
    return redirect("/approve/dashboard/start");
  }
  return Response.json({});
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userName = formData.get("userName")?.toString();
  const password = formData.get("password")?.toString();
  const env = callEnv(context);
  const { API_BASE_URL } = env

  if (!userName || !password) {
    return Response.json({ error: "すべてのフィールドを入力してください" }, { status: 400 });
  }
  const body: LoginData = {
    userName: userName,
    password: password
  }
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (res.status === 200) {
    const user = await res.json() as LoginResponseType;
    // ログイン成功時のデータ
    const userData = {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      storeCode: user.storeCode,
      storeName: user.storeName,
      role: user.role,
    };

    // JSONを文字列化してエンコード
    const encodedUserData = encodeURIComponent(JSON.stringify(userData));

    return redirect("/approve/dashboard/start", {
      headers: {
        "Set-Cookie": `user=${encodedUserData}; HttpOnly; Path=/; SameSite=Strict`,
      },
    });
  }

  // ログイン失敗
  return Response.json({ error: "無効な氏名またはパスワードです" }, { status: 401 });
};

export default function Login() {
  const actionData = useActionData<{error: string}>();

  return (
    <div className="flex items-center justify-center min-h-screen-header bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl">管理者ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          {actionData?.error && (
            <p className="text-red-500 text-center">{actionData.error}</p>
          )}
          <Form method="post" className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                ユーザーネーム
              </label>
              <Input
                type="text"
                id="userName"
                name="userName"
                required
                placeholder="makuhari-伊音"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                required
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでないですか？
            <Link to="/register" className="ml-1 text-blue-600 hover:underline">
              新規登録
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
