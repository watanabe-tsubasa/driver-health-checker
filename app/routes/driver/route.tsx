import { redirect } from '@remix-run/node';
import { useActionData, Form, Outlet } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import { StoreSearchCombobox } from '~/components/FormUI';

export async function action({ request }) {
  const formData = await request.formData();

  const driverName = formData.get('driverName');
  const deliveryCompany = formData.get('deliveryCompany');
  const hasConsumedAlcohol = formData.get('hasConsumedAlcohol') === 'on';
  const alcoholTestResult = parseFloat(formData.get('alcoholTestResult') || '0');
  const hasIllness = formData.get('hasIllness') === 'on';
  const sleepHours = parseFloat(formData.get('sleepHours') || '0');

  if (!driverName || !deliveryCompany || isNaN(alcoholTestResult) || isNaN(sleepHours)) {
    return Response.json({ error: '必須項目をすべて入力してください。' }, { status: 400 });
  }

  // フォームデータをサーバー側で処理するロジックをここに追加
  // 例: データベースに保存
  console.log({
    driverName,
    deliveryCompany,
    hasConsumedAlcohol,
    alcoholTestResult,
    hasIllness,
    sleepHours,
  });

  return redirect('/success');
}

export default function DriverHealthCheckForm() {
  const actionData = useActionData();

  return (
    <Form method="post" className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md min-h-screen-header">
      {actionData?.error && (
        <div className="text-red-500 text-sm">{actionData.error}</div>
      )}
      <StoreSearchCombobox />

      <div className='space-y-2'>
        <Label htmlFor="driverName">氏名</Label>
        <Input id="driverName" name="driverName" required />
      </div>

      <div className='space-y-2'>
        <Label htmlFor="deliveryCompany">配送会社</Label>
        <Input id="deliveryCompany" name="deliveryCompany" required />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="hasConsumedAlcohol" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          飲酒の有無
        </Label>
        <Switch id="hasConsumedAlcohol" name="hasConsumedAlcohol" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alcoholTestResult">アルコール測定の結果</Label>
        <Input id="alcoholTestResult" name="alcoholTestResult" type="number" step="0.1" required />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="hasIllness" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          疾病の有無
        </Label>
        <Switch id="hasIllness" name="hasIllness" />
      </div>
      <div className='space-y-2'>
        <Label htmlFor="sleepHours">睡眠時間</Label>
        <Input id="sleepHours" name="sleepHours" type="number" step="0.5" required />
      </div>
      <Button type="submit" className="w-full">送信</Button>
      <Outlet />
    </Form>
  );
}
