import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { appLogger } from "@/utils/logger";
import { PaginationState } from "@tanstack/react-table";
import { MouseEvent } from "react";

const MAX_VISIBLE_PAGES = 3;

{
  /* <PaginationItem> */
}
{
  /*   <PaginationLink href="#" isActive> */
}
{
  /*     2 */
}
{
  /*   </PaginationLink> */
}
{
  /* </PaginationItem> */
}

interface PaginationWrapperProps {
  paginationState: PaginationState;
  rowCount: number;
  onChange: (paginationState: PaginationState) => void;
}

function PaginationWrapper({
  paginationState,
  rowCount,
  onChange,
}: PaginationWrapperProps) {
  const { pageIndex, pageSize } = paginationState;
  const totalPages = Math.ceil(rowCount / pageSize);
  const currentPage = pageIndex + 1;
  const pageGroupIndex = Math.ceil(currentPage / MAX_VISIBLE_PAGES);
  const visiblePages = Array.from({ length: MAX_VISIBLE_PAGES })
    .fill(0)
    .map((_, index: number) => {
      const page = MAX_VISIBLE_PAGES * pageGroupIndex - 2 + index + 1;
      return Math.min(page, totalPages);
    });
  const showLeftEllipsis = currentPage > MAX_VISIBLE_PAGES;
  const showRightEllipsis = totalPages > MAX_VISIBLE_PAGES;

  const handlePagination = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const element = e.target as HTMLAnchorElement;

    if (element.classList.contains("pagination-item")) {
      const newPageIndex = Number(element.id);
      onChange({ pageIndex: newPageIndex, pageSize });
    }
  };

  return (
    <Pagination onClick={handlePagination}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {visiblePages.map((_, index: number) => {
          return (
            <PaginationItem key={index + 1}>
              <PaginationLink
                href="#"
                className="pagination-item"
                id={String(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationWrapper;
