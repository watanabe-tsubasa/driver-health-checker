import { Form, Outlet } from "@remix-run/react";
import { redirect } from "@remix-run/cloudflare";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { StoreSearchCombobox } from "~/components/FormUI";
import { Separator } from "~/components/ui/separator";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const storeName = formData.get("storeName")?.toString();

  if (!storeName) {
    return redirect("/driver/end/store-select"); // storeNameがない場合は再表示
  }

  return redirect(`/driver/end/store-select/table?storeName=${encodeURIComponent(storeName)}`); // 子ルートにリダイレクト
}

export default function DriverStoreSelect() {
  return (
    <div className="h-screen-header min-w-full flex justify-center items-start p-2">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>帰着登録</CardTitle>
          <CardDescription>店舗を選択してください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <StoreSearchCombobox />
            <Button type="submit" className="w-full">
              検索
            </Button>
          </Form>
        </CardContent>
        <Separator />
        <CardFooter className="overflow-scroll">
          <Outlet />
        </CardFooter>
      </Card>
    </div>
  );
}
