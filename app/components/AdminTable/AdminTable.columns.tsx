import { ColumnDef } from "@tanstack/react-table";
// import { Checkbox } from "~/components/ui/checkbox";
import { StoremanagerTableActions } from "./AdminTableActions";
import { AdminDashboardData } from "~/lib/types";
import { convertToJSTDate } from "~/lib/utils";

export const columns: ColumnDef<AdminDashboardData>[] = [
  {
    accessorKey: "storeName",
    header: () => "店舗",
    cell: ({ row }) => row.getValue("storeName"),
  },
  {
    accessorKey: "driverName",
    header: () => "氏名",
    cell: ({ row }) => {
      const data = row.original;

      const isWarning =
      !data.startLeader.id ||
      !data.startNsManager.id ||
      !data.startStoreManager.id ||
      !data.endLeader.id ||
      !data.endNsManager.id ||
      !data.endStoreManager.id 
    
      return (
        <span className={isWarning ? "text-red-600 font-bold" : ""}>
          {row.getValue("driverName")}
        </span>
      );
    },
  },
  {
    accessorKey: "deliveryCompany",
    header: () => "配送会社",
    cell: ({ row }) => row.getValue("deliveryCompany"),
  },
  {
    accessorKey: "createdAt",
    header: () => "登録日",
    sortingFn: "datetime",
    cell: ({ row }) => {
      const date = convertToJSTDate(new Date(row.original.createdAtStart)); // 型変換
      return date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", month: "long", day: "numeric"});
    },
  },
  {
    accessorKey: "startLeader",
    header: () => "配送リーダー",
    cell: ({ row }) => row.original.startLeader.lastName || '未承認',
  },
  {
    accessorKey: "startNsManager",
    header: () => "NSマネージャー",
    cell: ({ row }) => row.original.startNsManager.lastName || '未承認',
  },
  {
    id: "actions",
    header: () => "詳細",
    cell: ({ row }) => <StoremanagerTableActions data={row.original} />,
  },
];
