/* eslint-disable react/prop-types */
import { Button } from "~/components/ui/button"
import { AdminDashboardData } from "~/lib/types"
import { Table } from "@tanstack/react-table"
// import { ApprooveTableTopToolbar } from "./ApprooveTableTopToolbar"

export const AdminTableBottomToolbar = ({ table }: {
  table: Table<AdminDashboardData>
}) => {
  return(
    <div className="flex justify-between">
      <div className="flex justify-end space-x-2 py-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          前
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          次
        </Button>
      </div>
    </div>
  )
}