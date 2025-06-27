
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileDown, Archive, CheckCircle } from 'lucide-react';

interface VisualOverviewToolbarProps {
  selectedCount: number;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onBatchArchive: () => void;
  onBatchSetFinal: () => void;
}

const VisualOverviewToolbar: React.FC<VisualOverviewToolbarProps> = ({
  selectedCount,
  onExportPDF,
  onExportExcel,
  onBatchArchive,
  onBatchSetFinal,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            已选择 {selectedCount} 个分镜
          </span>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              disabled={selectedCount === 0}
            >
              <FileDown className="h-4 w-4 mr-2" />
              导出 PDF
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onExportExcel}
              disabled={selectedCount === 0}
            >
              <FileDown className="h-4 w-4 mr-2" />
              导出 Excel
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBatchArchive}
              disabled={selectedCount === 0}
            >
              <Archive className="h-4 w-4 mr-2" />
              批量存档
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBatchSetFinal}
              disabled={selectedCount === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              设为最终版
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualOverviewToolbar;
