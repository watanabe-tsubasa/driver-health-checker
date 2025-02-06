/* eslint-disable react/prop-types */
import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { ApproveTableToolbarProps } from "./tableTypes";
// import { Input } from "~/components/ui/input"

export const ApproveTableTopToolbar = ({ table }: ApproveTableToolbarProps) => {
  return (
    <div className="flex items-center py-4">
      {/* <Input
        placeholder="Filter by store name..."
        value={(table.getColumn("storeName")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("storeName")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      /> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
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
