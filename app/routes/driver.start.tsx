import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import { useActionData, Form, useLoaderData } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import { StoreSearchCombobox } from '~/components/FormUI';
import { callEnv, fetchStores, innerFetch } from '~/lib/utils';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = callEnv(context);
  return { storesPromise: fetchStores(env) };
};

export const action = async({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const env = callEnv(context);

  const payload = {
    storeCode: formData.get("storeCode"),
    driverName: formData.get("driverName"),
    deliveryCompany: formData.get("deliveryCompany"),
    hasUsedAlcoholChecker: formData.get("hasUsedAlcoholChecker") === "on",
    alcoholTestFirstResult: parseFloat(formData.get("alcoholTestFirstResult") as string || "0"),
    alcoholTestSecondResult: formData.get("alcoholTestSecondResult") 
      ? parseFloat(formData.get("alcoholTestSecondResult") as string) 
      : null,
    hasIllness: formData.get("hasIllness") === "on",
    isTired: formData.get("isTired") === "on",
  };

  // 🔹 バリデーション
  if (
    typeof payload.storeCode !== "string" || typeof payload.driverName !== "string" ||
    typeof payload.deliveryCompany !== "string" || isNaN(payload.alcoholTestFirstResult) ||
    (payload.alcoholTestSecondResult !== null && isNaN(payload.alcoholTestSecondResult))
  ) {
    return new Response(
      JSON.stringify({ error: "無効なデータです" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 🔹 API にリクエスト
  const response = await innerFetch(env, '/api/driver-start', {
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

  return redirect("/success");
};

interface DriverActionData {
  error?: string;
}

export default function DriverHealthCheckForm() {
  const { storesPromise } = useLoaderData<typeof loader>()
  const actionData = useActionData<DriverActionData>();

  return (
    <Form method="post" className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md min-h-screen-header">
      {actionData?.error && (
        <div className="text-red-500 text-sm">{actionData.error}</div>
      )}
      <StoreSearchCombobox storesPromise={storesPromise} />

      <div className='space-y-2'>
        <Label htmlFor="driverName">氏名</Label>
        <Input id="driverName" name="driverName" required />
      </div>

      <div className='space-y-2'>
        <Label htmlFor="deliveryCompany">配送会社</Label>
        <Input id="deliveryCompany" name="deliveryCompany" required />
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

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="hasIllness" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          疾病の有無
        </Label>
        <div className='flex flex-row items-center justify-center space-x-2'>
          <p className='text-xs'>無</p>
          <Switch id="hasIllness" name="hasIllness" />
          <p className='text-xs'>有</p>
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="isTired" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          疲労の有無
        </Label>
        <div className='flex flex-row items-center justify-center space-x-2'>
          <p className='text-xs'>無</p>
          <Switch id="isTired" name="isTired" />
          <p className='text-xs'>有</p>
        </div>
      </div>

      <div className='pt-2'>
        <Button type="submit" className="w-full">送信</Button>
      </div>
    </Form>
  );
}
