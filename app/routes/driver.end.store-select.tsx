import { Form, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { StoreSearchCombobox } from "~/components/FormUI";
import { Separator } from "~/components/ui/separator";
import { callEnv, fetchStores } from "~/lib/utils";
import { Loader2 } from "lucide-react";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = callEnv(context);
  return {storesPromise: fetchStores(env)};
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const storeCode = formData.get("storeCode")?.toString();

  if (!storeCode) {
    return redirect("/driver/end/store-select"); // storeCodeがない場合は再表示
  }

  return redirect(`/driver/end/store-select/table?storeCode=${encodeURIComponent(storeCode)}`); // 子ルートにリダイレクト
}

export default function DriverStoreSelect() {
  const { storesPromise } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <div className="h-screen-header min-w-full flex justify-center items-start p-2">
      <Card className="w-full h-full max-w-md">
        <CardHeader>
          <CardTitle>帰着登録</CardTitle>
          <CardDescription>店舗を選択してください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <StoreSearchCombobox storesPromise={storesPromise} />
            <Button type="submit" className="w-full">
              {isSubmitting ? <Loader2 className="animate-spin" /> : '検索'}
            </Button>
          </Form>
        </CardContent>
        <Separator />
        <CardFooter className="overflow-auto">
          <Outlet />
        </CardFooter>
      </Card>
    </div>
  );
}
