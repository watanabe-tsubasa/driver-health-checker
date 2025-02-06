/* eslint-disable react/prop-types */
import { Table } from "@tanstack/react-table";
import { DashboardStartDriverData, DashboardEndDriverData } from "~/lib/types";

// テーブルの型を定義
export type ApproveTableToolbarProps = {
  table: Table<DashboardStartDriverData | DashboardEndDriverData>;
};