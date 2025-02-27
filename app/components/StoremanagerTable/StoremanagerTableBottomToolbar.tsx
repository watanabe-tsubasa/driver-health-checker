/* eslint-disable react/prop-types */
import { Button } from "~/components/ui/button"
import { Form, useNavigation } from "@remix-run/react"
import { DashboardStoreManagerData, LoginResponseType } from "~/lib/types"
import { Table } from "@tanstack/react-table"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "~/components/ui/dialog"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
// import { ApprooveTableTopToolbar } from "./ApprooveTableTopToolbar"

export const StoremanagerTableBottomToolbar = ({ allData, loginData, table }: {
  allData: DashboardStoreManagerData[],
  loginData: LoginResponseType,
  table: Table<DashboardStoreManagerData>
}) => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const hasApprovalData = allData.length !== 0
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (isSubmitting) {
      setOpen(false);
    }
    return () => setOpen(false);
  }, [isSubmitting]);

  return(
    <div className="flex justify-between items-center">
      <Button
        type="button"
        onClick={() => setOpen(true)}
        variant="secondary"
        size="sm"
        disabled={!hasApprovalData}
        className="min-w-20"
      >
        {hasApprovalData ? '全件承認' : '承認が必要なデータはありません'}
      </Button>
      <div className="flex justify-end space-x-2 py-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          前
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          次
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>全件承認</DialogTitle>
            <DialogDescription>1ヶ月分の記録を承認します</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="grid grid-cols-2 gap-4 mx-4">
              <Form method="post" className="flex">
                <input type="hidden" name="allData" value={JSON.stringify(allData)} />
                <input type="hidden" name="managerId" value={loginData.id} />
                <input type="hidden" name="role" value={loginData.role} />
                <Button
                  type="submit"
                  variant="default"
                  disabled={!hasApprovalData}
                  className="min-w-20 flex-1"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : '全件承認'}
                </Button>
              </Form>
              <Button
               type="button"
               variant="secondary"
               className="min-w-20"
               onClick={() => setOpen(false)}
              >
                キャンセル
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}