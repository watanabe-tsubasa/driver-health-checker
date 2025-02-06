import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import csv from "csv-parser";

const DATABASE_NAME = "driver-health-checker"; // D1 のDB名
const CSV_FILE = path.resolve("./stores.csv"); // CSVファイルのパス

interface storeType {
  store_name: string;
  store_code: string;
}
const stores: storeType[] = [];

fs.createReadStream(CSV_FILE)
  .pipe(csv())
  .on("data", (row) => {
    stores.push(row);
  })
  .on("end", () => {
    console.log(`CSV 読み込み完了: ${stores.length} 件のデータを取得しました。`);

    const values = stores
      .map(
        (s) =>
          `('${s.store_name}', '${s.store_code}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      .join(",\n");

    const sql = `INSERT INTO sites (store_name, store_code, created_at, updated_at) VALUES \n${values};`;

    console.log("実行するSQL:");
    console.log(sql);

    // SQL を Cloudflare D1 に適用
    execSync(`bunx wrangler d1 execute ${DATABASE_NAME} --remote --command="${sql}"`, {
      stdio: "inherit",
    });

    console.log("データベースに店舗データを挿入しました。");
  });
