import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Drawer, DrawerContent } from "~/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { callEnv } from "~/lib/utils";

// StoreData 型定義
interface StoreData  {
  id: number;
  storeCode: string;
  storeName: string;
  driverName: string;
  deliveryCompany: string;
}

// Loader の戻り値の型定義
interface LoaderData  {
  filteredData: StoreData[];
  storeCode: string;
}

// Loader関数
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const storeCode = url.searchParams.get("storeCode");

  if (!storeCode) {
    return Response.json({ filteredData: [], error: "storeCode が指定されていません。" });
  }

  const env = callEnv(context);
  const { API_BASE_URL } = env;

  try {
    const response = await fetch(`${API_BASE_URL}/api/driver-end/store-select-table?storeCode=${storeCode}`);
    
    if (!response.ok) {
      const errorData = await response.json() as {error: string};
      return Response.json({ filteredData: [], error: errorData.error });
    }

    const filteredData = await response.json();
    console.log(`filteredData: ${filteredData}`)
    return Response.json({ filteredData, storeCode });

  } catch (error) {
    console.error("API Fetch Error:", error);
    return Response.json({ filteredData: [], error: "データ取得に失敗しました。" });
  }
};


// コンポーネント
export default function StoreTable() {
  const { filteredData, storeCode } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleOpenForm = (data: StoreData) => {
    const queryParams = new URLSearchParams({
      id: String(data.id),
      storeCode: data.storeCode,
      storeName: data.storeName,
      driverName: data.driverName,
      deliveryCompany: data.deliveryCompany,
    });
    navigate(`/driver/end/store-select/table/form?${queryParams.toString()}`);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    navigate(`/driver/end/store-select/table?storeCode=${storeCode}`);
  };

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableCaption>{storeCode}｜配送前登録</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>配送会社</TableHead>
            <TableHead>氏名</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.deliveryCompany}</TableCell>
                <TableCell>{store.driverName}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenForm(store)}>選択</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                該当するデータがありません。
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={handleCloseDrawer}>
              閉じる
            </Button>
          </div>
          <Outlet />
        </DrawerContent>
      </Drawer>
    </div>
  );
}