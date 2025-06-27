
import { useHotkeys } from 'react-hotkeys-hook';
import { useCallback } from 'react';

interface UseKeyboardShortcutsProps {
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  isEnabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  hasSelection,
  isEnabled = true,
}: UseKeyboardShortcutsProps) => {
  const handleSelectAll = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    onSelectAll();
  }, [onSelectAll]);

  const handleClearSelection = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    onClearSelection();
  }, [onClearSelection]);

  const handleDelete = useCallback((e: KeyboardEvent) => {
    if (hasSelection) {
      e.preventDefault();
      onDeleteSelected();
    }
  }, [onDeleteSelected, hasSelection]);

  useHotkeys('ctrl+a, meta+a', handleSelectAll, {
    enabled: isEnabled,
    preventDefault: true,
  });

  useHotkeys('escape', handleClearSelection, {
    enabled: isEnabled && hasSelection,
    preventDefault: true,
  });

  useHotkeys('delete', handleDelete, {
    enabled: isEnabled && hasSelection,
    preventDefault: true,
  });
};
</rov-write>

更新 VisualOverviewToolbar 组件以使用确认对话框：

<lov-write file_path="src/components/visual-overview/VisualOverviewToolbar.tsx">
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileDown, Archive, CheckCircle, Trash2, RotateCcw } from 'lucide-react';
import BatchOperationDialog from './BatchOperationDialog';

interface VisualOverviewToolbarProps {
  selectedCount: number;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onBatchArchive: () => void;
  onBatchSetFinal: () => void;
  isArchiveView?: boolean;
  isLoading?: boolean;
}

type BatchOperation = 'archive' | 'restore' | 'setFinal' | 'delete' | null;

const VisualOverviewToolbar: React.FC<VisualOverviewToolbarProps> = ({
  selectedCount,
  onExportPDF,
  onExportExcel,
  onBatchArchive,
  onBatchSetFinal,
  isArchiveView = false,
  isLoading = false,
}) => {
  const [pendingOperation, setPendingOperation] = useState<BatchOperation>(null);

  const handleOperationClick = (operation: BatchOperation) => {
    setPendingOperation(operation);
  };

  const handleConfirmOperation = async () => {
    switch (pendingOperation) {
      case 'archive':
      case 'restore':
        await onBatchArchive();
        break;
      case 'setFinal':
        await onBatchSetFinal();
        break;
      default:
        break;
    }
    setPendingOperation(null);
  };

  const handleCloseDialog = () => {
    setPendingOperation(null);
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                已选择
              </span>
              <Badge variant="secondary" className="font-medium">
                {selectedCount} 个分镜
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExportPDF}
                disabled={selectedCount === 0 || isLoading}
              >
                <FileDown className="h-4 w-4 mr-2" />
                导出 PDF
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onExportExcel}
                disabled={selectedCount === 0 || isLoading}
              >
                <FileDown className="h-4 w-4 mr-2" />
                导出 Excel
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOperationClick(isArchiveView ? 'restore' : 'archive')}
                disabled={selectedCount === 0 || isLoading}
              >
                {isArchiveView ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    批量恢复
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    批量存档
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOperationClick('setFinal')}
                disabled={selectedCount === 0 || isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                设为最终版
              </Button>
              
              {/* 快捷键提示 */}
              <div className="text-xs text-muted-foreground ml-4 space-y-1">
                <div>Ctrl+A: 全选</div>
                <div>Esc: 清除选择</div>
                <div>Delete: 删除选中</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <BatchOperationDialog
        isOpen={pendingOperation !== null}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmOperation}
        operation={pendingOperation || 'archive'}
        selectedCount={selectedCount}
        isLoading={isLoading}
      />
    </>
  );
};

export default VisualOverviewToolbar;
