import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { AccessDenied } from "~/components/FunctionalComponents";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { callEnv, getLoginDataFromCookie, innerFetch } from "~/lib/utils";
import { LoginResponseType } from "~/lib/types";
import { useRef, useState } from "react";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const loginData = getLoginDataFromCookie(request);
  return { loginData };
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const value = formData.get("value")?.toString();
  const label = formData.get("label")?.toString();
  const env = callEnv(context);

  if (!value || !label) {
    return Response.json({ error: "すべてのフィールドを入力してください" }, { status: 400 });
  }

  const update = { value, label };

  try {
    const res = await innerFetch(env, "/api/stores/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: [update] }),
    });

    if (res.ok) {
      const user = getLoginDataFromCookie(request) as LoginResponseType;

      // ✅ Cookie に保存するためのユーザーデータ
      const updatedUserData = {
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        storeCode: user.storeCode,
        storeName: label, // ✅ 更新後の店名を反映
        role: user.role,
      };

      const encodedUserData = encodeURIComponent(JSON.stringify(updatedUserData));

      return redirect("/edit/storeName", {
        headers: {
          "Set-Cookie": `user=${encodedUserData}; HttpOnly; Path=/; SameSite=Strict`,
        },
      });
    } else {
      const errorResponse = await res.json() as Error;
      return Response.json({ error: errorResponse.message || "更新に失敗しました" }, { status: res.status });
    }
  } catch (error) {
    console.error("API 呼び出しエラー:", error);
    return Response.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
};

export default function EditStoreName() {
  const { loginData } = useLoaderData<typeof loader>();
  const actionData = useActionData<{error: string}>();
  const storeNameRef = useRef<HTMLInputElement>(null);
  const [isEdited, setIsEdited] = useState(false);

  if (!loginData || loginData.role === "leader") return (
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

  if (loginData.role === "master") {
    return (
      <AccessDenied>
        <div className="flex flex-col justify-center items-center">
          <p>一括編集を準備中</p>
          <Link to={`/`}>
            <Button variant="link" size="sm" className="mx-2">
              トップに戻る
            </Button>
          </Link>
        </div>
      </AccessDenied>
    )
  }
  const handleInputChange = () => {
    const currentName = storeNameRef.current?.value || "";
    setIsEdited(currentName !== loginData.storeName  && currentName.trim() !== "");
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen-header bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl">店名変更</CardTitle>
        </CardHeader>
        <CardContent>
          {actionData?.error && (
            <p className="text-red-500 text-center">{actionData.error}</p>
          )}
          <Form method="post" className="space-y-4">
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                店舗コード
              </label>
              <Input
                type="text"
                id="value"
                name="value"
                required
                value={loginData.storeCode}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                店舗名
              </label>
              <Input
                type="text"
                id="label"
                name="label"
                required
                defaultValue={loginData.storeName}
                ref={storeNameRef}
                onChange={handleInputChange}
              />
            </div>
            <Button disabled={!isEdited} type="submit" className="w-full">
              修正する
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}