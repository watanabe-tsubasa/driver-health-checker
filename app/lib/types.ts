export interface LoginData {
  lastName: string;
  firstName: string;
  storeName: string;
}

// ~/lib/types.ts
export interface DriverLog {
  id: number;
  storeName: string;
  driverName: string;
  deliveryCompany: string;
  hasUsedAlcoholChecker: boolean;
  alcoholTestFirstResult: number;
  alcoholTestSecondResult?: number;
  hasIllness?: boolean;
  isTired?: boolean;
}


export interface LoaderData {
  loginData: LoginData;
  filteredData: DriverLog[];
}

export interface DataTypeForLogin {
  lastName: string;
  password: string;
  firstName?: string;
  storeName?: string;
}