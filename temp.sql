-- 1. データを一時テーブルにバックアップ
CREATE TABLE managers_backup AS SELECT * FROM managers;

-- 2. 元のテーブルを削除
DROP TABLE managers;

-- 3. 'store_code' を NULL 許容にして新しいテーブルを作成
CREATE TABLE managers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_code TEXT, -- NOT NULL 制約を削除
  login_id TEXT UNIQUE NOT NULL,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT CHECK(role IN ('leader', 'ns_manager', 'store_manager', 'master')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_code) REFERENCES sites (store_code) ON DELETE CASCADE
);

-- 4. バックアップデータを元に戻す
INSERT INTO managers (id, store_code, login_id, last_name, first_name, password_hash, salt, role, created_at, updated_at)
SELECT id, store_code, login_id, last_name, first_name, password_hash, salt, role, created_at, updated_at
FROM managers_backup;

-- 5. バックアップテーブルの削除
DROP TABLE managers_backup;
