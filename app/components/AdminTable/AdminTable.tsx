import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { columns } from "./AdminTable.columns";
import { AdminDashboardData, LoginResponseType, Store } from "~/lib/types";
// import { AdminTableBottomToolbar } from "./AdminTableBottomToolbar";
import { AdminTableTopToolbar } from "./AdminTableTopToolbar";
import { AdminTableBottomToolbar } from "./AdminTableBottomToolbar";
import { Separator } from "../ui/separator";

export const AdminTable = ({
  data,
  loginData,
  storesPromise
}: {
  data: AdminDashboardData[];
  loginData: LoginResponseType;
  storesPromise: Promise<Store[]>
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  // const selectedData = table.getSelectedRowModel().rows.map((row) => row.original);

  return (
    <div className="w-full flex flex-col h-full">
      {/* 🔹 ツールバーを追加 */}
      <AdminTableTopToolbar table={table} loginData={loginData} storesPromise={storesPromise} />

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortedState = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center justify-between">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() &&
                          (sortedState === "asc" ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : sortedState === "desc" ? (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronsUpDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Separator />
      <div className="sticky bottom-0">
        <AdminTableBottomToolbar table={table} />
      </div>
    </div>
  );
};
