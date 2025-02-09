import { Form } from "@remix-run/react";
import { Table } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { AdminDashboardData, LoginResponseType, Store } from "~/lib/types";
import { DatePickerWithRange, StoreSearchComboboxNolabel } from "../FormUI";

export const AdminTableTopToolbar = ({
  loginData, storesPromise
}: {
  table: Table<AdminDashboardData>;
  loginData: LoginResponseType,
  storesPromise: Promise<Store[]>
}) => {
  if (!loginData) {
    return <div>ログイン情報が取得できません。</div>;
  }
  
  return (
    <div className="flex items-center justify-between py-4">
      <Form method="post" className="flex-1 flex justify-between items-center">
        {(loginData.role === "master" && storesPromise) ?
         <StoreSearchComboboxNolabel storesPromise={storesPromise} /> :
         <>
           <input id="storeName" name="storeName" type="hidden" value={loginData.storeName} readOnly />
           <input id="storeCode" name="storeCode" type="hidden" value={loginData.storeCode} readOnly />
         </>
        }
        <DatePickerWithRange />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          className="min-w-20"
        >
          検索
        </Button>
      </Form>

      {/* 🔹 カラムの表示・非表示設定 */}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table.getAllColumns().map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
};
