
import { useMemo } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShotWithPrompts } from '@/types/visualOverview';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<ShotWithPrompts>();

export const useVisualOverviewColumns = (): ColumnDef<ShotWithPrompts, any>[] => {
  const navigate = useNavigate();

  return useMemo(() => [
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
};
