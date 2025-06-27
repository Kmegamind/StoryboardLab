
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BatchOperationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  operation: 'archive' | 'restore' | 'setFinal' | 'delete';
  selectedCount: number;
  isLoading?: boolean;
}

const BatchOperationDialog: React.FC<BatchOperationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  operation,
  selectedCount,
  isLoading = false,
}) => {
  const getOperationConfig = () => {
    switch (operation) {
      case 'archive':
        return {
          title: '批量存档确认',
          description: `您确定要存档 ${selectedCount} 个分镜吗？存档后的分镜将不会在活跃列表中显示，但可以通过筛选器查看。`,
          confirmText: '确认存档',
          variant: 'default' as const,
        };
      case 'restore':
        return {
          title: '批量恢复确认',
          description: `您确定要恢复 ${selectedCount} 个分镜吗？恢复后的分镜将重新显示在活跃列表中。`,
          confirmText: '确认恢复',
          variant: 'default' as const,
        };
      case 'setFinal':
        return {
          title: '批量设置最终版确认',
          description: `您确定要将 ${selectedCount} 个分镜的最新提示词设置为最终版吗？这将取消它们之前的最终版标记。`,
          confirmText: '确认设置',
          variant: 'default' as const,
        };
      case 'delete':
        return {
          title: '批量删除确认',
          description: `您确定要永久删除 ${selectedCount} 个分镜吗？此操作无法撤销，所有相关的提示词版本也将被删除。`,
          confirmText: '确认删除',
          variant: 'destructive' as const,
        };
      default:
        return {
          title: '确认操作',
          description: `您确定要对 ${selectedCount} 个分镜执行此操作吗？`,
          confirmText: '确认',
          variant: 'default' as const,
        };
    }
  };

  const config = getOperationConfig();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={config.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {isLoading ? '处理中...' : config.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BatchOperationDialog;
