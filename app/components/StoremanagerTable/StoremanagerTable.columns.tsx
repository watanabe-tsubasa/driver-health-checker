import { ColumnDef } from "@tanstack/react-table";
// import { Checkbox } from "~/components/ui/checkbox";
import { StoremanagerTableActions } from "./StoremanagerTableActions";
import { DashboardStoreManagerData } from "~/lib/types";
import { convertToJSTDate } from "~/lib/utils";

export const columns: ColumnDef<DashboardStoreManagerData>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "driverName",
    header: () => "氏名",
    cell: ({ row }) => {
      const data = row.original;

      const isWarning =
      !data.hasUsedAlcoholCheckerStart ||
      (data.hasIllness ?? false) || 
      (data.isTired ?? false) ||
      ((data.alcoholTestFirstResultStart !== 0 &&
        (data.alcoholTestSecondResultStart === null || data.alcoholTestSecondResultStart !== 0)) ||
       (data.alcoholTestFirstResultStart === 0 &&
        data.alcoholTestSecondResultStart !== null &&
        data.alcoholTestSecondResultStart !== 0)) ||
      !data.hasUsedAlcoholCheckerEnd ||
      ((data.alcoholTestFirstResultEnd !== 0 &&
        (data.alcoholTestSecondResultEnd === null || data.alcoholTestSecondResultEnd !== 0)) ||
       (data.alcoholTestFirstResultEnd === 0 &&
        data.alcoholTestSecondResultEnd !== null &&
        data.alcoholTestSecondResultEnd !== 0));
    
    
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
    id: "actions",
    header: () => "詳細",
    cell: ({ row }) => <StoremanagerTableActions data={row.original} />,
  },
];
