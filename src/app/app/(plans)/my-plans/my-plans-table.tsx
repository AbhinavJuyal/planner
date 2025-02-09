"use client";

import React from "react";
import { TanstackTable } from "@/components/tanstack-table";
import { ColumnDef } from "@tanstack/react-table";
import { Board } from "@prisma/client";
import { Dice5 } from "lucide-react";

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

interface MyPlansTableProps {
  tableData: Board[] | undefined;
}

const MyPlansTable = ({ tableData }: MyPlansTableProps) => {
  return (
    <>{tableData && <TanstackTable data={tableData} columns={columns} />}</>
  );
};

export default MyPlansTable;
