// api/driver-end/store-select-table-form.ts
export async function handleDriverEndStoreSelectTableForm(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  console.log(env); // for ignore error
  console.log(ctx); // for ignore error

  // GET /api/driver-end/store-select-table-form?storeName=xxx
  if (request.method === "GET") {
    const storeName = url.searchParams.get("storeName") || "";
    const driverName = url.searchParams.get("driverName") || "";
    const deliveryCompany = url.searchParams.get("deliveryCompany") || "";

    return new Response(
      JSON.stringify({ storeName, driverName, deliveryCompany }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // POST /api/driver-end/store-select-table-form
  if (request.method === "POST") {
    const data = await request.json();
    console.log("POST store-select-table-form data:", data);
    // DB保存など

    return new Response(JSON.stringify({ message: "保存しました" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
