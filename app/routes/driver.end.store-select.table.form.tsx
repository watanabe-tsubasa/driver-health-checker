import { redirect } from '@remix-run/cloudflare';
import { useLoaderData, Form } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { DriverActionRequest } from './driver.start';

type LoaderData = {
  storeName: string;
  driverName: string;
  deliveryCompany: string;
};

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const storeName = url.searchParams.get("storeName") || "";
  const driverName = url.searchParams.get("driverName") || "";
  const deliveryCompany = url.searchParams.get("deliveryCompany") || "";

  return Response.json({ storeName, driverName, deliveryCompany });
}

export const action = async ({ request }: DriverActionRequest) => {
  const formData = await request.formData();

  const storeName = formData.get('storeName');
  const driverName = formData.get('driverName');
  const deliveryCompany = formData.get('deliveryCompany');
  const hasUsedAlcoholChecker = formData.get('hasUsedAlcoholChecker') === 'on';
  const alcoholTestFirstResult = parseFloat(formData.get('alcoholTestFirstResult') as string || '0');
  const alcoholTestSecondResult = parseFloat(formData.get('alcoholTestSecondResult') as string || '0');
  const hasIllness = formData.get('hasIllness') === 'on';
  const isTired = formData.get('isTired') === 'on';

  if (typeof storeName !== 'string' ||
      typeof driverName !== 'string' ||
      typeof deliveryCompany !== 'string' ||
      isNaN(alcoholTestFirstResult) || 
      isNaN(alcoholTestSecondResult)) {
    return new Response(JSON.stringify({ error: '必須項目をすべて入力してください。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // フォームデータをサーバー側で処理するロジックをここに追加
  // 例: データベースに保存
  console.log(formData);
  console.log({
    storeName,
    driverName,
    deliveryCompany,
    hasUsedAlcoholChecker,
    alcoholTestFirstResult,
    alcoholTestSecondResult,
    hasIllness,
    isTired,
  });

  return redirect('/success');
}

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
