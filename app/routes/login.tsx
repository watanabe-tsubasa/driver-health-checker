import { redirect } from "@remix-run/cloudflare";
import { Form, Link, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";



const SAMPLE_USERS = [
  {
    lastName: "渡邊",
    password: "password",
    firstName: "翼",
    storeName: "イオン東雲店",
  },
  {
    lastName: "伊音",
    password: "password",
    firstName: "太郎",
    storeName: "イオン船橋店",
  },
  {
    lastName: "イオン",
    password: "password",
    firstName: "花子",
    storeName: "イオンスタイル千葉みなと",
  },
];


export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const lastName = formData.get("lastName")?.toString();
  const password = formData.get("password")?.toString();

  if (!lastName || !password) {
    return Response.json({ error: "すべてのフィールドを入力してください" }, { status: 400 });
  }

  // ユーザーの認証
  const user = SAMPLE_USERS.find(
    (user) => user.lastName === lastName && user.password === password
  );

  if (user) {
    // ログイン成功時のデータ
    const userData = {
      lastName: user.lastName,
      firstName: user.firstName,
      storeName: user.storeName,
    };

    // JSONを文字列化してエンコード
    const encodedUserData = encodeURIComponent(JSON.stringify(userData));

    return redirect("/dashboard/admin", {
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
            <div className="grid grid-cols-2">
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  氏名
                </label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="山田"
                />
              </div>
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
