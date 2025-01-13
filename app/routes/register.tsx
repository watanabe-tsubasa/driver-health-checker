import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { StoreSearchCombobox } from "~/components/FormUI";
import { HeadersFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";

export const headers: HeadersFunction = () => ({
  "WWW-Authenticate": "Basic",
});

const isAuthorized = (request: Request, USERNAME: string, PASSWORD: string) => {
  const header = request.headers.get("Authorization");

  if (!header) return false;

  const base64 = header.replace("Basic ", "");
  const decoded = new TextDecoder().decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0)));
  const [username, password] = decoded.split(":");

  // 環境変数などでIDとパスワードを渡す
  return username === USERNAME && password === PASSWORD;
};

interface LoaderDataType {
  authorized: boolean;
}

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  let env: Env;
  try {
    env = process.env as unknown as Env; // ローカルはnodeなのでprocess.env
  } catch {
    env = context.cloudflare.env as Env; // Cloudflare Pagesはcontext.cloudflare.env
  }

  const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = env;
  if (!isAuthorized(request, BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD)) {
    return Response.json({ authorized: false }, { status: 401 });
  }

  return Response.json({
    authorized: true,
  });
};

export default function Register() {
  const { authorized } = useLoaderData<LoaderDataType>();

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen-header bg-gray-50">
        <Card className="w-full h-40 m-4 flex items-center justify-center">
          <p>登録にはパスワードが必要です</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen-header bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl">新規登録</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" action="/register" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  氏
                </label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="山田"
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  名
                </label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="太郎"
                />
              </div>
            </div>
            <div>
              <StoreSearchCombobox />
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード（確認のため再度入力）
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
              登録
            </Button>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちですか？
            <Link to="/login" className="ml-1 text-blue-600 hover:underline">
              ログイン
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
