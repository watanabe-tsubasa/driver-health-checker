/* eslint-disable react/prop-types */
import { Button } from "~/components/ui/button"
import { Form } from "@remix-run/react"
import { DashboardEndDriverData, DashboardStartDriverData, LoginResponseType } from "~/lib/types"
import { Table } from "@tanstack/react-table"
// import { ApprooveTableTopToolbar } from "./ApprooveTableTopToolbar"

export const ApproveTableBottomToolbar = <T extends DashboardStartDriverData | DashboardEndDriverData>({ selectedData, loginData, table }: {
  selectedData: T[],
  loginData: LoginResponseType,
  table: Table<T>
}) => {
  return(
    <div className="flex justify-between">
      <Form method="post">
        <input type="hidden" name="selectedData" value={JSON.stringify(selectedData)} />
        <input type="hidden" name="managerId" value={loginData.id} />
        <input type="hidden" name="role" value={loginData.role} />
        <div className="flex justify-end space-x-2 py-4">
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={selectedData.length === 0}
            className="min-w-20"
          >
            承認
          </Button>
        </div>
      </Form>
      <div className="flex justify-end space-x-2 py-4">
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