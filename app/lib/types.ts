export interface LoginData {
  lastName: string;
  firstName: string;
  storeName: string;
}

export interface DriverLog {
  id: number;
  storeName: string;
  driverName: string;
  deliveryCompany: string;
}

export interface LoaderData {
  loginData: LoginData;
  filteredData: DriverLog[];
}