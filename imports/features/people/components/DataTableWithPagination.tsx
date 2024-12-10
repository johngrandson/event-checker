import React, { useEffect, useState } from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '/components/ui/table';
import { Card } from '/components/ui/card';

import { Button } from '/components/ui/button';
import { Input } from '/components/ui/input';
import { usePeople } from '/imports/features/people/hooks/usePeople';
import EmptyTable from '/components/ui/empty-table';

interface DataTableWithPaginationProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  size: number;
  currentPage: number;
  totalItems: number;
  fetchData: () => { data: TData[]; total: number };
  onPageChange: (page: number) => void;
}

export function DataTableWithPagination<TData, TValue>({
  columns,
  size,
  currentPage,
  totalItems,
  fetchData,
  onPageChange,
}: DataTableWithPaginationProps<TData, TValue>) {
  const [tableData, setTableData] = useState<TData[] | any>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const paginatedData = fetchData().data;
  const { people: filteredData } = usePeople(columnFilters);

  useEffect(() => {
    const isFiltering = Boolean(
      columnFilters.find((filter) => filter.id === 'firstName')?.value
    );
    setTableData(isFiltering ? filteredData : paginatedData);
  }, [paginatedData, filteredData, columnFilters]);

  const totalToDisplay = columnFilters.length
    ? filteredData.length
    : totalItems;

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalToDisplay / size),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex w-full items-center py-4">
        <Input
          placeholder="Filter by name..."
          disabled={table.getRowModel().rows?.length === 0}
          value={
            (table.getColumn('firstName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('firstName')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <Card>
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      minWidth: header.column.columnDef.size,
                      maxWidth: header.column.columnDef.size,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        minWidth: cell.column.columnDef.size,
                        maxWidth: cell.column.columnDef.size,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-2" key={'empty'}>
                <TableCell colSpan={columns.length} className="text-center">
                  <EmptyTable />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="mt-4 flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {Math.ceil(totalToDisplay / size)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalToDisplay / size)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
