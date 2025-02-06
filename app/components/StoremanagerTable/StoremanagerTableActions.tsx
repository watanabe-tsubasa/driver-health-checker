/* eslint-disable react/prop-types */
import { useState } from "react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { DashboardStoreManagerData } from "~/lib/types";
import { convertToJSTDate } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

export const StoremanagerTableActions = ({ data }: { data: DashboardStoreManagerData}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
       variant="ghost"
       className="h-8 w-8 p-0"
       onClick={() => setOpen(true)}
      >
        <MoreHorizontal />
      </Button>
      {/* <DropdownMenu>
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
      </DropdownMenu> */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>詳細情報</DialogTitle>
            <DialogDescription>ドライバーの詳細情報を表示します。</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {/* <p><strong>ID:</strong> {data.id}</p> */}
            <p>
              <strong>登録日時:</strong> {
              convertToJSTDate(new Date(data.createdAtStart))
              .toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
              }
            </p>
            <p><strong>店舗名:</strong> {data.storeName}</p>
            <p><strong>氏名:</strong> {data.driverName}</p>
            <p><strong>配送会社:</strong> {data.deliveryCompany}</p>
            <Separator className="my-4" />
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1 border-r-[1px] border-solid pl-2">
                <strong className="font-extrabold">配送前</strong>
                <p><strong>アルコールチェッカー使用:</strong> {data.hasUsedAlcoholCheckerStart ? "有" : "無"}</p>
                <p><strong>アルコール測定(1回目):</strong> {data.alcoholTestFirstResultStart}</p>
                <p><strong>アルコール測定(2回目):</strong> {data.alcoholTestFirstResultEnd ?? "-"}</p>
                <p><strong>疾病の有無:</strong> {data.hasIllness ? "有" : "無"}</p>
                <p><strong>疲労の有無:</strong> {data.isTired ? "有" : "無"}</p>
              </div>
              <div className="space-y-2 flex-1 pl-2">
                <strong className="font-extrabold">帰着後</strong>
                <p><strong>アルコールチェッカー使用:</strong> {data.hasUsedAlcoholCheckerEnd ? "有" : "無"}</p>
                <p><strong>アルコール測定(1回目):</strong> {data.alcoholTestSecondResultStart}</p>
                <p><strong>アルコール測定(2回目):</strong> {data.alcoholTestSecondResultEnd ?? "-"}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
