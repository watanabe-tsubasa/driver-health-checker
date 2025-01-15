import { ColumnDef } from "@tanstack/react-table"
import { DriverLog } from "~/lib/types"
import { Checkbox } from "~/components/ui/checkbox"
import { AdminTableActions } from "./AdminTableActions"

export const columns: ColumnDef<DriverLog>[] = [
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
      const {
        hasUsedAlcoholChecker,
        hasIllness,
        isTired,
        alcoholTestFirstResult,
        alcoholTestSecondResult
      } = row.original;

      const isWarning =
        !hasUsedAlcoholChecker || hasIllness || isTired || (alcoholTestFirstResult !== 0 && alcoholTestSecondResult !== 0 || null);

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
    id: "actions",
    header: () => "操作",
    cell: ({ row }) => <AdminTableActions data={row.original} />,
  },
];
