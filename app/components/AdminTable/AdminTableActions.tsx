import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DriverLog } from "~/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";

interface AdminTableActionsProps {
  data: DriverLog;
}

export const AdminTableActions: React.FC<AdminTableActionsProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(data.id))}>
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>詳細情報</DialogTitle>
            <DialogDescription>ドライバーの詳細情報を表示します。</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p><strong>ID:</strong> {data.id}</p>
            <p><strong>店舗名:</strong> {data.storeName}</p>
            <p><strong>氏名:</strong> {data.driverName}</p>
            <p><strong>配送会社:</strong> {data.deliveryCompany}</p>
            <p><strong>アルコールチェッカー使用:</strong> {data.hasUsedAlcoholChecker ? "有" : "無"}</p>
            <p><strong>アルコール測定(1回目):</strong> {data.alcoholTestFirstResult}</p>
            <p><strong>アルコール測定(2回目):</strong> {data.alcoholTestSecondResult ?? "-"}</p>
            <p><strong>疾病の有無:</strong> {data.hasIllness ? "有" : "無"}</p>
            <p><strong>疲労の有無:</strong> {data.isTired ? "有" : "無"}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
