import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Form, Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="flex items-center justify-center min-h-screen-header bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" action="/login" className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                placeholder="example@example.com"
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
