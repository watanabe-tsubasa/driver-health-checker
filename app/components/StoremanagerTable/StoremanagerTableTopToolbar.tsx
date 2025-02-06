import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { DashboardStoreManagerData } from "~/lib/types";

export const StoremanagerTableTopToolbar = ({
  table,
  showAll,
  onToggleShowAll,
}: {
  table: Table<DashboardStoreManagerData>;
  showAll: boolean;
  onToggleShowAll: () => void;
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      {/* 🔹 データ切り替えボタン */}
      <Button variant="outline" onClick={onToggleShowAll}>
        {showAll ? "警告データのみ表示" : "全データを表示"}
      </Button>

      {/* 🔹 カラムの表示・非表示設定 */}
      <DropdownMenu>
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
      </DropdownMenu>
    </div>
  );
};
