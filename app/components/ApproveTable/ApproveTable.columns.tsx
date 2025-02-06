import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";
import { ApproveTableActions } from "./ApproveTableActions";
import { DashboardStartDriverData, DashboardEndDriverData } from "~/lib/types";
import { convertToJSTDate, isStartDriverData } from "~/lib/utils";

// 共通の型を適用
export const columns: ColumnDef<DashboardStartDriverData | DashboardEndDriverData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "driverName",
    header: () => "氏名",
    cell: ({ row }) => {
      const data = row.original;

      const isWarning = isStartDriverData(data)
      ? !data.hasUsedAlcoholChecker || data.hasIllness || data.isTired ||
        ((data.alcoholTestFirstResult !== 0 && (data.alcoholTestSecondResult === null || data.alcoholTestSecondResult !== 0)) ||
         (data.alcoholTestFirstResult === 0 && data.alcoholTestSecondResult !== null && data.alcoholTestSecondResult !== 0))
      : !data.hasUsedAlcoholChecker ||
        ((data.alcoholTestFirstResult !== 0 && (data.alcoholTestSecondResult === null || data.alcoholTestSecondResult !== 0)) ||
         (data.alcoholTestFirstResult === 0 && data.alcoholTestSecondResult !== null && data.alcoholTestSecondResult !== 0));
    
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
      const date = convertToJSTDate(new Date(row.original.createdAt)); // 型変換
      return date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", month: "long", day: "numeric"});
    },
  },
  {
    id: "actions",
    header: () => "詳細",
    cell: ({ row }) => <ApproveTableActions data={row.original} />,
  },
];
