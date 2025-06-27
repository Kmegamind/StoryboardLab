
import React from 'react';
import { useVisualOverview } from '@/hooks/useVisualOverview';
import VisualOverviewLayout from '@/components/visual-overview/VisualOverviewLayout';
import VisualOverviewTable from '@/components/visual-overview/VisualOverviewTable';
import VisualOverviewToolbar from '@/components/visual-overview/VisualOverviewToolbar';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

const VisualOverviewPage = () => {
  const {
    shots,
    isLoading,
    filters,
    sorting,
    selectedShots,
    uniqueShotTypes,
    totalCount,
    currentPage,
    pageSize,
    setFilters,
    setSorting,
    setSelectedShots,
    handleSelectAll,
    handleClearSelection,
    handleDeleteSelected,
    handleExportPDF,
    handleExportExcel,
    handleBatchArchive,
    handleBatchSetFinal,
    handlePageChange,
  } = useVisualOverview();

  if (isLoading && shots.length === 0) {
    return (
      <VisualOverviewLayout>
        <div className="flex justify-center items-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4">正在加载分镜数据...</p>
        </div>
      </VisualOverviewLayout>
    );
  }

  // Show friendly message when no shots are found
  if (!isLoading && shots.length === 0 && totalCount === 0) {
    return (
      <VisualOverviewLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">分镜管理</h1>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无分镜数据</h3>
              <p className="text-muted-foreground mb-4">
                您还没有创建任何分镜，或者当前筛选条件下没有找到匹配的分镜。
              </p>
              <p className="text-sm text-muted-foreground">
                请检查：
                <br />• 是否已选择正确的项目
                <br />• 筛选条件是否过于严格
                <br />• 是否需要先创建分镜
              </p>
            </CardContent>
          </Card>
        </div>
      </VisualOverviewLayout>
    );
  }

  return (
    <VisualOverviewLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">分镜管理</h1>
            <p className="text-muted-foreground mt-1">
              管理和组织您的项目分镜，共 {totalCount} 个分镜
            </p>
          </div>
          <VisualOverviewToolbar
            selectedCount={selectedShots.length}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onBatchArchive={handleBatchArchive}
            onBatchSetFinal={handleBatchSetFinal}
            isArchiveView={filters.status === 'archived'}
            isLoading={isLoading}
          />
        </div>

        {totalCount > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>数据统计</AlertTitle>
            <AlertDescription>
              当前显示 {shots.length} 个分镜，总共 {totalCount} 个分镜
              {filters.status !== 'all' && ` (筛选条件: ${
                filters.status === 'active' ? '活跃' : 
                filters.status === 'archived' ? '已存档' : '全部'
              })`}
            </AlertDescription>
          </Alert>
        )}

        <VisualOverviewTable
          shots={shots}
          filters={filters}
          sorting={sorting}
          selectedShots={selectedShots}
          uniqueShotTypes={uniqueShotTypes}
          onFiltersChange={setFilters}
          onSortingChange={setSorting}
          onSelectedShotsChange={setSelectedShots}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onDeleteSelected={handleDeleteSelected}
        />

        {/* 分页信息 */}
        {totalCount > pageSize && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>
              显示 {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} 
              条，共 {totalCount} 条记录
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                上一页
              </button>
              <span className="px-3 py-1">
                第 {currentPage} 页，共 {Math.ceil(totalCount / pageSize)} 页
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </VisualOverviewLayout>
  );
};

export default VisualOverviewPage;
