import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGINATION_PAGE_SIZES } from "@/utils/constants";

interface PaginationWrapperProps<TData> {
  table: Table<TData>;
}

function PaginationWrapper<TData>({ table }: PaginationWrapperProps<TData>) {
  const tableState = table.getState();
  const totalPages = table.getPageCount();
  const { pageIndex, pageSize } = tableState.pagination;
  const currentPage = pageIndex + 1;

  return (
    <div className="flex w-full justify-end gap-8">
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm leading-9">
        Page {currentPage} of {totalPages}
      </p>
      <div>
        <Select
          defaultValue={String(PAGINATION_PAGE_SIZES[0])}
          value={String(pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            Show <SelectValue placeholder="Page Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PAGINATION_PAGE_SIZES.map((value, index) => (
                <SelectItem value={String(value)} key={index}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default PaginationWrapper;
