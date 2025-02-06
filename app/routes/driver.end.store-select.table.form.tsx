import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import { useLoaderData, Form } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { callEnv } from '~/lib/utils';

type LoaderData = {
  storeName: string;
  driverName: string;
  deliveryCompany: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  const storeCode = url.searchParams.get("storeCode") || "";
  const storeName = url.searchParams.get("storeName") || "";
  const driverName = url.searchParams.get("driverName") || "";
  const deliveryCompany = url.searchParams.get("deliveryCompany") || "";

  return Response.json({ id, storeCode, storeName, driverName, deliveryCompany });
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const startCheckId = url.searchParams.get("id"); // start_checks の ID
  const storeCode = url.searchParams.get("storeCode");

  if (!startCheckId || !storeCode) {
    return new Response(JSON.stringify({ error: 'ID または storeCode が指定されていません。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await request.formData();
  const hasUsedAlcoholChecker = formData.get('hasUsedAlcoholChecker') === 'on';
  const alcoholTestFirstResult = parseFloat(formData.get('alcoholTestFirstResult') as string || '0');
  const alcoholTestSecondResult = formData.get('alcoholTestSecondResult')
    ? parseFloat(formData.get('alcoholTestSecondResult') as string)
    : null;

  if (isNaN(alcoholTestFirstResult) || (alcoholTestSecondResult !== null && isNaN(alcoholTestSecondResult))) {
    return new Response(JSON.stringify({ error: 'アルコール測定結果が無効です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const env = callEnv(context);
  const { API_BASE_URL } = env;

  // 🔹 API に登録リクエストを送信
  const payload = {
    startCheckId: Number(startCheckId),
    hasUsedAlcoholChecker,
    alcoholTestFirstResult,
    alcoholTestSecondResult,
  };

  const response = await env.API_WORKER.fetch(`${API_BASE_URL}/api/driver-end/store-select-table-form`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return new Response(
      JSON.stringify(errorData),
      { status: response.status, headers: { "Content-Type": "application/json" } }
    );
  }

  return redirect('/success');
};

export default function DriverHealthCheckForm() {
  const { storeName, driverName, deliveryCompany } = useLoaderData<LoaderData>();

  return (
    <Form method="post" className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2">
        <Label htmlFor="storeName">店舗名</Label>
        <Input id="storeName" name="storeName" required defaultValue={storeName} readOnly />
      </div>

      <div className="space-y-2">
        <Label htmlFor="driverName">氏名</Label>
        <Input id="driverName" name="driverName" required defaultValue={driverName} readOnly />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryCompany">配送会社</Label>
        <Input id="deliveryCompany" name="deliveryCompany" required defaultValue={deliveryCompany} readOnly />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Label htmlFor="hasUsedAlcoholChecker" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          アルコールチェッカーの使用
        </Label>
        <div className='flex flex-row items-center justify-center space-x-2'>
          <p className='text-xs'>無</p>
          <Switch id="hasUsedAlcoholChecker" name="hasUsedAlcoholChecker" defaultChecked/>
          <p className='text-xs'>有</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alcoholTestResult">アルコール測定の結果</Label>
        <div className='grid grid-cols-2 space-x-6'>
          <div>
            <Label htmlFor="alcoholTestFirstResult">1回目</Label>
            <Input id="alcoholTestFirstResult" name="alcoholTestFirstResult" type="number" step="0.1" required defaultValue={0} />
          </div>
          <div>
            <Label htmlFor="alcoholTestSecondResult">2回目</Label>
            <Input id="alcoholTestSecondResult" name="alcoholTestSecondResult" type="number" step="0.1" />
          </div>
        </div>
      </div>

      <div className='pt-2'>
        <Button type="submit" className="w-full">送信</Button>
      </div>
    </Form>
  );
}
