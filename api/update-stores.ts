// /api/sites/update-store-names.ts

import { EditStoreNamesRequest } from "~/lib/types";

export async function handleUpdateStores(request: Request, env: Env) {
  const db = env.DB;
  if (request.method === "PUT") {
    try {
      const { updates } = await request.json() as EditStoreNamesRequest;
      if (!Array.isArray(updates) || updates.length === 0) {
        return new Response(JSON.stringify({ error: "更新するデータがありません。" }), { status: 400 });
      }
      const query = `
        UPDATE sites
        SET store_name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE store_code = ?
      `;
      const statements: D1PreparedStatement[] = updates.map(update => (
        db.prepare(query).bind(update.value, update.label)
      ));
      await db.batch(statements);
  
      return new Response(JSON.stringify({ message: "店舗情報が更新されました。" }), { status: 200 });
    } catch (error) {
      console.error("Batch Update Error:", error);
      return new Response(JSON.stringify({ error: "更新に失敗しました。" }), { status: 500 });
    }
  }
}
