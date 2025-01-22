// api/driver-end/store-select-table.ts
interface StoreData {
  id: number;
  storeName: string;
  driverName: string;
  deliveryCompany: string;
}

// ダミーデータ
const storeData: StoreData[] = [
  { id: 1, storeName: "イオン東雲店", driverName: "山田太郎", deliveryCompany: "ヤマト運輸" },
  { id: 2, storeName: "イオン船橋店", driverName: "佐藤花子", deliveryCompany: "佐川急便" },
  // ...
];

export async function handleDriverEndStoreSelectTable(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  console.log(env, ctx); // for ignore error

  if (request.method === "GET") {
    const storeName = url.searchParams.get("storeName");
    if (!storeName) {
      return new Response(
        JSON.stringify({ filteredData: [], error: "店舗名が指定されていません。" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const filteredData = storeData.filter((store) => store.storeName.includes(storeName));
    return new Response(JSON.stringify({ filteredData, storeName }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
