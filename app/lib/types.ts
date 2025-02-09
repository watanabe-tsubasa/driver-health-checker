// login
export interface LoginData {
  userName: string;
  password: string;
}

export interface Store {
  value: string; // store_code
  label: string; // store_name
}

const ROLE_TYPES = ['leader', 'ns_manager', 'store_manager', 'master'] as const;
export type RoleType = (typeof ROLE_TYPES)[number];

export interface LoginResponseType {
  id: number;
  lastName: string;
  firstName: string;
  storeCode: string;
  storeName: string;
  role: RoleType;
}

// editStoreNames
export interface EditStoreNamesRequest {
  updates: Store[];
}

// register
export interface RegisterRequestData {
  lastName: string;
  firstName: string;
  storeCode: string;
  storeName: string;
  userName: string;
  role: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponseSuccess {
  message: string;
  user: {
    lastName: string;
    firstName: string;
    storeName: string;
    userName: string;
    role: string;
    password: string;
  };
}

interface RegisterResponseError {
  error: string;
  suggestion?: string;
}

export type RegisterResponse = RegisterResponseSuccess | RegisterResponseError;

// driverlog

export interface StartHealthCheckFormData {
  storeName: string; // 店舗名
  storeCode: string; // 店舗コード
  driverName: string; // 氏名
  deliveryCompany: string; // 配送会社
  hasUsedAlcoholChecker: boolean; // チェッカー使用の有無
  alcoholTestFirstResult: number; // アルコール測定結果1回目
  alcoholTestSecondResult: number | null; // アルコール測定結果2回目
  hasIllness: boolean; // 疾病の有無
  isTired: boolean; // 疲労の有無
}

export interface EndHealthCheckFormData {
  startCheckId: number;
  storeName: string; // 店舗名
  storeCode: string; // 店舗コード
  driverName: string; // 氏名
  deliveryCompany: string; // 配送会社
  hasUsedAlcoholChecker: boolean; // チェッカー使用の有無
  alcoholTestFirstResult: number; // アルコール測定結果1回目
  alcoholTestSecondResult: number | null; // アルコール測定結果2回目
}

// dashboard/approve

export interface DashboardStartDriverData extends StartHealthCheckFormData {
  id: number;
  createdAt: string;
}

export interface DashboardEndDriverData extends EndHealthCheckFormData {
  id: number;
  createdAt: string;
}

export interface ApprovalRequestBody {
  selectedData: {
    id: number; // start_checks の ID
  }[];
  managerId: number; // 承認する管理者の ID
  role: RoleType
}

// dashboard/storemanager
export interface DashboardStoreManagerData {
  startCheckId: number; // 配送開始の ID (必須)
  endCheckId: number | null; // 配送終了の ID (null あり)
  storeCode: string; // 店舗コード
  storeName: string; // 店舗名
  driverName: string; // ドライバー氏名
  deliveryCompany: string; // 配送会社
  hasUsedAlcoholCheckerStart: boolean | null; // 配送開始時のアルコールチェッカー使用状況
  alcoholTestFirstResultStart: number | null; // 配送開始時のアルコール測定結果1回目
  alcoholTestSecondResultStart: number | null; // 配送開始時のアルコール測定結果2回目
  hasIllness: boolean | null; // 疾病の有無 (配送開始時のみ)
  isTired: boolean | null; // 疲労の有無 (配送開始時のみ)
  hasUsedAlcoholCheckerEnd: boolean | null; // 配送終了時のアルコールチェッカー使用状況
  alcoholTestFirstResultEnd: number | null; // 配送終了時のアルコール測定結果1回目
  alcoholTestSecondResultEnd: number | null; // 配送終了時のアルコール測定結果2回目
  createdAtStart: string; // 配送開始時の登録日時
  createdAtEnd: string | null; // 配送終了時の登録日時
}

export interface ApprovalStoremanagerRequestBody {
  allData: {
    startCheckId: number | null; // 配送開始データの ID
    endCheckId: number | null; // 配送終了データの ID
  }[];
  managerId: number; // 承認する管理者の ID
  role: RoleType;
}

// dashboard/admin
export interface ApprovalInfo {
  id: number | null;
  lastName: string | null;
  firstName: string | null;
  approvalTime: string | null;
}

export interface AdminDashboardData {
  startCheckId: number; // 配送開始の ID (必須)
  endCheckId: number | null; // 配送終了の ID (null あり)
  storeCode: string; // 店舗コード
  storeName: string; // 店舗名
  driverName: string; // ドライバー氏名
  deliveryCompany: string; // 配送会社
  hasUsedAlcoholCheckerStart: boolean; // 配送開始時のアルコールチェッカー使用状況
  alcoholTestFirstResultStart: number; // 配送開始時のアルコール測定結果1回目
  alcoholTestSecondResultStart: number | null; // 配送開始時のアルコール測定結果2回目
  hasIllness: boolean; // 疾病の有無 (配送開始時のみ)
  isTired: boolean; // 疲労の有無 (配送開始時のみ)
  hasUsedAlcoholCheckerEnd: boolean | null; // 配送終了時のアルコールチェッカー使用状況
  alcoholTestFirstResultEnd: number | null; // 配送終了時のアルコール測定結果1回目
  alcoholTestSecondResultEnd: number | null; // 配送終了時のアルコール測定結果2回目
  createdAtStart: string; // 配送開始時の登録日時
  createdAtEnd: string | null; // 配送終了時の登録日時

  // 配送開始前の承認情報
  startLeader: ApprovalInfo;
  startStoreManager: ApprovalInfo;
  startNsManager: ApprovalInfo;

  // 配送終了後の承認情報
  endLeader: ApprovalInfo;
  endStoreManager: ApprovalInfo;
  endNsManager: ApprovalInfo;
}
