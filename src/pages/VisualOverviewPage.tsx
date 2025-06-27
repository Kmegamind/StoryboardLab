
import React from 'react';
import { useVisualOverview } from '@/hooks/useVisualOverview';
import VisualOverviewLayout from '@/components/visual-overview/VisualOverviewLayout';
import VisualOverviewTable from '@/components/visual-overview/VisualOverviewTable';
import VisualOverviewToolbar from '@/components/visual-overview/VisualOverviewToolbar';
import { Loader2 } from 'lucide-react';

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
          <p className="ml-4">正在加载视觉总览...</p>
        </div>
      </VisualOverviewLayout>
    );
  }

  return (
    <VisualOverviewLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">视觉总览</h1>
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
