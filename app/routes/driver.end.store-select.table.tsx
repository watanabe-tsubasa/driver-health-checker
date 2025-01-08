import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
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

// StoreData 型定義
type StoreData = {
  id: number;
  storeName: string;
  driverName: string;
  deliveryCompany: string;
};

// Loader の戻り値の型定義
type LoaderData = {
  filteredData: StoreData[];
  storeName: string;
};

// ダミーデータ
const storeData: StoreData[] = [
  { id: 1, storeName: "イオン東雲店", driverName: "山田太郎", deliveryCompany: "ヤマト運輸" },
  { id: 2, storeName: "イオン船橋店", driverName: "佐藤花子", deliveryCompany: "佐川急便" },
  { id: 3, storeName: "イオンスタイル幕張新都心", driverName: "鈴木一郎", deliveryCompany: "日本郵便" },
  { id: 4, storeName: "イオン海浜幕張店", driverName: "田中美咲", deliveryCompany: "福山通運" },
  { id: 5, storeName: "イオンスタイル品川シーサイド", driverName: "高橋健太", deliveryCompany: "西濃運輸" },
];

// Loader関数
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const storeName = url.searchParams.get("storeName");

  if (!storeName) {
    return Response.json({ filteredData: [], error: "店舗名が指定されていません。" });
  }

  const filteredData = storeData.filter((store) =>
    store.storeName.includes(storeName)
  );

  return Response.json({ filteredData, storeName });
}

// コンポーネント
export default function StoreTable() {
  // useLoaderDataの型をLoaderDataに指定
  const { filteredData, storeName } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleOpenForm = (data: StoreData) => {
    const queryParams = new URLSearchParams({
      storeName: data.storeName,
      driverName: data.driverName,
      deliveryCompany: data.deliveryCompany,
    });
    navigate(`/driver/end/store-select/table/form?${queryParams.toString()}`);
    setDrawerOpen(true); // Drawerを開く
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    navigate(`/driver/end/store-select/table?storeName=${storeName}`); // Drawerを閉じた後に親ルートに戻す
  };

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableCaption>{storeName}｜配送前登録</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead>店舗名</TableHead> */}
            <TableHead>配送会社</TableHead>
            <TableHead>氏名</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((store) => (
              <TableRow key={store.id}>
                {/* <TableCell className="font-medium">{store.storeName}</TableCell> */}
                <TableCell>{store.deliveryCompany}</TableCell>
                <TableCell>{store.driverName}</TableCell>
                <TableCell><Button onClick={() => handleOpenForm(store)}>選択</Button></TableCell>
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
