import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Form, Link, useLoaderData, useActionData, redirect } from "@remix-run/react";
import { ManagerRoleSelect, StoreSearchCombobox } from "~/components/FormUI";
import { HeadersFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/cloudflare";
import { useState } from "react";
import { RegisterResponse, Store } from "~/lib/types";
import { callEnv, fetchStores, innerFetch } from "~/lib/utils";
import { AccessDenied } from "~/components/FunctionalComponents";

export const headers: HeadersFunction = () => ({
  "WWW-Authenticate": "Basic",
});

// 認証チェック
const isAuthorized = (request: Request, USERNAME: string, PASSWORD: string) => {
  const header = request.headers.get("Authorization");
  if (!header) return false;
  const base64 = header.replace("Basic ", "");
  const decoded = new TextDecoder().decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0)));
  const [username, password] = decoded.split(":");
  return username === USERNAME && password === PASSWORD;
};

// Loader 関数
interface TypeOfLoader {
  authorized: boolean;
  storesPromise: Promise<Store[]>;
}

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const env = callEnv(context);
  const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = env;
  if (!isAuthorized(request, BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD)) {
    return Response.json({ authorized: false }, { status: 401 });
  }
  return { authorized: true, storesPromise: fetchStores(env) };
};

// Action 関数
export const action = async ({ request, context }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;
  const env = callEnv(context);
  // `role` のバリデーション
  if (!["store_manager", "ns_manager", "leader"].includes(data.role)) {
    return Response.json({ error: "無効な役職が選択されました。" }, { status: 400 });
  }
  // サーバー側で `password` の一致チェックを追加
  if (data.password !== data.confirmPassword) {
    return Response.json({ error: "パスワードが一致しません。" }, { status: 400 });
  }
  // API に登録リクエストを送信
  const response = await innerFetch(env, '/api/auth/register', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as RegisterResponse;

  if (!response.ok) {
    return Response.json(result, { status: response.status });
  }

  // 登録成功時にリダイレクト
  return redirect("/success");
};

// 登録フォームコンポーネント
export default function Register() {
  const { authorized, storesPromise } = useLoaderData<TypeOfLoader>();
  const actionData = useActionData<RegisterResponse>(); // Action のレスポンスを取得
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
 
  if (!authorized) {
    return (
      <AccessDenied>
        <div className="flex flex-col justify-center items-center">
          <p>登録にはパスワードが必要です</p>
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
    <div className="flex items-center justify-center min-h-screen-header bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl">新規登録</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">氏</label>
                <Input type="text" id="lastName" name="lastName" required placeholder="山田" />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">名</label>
                <Input type="text" id="firstName" name="firstName" required placeholder="太郎" />
              </div>
            </div>
            <div>
              <StoreSearchCombobox storesPromise={storesPromise} />
            </div>
            <div>
              <ManagerRoleSelect onChange={(value) => setRole(value)} />
              <input type="hidden" name="role" value={role} />
            </div>
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">ユーザーネーム</label>
              <Input
                type="text"
                id="userName"
                name="userName"
                required
                placeholder="店舗名ローマ字-名字 で登録"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              {actionData && "suggestion" in actionData && actionData.suggestion && (
                <p className="text-sm text-gray-500">
                  推奨:{" "}
                  <button type="button" className="text-blue-600 hover:underline" onClick={() => setUserName(actionData.suggestion!)}>
                    {actionData.suggestion}
                  </button>
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
              <Input type="password" id="password" name="password" required placeholder="••••••••" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">パスワード（確認のため再度入力）</label>
              <Input type="password" id="confirmPassword" name="confirmPassword" required placeholder="••••••••" />
            </div>
            {actionData && "error" in actionData && <p className="text-red-500 text-sm">{actionData.error}</p>}
            <Button type="submit" className="w-full">登録</Button>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちですか？
            <Link to="/login" className="ml-1 text-blue-600 hover:underline">ログイン</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
