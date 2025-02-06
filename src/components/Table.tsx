// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   flexRender,
//   ColumnDef,
// } from "@tanstack/react-table";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useEffect } from "react";

// interface DataTableProps<T> {
//   data: T[];
//   columns: ColumnDef<T>[];
//   pageSize?: number;
//   pageIndex?: number;
//   onPaginationChange?: (...args: any[]) => void;
// }

// export function DataTable<T>({
//   data,
//   columns,
//   pageSize = 10,
//   pageIndex = 0,
//   onPaginationChange,
// }: DataTableProps<T>) {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     manualPagination: true,
//     onPaginationChange: onPaginationChange,
//     initialState: {
//       pagination: {
//         pageSize,
//         pageIndex,
//       },
//     },
//   });

//   useEffect(() => {
//     if (onPaginationChange) {
//       onPaginationChange();
//     }
//   }, [pageIndex, pageSize]);

//   return (
//     <div className="w-full">
//       <div className="rounded-lg border border-gray-200 overflow-hidden">
//         <table className="w-full text-sm text-left text-gray-500">
//           <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <th key={header.id} className="px-6 py-3">
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.map((row) => (
//               <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
//                 {row.getVisibleCells().map((cell) => (
//                   <td key={cell.id} className="px-6 py-4">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//             className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
//           >
//             <ChevronLeft size={20} />
//           </button>
//           <span className="text-sm text-gray-700">
//             Page {table.getState().pagination.pageIndex + 1} of{" "}
//             {table.getPageCount()}
//           </span>
//           <button
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//             className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
//           >
//             <ChevronRight size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageCount: number;
  pageIndex: number;
  onPageChange: (newPage: number) => void;
}

export function DataTable<T>({
  data,
  columns,
  pageCount,
  pageIndex,
  onPageChange,
}: DataTableProps<T>) {
  const pageSize = 10; // Fixed page size

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 font-semibold">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="bg-white border-b hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Page {pageIndex + 1} of {pageCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(0)}
            disabled={pageIndex === 0}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="First page"
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous page"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{pageIndex + 1}</span>
            <span className="text-gray-500">/</span>
            <span className="text-sm text-gray-600">{pageCount}</span>
          </div>
          <button
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next page"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => onPageChange(pageCount - 1)}
            disabled={pageIndex >= pageCount - 1}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Last page"
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
