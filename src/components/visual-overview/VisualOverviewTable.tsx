
import React, { useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShotWithPrompts, VisualOverviewFilters, VisualOverviewSorting } from '@/types/visualOverview';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const columnHelper = createColumnHelper<ShotWithPrompts>();

interface VisualOverviewTableProps {
  shots: ShotWithPrompts[];
  filters: VisualOverviewFilters;
  sorting: VisualOverviewSorting;
  selectedShots: string[];
  uniqueShotTypes: string[];
  onFiltersChange: (filters: VisualOverviewFilters) => void;
  onSortingChange: (sorting: VisualOverviewSorting) => void;
  onSelectedShotsChange: (selectedShots: string[]) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
}

const VisualOverviewTable: React.FC<VisualOverviewTableProps> = ({
  shots,
  filters,
  sorting,
  selectedShots,
  uniqueShotTypes,
  onFiltersChange,
  onSortingChange,
  onSelectedShotsChange,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
}) => {
  const navigate = useNavigate();

  // Enable keyboard shortcuts
  useKeyboardShortcuts({
    onSelectAll,
    onClearSelection,
    onDeleteSelected,
    hasSelection: selectedShots.length > 0,
    isEnabled: true,
  });

  const columns = useMemo<ColumnDef<ShotWithPrompts, any>[]>(() => [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('shot_number', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          镜头号
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('shot_number') || 'N/A'}</div>
      ),
    }),
    columnHelper.accessor('shot_type', {
      header: '镜头类型',
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue('shot_type') || 'N/A'}</Badge>
      ),
    }),
    columnHelper.accessor('scene_content', {
      header: '场景内容',
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.getValue('scene_content')}>
          {row.getValue('scene_content') || 'N/A'}
        </div>
      ),
    }),
    columnHelper.accessor('latest_prompt', {
      header: '最新提示词',
      cell: ({ row }) => {
        const prompt = row.getValue('latest_prompt') as any;
        return (
          <div className="max-w-xs truncate" title={prompt?.prompt_text}>
            {prompt?.prompt_text || '暂无提示词'}
          </div>
        );
      },
    }),
    columnHelper.accessor('final_prompt', {
      header: '状态',
      cell: ({ row }) => {
        const finalPrompt = row.getValue('final_prompt');
        const isArchived = row.original.is_archived;
        
        return (
          <div className="flex gap-1">
            {finalPrompt && <Badge variant="default">最终版</Badge>}
            {isArchived && <Badge variant="outline">已存档</Badge>}
            {row.original.perspective_type === 'perspective' && (
              <Badge variant="secondary">视角变体</Badge>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/shot-lab/${row.original.id}`)}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      ),
    }),
  ], [navigate]);

  const filteredData = useMemo(() => {
    return shots.filter(shot => {
      if (filters.status === 'active' && shot.is_archived) return false;
      if (filters.status === 'archived' && !shot.is_archived) return false;
      if (filters.perspectiveType === 'main' && shot.perspective_type !== 'main') return false;
      if (filters.perspectiveType === 'perspective' && shot.perspective_type !== 'perspective') return false;
      if (filters.shotType && shot.shot_type !== filters.shotType) return false;
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        return (
          shot.shot_number?.toLowerCase().includes(searchLower) ||
          shot.scene_content?.toLowerCase().includes(searchLower) ||
          shot.latest_prompt?.prompt_text?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [shots, filters]);

  const table = useReactTable({
    data: filteredData,
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
    <Card>
      <CardHeader>
        <CardTitle>分镜列表</CardTitle>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="搜索镜头号、场景内容或提示词..."
            value={filters.searchText}
            onChange={(e) => onFiltersChange({ ...filters, searchText: e.target.value })}
            className="max-w-sm"
          />
          
          <Select
            value={filters.status}
            onValueChange={(value: any) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">活跃</SelectItem>
              <SelectItem value="archived">已存档</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.perspectiveType}
            onValueChange={(value: any) => onFiltersChange({ ...filters, perspectiveType: value })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="main">主镜头</SelectItem>
              <SelectItem value="perspective">视角变体</SelectItem>
            </SelectContent>
          </Select>

          {uniqueShotTypes.length > 0 && (
            <Select
              value={filters.shotType}
              onValueChange={(value) => onFiltersChange({ ...filters, shotType: value === 'all-types' ? '' : value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="镜头类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">全部类型</SelectItem>
                {uniqueShotTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
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
                    {filters.status !== 'all' || filters.searchText || filters.shotType || filters.perspectiveType !== 'all' 
                      ? '当前筛选条件下暂无数据，请尝试调整筛选条件' 
                      : '暂无分镜数据，请先创建分镜'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualOverviewTable;
