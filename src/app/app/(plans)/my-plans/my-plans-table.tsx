"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TanstackTable } from "@/components/tanstack-table";
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  TableOptions,
} from "@tanstack/react-table";
import { Board } from "@prisma/client";
import { Dice5 } from "lucide-react";
import { fetchService } from "@/utils/fetch-service";
import { appLogger } from "@/utils/logger";
import Loading from "@/components/loading";
import clsx from "clsx";
import PaginationWrapper from "@/components/pagination-wrapper";

const columns: ColumnDef<Board>[] = [
  {
    accessorKey: "title",
    header: "Name",
    cell: ({ getValue }) => {
      const title = getValue() as string;
      return (
        <div className="flex justify-start gap-3 ">
          <Dice5 />
          <span title={title}>{title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "",
    header: "Privacy",
    cell: ({}) => {
      return "SharedWithYou";
    },
  },
  { accessorKey: "owner", header: "Owner" },
];

const fetchTableData = async (pagination: PaginationState) => {
  const { pageIndex, pageSize } = pagination;
  const data = await fetchService.call<{
    records: Board[];
    totalRecords: number;
  }>("/api/all-boards", {
    method: "GET",
    searchParams: {
      page: pageIndex + 1,
      pageSize,
    },
  });

  return data;
};

const MyPlansTable = () => {
  const [tableData, setTableData] = useState<{
    records: Board[];
    totalRecords: number;
  }>({ records: [], totalRecords: 0 });
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableSettings = useMemo<TableOptions<Board>>(() => {
    return {
      data: tableData.records,
      columns: columns,
      rowCount: tableData.totalRecords,
      getCoreRowModel: getCoreRowModel(),
      state: { pagination: paginationState },
      onPaginationChange: setPaginationState,
      manualPagination: true,
      debugTable: true,
    };
  }, [tableData, paginationState]);

  useEffect(() => {
    fetchTableData(paginationState).then((value) => {
      setTableData(value);
    });
  }, [paginationState]);

  const contentLoading = tableData.records.length === 0;

  return (
    <div
      className={clsx(
        "grid grid-cols-1",
        contentLoading ? "grid-cols-1" : "grid-rows-[max-content_1fr]",
      )}
    >
      {contentLoading ? (
        <Loading />
      ) : (
        <div>
          <TanstackTable<Board> settings={tableSettings} />
        </div>
      )}
    </div>
  );
};

export default MyPlansTable;
