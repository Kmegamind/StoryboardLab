
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShotWithPrompts } from '@/types/visualOverview';
import { useVisualOverviewColumns } from './VisualOverviewColumns';

interface VisualOverviewTableCoreProps {
  data: ShotWithPrompts[];
  selectedShots: string[];
  onSelectedShotsChange: (selectedShots: string[]) => void;
}

const VisualOverviewTableCore: React.FC<VisualOverviewTableCoreProps> = ({
  data,
  selectedShots,
  onSelectedShotsChange,
}) => {
  const columns = useVisualOverviewColumns();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' 
        ? updater(Object.fromEntries(selectedShots.map(id => [id, true])))
        : updater;
      onSelectedShotsChange(Object.keys(newSelection));
    },
    state: {
      rowSelection: Object.fromEntries(selectedShots.map(id => [id, true])),
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                暂无分镜数据，请先创建分镜
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisualOverviewTableCore;
