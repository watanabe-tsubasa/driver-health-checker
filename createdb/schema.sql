-- 既存のテーブルを削除
DROP TABLE IF EXISTS start_check_approvals;
DROP TABLE IF EXISTS end_check_approvals;
DROP TABLE IF EXISTS end_checks;
DROP TABLE IF EXISTS start_checks;
DROP TABLE IF EXISTS managers;
DROP TABLE IF EXISTS sites;

-- 拠点情報テーブル
CREATE TABLE sites (
  store_code TEXT PRIMARY KEY, -- 店舗コードを主キーに変更
  store_name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 管理者テーブル（store_code でリレーション）
CREATE TABLE managers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_code TEXT NOT NULL, -- store_code をリレーションキーに
  login_id TEXT UNIQUE NOT NULL, -- ログイン用の一意キー
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT CHECK(role IN ('leader', 'ns_manager', 'store_manager')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_code) REFERENCES sites (store_code) ON DELETE CASCADE
);

-- 配送開始前のアルコールチェック（store_code でリレーション）
CREATE TABLE start_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_code TEXT NOT NULL, -- store_code をリレーションキーに
  driver_name TEXT NOT NULL,
  delivery_company TEXT NOT NULL,
  has_used_alcohol_checker BOOLEAN NOT NULL,
  alcohol_test_first_result REAL NOT NULL, -- アルコール測定結果1回目
  alcohol_test_second_result REAL, -- アルコール測定結果2回目（NULL可）
  has_illness BOOLEAN NOT NULL, -- 疾病の有無
  is_tired BOOLEAN NOT NULL, -- 疲労の有無
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_code) REFERENCES sites (store_code) ON DELETE CASCADE
);

-- 配送終了後のアルコールチェック
CREATE TABLE end_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_check_id INTEGER NOT NULL,
  has_used_alcohol_checker BOOLEAN NOT NULL,
  alcohol_test_first_result REAL NOT NULL, -- アルコール測定結果1回目
  alcohol_test_second_result REAL, -- アルコール測定結果2回目（NULL可）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (start_check_id) REFERENCES start_checks (id) ON DELETE CASCADE
);

-- アルコールチェックの承認記録（配送開始前）
CREATE TABLE start_check_approvals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_check_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
  approver_role TEXT CHECK(approver_role IN ('leader', 'store_manager', 'ns_manager')) NOT NULL,
  approval_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  result BOOLEAN NOT NULL,
  FOREIGN KEY (start_check_id) REFERENCES start_checks (id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES managers (id) ON DELETE CASCADE
);

-- アルコールチェックの承認記録（配送終了後）
CREATE TABLE end_check_approvals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  end_check_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
  approver_role TEXT CHECK(approver_role IN ('leader', 'store_manager', 'ns_manager')) NOT NULL,
  approval_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  result BOOLEAN NOT NULL,
  FOREIGN KEY (end_check_id) REFERENCES end_checks (id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES managers (id) ON DELETE CASCADE
);

-- 必要なインデックス
CREATE INDEX idx_start_checks_store ON start_checks (store_code);
CREATE INDEX idx_managers_store ON managers (store_code);
CREATE INDEX idx_start_check_approvals ON start_check_approvals (start_check_id);
CREATE INDEX idx_end_check_approvals ON end_check_approvals (end_check_id);
CREATE INDEX idx_managers_login ON managers (login_id);
