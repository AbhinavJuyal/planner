"use client";

import { flexRender, TableOptions, useReactTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationWrapper from "./pagination-wrapper";
import { ScrollArea } from "./ui/scroll-area";

interface DataTableProps<TData> {
  settings: TableOptions<TData>;
}

export function TanstackTable<TData>({ settings }: DataTableProps<TData>) {
  const table = useReactTable<TData>(settings);
  const { manualPagination, state, rowCount } = settings;
  const { pagination: paginationState } = state ?? { pagination: undefined };

  return (
    <div className="w-full h-full flex flex-col">
      <ScrollArea className="w-full h-[700px]">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={settings.columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      <div className="mt-auto">
        {manualPagination && paginationState && rowCount && (
          <PaginationWrapper<TData> table={table} />
        )}
      </div>
    </div>
  );
}
